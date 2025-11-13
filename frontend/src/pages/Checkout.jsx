import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Danh sách mã giảm giá (Đồng bộ với Minigame)
const validCoupons = {
  SALE20: 0.2,      // 20%
  GIAOIHANG: 10,    // $10
  SPIN10: 0.1,      // 10%
  SPIN20: 0.2,      // 20%
  LUCKY5: 5,        // $5
  FREESHIP: "FREE", // Free shipping
};

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    companyName: "",
    streetAddress: "",
    apartment: "",
    townCity: "",
    phoneNumber: "",
    email: "",
    saveInfo: false,
    paymentMethod: "cash",
  });

  // State xử lý Coupon
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isFreeShip, setIsFreeShip] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        email: user.email || "",
        streetAddress: user.address || "",
      }));
    }
  }, [user]);

  // Tính toán tiền
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  
  const standardShipping = subtotal > 200 ? 0 : 10; // Mặc định ship $10 nếu < $200
  const shipping = isFreeShip ? 0 : standardShipping;
  const total = Math.max(0, subtotal + shipping - discount);

  // Hàm áp dụng mã (LOGIC MỚI)
  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    
    if (validCoupons.hasOwnProperty(code)) {
      const value = validCoupons[code];
      setDiscount(0);
      setIsFreeShip(false);

      if (value === "FREE") {
        setIsFreeShip(true);
        alert("Đã áp dụng mã Freeship thành công!");
      } else if (value < 1) { 
        const discountAmount = subtotal * value;
        setDiscount(discountAmount);
        alert(`Đã giảm ${value * 100}% (-$${discountAmount.toFixed(2)})`);
      } else { 
        setDiscount(value);
        alert(`Đã giảm $${value}`);
      }
    } else {
      alert("Mã giảm giá không hợp lệ.");
      setDiscount(0);
      setIsFreeShip(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    const orderData = {
      orderItems: cartItems,
      billingDetails: formData,
      subtotal: subtotal,
      shipping: shipping,
      total: total, // Tổng tiền đã trừ giảm giá
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data._id) {
          alert("Đặt hàng thành công!");
          await clearCart();
          navigate(`/order-success/${data._id}`);
        } else {
          alert("Lỗi hệ thống: Không lấy được mã đơn hàng.");
        }
      } else {
        const errorData = await res.json();
        alert(`Lỗi đặt hàng: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối đến server.");
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-gray-500 hover:underline">Home</Link>
        <span>/</span>
        <span className="text-primary font-medium">Checkout</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Billing Details</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          {/* Form giữ nguyên */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Street Address *</label>
                <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Apartment, floor, etc. (optional)</label>
                <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Town/City *</label>
                <input type="text" name="townCity" value={formData.townCity} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Phone Number *</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleChange} className="w-4 h-4 accent-red-500" />
                <span className="text-sm">Save this information for faster check-out next time</span>
              </label>
            </div>

            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="paymentMethod" value="bank" checked={formData.paymentMethod === "bank"} onChange={handleChange} className="w-4 h-4 accent-black" />
                  <span>Bank Transfer</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === "cash"} onChange={handleChange} className="w-4 h-4 accent-black" />
                  <span>Cash on delivery</span>
                </label>
              </div>
            </div>

            {/* INPUT COUPON ĐÃ HOẠT ĐỘNG */}
            <div className="flex gap-3 pt-2">
              <input
                type="text"
                placeholder="Coupon Code"
                className="flex-grow px-4 py-3 border rounded-md outline-none focus:border-primary"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary px-6"
                onClick={applyCoupon} // Gọi hàm xử lý thật
              >
                Apply Coupon
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 mt-4">
              Place Order
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: THÔNG TIN ĐƠN HÀNG */}
        <div className="md:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain bg-white border rounded p-1" />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 truncate max-w-[150px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-300 pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              {/* Hiển thị giảm giá nếu có */}
              {discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-3 mt-2">
                <span>Total:</span>
                <span className="text-red-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
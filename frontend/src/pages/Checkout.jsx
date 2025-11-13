import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. Import Context để lấy giỏ hàng từ Backend
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Để lấy thông tin user điền sẵn (nếu muốn)

function Checkout() {
  const navigate = useNavigate();
  // 2. Lấy cartItems và clearCart từ Context
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

  const [couponCode, setCouponCode] = useState("");

  // Tự động điền email/tên nếu đã đăng nhập (UX tốt hơn)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // 3. TÍNH TOÁN TIỀN (Sử dụng || 0 để an toàn)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shipping = 0; // Hoặc logic tính phí ship
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 4. GỬI ĐƠN HÀNG LÊN BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra giỏ hàng rỗng
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    const orderData = {
      orderItems: cartItems,
      billingDetails: formData,
      subtotal: subtotal,
      shipping: shipping,
      total: total,
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Gửi cookie xác thực
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        alert("Đặt hàng thành công!");
        // Xóa giỏ hàng trên server và local
        await clearCart(); 
        navigate(`/order-success/${data._id}`);
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
    <div className="container mx-auto py-12">
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-gray-500 hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-primary font-medium">Checkout</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Billing Details</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Street Address *</label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Apartment, floor, etc. (optional)</label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Town/City *</label>
                <input
                  type="text"
                  name="townCity"
                  value={formData.townCity}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm">Save this information for faster check-out next time</span>
              </label>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === "bank"}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span>Bank</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === "cash"}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span>Cash on delivery</span>
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon Code"
                className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button type="button" className="btn btn-primary" onClick={() => alert("Coupon logic in checkout not implemented yet")}>
                Apply Coupon
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-full py-3">
              Place Order
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg">
            {/* 5. HIỂN THỊ SẢN PHẨM TỪ CONTEXT (Dùng _id) */}
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded bg-white border" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 truncate max-w-[150px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
                {/* 6. LÀM TRÒN GIÁ TIỀN */}
                <span className="text-gray-700 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-300 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-gray-300 pt-2 mt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
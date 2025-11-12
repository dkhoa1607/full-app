import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Checkout() {
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

  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang reload

    // 1. Gói (package) tất cả dữ liệu lại
    const orderData = {
      orderItems: cartItems,      // Lấy từ state
      billingDetails: formData, // Lấy từ state
      subtotal: subtotal,         // Lấy từ biến đã tính
      shipping: shipping,
      total: total,
    };

    try {
      // 2. Gửi request POST đến backend
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData), // Chuyển object thành chuỗi JSON
      });

      if (res.ok) {
        // 3. NẾU THÀNH CÔNG (Backend trả về 201)
        alert('Order placed successfully!');
        localStorage.removeItem('cart'); // Xóa giỏ hàng
        
        // Dùng 'navigate' thay vì 'window.location.href' sẽ mượt hơn
        // (Bạn cần import { useNavigate } from 'react-router-dom'
        // và const navigate = useNavigate() ở đầu component)
        
        // navigate('/order-success');
        
        // Hoặc giữ cách cũ:
        window.location.href = '/order-success';

      } else {
        // 4. NẾU THẤT BẠI (Backend trả về 400 hoặc 500)
        const errorData = await res.json();
        alert(`Error placing order: ${errorData.message}`);
      }
    } catch (error) {
      // 5. NẾU LỖI MẠNG (VD: backend chưa chạy)
      console.error('Fetch error:', error);
      alert('Could not connect to the server. Please try again later.');
    }
  };

  const applyCoupon = () => {
    alert(`Coupon ${couponCode} applied!`);
    setCouponCode("");
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
                <label className="block mb-2 font-medium">
                  Apartment, floor, etc. (optional)
                </label>
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
              <button type="button" className="btn btn-outline" onClick={applyCoupon}>
                Apply Coupon
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-full py-3">
              Place Order
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="bg-lighter-bg p-6 rounded-lg">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <span className="text-gray-700 font-medium">
                  ${item.price * item.quantity}
                </span>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
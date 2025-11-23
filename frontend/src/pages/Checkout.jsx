import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight, CreditCard, Banknote, Truck, MapPin, 
  User, Mail, Phone, ShieldCheck 
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();
  // Sửa: Lấy refreshCart thay vì clearCart
  const { cartItems, refreshCart } = useCart();
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
    deliveryOption: "standard", // Thêm state cho lựa chọn giao hàng
    scheduledDeliveryDate: "",
    customDeliverySeconds: 30, // State mới cho custom delivery
  });

  const [couponCode, setCouponCode] = useState("");

  // Tự động điền thông tin nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        streetAddress: user.address || "",
      }));
    }
  }, [user]);

  // Tính toán tổng tiền
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shipping = 0; // Logic ship (có thể lấy từ state nếu cần)
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Chọn phương thức thanh toán
  const handlePaymentChange = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
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
      total: total,
      deliveryOption: formData.deliveryOption,
      scheduledDeliveryDate: formData.deliveryOption === 'scheduled' ? formData.scheduledDeliveryDate : null,
      customDeliverySeconds: formData.deliveryOption === 'custom_seconds' ? formData.customDeliverySeconds : null,
    };

    try {
      const res = await fetch("https://full-app-da2f.vercel.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data._id) {
          
          // Sửa: Gọi refreshCart() để cập nhật state giỏ hàng (vì backend đã tự xóa)
          refreshCart(); 
          
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
    <div className="bg-gray-50 min-h-screen font-poppins text-gray-800 pb-20">
      
      {/* Header Banner Nhỏ */}
      <div className="bg-white border-b py-8 mb-8 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-2">Checkout</h1>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <Link to="/cart" className="hover:text-black transition-colors">Cart</Link> 
            <span>/</span> 
            <span className="text-black font-medium">Checkout</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* --- CỘT TRÁI: FORM THÔNG TIN --- */}
          <div className="flex-1">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm">1</span>
                Billing Details
              </h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all" placeholder="John" />
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all" placeholder="Optional" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Street Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} required 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all" placeholder="123 Main St" />
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Apartment, floor, etc.</label>
                  <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all" placeholder="Optional" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Town/City <span className="text-red-500">*</span></label>
                    <input type="text" name="townCity" value={formData.townCity} onChange={handleChange} required 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all" placeholder="090..." />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all" placeholder="example@mail.com" />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${formData.saveInfo ? "bg-red-500 border-red-500" : "border-gray-300 bg-white"}`}>
                      {formData.saveInfo && <span className="text-white text-xs">✔</span>}
                    </div>
                    <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleChange} className="hidden" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">Save this information for faster check-out next time</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Delivery Options Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm">2</span>
                Delivery Method
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all">
                  <input type="radio" name="deliveryOption" value="standard" checked={formData.deliveryOption === 'standard'} onChange={handleChange} className="form-radio text-red-500" />
                  <Truck className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Standard Delivery (3-5 days)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all">
                  <input type="radio" name="deliveryOption" value="express_30s" checked={formData.deliveryOption === 'express_30s'} onChange={handleChange} className="form-radio text-red-500" />
                  <Truck className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Express Delivery (30s Demo)</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border rounded-xl transition-all">
                  <label className="flex items-center gap-3 cursor-pointer flex-shrink-0 w-full sm:w-auto">
                    <input type="radio" name="deliveryOption" value="scheduled" checked={formData.deliveryOption === 'scheduled'} onChange={handleChange} className="form-radio text-red-500" />
                    <span className="font-medium">Schedule Delivery</span>
                  </label>
                  <input 
                    type="date" 
                    name="scheduledDeliveryDate"
                    value={formData.scheduledDeliveryDate}
                    onChange={handleChange}
                    disabled={formData.deliveryOption !== 'scheduled'}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-red-500 text-sm transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border rounded-xl transition-all">
                  <label className="flex items-center gap-3 cursor-pointer flex-shrink-0 w-full sm:w-auto">
                    <input type="radio" name="deliveryOption" value="custom_seconds" checked={formData.deliveryOption === 'custom_seconds'} onChange={handleChange} className="form-radio text-red-500" />
                    <span className="font-medium">Custom Delivery (secs)</span>
                  </label>
                  <input 
                    type="number" 
                    name="customDeliverySeconds"
                    value={formData.customDeliverySeconds}
                    onChange={handleChange}
                    min="1"
                    disabled={formData.deliveryOption !== 'custom_seconds'}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-red-500 text-sm transition-colors disabled:opacity-50"
                    placeholder="e.g., 60"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm">3</span>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => handlePaymentChange("bank")}
                  className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-4 ${formData.paymentMethod === "bank" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === "bank" ? "border-red-500" : "border-gray-300"}`}>
                    {formData.paymentMethod === "bank" && <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm"><CreditCard className="w-5 h-5 text-blue-600"/></div>
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                </div>

                <div 
                  onClick={() => handlePaymentChange("cash")}
                  className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-4 ${formData.paymentMethod === "cash" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === "cash" ? "border-red-500" : "border-gray-300"}`}>
                    {formData.paymentMethod === "cash" && <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm"><Banknote className="w-5 h-5 text-green-600"/></div>
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: ORDER SUMMARY --- */}
          <div className="lg:w-[400px] flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-lg p-1 border border-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</p>
                      {item.selectedColor && <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-4 mt-2">
                  <span>Total</span>
                  <span className="text-red-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="flex gap-2 mt-6">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="button" className="bg-black text-white px-5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors" onClick={() => alert("Apply coupon in Cart page first!")}>
                  Apply
                </button>
              </div>

              {/* Place Order Button */}
              <button 
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-lg mt-6 hover:bg-red-600 shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2 group"
              >
                Place Order <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" /> Secure SSL Encryption
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Checkout;
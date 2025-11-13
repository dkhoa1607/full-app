import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";

// Danh sách Coupon
const validCoupons = {
  SALE20: 0.2,      // Giảm 20%
  GIAOIHANG: 10,    // Giảm $10
  SPIN10: 0.1,      // Giảm 10%
  SPIN20: 0.2,      // Giảm 20%
  LUCKY5: 5,        // Giảm $5
  FREESHIP: "FREE", // Miễn phí vận chuyển
};

function Cart() {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isFreeShip, setIsFreeShip] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(""); // Để hiển thị mã đã dùng

  // 1. Tính toán
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  
  const standardShipping = subtotal > 200 ? 0 : 10; 
  const shipping = isFreeShip ? 0 : standardShipping;
  const total = Math.max(0, subtotal + shipping - discount);

  // 2. Xử lý Coupon
  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (!code) return;
    
    if (validCoupons.hasOwnProperty(code)) {
      const value = validCoupons[code];
      setDiscount(0);
      setIsFreeShip(false);

      if (value === "FREE") {
        setIsFreeShip(true);
        setAppliedCoupon(code);
        alert("Đã áp dụng mã Freeship thành công!");
      } else if (value < 1) { 
        const discountAmount = subtotal * value;
        setDiscount(discountAmount);
        setAppliedCoupon(code);
        alert(`Đã giảm ${value * 100}% (-$${discountAmount.toFixed(2)})`);
      } else { 
        setDiscount(value);
        setAppliedCoupon(code);
        alert(`Đã giảm $${value}`);
      }
    } else {
      alert("Mã giảm giá không hợp lệ.");
      setDiscount(0);
      setIsFreeShip(false);
      setAppliedCoupon("");
    }
    setCouponCode("");
  };

  return (
    <div className="bg-gray-50 min-h-screen font-poppins text-gray-800 pb-20">
      
      {/* Header Banner Nhỏ */}
      <div className="bg-white border-b py-8 mb-8 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-2">Shopping Cart</h1>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <Link to="/" className="hover:text-black transition-colors">Home</Link> 
            <span>/</span> 
            <span className="text-black font-medium">Cart</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {cartItems.length === 0 ? (
          // --- TRẠNG THÁI GIỎ TRỐNG ---
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our products and find something you love.</p>
            <Link to="/shop" className="btn btn-primary px-10 py-3 rounded-full shadow-lg hover:shadow-red-200 transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 relative">
            
            {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
            <div className="flex-1 space-y-4">
              {/* Header của list (ẩn trên mobile) */}
              <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 px-6 pb-2">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Các Item */}
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:border-red-100 transition-colors group">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    
                    {/* Ảnh & Thông tin */}
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg p-2 flex-shrink-0 border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate pr-4" title={item.name}>{item.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                          {item.selectedColor && (
                            <span className="bg-gray-100 px-2 py-1 rounded">Color: {item.selectedColor}</span>
                          )}
                          {item.selectedStorage && (
                            <span className="bg-gray-100 px-2 py-1 rounded">Option: {item.selectedStorage}</span>
                          )}
                        </div>
                        {/* Nút xóa (hiện trên mobile ở đây) */}
                        <button 
                          onClick={() => removeItem(item._id)} 
                          className="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 sm:hidden"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Giá (Desktop) */}
                    <div className="hidden sm:block w-24 text-center font-medium text-gray-600">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Bộ chỉnh số lượng */}
                    <div className="flex items-center border border-gray-200 rounded-lg h-10 w-fit">
                      <button 
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="px-3 h-full hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input 
                        type="text" 
                        readOnly 
                        value={item.quantity} 
                        className="w-10 text-center text-sm font-medium outline-none" 
                      />
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 h-full hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtotal & Remove (Desktop) */}
                    <div className="hidden sm:flex flex-col items-end w-24 gap-2">
                      <span className="font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="flex justify-between mt-6">
                <Link to="/shop" className="btn btn-outline border-gray-300 text-gray-600 px-6 py-2.5 text-sm hover:border-black hover:text-black hover:bg-transparent">
                  ← Continue Shopping
                </Link>
                <button onClick={clearCart} className="text-red-500 text-sm font-medium hover:underline flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Clear Cart
                </button>
              </div>
            </div>

            {/* --- CỘT PHẢI: ORDER SUMMARY (Sticky) --- */}
            <div className="lg:w-[380px] flex-shrink-0">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-24">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                
                {/* Các dòng tính tiền */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-black">
                      {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-500 bg-red-50 p-2 rounded-md">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount {appliedCoupon && `(${appliedCoupon})`}</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-4 mt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code here"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                      onClick={applyCoupon}
                      className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                  Secure Checkout - 30 Days Return Policy
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
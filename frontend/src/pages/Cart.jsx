import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";

// Danh sách Coupon (Đã đồng bộ với MiniGame)
const validCoupons = {
  // Mã cũ
  SALE20: 0.2,      // Giảm 20%
  GIAOIHANG: 10,    // Giảm $10
  
  // Mã từ MiniGame
  SPIN10: 0.1,      // Giảm 10%
  SPIN20: 0.2,      // Giảm 20%
  LUCKY5: 5,        // Giảm $5
  FREESHIP: "FREE", // Miễn phí vận chuyển
};

function Cart() {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isFreeShip, setIsFreeShip] = useState(false);

  // 1. Tính Subtotal (Tổng tiền hàng)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  
  // 2. Tính phí ship (Ví dụ: mặc định $10, nếu subtotal > 200 hoặc có mã FreeShip thì = 0)
  const standardShipping = subtotal > 200 ? 0 : 10; 
  const shipping = isFreeShip ? 0 : standardShipping;

  // 3. Tính Tổng cuối cùng (Không được âm)
  const total = Math.max(0, subtotal + shipping - discount);

  // 4. Xử lý áp dụng Coupon
  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    
    if (validCoupons.hasOwnProperty(code)) {
      const value = validCoupons[code];

      // Reset trạng thái cũ trước khi áp dụng mới
      setDiscount(0);
      setIsFreeShip(false);

      if (value === "FREE") {
        setIsFreeShip(true);
        alert("Đã áp dụng mã Freeship thành công!");
      } 
      else if (value < 1) { 
        // Nếu giá trị < 1 tức là phần trăm (0.1 = 10%)
        const discountAmount = subtotal * value;
        setDiscount(discountAmount);
        alert(`Đã áp dụng mã giảm giá ${value * 100}%! (-$${discountAmount.toFixed(2)})`);
      } 
      else { 
        // Nếu giá trị >= 1 tức là số tiền cụ thể ($5, $10)
        setDiscount(value);
        alert(`Đã áp dụng mã giảm giá $${value}!`);
      }
    } else {
      alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      setDiscount(0);
      setIsFreeShip(false);
    }
    setCouponCode("");
  };

  const handleClearCart = () => {
    clearCart();
    setDiscount(0);
    setIsFreeShip(false);
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8 text-gray-500">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">Cart</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Your cart is empty</h2>
          <p className="mb-8 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary px-8 py-3">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Bảng sản phẩm */}
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const itemPrice = item.price || 0;
                  const itemQuantity = item.quantity || 1;
                  const itemSubtotal = itemPrice * itemQuantity;

                  return (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => removeItem(item._id)} 
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <X className="h-5 w-5" />
                          </button>
                          <div className="w-16 h-16 border rounded bg-white flex items-center justify-center shrink-0">
                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 truncate max-w-[200px]" title={item.name}>
                              {item.name || 'Product Name'}
                            </span>
                            {item.selectedColor && <span className="text-xs text-gray-500">Color: {item.selectedColor}</span>}
                            {item.selectedStorage && <span className="text-xs text-gray-500">Size: {item.selectedStorage}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        ${itemPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center border rounded-md w-fit bg-white">
                          <input
                            type="number"
                            value={itemQuantity}
                            onChange={(e) => updateQuantity(item._id, Number.parseInt(e.target.value))}
                            className="w-12 text-center border-none focus:ring-0 py-1 text-sm"
                            min="1"
                          />
                          <div className="flex flex-col border-l">
                            <button onClick={() => updateQuantity(item._id, itemQuantity + 1)} className="px-1.5 hover:bg-gray-100 border-b">
                              <ChevronUp className="h-3 w-3 text-gray-500" />
                            </button>
                            <button onClick={() => updateQuantity(item._id, Math.max(1, itemQuantity - 1))} className="px-1.5 hover:bg-gray-100">
                              <ChevronDown className="h-3 w-3 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        ${itemSubtotal.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* Cột trái: Nút hành động & Coupon */}
            <div className="lg:w-1/2 space-y-6">
              <div className="flex gap-4">
                <Link to="/" className="btn btn-outline px-6 py-3 w-full sm:w-auto">
                  Return To Shop
                </Link>
                <button className="btn btn-outline px-6 py-3 w-full sm:w-auto hover:border-red-500 hover:text-red-500" onClick={handleClearCart}>
                  Clear Cart
                </button>
              </div>

              <div className="flex gap-3 pt-4 max-w-md">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="flex-grow px-4 py-3 border rounded-md outline-none focus:border-primary"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="btn btn-primary px-6 whitespace-nowrap" onClick={applyCoupon}>
                  Apply Coupon
                </button>
              </div>
            </div>

            {/* Cột phải: Cart Total */}
            <div className="lg:w-1/3">
              <div className="border rounded-lg p-6 shadow-sm bg-gray-50">
                <h3 className="text-lg font-bold mb-6 text-gray-800">Cart Total</h3>

                <div className="space-y-3 text-sm mb-4 border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {/* Hiển thị Discount nếu có */}
                  {discount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Discount:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total:</span>
                  <span className="text-red-600">${total.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className="btn btn-primary w-full py-3 block text-center">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
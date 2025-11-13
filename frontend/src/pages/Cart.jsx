import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronUp, ChevronDown } from "lucide-react";
// 1. Import Context để lấy dữ liệu từ Backend
import { useCart } from "../context/CartContext";

const validCoupons = {
  SALE20: 0.2, // Giảm 20%
  GIAOIHANG: 10, // Giảm 10$
};

function Cart() {
  // 2. Lấy state và hàm từ Context thay vì tự khai báo
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Tính toán Subtotal (Thêm kiểm tra an toàn để không bị lỗi crash)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  
  const shipping = 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const applyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (validCoupons[code]) {
      const discountValue = validCoupons[code];

      if (discountValue < 1) {
        const discountAmount = subtotal * discountValue;
        setDiscount(discountAmount);
        alert(`Applied ${discountValue * 100}% coupon!`);
      } else {
        setDiscount(discountValue);
        alert(`Applied $${discountValue} coupon!`);
      }
    } else {
      alert("Invalid coupon code.");
      setDiscount(0);
    }
    setCouponCode("");
  };

  // Hàm clear cart cục bộ (gọi context để xóa DB + reset discount)
  const handleClearCart = () => {
    clearCart();
    setDiscount(0);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-gray-500 hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-primary font-medium">Cart</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Your cart is empty</h2>
          <p className="mb-8 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary px-8 py-3">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Quantity</th>
                  <th className="text-left py-3 px-4">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const itemPrice = item.price || 0;
                  const itemQuantity = item.quantity || 1;
                  const itemSubtotal = itemPrice * itemQuantity;

                  return (
                    // QUAN TRỌNG: Dùng item._id làm key
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          {/* Gọi hàm removeItem từ Context */}
                          <button onClick={() => removeItem(item._id)} className="text-gray-400 hover:text-primary">
                            <X className="h-5 w-5" />
                          </button>
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded bg-gray-50" />
                          <span className="font-medium text-gray-800 truncate max-w-[200px]" title={item.name}>
                            {item.name || 'Sản phẩm không tên'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        ${itemPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center border rounded-md w-fit">
                          <input
                            type="number"
                            value={itemQuantity}
                            // Gọi hàm updateQuantity từ Context
                            onChange={(e) => updateQuantity(item._id, Number.parseInt(e.target.value))}
                            className="w-12 text-center border-none focus:ring-0 py-1"
                            min="1"
                          />
                          <div className="flex flex-col">
                            <button onClick={() => updateQuantity(item._id, itemQuantity + 1)} className="px-2 hover:bg-gray-100">
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            </button>
                            <button onClick={() => updateQuantity(item._id, Math.max(1, itemQuantity - 1))} className="px-2 hover:bg-gray-100">
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        ${itemSubtotal.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3 space-y-4">
              <Link to="/" className="btn btn-outline w-full">
                Return To Shop
              </Link>
              <button className="btn btn-outline w-full" onClick={handleClearCart}>
                Clear Cart
              </button>
            </div>

            <div className="md:w-1/2 lg:w-1/3">
              <div className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Cart Total</h3>

                <div className="flex justify-between py-3 border-b">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between py-3 border-b text-red-500">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between py-3 mb-6 font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="flex-grow px-4 py-2 border rounded-md outline-none focus:border-primary"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="btn btn-primary whitespace-nowrap" onClick={applyCoupon}>
                    Apply
                  </button>
                </div>

                <Link to="/checkout" className="btn btn-primary w-full py-3">
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ChevronUp, ChevronDown } from "lucide-react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const applyCoupon = () => {
    alert(`Coupon ${couponCode} applied!`);
    setCouponCode("");
  };

  return (
    <div className="container py-12">
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-gray-500 hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-primary font-medium">Cart</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-8">Looks like you haven't added anything to your cart yet.</p>
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
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-primary"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">${item.price}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center border rounded-md w-fit">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                          className="w-12 text-center border-none focus:ring-0 py-1"
                          min="1"
                        />
                        <div className="flex flex-col">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2"
                          >
                            <ChevronUp className="h-4 w-4 text-gray-500 hover:text-primary" />
                          </button>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="px-2"
                          >
                            <ChevronDown className="h-4 w-4 text-gray-500 hover:text-primary" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      ${item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3 space-y-4">
              <Link to="/shop" className="btn btn-outline w-full">
                Return To Shop
              </Link>
              <button className="btn btn-outline w-full" onClick={() => setCartItems([])}>
                Clear Cart
              </button>
            </div>

            <div className="md:w-1/2 lg:w-1/3">
              <div className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Cart Total</h3>

                <div className="flex justify-between py-3 border-b">
                  <span>Subtotal:</span>
                  <span>${subtotal}</span>
                </div>

                <div className="flex justify-between py-3 border-b">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>

                <div className="flex justify-between py-3 mb-6 font-semibold">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="flex-grow px-4 py-2 border rounded-md"
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
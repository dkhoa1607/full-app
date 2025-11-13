import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // 1. Load giỏ hàng từ Backend khi đăng nhập
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const res = await fetch('http://localhost:5000/api/users/cart', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            setCartItems(data);
          }
        } catch (error) {
          console.error("Lỗi tải giỏ hàng:", error);
        }
      } else {
        setCartItems([]); // Chưa đăng nhập thì giỏ hàng rỗng
      }
    };
    fetchCart();
  }, [user]);

  // 2. Thêm vào giỏ hàng
  const addToCart = async (product, quantity = 1, color = null, storage = null) => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua hàng!");
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/users/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        // Gửi color và storage lên server
        body: JSON.stringify({ product, quantity, color, storage }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
        alert("Đã thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);
    }
  };

  // 3. Cập nhật số lượng
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  // 4. Xóa sản phẩm
  const removeItem = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/cart/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  // 5. Xóa sạch giỏ
  const clearCart = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/cart', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) setCartItems([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
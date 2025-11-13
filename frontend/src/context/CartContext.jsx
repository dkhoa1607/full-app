// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // Tách hàm fetch ra để tái sử dụng
  const fetchCart = useCallback(async () => {
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
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ... (Giữ nguyên các hàm addToCart, updateQuantity, removeItem, clearCart cũ) ...
  // Lưu ý: Trong các hàm cũ, nếu muốn chắc chắn, bạn có thể gọi fetchCart() sau khi thành công
  // Nhưng ở đây tôi giữ code cũ cho gọn, chỉ thêm refreshCart

  const addToCart = async (product, quantity = 1, color = null, storage = null) => {
      // ... (Code cũ) ...
      // Sau khi res.ok, bạn có thể gọi: await fetchCart(); để đồng bộ chuẩn nhất
      // Hoặc giữ nguyên logic set local state nếu muốn nhanh
      if (!user) { alert("Vui lòng đăng nhập!"); return; }
      try {
        const res = await fetch('http://localhost:5000/api/users/cart', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
            body: JSON.stringify({ product, quantity, color, storage }),
        });
        if (res.ok) {
            const data = await res.json();
            setCartItems(data);
            alert("Đã thêm vào giỏ hàng!");
        }
      } catch (error) { console.error(error); }
  };
  
  const updateQuantity = async (productId, newQuantity) => {
      if (newQuantity < 1) return;
      try {
          const res = await fetch(`http://localhost:5000/api/users/cart/${productId}`, {
              method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
              body: JSON.stringify({ quantity: newQuantity }),
          });
          if (res.ok) setCartItems(await res.json());
      } catch (e) {}
  };

  const removeItem = async (productId) => {
      try {
          const res = await fetch(`http://localhost:5000/api/users/cart/${productId}`, {
              method: 'DELETE', credentials: 'include',
          });
          if (res.ok) setCartItems(await res.json());
      } catch (e) {}
  };

  const clearCart = async () => {
      try {
          const res = await fetch('http://localhost:5000/api/users/cart', {
              method: 'DELETE', credentials: 'include',
          });
          if (res.ok) setCartItems([]);
      } catch (e) {}
  };

  return (
    // Thêm fetchCart vào value để bên ngoài gọi được (đổi tên thành refreshCart cho dễ hiểu)
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
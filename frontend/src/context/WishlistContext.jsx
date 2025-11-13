import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Cần AuthContext để biết user đã đăng nhập chưa

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth(); // Lấy thông tin user hiện tại

  // 1. Lấy danh sách wishlist từ Backend mỗi khi User thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await fetch('http://localhost:5000/api/users/wishlist', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Gửi cookie để xác thực
          });
          if (res.ok) {
            const data = await res.json();
            setWishlistItems(data);
          }
        } catch (error) {
          console.error("Lỗi tải wishlist:", error);
        }
      } else {
        setWishlistItems([]); // Nếu chưa đăng nhập (hoặc logout), xóa trắng wishlist
      }
    };

    fetchWishlist();
  }, [user]);

  // 2. Hàm Toggle (Thêm/Xóa) gọi API Backend
  const toggleWishlist = async (product) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm vào yêu thích!");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ product }), // Gửi sản phẩm lên server
      });

      if (res.ok) {
        const updatedWishlist = await res.json(); // Server trả về danh sách mới
        setWishlistItems(updatedWishlist); // Cập nhật state
      }
    } catch (error) {
      console.error("Lỗi cập nhật wishlist:", error);
    }
  };

  // 3. Hàm xóa (Thực ra logic Toggle đã bao gồm xóa, nhưng để tương thích code cũ ta viết wrapper)
  const removeFromWishlist = async (productId) => {
    // Tìm sản phẩm đầy đủ từ ID để gửi lên server (vì API toggle cần object product)
    const productToRemove = wishlistItems.find(item => item._id === productId);
    if (productToRemove) {
      await toggleWishlist(productToRemove);
    }
  };

  // 4. Kiểm tra xem có trong wishlist không (Giữ nguyên logic client)
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
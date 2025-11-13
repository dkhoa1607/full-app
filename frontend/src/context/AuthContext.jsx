import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // loading = true nghĩa là đang hỏi Backend, chưa biết kết quả
  const [loading, setLoading] = useState(true); 

  // Hàm kiểm tra đăng nhập (Chạy mỗi khi F5 trang)
  const checkUserLoggedIn = async () => {
    try {
      // Gửi request kèm Cookie để hỏi backend "Tôi là ai?"
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // QUAN TRỌNG: Gửi Cookie đi
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data); // Nếu Cookie đúng, lưu user vào State
      } else {
        setUser(null); // Cookie sai hoặc hết hạn
      }
    } catch (error) {
      console.error("Lỗi check auth:", error);
      setUser(null);
    } finally {
      setLoading(false); // Đã kiểm tra xong
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Hàm này dùng để cập nhật state sau khi Login thành công
  const login = (userData) => {
    setUser(userData);
  };

  // Hàm đăng xuất
const logout = async () => {
    try {
      // Gọi backend để xóa cookie
      await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Sau đó xóa user trong state
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )};

// Hook để các trang khác dễ dàng lấy thông tin user
export const useAuth = () => {
  return useContext(AuthContext);
};
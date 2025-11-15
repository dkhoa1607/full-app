import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
// --- SỬA: Thêm icon Home và useEffect ---
import { LayoutDashboard, ShoppingBag, Users, LogOut, Box, Home } from "lucide-react"; // Import icon
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react"; // <-- Đã thêm import này

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // BẢO VỆ: Nếu không phải Admin -> Đá về trang chủ ngay lập tức
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Hàm để tô màu menu đang chọn
  const isActive = (path) => location.pathname === path ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-100 hover:text-black";

  return (
    <div className="min-h-screen bg-gray-100 flex font-poppins">
      
      {/* --- SIDEBAR (Thanh menu bên trái) --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <Link to="/admin" className="text-2xl font-extrabold text-black tracking-wider no-underline">
            Admin<span className="text-red-500">.</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all no-underline ${isActive("/admin")}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          
          {/* Link quản lý sản phẩm */}
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all no-underline ${isActive("/admin/products")}`}>
            <Box className="w-5 h-5" /> Products
          </Link>
          
          {/* Link quản lý đơn hàng */}
          <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all no-underline ${isActive("/admin/orders")}`}>
            <ShoppingBag className="w-5 h-5" /> Orders
          </Link>
          
          {/* Link quản lý người dùng */}
          <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all no-underline ${isActive("/admin/users")}`}>
            <Users className="w-5 h-5" /> Users
          </Link>
        </nav>

        {/* --- SỬA LẠI KHỐI CUỐI TRANG --- */}
        <div className="mt-auto p-4 space-y-2 border-t border-gray-100">
          {/* 1. NÚT VỀ TRANG CHỦ (MỚI) */}
          <Link 
            to="/" 
            target="_blank" // Mở ở tab mới
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 hover:text-black rounded-xl w-full transition-all font-medium no-underline"
          >
            <Home className="w-5 h-5" /> View Site
          </Link>
          
          {/* 2. NÚT LOGOUT (CŨ) */}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-all font-medium">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
        {/* --- KẾT THÚC SỬA --- */}
      </aside>

      {/* --- MAIN CONTENT (Nội dung bên phải) --- */}
      <main className="flex-1 md:ml-64 p-8">
        {/* Outlet là nơi các trang con (Dashboard, Products...) sẽ hiện ra */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
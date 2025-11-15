import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import MyAccount from "../pages/MyAccount";
import OrderSuccess from "../pages/OrderSuccess";
import Wishlist from "../pages/Wishlist";
import ProductDetail from "../pages/ProductDetail";
import MyOrders from "../pages/MyOrders"; // <-- Import đã có (dòng 17 của bạn)
import MiniGame from "../pages/Minigame";
import Shop from "../pages/Shop";
import AdminLayout from "../components/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductEdit from "../pages/admin/AdminProductEdit";

// --- 1. IMPORT 2 TRANG ADMIN MỚI ---
import AdminOrders from "../pages/admin/AdminOrders";
import AdminUsers from "../pages/admin/AdminUsers";


import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20">Loading auth...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const RejectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20">Loading auth...</div>;
  return user ? <Navigate to="/" /> : <Outlet />;
};

// --- BẢO VỆ ROUTE ADMIN ---
const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-20">Loading auth...</div>;
  }

  // Phải có user VÀ user.isAdmin = true
  return user && user.isAdmin ? <AdminLayout /> : <Navigate to="/login" />;
};


const AppRouter = () => {
  return (
    <Routes>
      {/* NHÓM 1: PUBLIC */}
      <Route element={<RejectedRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      {/* NHÓM 2: PRIVATE (Đã đăng nhập) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="order-success/:id" element={<OrderSuccess />} />
          <Route path="minigame" element={<MiniGame />} />
          <Route path="my-orders" element={<MyOrders />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* NHÓM 3: ADMIN (Đã bảo vệ) */}
      <Route path="/admin" element={<AdminRoute />}> {/* <-- Sử dụng AdminRoute bảo vệ */}
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="product/:id/edit" element={<AdminProductEdit />} />
        
        {/* --- 2. THÊM 2 ROUTE MỚI VÀO ĐÂY --- */}
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        
      </Route>
    </Routes>
  );
};

export default AppRouter;
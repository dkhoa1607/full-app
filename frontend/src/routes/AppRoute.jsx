// frontend/src/routes/AppRoute.jsx

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

import { useAuth } from "../context/AuthContext";

// 1. Component Bảo vệ (Chỉ cho người đã đăng nhập đi qua)
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Trong lúc chờ Backend trả lời, hiện màn hình chờ
  if (loading) return <div className="text-center py-20">Loading auth...</div>;

  // Nếu có user -> Cho phép xem (Outlet). Nếu không -> Đá về Login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

// 2. Component Từ chối (Đã đăng nhập rồi thì không cho vào Login/Signup nữa)
const RejectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-20">Loading auth...</div>;

  // Nếu đã có user -> Đá về Home. Nếu chưa -> Cho phép vào Login/Signup
  return user ? <Navigate to="/" /> : <Outlet />;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* NHÓM 1: CÁC TRANG PUBLIC (Chỉ dành cho người CHƯA đăng nhập) */}
      <Route element={<RejectedRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      {/* NHÓM 2: CÁC TRANG PRIVATE (Cần đăng nhập mới xem được) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          
          {/* Route cho Wishlist */}
          <Route path="wishlist" element={<Wishlist />} />

          {/* Route cho Product Detail (Chi tiết sản phẩm) */}
          <Route path="product/:id" element={<ProductDetail />} />
          
          <Route path="checkout" element={<Checkout />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="order-success/:id" element={<OrderSuccess />} />
          
          {/* Trang 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
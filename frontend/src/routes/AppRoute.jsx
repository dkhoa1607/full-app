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
          {/* --- BẠN ĐANG THIẾU DÒNG NÀY --- */}
          <Route path="my-orders" element={<MyOrders />} />
          {/* -------------------------------- */}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} /> {/* <-- Thêm dòng này */}
        <Route path="product/:id/edit" element={<AdminProductEdit />} />
        {/* Route Edit sản phẩm sẽ thêm sau */}
      </Route>
    </Routes>
  );
};

export default AppRouter;
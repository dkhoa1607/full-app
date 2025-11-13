// frontend/src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// 1. Import hook useAuth để dùng hàm login() từ Context
import { useAuth } from "../context/AuthContext";

const SignUpForm = () => {
  // 2. Lấy hàm login từ AuthContext
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailOrPhone)) {
      newErrors.emailOrPhone = "Email không đúng định dạng";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // ====================================================
  // HÀM XỬ LÝ ĐĂNG NHẬP (GỌI API BACKEND)
  // ====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // QUAN TRỌNG: Gửi kèm cookie (nếu có) và nhận cookie từ server
        credentials: 'include',
        body: JSON.stringify({
          email: formData.emailOrPhone,
          password: formData.password,
        }),
      });

      if (res.ok) {
        const userData = await res.json();
        
        // 3. Gọi hàm login() của Context để cập nhật trạng thái toàn cục
        // (Thay vì tự lưu localStorage ở đây)
        login(userData);

        alert("Đăng nhập thành công!");
        navigate("/"); // Chuyển hướng về trang chủ
      } else {
        const errorData = await res.json();
        alert(`Đăng nhập thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến server.");
    }
  };
  // ====================================================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "371px",
        minHeight: "530px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 500 }}>Log in to Exclusive</h1>
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            fontFamily: "Poppins",
            lineHeight: "24px",
            color: "#000",
          }}
        >
          Enter your details below
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email"
            value={formData.emailOrPhone}
            onChange={handleInputChange}
            style={{
              border: "none",
              borderBottom: "1px solid #000",
              padding: "8px 0",
              fontSize: "16px",
              fontFamily: "Poppins",
              lineHeight: "24px",
              opacity: 0.4,
              outline: "none",
            }}
          />
          {errors.emailOrPhone && (
            <span style={{ color: "red", fontSize: "14px" }}>{errors.emailOrPhone}</span>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{
              border: "none",
              borderBottom: "1px solid #000",
              padding: "8px 0",
              fontSize: "16px",
              fontFamily: "Poppins",
              lineHeight: "24px",
              opacity: 0.4,
              outline: "none",
            }}
          />
          {errors.password && (
            <span style={{ color: "red", fontSize: "14px" }}>{errors.password}</span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#DB4444",
              color: "#FAFAFA",
              border: "none",
              borderRadius: "4px",
              padding: "16px",
              fontSize: "16px",
              fontFamily: "Poppins",
              fontWeight: 500,
              lineHeight: "24px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Log in
          </button>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              fontSize: "16px",
              fontFamily: "Poppins",
              lineHeight: "24px",
              opacity: 0.7,
            }}
          >
            <span style={{cursor: "pointer"}}>Forget password?</span>
            <Link to="/signup" style={{ color: "#DB4444", textDecoration: "none", marginLeft: "10px" }}>
              Create account
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

const Footer = () => {
  return (
    <div style={{ backgroundColor: "#000", color: "#FAFAFA", padding: "20px", textAlign: "center" }}>
      <p>© {new Date().getFullYear()} Exclusive. All rights reserved.</p>
    </div>
  );
};

const Login = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <SignUpForm />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
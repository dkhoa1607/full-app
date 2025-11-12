import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Các components 'TopHeader' và 'Header' đã bị loại bỏ
// vì chúng được định nghĩa nhưng không bao giờ được sử dụng trong file này.

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.email !== formData.emailOrPhone) {
      alert("Tài khoản không tồn tại hoặc sai email.");
      return;
    }

    alert("Đăng nhập thành công!");
    navigate("/");
  };

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
        <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 500 }}>Log in to shopping</h1>
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
            <span>Forget password ?</span>
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
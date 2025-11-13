// frontend/src/pages/MyAccount.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. Import hook useAuth
import { useAuth } from "../context/AuthContext";

function MyAccount() {
  const navigate = useNavigate();
  // 2. Lấy hàm logout từ Context
  const { logout } = useAuth();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [displayName, setDisplayName] = useState("");

  // Load dữ liệu khi vào trang
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Gửi Cookie đi để xác thực
        });

        if (res.ok) {
          const data = await res.json();
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            address: data.address || "", // Backend đã trả về address
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setDisplayName(`${data.firstName} ${data.lastName}`);
        } else {
          // Nếu token lỗi hoặc hết hạn -> logout và về trang login
          await logout();
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, [navigate, logout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý cập nhật thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.newPassword && userData.newPassword !== userData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          address: userData.address,
          newPassword: userData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cập nhật hồ sơ thành công!");
        setDisplayName(`${data.firstName} ${data.lastName}`);
        // Reset mật khẩu trên form
        setUserData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến server");
    }
  };

  // 3. Hàm Logout đã được nâng cấp
  const handleLogout = async () => {
    // Gọi hàm logout từ Context (nó sẽ gọi API /logout để xóa cookie server)
    await logout(); 
    
    // Xóa giỏ hàng ở local (tuỳ chọn, để người sau không thấy giỏ hàng cũ)
    localStorage.removeItem("cart"); 
    
    // Chuyển về trang login
    navigate("/login"); 
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link to="/" className="text-gray-500">Home</Link>
        <span>/</span>
        <span>My Account</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl">
          Welcome! <span className="text-primary">{displayName}</span>
        </h1>
        {/* Nút Logout gọi hàm handleLogout mới */}
        <button onClick={handleLogout} className="text-red-500 underline hover:text-red-700 text-sm">
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-6">Manage My Account</h2>
            <ul className="space-y-4">
              <li><Link to="/my-account" className="text-primary font-medium">My Profile</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary">Address Book</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary">My Payment Options</Link></li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">First Name</label>
                  <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Last Name</label>
                  <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Email</label>
                  <input type="email" name="email" value={userData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Address</label>
                  <input type="text" name="address" value={userData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary" placeholder="Nhập địa chỉ giao hàng" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-700">Password Changes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm">Current Password</label>
                  <input type="password" name="currentPassword" value={userData.currentPassword} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Nhập mật khẩu cũ (nếu đổi pass)" />
                </div>
                <div>
                  <label className="block mb-2 text-sm">New Password</label>
                  <input type="password" name="newPassword" value={userData.newPassword} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Mật khẩu mới" />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm">Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Nhập lại mật khẩu mới" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" className="px-6 py-2 border border-gray-400 rounded-md hover:bg-gray-100" onClick={() => navigate("/")}>
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-opacity-90">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyAccount() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserData((prev) => ({
        ...prev,
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        email: storedUser.email || "",
      }));
      setInitialData({
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        email: storedUser.email || "",
        address: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", userData);
    alert("Profile updated successfully!");
    localStorage.setItem(
      "user",
      JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      }),
    );
    setInitialData(userData);
  };

  const handleCancel = () => {
    setUserData(initialData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container py-12">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link to="/" className="text-gray-500">
          Home
        </Link>
        <span>/</span>
        <span>My Account</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl">
          Welcome!{" "}
          <span className="text-primary">
            {initialData.firstName} {initialData.lastName}
          </span>
        </h1>
        <button
          onClick={handleLogout}
          className="text-red-500 underline hover:text-red-700 text-sm"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-6">Manage My Account</h2>
            <ul className="space-y-4">
              <li>
                <Link to="/my-account" className="text-primary font-medium">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/address-book" className="text-gray-600 hover:text-primary">
                  Address Book
                </Link>
              </li>
              <li>
                <Link to="/payment-options" className="text-gray-600 hover:text-primary">
                  My Payment Options
                </Link>
              </li>
            </ul>

            <h2 className="text-lg font-bold mt-8 mb-6">My Orders</h2>
            <ul className="space-y-4">
              <li>
                <Link to="/my-returns" className="text-gray-600 hover:text-primary">
                  My Returns
                </Link>
              </li>
              <li>
                <Link to="/my-cancellations" className="text-gray-600 hover:text-primary">
                  My Cancellations
                </Link>
              </li>
            </ul>

            <h2 className="text-lg font-bold mt-8 mb-6">My Wishlist</h2>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-primary"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-700">Password Changes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={userData.currentPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={userData.newPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-400 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-opacity-90"
                >
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
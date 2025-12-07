import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../config/api.js";
import { 
  Trash2, CreditCard, MapPin, Plus, User, Package, LogOut, 
  Camera, Lock, Mail, Phone, Home
} from "lucide-react";

function MyAccount() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    firstName: "", lastName: "", email: "", address: "",
    currentPassword: "", newPassword: "", confirmPassword: "",
    addressBook: [],
    paymentMethods: []
  });

  const [newAddress, setNewAddress] = useState({ street: "", city: "", phone: "" });
  const [newCard, setNewCard] = useState({ cardType: "Visa", cardNumber: "", holderName: "", expiry: "" });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // --- LOAD DATA ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await apiCall('/api/users/profile', {
          method: 'GET',
        });
        if (res.ok) {
          const data = await res.json();
          setUserData({
            ...data,
            currentPassword: "", newPassword: "", confirmPassword: "",
            addressBook: data.addressBook || [],
            paymentMethods: data.paymentMethods || []
          });
        }
      } catch (error) { console.error(error); }
    };
    fetchUserProfile();
  }, []);

  // --- HANDLERS ---
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (userData.newPassword && userData.newPassword !== userData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!"); return;
    }
    try {
      const res = await apiCall('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: userData.firstName, lastName: userData.lastName,
          email: userData.email, address: userData.address,
          newPassword: userData.newPassword,
        }),
      });
      if (res.ok) alert("Cập nhật hồ sơ thành công!");
    } catch (error) { alert("Lỗi kết nối"); }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    const res = await apiCall('/api/users/address', {
      method: 'POST',
      body: JSON.stringify(newAddress),
    });
    if (res.ok) {
      const updatedList = await res.json();
      setUserData(prev => ({ ...prev, addressBook: updatedList }));
      setNewAddress({ street: "", city: "", phone: "" });
      setIsAddingAddress(false);
    }
  };

  const deleteAddress = async (id) => {
    if(!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    const res = await apiCall(`/api/users/address/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const updatedList = await res.json();
      setUserData(prev => ({ ...prev, addressBook: updatedList }));
    }
  };

  const addPayment = async (e) => {
    e.preventDefault();
    const res = await apiCall('/api/users/payment', {
      method: 'POST',
      body: JSON.stringify(newCard),
    });
    if (res.ok) {
      const updatedList = await res.json();
      setUserData(prev => ({ ...prev, paymentMethods: updatedList }));
      setNewCard({ cardType: "Visa", cardNumber: "", holderName: "", expiry: "" });
      setIsAddingCard(false);
    }
  };

  const deletePayment = async (id) => {
    if(!confirm("Bạn có chắc muốn xóa thẻ này?")) return;
    const res = await apiCall(`/api/users/payment/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const updatedList = await res.json();
      setUserData(prev => ({ ...prev, paymentMethods: updatedList }));
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("cart");
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen font-poppins text-gray-800 pb-20">
      
      {/* Header Banner */}
      <div className="bg-white border-b py-8 mb-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">My Account</h1>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <Link to="/" className="hover:text-black transition-colors">Home</Link> 
                <span>/</span> 
                <span className="text-black font-medium">Account</span>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="text-xl font-bold text-red-500">{userData.firstName} {userData.lastName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR MENU --- */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              
              {/* Avatar Mini */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Account</p>
                  <p className="font-bold text-gray-800 truncate max-w-[150px]">{userData.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "profile" ? "bg-red-50 text-red-500" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <User className="w-4 h-4" /> My Profile
                </button>
                <button 
                  onClick={() => setActiveTab("address")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "address" ? "bg-red-50 text-red-500" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <MapPin className="w-4 h-4" /> Address Book
                </button>
                <button 
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "payment" ? "bg-red-50 text-red-500" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <CreditCard className="w-4 h-4" /> Payment Options
                </button>
                <Link 
                  to="/my-orders"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <Package className="w-4 h-4" /> My Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all mt-4"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* --- MAIN CONTENT --- */}
          <div className="lg:w-3/4">
            
            {/* 1. PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Profile</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <input type="text" name="firstName" value={userData.firstName} onChange={handleProfileChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <input type="text" name="lastName" value={userData.lastName} onChange={handleProfileChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <div className="relative">
                        <input type="email" name="email" value={userData.email} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none" />
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Main Address</label>
                      <div className="relative">
                        <input type="text" name="address" value={userData.address} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none" />
                        <Home className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="font-semibold text-gray-800">Password Changes</h3>
                    <div className="space-y-2">
                      <input type="password" name="currentPassword" placeholder="Current Password" value={userData.currentPassword} onChange={handleProfileChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <input type="password" name="newPassword" placeholder="New Password" value={userData.newPassword} onChange={handleProfileChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none" />
                      <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={userData.confirmPassword} onChange={handleProfileChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <button type="button" className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors">Cancel</button>
                    <button type="submit" className="px-8 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 shadow-lg hover:shadow-red-200 transition-all">Save Changes</button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. ADDRESS TAB (Grid Layout) */}
            {activeTab === "address" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Address Book</h2>
                  <button 
                    onClick={() => setIsAddingAddress(!isAddingAddress)} 
                    className="flex items-center gap-2 text-red-500 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add New
                  </button>
                </div>

                {/* Form thêm mới */}
                {isAddingAddress && (
                  <form onSubmit={addAddress} className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid md:grid-cols-3 gap-4 mb-6 animate-slide-down">
                    <input placeholder="Street Address" className="border p-2.5 rounded-lg outline-none focus:border-red-500 bg-white" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
                    <input placeholder="City" className="border p-2.5 rounded-lg outline-none focus:border-red-500 bg-white" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
                    <input placeholder="Phone" className="border p-2.5 rounded-lg outline-none focus:border-red-500 bg-white" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required />
                    <div className="md:col-span-3 flex justify-end gap-3">
                      <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                      <button type="submit" className="btn btn-primary px-6 py-2 text-sm">Save Address</button>
                    </div>
                  </form>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {userData.addressBook.map((addr) => (
                    <div key={addr._id} className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                      <button onClick={() => deleteAddress(addr._id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4"/></button>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-50 text-red-500 rounded-lg"><MapPin className="w-5 h-5"/></div>
                        <span className="font-bold text-gray-800">{addr.city}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{addr.street}</p>
                      <p className="text-gray-500 text-sm font-mono">{addr.phone}</p>
                    </div>
                  ))}
                  {/* Thẻ rỗng để Add */}
                  <button onClick={() => setIsAddingAddress(true)} className="border-2 border-dashed border-gray-300 p-6 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-500 transition-all h-full min-h-[160px]">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="font-medium">Add New Address</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. PAYMENT TAB (Card UI) */}
            {activeTab === "payment" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Payment Methods</h2>
                  <button 
                    onClick={() => setIsAddingCard(!isAddingCard)} 
                    className="flex items-center gap-2 text-red-500 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add New
                  </button>
                </div>

                {isAddingCard && (
                  <form onSubmit={addPayment} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4 mb-6 animate-slide-down">
                    <div className="grid md:grid-cols-2 gap-4">
                      <select className="border p-2.5 rounded-lg bg-white outline-none" value={newCard.cardType} onChange={e => setNewCard({...newCard, cardType: e.target.value})}>
                        <option>Visa</option><option>MasterCard</option><option>JCB</option>
                      </select>
                      <input placeholder="Card Number" className="border p-2.5 rounded-lg bg-white outline-none" value={newCard.cardNumber} onChange={e => setNewCard({...newCard, cardNumber: e.target.value})} required />
                      <input placeholder="Card Holder Name" className="border p-2.5 rounded-lg bg-white outline-none" value={newCard.holderName} onChange={e => setNewCard({...newCard, holderName: e.target.value})} required />
                      <input placeholder="Expiry (MM/YY)" className="border p-2.5 rounded-lg bg-white outline-none" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} required />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setIsAddingCard(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                      <button type="submit" className="btn btn-primary px-6 py-2 text-sm">Save Card</button>
                    </div>
                  </form>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {userData.paymentMethods.map((card) => (
                    <div key={card._id} className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transform transition-transform hover:-translate-y-1 bg-gradient-to-br from-gray-800 to-black">
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                      
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <span className="font-bold tracking-wider uppercase">{card.cardType}</span>
                        <button onClick={() => deletePayment(card._id)} className="text-white/50 hover:text-white"><Trash2 className="w-4 h-4"/></button>
                      </div>
                      
                      <div className="mb-4 font-mono text-xl tracking-widest relative z-10">
                        {card.cardNumber}
                      </div>
                      
                      <div className="flex justify-between text-xs text-white/70 relative z-10">
                        <div>
                          <p className="uppercase text-[10px] mb-1">Card Holder</p>
                          <p className="font-bold text-white uppercase">{card.holderName}</p>
                        </div>
                        <div>
                          <p className="uppercase text-[10px] mb-1">Expires</p>
                          <p className="font-bold text-white">{card.expiry}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Thẻ rỗng để Add */}
                  <button onClick={() => setIsAddingCard(true)} className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-500 transition-all h-full min-h-[180px]">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="font-medium">Add New Card</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
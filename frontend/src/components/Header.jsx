import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, LogOut, Package, Star, Gift, Menu, X } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// --- THANH THÔNG BÁO TRÊN CÙNG ---
const TopHeader = () => {
  return (
    <div className="bg-black text-white text-sm py-3 font-poppins hidden md:block">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex-1 text-center">
          <span>Summer Sale For All Swim Suits And Free Express Delivery - </span>
          {/* Phần chữ nhấp nháy */}
          <span className="font-bold text-yellow-300 animate-blink">OFF 50%!</span>
        </div>
        <Link to="/shop" className="font-bold underline cursor-pointer hover:text-gray-300 transition-colors ml-4 flex-shrink-0">
          ShopNow
        </Link>
        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300 ml-8 flex-shrink-0">
          English <span className="text-[10px]">▼</span>
        </div>
      </div>
    </div>
  );
};

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserOpen, setIsUserOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Xóa input sau khi tìm
    }
  };

  // Hàm kiểm tra link active để tô đậm
  const isActive = (path) => location.pathname === path ? "text-black font-bold border-b-2 border-black" : "text-gray-500 hover:text-black";

  return (
    <div className="font-poppins sticky top-0 z-50 bg-white shadow-sm">
      <TopHeader />

      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* 1. LOGO */}
          <Link to="/" className="text-2xl font-extrabold tracking-wider text-black flex items-center gap-1">
            Exclusive<span className="text-red-500 text-4xl leading-none">.</span>
          </Link>

          {/* 2. MENU (Desktop) */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link to="/" className={`pb-1 transition-all ${isActive("/")}`}>Home</Link>
            <Link to="/shop" className={`pb-1 transition-all ${isActive("/shop")}`}>Shop</Link>
            <Link to="/contact" className={`pb-1 transition-all ${isActive("/contact")}`}>Contact</Link>
            <Link to="/about" className={`pb-1 transition-all ${isActive("/about")}`}>About</Link>
            {!user && <Link to="/signup" className={`pb-1 transition-all ${isActive("/signup")}`}>Sign Up</Link>}
          </nav>

          {/* 3. ICONS & SEARCH */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-100 rounded-md px-3 py-2 w-64 focus-within:ring-1 focus-within:ring-gray-300 transition-all">
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="bg-transparent border-none outline-none text-xs w-full placeholder:text-gray-500 text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="p-0 m-0 border-none bg-transparent cursor-pointer">
                <Search className="w-4 h-4 text-gray-500 hover:text-black" />
              </button>
            </form>

            <div className="flex items-center gap-4">
              {/* Minigame */}
              <Link to="/minigame" className="relative group" title="Lucky Wheel">
                <Gift className="w-6 h-6 text-black hover:text-red-500 transition-colors animate-pulse" />
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative group">
                <Heart className="w-6 h-6 text-black hover:text-red-500 transition-colors" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <ShoppingCart className="w-6 h-6 text-black hover:text-red-500 transition-colors" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserOpen(!isUserOpen)}
                    className={`p-1.5 rounded-full transition-all ${isUserOpen ? "bg-red-500 text-white" : "bg-gray-100 text-black hover:bg-gray-200"}`}
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserOpen && (
                    <div className="absolute right-0 top-full mt-3 w-60 bg-black/90 backdrop-blur-md text-white rounded-lg shadow-xl py-2 animate-fade-in-up border border-gray-700">
                      <div className="px-4 py-3 border-b border-gray-700 mb-1">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="font-bold truncate">{user.firstName} {user.lastName}</p>
                      </div>
                      
                      <Link to="/my-account" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-sm transition-colors">
                        <User className="w-4 h-4" /> Manage My Account
                      </Link>
                      <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-sm transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link to="/my-cancellations" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-sm transition-colors">
                        <Star className="w-4 h-4" /> My Reviews
                      </Link>
                      
                      <div className="border-t border-gray-700 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-sm text-red-400 transition-colors text-left">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="p-1.5 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-4 shadow-lg">
            <Link to="/" className="block font-medium hover:text-red-500">Home</Link>
            <Link to="/shop" className="block font-medium hover:text-red-500">Shop</Link>
            <Link to="/contact" className="block font-medium hover:text-red-500">Contact</Link>
            <Link to="/about" className="block font-medium hover:text-red-500">About</Link>
            {!user && <Link to="/signup" className="block font-medium hover:text-red-500">Sign Up</Link>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
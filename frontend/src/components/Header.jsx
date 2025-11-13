import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, LogOut, Package, Star, Gift } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// --- 1. DANH SÁCH CÁC CÂU QUẢNG CÁO THEO MÙA ---
const SALE_MESSAGES = [
  "🌸 Spring Sale: Blooming New Collections - Up to 40% OFF!",
  "☀️ Summer Vibes: Swim Suits & Beachwear - Buy 1 Get 1 Free!",
  "🍂 Autumn Special: Cozy Hoodies & Sweaters - Flat 30% OFF!",
  "❄️ Winter Wonderland: Jackets & Coats - 50% Discount!",
  "⚡ Flash Sale: Electronics - Extra 10% OFF for Members!",
  "🚚 Free Express Delivery for all orders over $140!"
];

// Component TopHeader (Đã nâng cấp để chạy chữ)
const TopHeader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logic tự động chuyển câu sau mỗi 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SALE_MESSAGES.length);
    }, 4000); // 4000ms = 4 giây

    return () => clearInterval(interval); // Dọn dẹp khi component bị hủy
  }, []);

  return (
    <div className="bg-black text-white text-xs py-3 text-center font-poppins hidden md:block transition-all duration-500">
      <div className="container mx-auto flex justify-between px-4 items-center">
        
        {/* Phần hiển thị Text chạy */}
        <div className="flex-1 text-center animate-fade-in">
          <span className="inline-block min-w-[300px]">
            {SALE_MESSAGES[currentIndex]}
          </span>
          <span className="font-bold underline cursor-pointer ml-2 hover:text-gray-300">
            ShopNow
          </span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
          English ⌄
        </div>
      </div>
    </div>
  );
};

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Gọi TopHeader đã nâng cấp */}
      <TopHeader />

      <header className="border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-0">
          
          <Link to="/" className="text-2xl font-bold text-black font-inter tracking-wider no-underline">
            Exclusive
          </Link>

          <nav className="hidden md:flex gap-8 font-poppins text-sm">
            <Link to="/" className="hover:underline underline-offset-4 decoration-2 decoration-gray-400 text-black no-underline">Home</Link>
            <Link to="/shop" className="hover:underline underline-offset-4 decoration-2 decoration-gray-400 text-black no-underline">Shop</Link>
            <Link to="/contact" className="hover:underline underline-offset-4 decoration-2 decoration-gray-400 text-black no-underline">Contact</Link>
            <Link to="/about" className="hover:underline underline-offset-4 decoration-2 decoration-gray-400 text-black no-underline">About</Link>
            {!user && <Link to="/signup" className="hover:underline underline-offset-4 decoration-2 decoration-gray-400 text-black no-underline">Sign Up</Link>}
          </nav>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative hidden md:block bg-gray-100 rounded px-3 py-2">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="bg-transparent text-xs w-48 outline-none placeholder:text-gray-500 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Nút Minigame */}
            <Link to="/minigame" className="relative group" title="Vòng quay may mắn">
              <Gift className="w-6 h-6 cursor-pointer text-red-500 hover:text-red-600 transition-colors animate-bounce" />
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative group text-black">
              <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative group text-black">
              <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <div className="cursor-pointer bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div className="absolute right-0 top-full mt-2 w-56 bg-black/90 backdrop-blur-sm text-white rounded-md shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-gray-700 text-sm text-gray-300">
                    Hello, <span className="font-bold text-white">{user.firstName}</span>
                  </div>
                  <Link to="/my-account" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm text-white no-underline">
                    <User className="w-4 h-4" /> Manage My Account
                  </Link>
                  <Link to="/my-orders" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm text-white no-underline">
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm text-left text-red-400">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-black">
                <User className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Header() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { wishlistItems } = useWishlist();

  const { cartItems } = useCart();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header style={{ borderBottom: "1px solid #e5e7eb", padding: "10px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 2rem",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="text-2xl font-bold text-black font-poppins">
            Exclusive
          </span>
        </Link>

        <nav style={{ display: "flex", gap: "55px" }}>
          <Link to="/" className={`font-poppins text-base cursor-pointer no-underline ${isActive("/") ? "text-black font-semibold" : "text-gray-500"}`}>Home</Link>
          <Link to="/contact" className={`font-poppins text-base cursor-pointer no-underline ${isActive("/contact") ? "text-black font-semibold" : "text-gray-500"}`}>Contact</Link>
          <Link to="/about" className={`font-poppins text-base cursor-pointer no-underline ${isActive("/about") ? "text-black font-semibold" : "text-gray-500"}`}>About</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="What are you looking for?"
              className="bg-gray-100 py-2 px-3 pr-9 rounded text-sm font-poppins w-[200px] border-none outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>

          <Link to="/wishlist" style={{ position: "relative" }}>
            <Heart style={{ width: "24px", height: "24px", color: "#000000" }} />
            
            {wishlistItems.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#DB4444",
                  color: "white",
                  fontSize: "12px",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link to="/cart" style={{ position: "relative" }}>
            <ShoppingCart style={{ width: "24px", height: "24px", color: "#000000" }} />
            {cartItems.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#DB4444",
                  color: "white",
                  fontSize: "12px",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartItems.length}
              </span>
            )}
          </Link>

          <Link to="/my-account">
            <User style={{ width: "24px", height: "24px", color: "#000000" }} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
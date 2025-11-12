import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User } from "lucide-react";

function Header() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

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
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000000",
              fontFamily: "Poppins",
            }}
          >
            Exclusive
          </span>
        </Link>

        <nav style={{ display: "flex", gap: "55px" }}>
          <Link
            to="/"
            style={{
              fontFamily: "Poppins",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none",
              color: isActive("/") ? "#000000" : "#666666",
              fontWeight: isActive("/") ? "600" : "normal",
            }}
          >
            Home
          </Link>
          <Link
            to="/contact"
            style={{
              fontFamily: "Poppins",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none",
              color: isActive("/contact") ? "#000000" : "#666666",
              fontWeight: isActive("/contact") ? "600" : "normal",
            }}
          >
            Contact
          </Link>
          <Link
            to="/about"
            style={{
              fontFamily: "Poppins",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none",
              color: isActive("/about") ? "#000000" : "#666666",
              fontWeight: isActive("/about") ? "600" : "normal",
            }}
          >
            About
          </Link>
          <Link
            to="/signup"
            style={{
              fontFamily: "Poppins",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none",
              color: isActive("/signup") ? "#000000" : "#666666",
              fontWeight: isActive("/signup") ? "600" : "normal",
            }}
          >
            Sign Up
          </Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="What are you looking for?"
              style={{
                backgroundColor: "#F5F5F5",
                padding: "8px 12px",
                paddingRight: "36px",
                borderRadius: "4px",
                border: "none",
                fontSize: "14px",
                fontFamily: "Poppins",
                width: "200px",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "18px",
                height: "18px",
                color: "#666666",
              }}
            />
          </div>

          <Link to="/wishlist" style={{ position: "relative" }}>
            <Heart style={{ width: "24px", height: "24px", color: "#000000" }} />
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
              1
            </span>
          </Link>

          <Link to="/cart" style={{ position: "relative" }}>
            <ShoppingCart style={{ width: "24px", height: "24px", color: "#000000" }} />
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
              2
            </span>
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
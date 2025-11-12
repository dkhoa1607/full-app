import { useState } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <footer
      style={{
        backgroundColor: "#000000",
        color: "#FAFAFA",
        paddingTop: "64px",
        paddingBottom: "32px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "32px",
            marginBottom: "64px",
          }}
        >
          {/* Column 1: Subscribe */}
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "24px",
                fontFamily: "Poppins",
              }}
            >
              Exclusive
            </h2>
            <p style={{ marginBottom: "16px", fontFamily: "Poppins", fontSize: "16px" }}>
              Subscribe
            </p>
            <p style={{ marginBottom: "16px", fontFamily: "Poppins", fontSize: "16px" }}>
              Get 10% off your first order
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex" }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid white",
                  borderRight: "none",
                  borderTopLeftRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  padding: "8px 12px",
                  color: "white",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  width: "100%",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid white",
                  borderLeft: "none",
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  padding: "8px 12px",
                  color: "white",
                }}
              >
                <Send style={{ width: "20px", height: "20px" }} />
              </button>
            </form>
          </div>

          {/* Column 2: Support */}
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "24px",
                fontFamily: "Poppins",
              }}
            >
              Support
            </h2>
            <address
              style={{
                fontStyle: "normal",
                marginBottom: "16px",
                fontFamily: "Poppins",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            >
              111 Bijoy sarani, Dhaka,
              <br />
              DH 1515, Bangladesh.
            </address>
            <p style={{ marginBottom: "8px", fontFamily: "Poppins", fontSize: "16px" }}>
              exclusive@gmail.com
            </p>
            <p style={{ fontFamily: "Poppins", fontSize: "16px" }}>+88015-88888-9999</p>
          </div>

          {/* Column 3: Account */}
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "24px",
                fontFamily: "Poppins",
              }}
            >
              Account
            </h2>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontFamily: "Poppins",
                fontSize: "16px",
              }}
            >
              <li>
                <Link to="/my-account" style={{ color: "#FAFAFA", textDecoration: "none" }}>
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: "#FAFAFA", textDecoration: "none" }}>
                  Login / Register
                </Link>
              </li>
              <li>
                <Link to="/cart" style={{ color: "#FAFAFA", textDecoration: "none" }}>
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" style={{ color: "#FAFAFA", textDecoration: "none" }}>
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/shop" style={{ color: "#FAFAFA", textDecoration: "none" }}>
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Link */}
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "24px",
                fontFamily: "Poppins",
              }}
            >
              Quick Link
            </h2>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontFamily: "Poppins",
                fontSize: "16px",
              }}
            >
              <li>
                <Link to="/privacy-policy" style={{ color: "#FAFAFA", textDecoration: "none" }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" style={{ color: "#FAFAFA", textDecoration: "none" }}>
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link to="/faq" style={{ color: "#FAFAFA", textDecoration: "none" }}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: "#FAFAFA", textDecoration: "none" }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid #333",
            paddingTop: "32px",
            textAlign: "center",
            fontFamily: "Poppins",
            fontSize: "14px",
          }}
        >
          <p>© Copyright Rimel 2022. All right reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
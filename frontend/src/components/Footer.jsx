import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if(!email) return;

    try {
      const res = await fetch('http://localhost:5000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if(res.ok) {
        alert("Cảm ơn bạn đã đăng ký!");
        setEmail("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Lỗi kết nối.");
    }
  }

  return (
    <footer className="bg-black text-white pt-16 pb-6 font-poppins">
      <div className="container mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          
          {/* Cột 1: Subscribe */}
          <div className="lg:col-span-1.5">
            <h2 className="text-2xl font-bold mb-6">Exclusive</h2>
            <h3 className="text-lg font-medium mb-4">Subscribe</h3>
            <p className="text-sm mb-4">Get 10% off your first order</p>
            <form onSubmit={handleSubscribe} className="relative w-full max-w-[250px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border border-white rounded py-2 px-3 text-sm w-full outline-none placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Cột 2: Support */}
          <div>
            <h3 className="text-lg font-medium mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li>111 Bijoy sarani, Dhaka,<br /> DH 1515, Bangladesh.</li>
              <li>exclusive@gmail.com</li>
              <li>+88015-88888-9999</li>
            </ul>
          </div>

          {/* Cột 3: Account */}
          <div>
            <h3 className="text-lg font-medium mb-6">Account</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/my-account" className="hover:underline">My Account</Link></li>
              <li><Link to="/login" className="hover:underline">Login / Register</Link></li>
              <li><Link to="/cart" className="hover:underline">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
              <li><Link to="/shop" className="hover:underline">Shop</Link></li>
            </ul>
          </div>

          {/* Cột 4: Quick Link */}
          <div>
            <h3 className="text-lg font-medium mb-6">Quick Link</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="#" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:underline">Terms Of Use</Link></li>
              <li><Link to="#" className="hover:underline">FAQ</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Cột 5: Download App (QR Code) */}
          <div>
            <h3 className="text-lg font-medium mb-6">Download App</h3>
            <p className="text-xs text-gray-400 mb-2">Save $3 with App New User Only</p>
            <div className="flex gap-2 items-center">
              {/* QR Code giả lập bằng ảnh placeholder */}
              <div className="bg-white p-1 w-20 h-20">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=ExclusiveApp" alt="QR" className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8 w-auto cursor-pointer" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8 w-auto cursor-pointer" />
              </div>
            </div>
            <div className="flex gap-6 mt-6 text-white">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-gray-400" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-gray-400" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-gray-400" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-gray-400" />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; Copyright Rimel 2022. All right reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
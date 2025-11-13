import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

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
      if(res.ok) { alert("Cảm ơn bạn đã đăng ký!"); setEmail(""); }
    } catch (error) { alert("Lỗi kết nối."); }
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8 font-poppins">
      <div className="container mx-auto px-6 md:px-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Cột 1: Branding & Subscribe */}
          <div className="lg:col-span-1.5 space-y-6">
            <h2 className="text-3xl font-bold tracking-wider">Exclusive.</h2>
            <h3 className="text-lg font-medium">Subscribe</h3>
            <p className="text-sm text-gray-300">Get 10% off your first order</p>
            
            <form onSubmit={handleSubscribe} className="relative max-w-xs">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent border border-white/40 rounded px-4 py-3 text-sm focus:border-white outline-none transition-colors placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-red-500 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Cột 2: Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Support</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="leading-relaxed">111 Bijoy sarani, Dhaka,<br /> DH 1515, Bangladesh.</li>
              <li>exclusive@gmail.com</li>
              <li>+88015-88888-9999</li>
            </ul>
          </div>

          {/* Cột 3: Account */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/my-account" className="hover:text-white hover:translate-x-1 transition-all inline-block">My Account</Link></li>
              <li><Link to="/login" className="hover:text-white hover:translate-x-1 transition-all inline-block">Login / Register</Link></li>
              <li><Link to="/cart" className="hover:text-white hover:translate-x-1 transition-all inline-block">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white hover:translate-x-1 transition-all inline-block">Wishlist</Link></li>
              <li><Link to="/shop" className="hover:text-white hover:translate-x-1 transition-all inline-block">Shop</Link></li>
            </ul>
          </div>

          {/* Cột 4: Quick Link */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Link</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Terms Of Use</Link></li>
              <li><Link to="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact</Link></li>
            </ul>
          </div>

          {/* Cột 5: Download App */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Download App</h3>
            <p className="text-xs text-gray-400">Save $3 with App New User Only</p>
            <div className="flex gap-3 items-center">
              {/* Giả lập QR Code */}
              <div className="bg-white p-1 w-20 h-20 flex-shrink-0">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=ExclusiveApp" alt="QR" className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8 w-auto cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8 w-auto cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="flex gap-6 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
            &copy; {new Date().getFullYear()} <span className="text-white">Exclusive</span>. All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
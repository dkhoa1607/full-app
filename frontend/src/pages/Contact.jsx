import { useState } from "react";
import { Link } from "react-router-dom";
// Sửa: Thêm User (cho input) và Loader2 (cho nút loading)
import { Phone, Mail, Send, MapPin, User, Loader2 } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  
  // --- NÂNG CẤP: Thêm state cho thông báo (thay thế alert()) ---
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa thông báo lỗi/thành công khi người dùng bắt đầu gõ lại
    if (statusMessage.text) {
      setStatusMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' }); // Xóa thông báo cũ

    try {
      const res = await fetch("https://full-app-da2f.vercel.app/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        // --- NÂNG CẤP: Dùng Status Message ---
        setStatusMessage({ type: 'success', text: 'Tin nhắn của bạn đã được gửi thành công!' });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        // --- NÂNG CẤP: Dùng Status Message ---
        setStatusMessage({ type: 'error', text: 'Gửi thất bại. Vui lòng thử lại.' });
      }
    } catch (error) {
      console.error(error);
      // --- NÂNG CẤP: Dùng Status Message ---
      setStatusMessage({ type: 'error', text: 'Lỗi kết nối server. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-poppins text-gray-800 pb-20">
      
      {/* Header Banner Nhỏ (Đồng bộ với các trang khác) */}
      <div className="bg-white border-b py-8 mb-12 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-2">Contact Us</h1>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <span className="text-black font-medium">Contact</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* --- NÂNG CẤP: Giao diện 2 cột --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ (Thiết kế lại thành 3 thẻ) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Thẻ 1: Call */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Call To Us</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">We are available 24/7, 7 days a week.</p>
              <p className="text-gray-900 font-medium text-sm">Phone: +8801611112222</p>
            </div>

            {/* Thẻ 2: Write */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Write To Us</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Fill out our form and we will contact you within 24 hours.</p>
              <p className="text-gray-900 font-medium text-sm break-words">Emails: customer@exclusive.com</p>
            </div>

            {/* Thẻ 3: Visit */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Visit Us</h3>
              </div>
              <p className="text-sm text-gray-600">123 Street, Old Trafford, London, UK</p>
            </div>

          </div>

          {/* CỘT PHẢI: FORM GỬI TIN NHẮN (Thiết kế lại input) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Send Us A Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- NÂNG CẤP: Input với Icon --- */}
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text" name="name" placeholder="Your Name *"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                    value={formData.name} onChange={handleChange} required
                  />
                </div>
                 <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email" name="email" placeholder="Your Email *"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                    value={formData.email} onChange={handleChange} required
                  />
                </div>
                 <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel" name="phone" placeholder="Your Phone (Optional)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
                
                <textarea
                  name="message" placeholder="Your Message *" rows="6"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all resize-none"
                  value={formData.message} onChange={handleChange} required
                ></textarea>

                {/* --- NÂNG CẤP: Vị trí hiển thị Thông báo Lỗi/Thành công --- */}
                {statusMessage.text && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${
                    statusMessage.type === 'success' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {statusMessage.text}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary px-10 py-3 rounded-lg shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 w-full sm:w-auto"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span>{loading ? "Sending..." : "Send Message"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* --- NÂNG CẤP: Thêm bản đồ --- */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447030833215!2d106.6974868153155!3d10.777014792320787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4941031a9d%3A0x19d266e76104e766!2zRGluaCDEkOG7mWMcTOG6pWM!5e0!3m2!1svi!2s!4v1678888888888!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>

      </div>
    </div>
  );
}

export default Contact;
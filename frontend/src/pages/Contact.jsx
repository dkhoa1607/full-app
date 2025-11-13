import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Send, MapPin } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Tin nhắn của bạn đã được gửi thành công!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("Gửi thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-poppins text-gray-800 pb-20">
      
      {/* Header Banner Nhỏ */}
      <div className="bg-white border-b py-8 mb-10 shadow-sm">
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
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
              
              {/* Phone */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md shadow-red-200">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Call To Us</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">We are available 24/7, 7 days a week.</p>
                <p className="text-gray-900 font-medium">Phone: +8801611112222</p>
              </div>

              <hr className="border-gray-100 my-6" />

              {/* Email */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md shadow-red-200">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Write To Us</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Fill out our form and we will contact you within 24 hours.</p>
                <p className="text-gray-900 font-medium break-words">Emails: customer@exclusive.com</p>
                <p className="text-gray-900 font-medium break-words">Emails: support@exclusive.com</p>
              </div>

              <hr className="border-gray-100 my-6" />

              {/* Address */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md shadow-red-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Visit Us</h3>
                </div>
                <p className="text-sm text-gray-600">123 Street, Old Trafford, London, UK</p>
              </div>

            </div>
          </div>

          {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Send Us A Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text" name="name" placeholder="Your Name *"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                    value={formData.name} onChange={handleChange} required
                  />
                  <input
                    type="email" name="email" placeholder="Your Email *"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                    value={formData.email} onChange={handleChange} required
                  />
                  <input
                    type="tel" name="phone" placeholder="Your Phone *"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
                    value={formData.phone} onChange={handleChange} required
                  />
                </div>
                
                <textarea
                  name="message" placeholder="Your Message *" rows="8"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all resize-none"
                  value={formData.message} onChange={handleChange} required
                ></textarea>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary px-10 py-3 rounded-lg shadow-lg hover:shadow-red-200 transition-all flex items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? "Sending..." : <>Send Message <Send className="w-4 h-4" /></>}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;
import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Tin nhắn của bạn đã được gửi thành công!");
        setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
      } else {
        alert("Gửi thất bại. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Lỗi kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-10 text-gray-500">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">Contact</span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ (Thiết kế dạng thẻ nổi) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-full">
            
            {/* Phone Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Call To Us</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">We are available 24/7, 7 days a week.</p>
              <p className="text-gray-800 font-medium">Phone: +8801611112222</p>
            </div>

            <hr className="border-gray-200 my-6" />

            {/* Email Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Write To Us</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">Fill out our form and we will contact you within 24 hours.</p>
              <p className="text-gray-800 font-medium">Emails: customer@exclusive.com</p>
              <p className="text-gray-800 font-medium">Emails: support@exclusive.com</p>
            </div>

             <hr className="border-gray-200 my-6" />

             {/* Address Section (Thêm cho đẹp) */}
             <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Visit Us</h3>
              </div>
              <p className="text-gray-600 text-sm">123 Street, Old Trafford, London, UK</p>
            </div>

          </div>
        </div>

        {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                className="bg-gray-50 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-red-200 focus:bg-white transition-all w-full"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                className="bg-gray-50 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-red-200 focus:bg-white transition-all w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone *"
                className="bg-gray-50 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-red-200 focus:bg-white transition-all w-full"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              name="message"
              placeholder="Your Message *"
              rows="8"
              className="bg-gray-50 px-4 py-3 rounded-md w-full mb-6 outline-none focus:ring-2 focus:ring-red-200 focus:bg-white transition-all resize-none"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <div className="flex justify-end">
              <button 
                type="submit" 
                className="btn btn-primary px-8 py-3 rounded-md flex items-center gap-2 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Sending..." : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
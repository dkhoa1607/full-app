import { Phone, Mail } from "lucide-react";
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="container py-12">
      <div className="flex items-center gap-2 text-sm mb-8">
        <a href="/" className="text-gray-500 hover:underline">
          Home
        </a>
        <span>/</span>
        <span className="text-primary font-medium">Contact</span>
      </div>

      <div className="grid md:grid-cols-5 gap-12">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                <Phone className="text-white h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Call To Us</h3>
            </div>
            <p className="text-gray-600 mb-1">We are available 24/7, 7 days a week.</p>
            <p className="text-gray-600">Phone: +8801611112222</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                <Mail className="text-white h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Write To Us</h3>
            </div>
            <p className="text-gray-600 mb-1">
              Fill out our form and we will contact you within 24 hours.
            </p>
            <p className="text-gray-600">customer@exclusive.com</p>
            <p className="text-gray-600">support@exclusive.com</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-primary">Send Us a Message</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                className="bg-gray-100 px-4 py-2 rounded-md"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                className="bg-gray-100 px-4 py-2 rounded-md"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone *"
                className="bg-gray-100 px-4 py-2 rounded-md"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              name="message"
              placeholder="Your Message *"
              rows="6"
              className="bg-gray-100 px-4 py-2 rounded-md w-full mb-6"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary px-8 py-3 bg-red-500 rounded-md">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
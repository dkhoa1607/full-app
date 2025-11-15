import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Store, DollarSign, Users, ShoppingBag, 
  Twitter, Instagram, Linkedin, 
  Truck, Headphones, CheckCircle 
} from "lucide-react";

function About() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stats');
        if(res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white min-h-screen font-poppins text-gray-800">
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-10">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black font-medium">About</span>
        </div>
      </div>

      {/* STORY SECTION */}
      <div className="container mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 animate-fade-in-left">
            <h1 className="text-5xl font-bold text-gray-900 tracking-wide">Our Story</h1>
            <div className="text-gray-600 text-lg leading-relaxed space-y-4 text-justify">
              <p>
                Launched in 2015, <strong>Exclusive</strong> is South Asia’s premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide range of tailored marketing, data, and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 millions customers across the region.
              </p>
              <p>
                Exclusive has more than 1 million products to offer, growing at a very fast pace. Exclusive offers a diverse assortment in categories ranging from consumer electronics to fashion, home appliances, and beauty items.
              </p>
            </div>
          </div>
          
          <div className="animate-fade-in-right">
            <img
              src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=1000&auto=format&fit=crop"
              alt="Our Story"
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: stats.products.toLocaleString(), label: "Total Products", Icon: Store },
            { value: `$${stats.revenue.toLocaleString()}`, label: "Total Revenue", Icon: DollarSign, highlight: true },
            { value: stats.users.toLocaleString(), label: "Active Customers", Icon: Users },
            { value: stats.orders.toLocaleString(), label: "Orders Sold", Icon: ShoppingBag },
          ].map((item, i) => (
            // THAY ĐỔI: hover:-translate-y-2 (thay cho hover:scale-105)
            <div
              key={i}
              className={`group border rounded-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 cursor-default
                ${item.highlight 
                  ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-200" 
                  : "bg-white border-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-200"
                }`}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-300
                ${item.highlight 
                  ? "bg-white/30 text-white" 
                  : "bg-gray-200 text-black group-hover:bg-white/30 group-hover:text-white"
                }`}>
                <item.Icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{item.value}</h3>
              <p className="text-sm opacity-90">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM SECTION */}
      <div className="container mx-auto px-4 mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              name: "Tom Cruise", 
              role: "Founder & Chairman", 
              img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop" 
            },
            { 
              name: "Emma Watson", 
              role: "Managing Director", 
              img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop" 
            },
            { 
              name: "Will Smith", 
              role: "Product Designer", 
              img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop" 
            },
          ].map((member, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="h-[350px] overflow-hidden bg-gray-100">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                />
              </div>
              <div className="p-6 text-left">
                <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 mb-4">{member.role}</p>
                <div className="flex gap-4 text-gray-400">
                  <a href="#" className="hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-black transition-colors"><Instagram className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-black transition-colors"><Linkedin className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { title: "FREE AND FAST DELIVERY", desc: "Free delivery for all orders over $140", Icon: Truck },
            { title: "24/7 CUSTOMER SERVICE", desc: "Friendly 24/7 customer support", Icon: Headphones },
            { title: "MONEY BACK GUARANTEE", desc: "We return money within 30 days", Icon: CheckCircle },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center group">
              {/* THAY ĐỔI: Chuyển sang màu đỏ (red) chủ đạo, bỏ border[8px] */}
              <div className="w-20 h-20 mb-6 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center text-red-500 transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-200">
                <item.Icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default About;
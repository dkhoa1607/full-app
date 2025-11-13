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

  // Gọi API lấy số liệu thật từ Backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-12 text-gray-500">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">About</span>
      </div>

      {/* --- 1. OUR STORY --- */}
      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-black tracking-wide mb-6">Our Story</h1>
          <div className="text-gray-700 text-base leading-relaxed space-y-4 text-justify">
            <p>
              Launched in 2015, <strong>Exclusive</strong> is South Asia’s premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide range of tailored marketing, data, and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 millions customers across the region.
            </p>
            <p>
              Exclusive has more than 1 million products to offer, growing at a very fast pace. Exclusive offers a diverse assortment in categories ranging from consumer electronics to fashion, home appliances, and beauty items.
            </p>
          </div>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=800&auto=format&fit=crop"
            alt="Our Story - Shopping"
            className="w-full rounded-lg shadow-xl object-cover h-[450px]"
          />
        </div>
      </div>

      {/* --- 2. STATS (DỮ LIỆU THẬT) --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
        {[
          { 
            value: stats.products.toLocaleString(), 
            label: "Total Products", 
            Icon: Store, 
            bgHover: "group-hover:bg-red-500", 
            textHover: "group-hover:text-white" 
          },
          { 
            value: `$${stats.revenue.toLocaleString()}`, 
            label: "Total Revenue", 
            Icon: DollarSign, 
            highlight: false, // Ô này sẽ nổi bật hơn
            bgHover: "group-hover:bg-white", 
            textHover: "group-hover:text-black" 
          },
          { 
            value: stats.users.toLocaleString(), 
            label: "Active Customers", 
            Icon: Users, 
            bgHover: "group-hover:bg-red-500", 
            textHover: "group-hover:text-white" 
          },
          { 
            value: stats.orders.toLocaleString(), 
            label: "Orders Sold", 
            Icon: ShoppingBag, 
            bgHover: "group-hover:bg-red-500", 
            textHover: "group-hover:text-white" 
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`group border rounded-lg p-8 text-center transition-all duration-300 hover:shadow-lg cursor-default
              ${item.highlight ? "bg-red-500 text-white border-red-500" : "bg-white border-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500"}
            `}
          >
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-300
              ${item.highlight ? "bg-white/30 text-white" : "bg-gray-200 text-black group-hover:bg-white/30 group-hover:text-white"}
            `}>
              <item.Icon className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-2 font-inter">{item.value}</h3>
            <p className={`text-sm ${item.highlight ? "text-gray-100" : "text-gray-600 group-hover:text-gray-100"}`}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* --- 3. TEAM MEMBERS (ẢNH ĐẸP TỪ UNSPLASH) --- */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { 
              name: "Tom Cruise", 
              role: "Founder & Chairman", 
              img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop" 
            },
            { 
              name: "Emma Watson", 
              role: "Managing Director", 
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop" 
            },
            { 
              name: "Will Smith", 
              role: "Product Designer", 
              img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop" 
            },
          ].map((member, i) => (
            <div key={i} className="text-left group">
              <div className="overflow-hidden rounded-lg bg-gray-100 mb-6 h-[400px]">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
              <p className="text-gray-600 mb-4">{member.role}</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-500 hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-gray-500 hover:text-black transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-gray-500 hover:text-black transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- 4. SERVICES (STATIC) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {[
          { title: "FREE AND FAST DELIVERY", desc: "Free delivery for all orders over $140", Icon: Truck },
          { title: "24/7 CUSTOMER SERVICE", desc: "Friendly 24/7 customer support", Icon: Headphones },
          { title: "MONEY BACK GUARANTEE", desc: "We return money within 30 days", Icon: CheckCircle },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-20 h-20 mb-6 rounded-full bg-gray-200 border-[8px] border-gray-100 flex items-center justify-center group hover:bg-black hover:text-white transition-colors duration-300">
              <item.Icon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold mb-2 uppercase tracking-wider">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
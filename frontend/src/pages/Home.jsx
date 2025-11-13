import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, ChevronLeft, ChevronRight, 
  Smartphone, Laptop, SprayCan, ShoppingBag, Truck, Headphones, ShieldCheck, Star
} from "lucide-react";

// --- DỮ LIỆU MỚI CHO GIAO DIỆN NÂNG CẤP ---

// 1. Dữ liệu Banner
const BANNERS = [
  {
    id: 1,
    title: "iPhone 9",
    subtitle: "Titanium. So strong. So light. So Pro.",
    image: "https://cdn.dummyjson.com/products/images/smartphones/1/thumbnail.png",
    bg: "bg-black",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "Women's Fashion",
    subtitle: "Discover the new autumn collection.",
    image: "https://cdn.dummyjson.com/products/images/womens-dresses/3/thumbnail.png",
    bg: "bg-[#f5f5f5]",
    textColor: "text-black"
  },
  {
    id: 3,
    title: "Luxury Fragrance",
    subtitle: "A new dimension of seduction.",
    image: "https://cdn.dummyjson.com/products/images/fragrances/1/thumbnail.png",
    bg: "bg-[#1a1a1a]",
    textColor: "text-white"
  }
];

// 2. Danh mục với Icon
const CATEGORIES = [
  { name: "Phones", link: "/shop?category=smartphones", Icon: Smartphone },
  { name: "Laptops", link: "/shop?category=laptops", Icon: Laptop },
  { name: "Fragrances", link: "/shop?category=fragrances", Icon: SprayCan },
  { name: "Skincare", link: "/shop?category=skincare", Icon: ShoppingBag },
  { name: "Groceries", link: "/shop?category=groceries", Icon: ShoppingBag },
  { name: "Decoration", link: "/shop?category=home-decoration", Icon: ShoppingBag },
];

// 3. Dịch vụ & Cam kết
const SERVICES = [
  { title: "FREE AND FAST DELIVERY", desc: "Free delivery for all orders over $140", Icon: Truck },
  { title: "24/7 CUSTOMER SERVICE", desc: "Friendly 24/7 customer support", Icon: Headphones },
  { title: "MONEY BACK GUARANTEE", desc: "We return money within 30 days", Icon: ShieldCheck },
];

// --- COMPONENT MỚI ---

// Component Đồng hồ đếm ngược
const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-12-31") - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="flex items-end gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-lg">
            {String(value).padStart(2, '0')}
          </div>
          <p className="text-xs mt-2 capitalize">{unit}</p>
        </div>
      ))}
    </div>
  );
};

// --- COMPONENT CHÍNH (ĐÃ NÂNG CẤP) ---

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tự động chuyển slide & Fetch sản phẩm bán chạy
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);

     const fetchBestSellers = async () => {
      try {
        // Lấy các sản phẩm có rating cao nhất
        const res = await fetch('http://localhost:5000/api/products?sort=rating&limit=8');
        const data = await res.json();
        if (data && data.products) {
          setBestSellers(data.products);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm bán chạy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  return (
    <div className="font-poppins text-gray-800 bg-white">
      
      {/* --- 1. HERO BANNER SLIDER (NÂNG CẤP) --- */}
      <div className="container mx-auto px-4 md:px-0 pt-8">
        <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden rounded-lg shadow-lg group border">
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 flex items-center transition-all duration-700 ease-in-out ${banner.bg}`}
              style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
            >
              <div className="container mx-auto px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8">
                <div className={`flex-1 space-y-4 md:space-y-6 ${banner.textColor} transition-all duration-500 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight">{banner.title}</h2>
                  <p className="text-lg md:text-xl opacity-80">{banner.subtitle}</p>
                  <Link to="/shop" className="inline-flex items-center gap-2 mt-4 px-8 py-3 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-all transform hover:scale-105 no-underline shadow-lg">
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className={`flex-1 flex justify-center transition-all duration-500 delay-200 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                  <img src={banner.image} alt={banner.title} className="max-h-[250px] md:max-h-[350px] object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>
          ))}
          {/* Nút điều hướng */}
          <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 z-20 p-2 bg-white/50 rounded-full text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100"><ChevronLeft /></button>
          <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 z-20 p-2 bg-white/50 rounded-full text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100"><ChevronRight /></button>
          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {BANNERS.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? "bg-red-500 scale-125" : "bg-gray-400/80 hover:bg-gray-200"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4 md:px-0 space-y-24">
        {/* --- 2. CATEGORIES (NÂNG CẤP VỚI ICON) --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
            <h3 className="text-red-500 font-bold text-lg">Categories</h3>
          </div>
          <h2 className="text-3xl font-bold mb-10">Browse By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map(({ name, link, Icon }, idx) => (
              <Link to={link} key={idx} className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 cursor-pointer no-underline text-black shadow-sm hover:shadow-lg hover:-translate-y-1">
                <Icon className="w-12 h-12" />
                <span className="font-medium text-center">{name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* --- 3. BEST SELLING PRODUCTS (MỤC MỚI) --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
            <h3 className="text-red-500 font-bold text-lg">This Month</h3>
          </div>
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold">Best Selling Products</h2>
            <Link to="/shop" className="btn bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? [...Array(4)].map((_, i) => <div key={i} className="bg-gray-100 h-[300px] rounded-lg animate-pulse"></div>) : 
              bestSellers.map(product => (
                <Link to={`/product/${product._id}`} key={product._id} className="group relative bg-white rounded-lg p-4 border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="relative aspect-square mb-4 bg-gray-50 rounded-md overflow-hidden p-4 flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="object-contain w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-500 transition-colors" title={product.name}>{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold text-red-600">${product.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1 text-sm text-yellow-500">
                        <Star className="w-4 h-4 fill-current" /> {product.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </section>

        {/* --- 4. FEATURED BANNER (NÂNG CẤP) --- */}
        <section>
          <div className="bg-black text-white rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-around gap-12 shadow-2xl overflow-hidden relative min-h-[450px]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10 space-y-6 text-center md:text-left">
              <p className="text-green-400 font-bold tracking-wider">Categories</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Enhance Your<br/>Music Experience</h2>
              <CountdownTimer />
              <Link to="/shop" className="inline-block bg-green-500 text-white px-10 py-3 rounded-md font-bold hover:bg-green-600 transition-colors no-underline mt-4 shadow-lg">Buy Now!</Link>
            </div>
            <img src="https://cdn.dummyjson.com/products/images/mobile-accessories/1/thumbnail.png" alt="Speaker" className="relative z-0 md:absolute md:right-10 md:bottom-0 max-h-[350px] md:max-h-[450px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]" />
          </div>
        </section>

        {/* --- 5. SERVICES & GUARANTEE (MỤC MỚI) --- */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {SERVICES.map(({ title, desc, Icon }, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-20 h-20 mb-6 rounded-full bg-gray-200 border-8 border-gray-100 flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:border-gray-300">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
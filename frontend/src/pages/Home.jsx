import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, ChevronLeft, ChevronRight, 
  Smartphone, Laptop, SprayCan, ShoppingBag, Truck, Headphones, ShieldCheck, Star,
  Watch, Home as HomeIcon, 
  Heart, ShoppingCart // <-- SỬA 1: Thêm Icon Heart và ShoppingCart
} from "lucide-react";
// --- SỬA 2: Thêm đuôi .jsx cho các file context ---
import { useCart } from "../context/CartContext.jsx"; // Import useCart
import { useWishlist } from "../context/WishlistContext.jsx"; // Import useWishlist

// --- COMPONENT CON ---

// Component Card Sản phẩm (Nâng cấp)
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);

  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-transparent hover:border-gray-100 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-300 flex flex-col">
      {/* Nút Wishlist */}
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
        className="absolute top-4 right-4 z-10 p-2.5 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        title="Add to Wishlist"
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* Ảnh */}
      <Link to={`/product/${product._id}`} className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden p-6 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-contain w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
        />
        {/* Nút Add to Cart (Slide Up) */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }} 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-black text-white text-sm font-medium py-3 rounded-lg shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-800"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
      </Link>

      {/* Thông tin */}
      <div className="flex flex-col flex-1 mt-2">
        <span className="text-xs font-semibold text-gray-400 uppercase mb-1">{product.category}</span>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2" title={product.name}>
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between">
          <span className="text-2xl font-bold text-red-600">${product.price.toFixed(2)}</span>
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <Star className="w-4 h-4 fill-current" /> 
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component Card Danh mục (Nâng cấp)
const CategoryCard = ({ name, link, Icon }) => (
  <Link 
    to={link} 
    className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 
             hover:bg-red-500 hover:text-white hover:border-red-500 
             transition-all duration-300 cursor-pointer text-black 
             shadow-sm hover:shadow-lg hover:shadow-red-200 hover:-translate-y-1.5"
  >
    <Icon className="w-12 h-12" />
    <span className="font-semibold text-center">{name}</span>
  </Link>
);

// Component Đồng hồ đếm ngược (Giữ nguyên)
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
    <div className="flex items-end gap-3 sm:gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-black font-bold text-xl sm:text-2xl shadow-lg">
            {String(value).padStart(2, '0')}
          </div>
          <p className="text-xs mt-2 capitalize">{unit}</p>
        </div>
      ))}
    </div>
  );
};

// --- DỮ LIỆU MỚI (AN TOÀN) ---

// 1. Dữ liệu Banner
const BANNERS = [
  {
    id: 1,
    title: "iPhone 14 Pro",
    subtitle: "Pro. Beyond.",
    image: "https://cdn.dummyjson.com/products/images/smartphones/2/thumbnail.png",
    bg: "bg-black",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "Women's Fashion",
    subtitle: "Discover the new autumn collection.",
    image: "https://cdn.dummyjson.com/products/images/womens-dresses/3/thumbnail.png",
    bg: "bg-[#F0EAE2]", // Màu be nhạt
    textColor: "text-black"
  },
  {
    id: 3,
    title: "Luxury Fragrance",
    subtitle: "A new dimension of seduction.",
    image: "https://cdn.dummyjson.com/products/images/fragrances/1/thumbnail.png",
    bg: "bg-[#E3E4E8]", // Màu xám nhạt
    textColor: "text-black"
  }
];

// 2. Danh mục với Icon
const CATEGORIES = [
  { name: "Phones", link: "/shop?category=smartphones", Icon: Smartphone },
  { name: "Laptops", link: "/shop?category=laptops", Icon: Laptop },
  { name: "Watches", link: "/shop?category=mens-watches", Icon: Watch },
  { name: "Fragrances", link: "/shop?category=fragrances", Icon: SprayCan },
  { name: "Skincare", link: "/shop?category=skincare", Icon: ShoppingBag },
  { name: "Decoration", link: "/shop?category=home-decoration", Icon: HomeIcon },
];

// 3. Dịch vụ & Cam kết
const SERVICES = [
  { title: "FREE AND FAST DELIVERY", desc: "Free delivery for all orders over $140", Icon: Truck },
  { title: "24/7 CUSTOMER SERVICE", desc: "Friendly 24/7 customer support", Icon: Headphones },
  { title: "MONEY BACK GUARANTEE", desc: "We return money within 30 days", Icon: ShieldCheck },
];


// --- COMPONENT TRANG CHỦ ---

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tự động chuyển slide & Fetch sản phẩm bán chạy
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000); // Tăng thời gian chuyển slide

     const fetchBestSellers = async () => {
      try {
        setLoading(true);
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

  // Hàm helper để tạo skeleton
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
      <div className="aspect-square mb-4 bg-gray-100 rounded-xl"></div>
      <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
      <div className="h-6 bg-gray-100 rounded w-3/4 mb-3"></div>
      <div className="flex items-end justify-between">
        <div className="h-8 bg-gray-100 rounded w-1/2"></div>
        <div className="h-6 bg-gray-100 rounded w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className="font-poppins text-gray-800 bg-white">
      
      {/* --- 1. HERO BANNER SLIDER --- */}
      <div className="container mx-auto px-4 pt-8">
        <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-2xl shadow-lg group border border-gray-100">
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 flex items-center transition-all duration-1000 ease-in-out ${banner.bg}`}
              style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
            >
              <div className="container mx-auto px-10 md:px-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                {/* Text Content */}
                <div className={`space-y-4 md:space-y-6 ${banner.textColor} transition-all duration-700 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight">{banner.title}</h2>
                  <p className="text-lg md:text-xl opacity-80">{banner.subtitle}</p>
                  <Link to="/shop" className="inline-flex items-center gap-2 mt-4 px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all transform hover:scale-105 no-underline shadow-lg shadow-red-200">
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                {/* Image */}
                <div className={`flex justify-center transition-all duration-700 delay-200 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                  <img src={banner.image} alt={banner.title} className="max-h-[200px] md:max-h-[350px] object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>
          ))}
          {/* Nút điều hướng */}
          <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 z-20 p-2.5 bg-white/70 rounded-full text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"><ChevronLeft /></button>
          <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 z-20 p-2.5 bg-white/70 rounded-full text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"><ChevronRight /></button>
          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {BANNERS.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-red-500 scale-125" : "bg-gray-400/80 hover:bg-gray-200"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4 space-y-24">
        
        {/* --- 2. CATEGORIES --- */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-5 h-10 bg-red-500 rounded"></div>
            <h3 className="text-red-500 font-bold text-lg">Categories</h3>
          </div>
          <h2 className="text-4xl font-bold mb-10 tracking-tight">Browse By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {CATEGORIES.map((cat, idx) => (
              <CategoryCard key={idx} {...cat} />
            ))}
          </div>
        </section>

        {/* --- 3. BEST SELLING PRODUCTS --- */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-5 h-10 bg-red-500 rounded"></div>
            <h3 className="text-red-500 font-bold text-lg">This Month</h3>
          </div>
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-4xl font-bold tracking-tight">Best Selling Products</h2>
            <Link to="/shop" className="btn bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors hidden sm:block">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? 
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />) : 
              bestSellers.slice(0, 4).map(product => ( // Chỉ hiện 4 món
                <ProductCard key={product._id} product={product} />
              ))
            }
          </div>
        </section>

        {/* --- 4. FEATURED BANNER --- */}
        <section>
          <div className="bg-black text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl overflow-hidden relative min-h-[400px] md:min-h-[450px]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[3%]"></div>
            <div className="relative z-10 space-y-6 text-center md:text-left">
              <p className="text-green-400 font-bold tracking-wider uppercase">Categories</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Enhance Your<br/>Music Experience</h2>
              <CountdownTimer />
              <Link to="/shop?category=mobile-accessories" className="inline-block bg-green-500 text-black px-10 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors no-underline mt-4 shadow-lg shadow-green-500/30">Buy Now!</Link>
            </div>
            {/* Ảnh an toàn */}
            <img 
              src="https://cdn.dummyjson.com/products/images/mobile-accessories/1/thumbnail.png" 
              alt="Speaker" 
              className="relative z-0 md:absolute md:right-10 md:bottom-0 max-h-[300px] md:max-h-[450px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]" 
            />
          </div>
        </section>

        {/* --- 5. EXPLORE OUR PRODUCTS (MỚI) --- */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-5 h-10 bg-red-500 rounded"></div>
            <h3 className="text-red-500 font-bold text-lg">Our Products</h3>
          </div>
          <h2 className="text-4xl font-bold mb-10 tracking-tight">Explore Our Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? 
              [...Array(8)].map((_, i) => <SkeletonCard key={i} />) : 
              bestSellers.map(product => ( // Hiển thị 8 món
                <ProductCard key={product._id} product={product} />
              ))
            }
          </div>
           <div className="text-center mt-16">
             <Link to="/shop" className="btn bg-red-500 text-white px-12 py-4 rounded-lg hover:bg-red-600 transition-colors font-bold text-lg shadow-lg shadow-red-200">View All Products</Link>
           </div>
        </section>

        {/* --- 6. SERVICES & GUARANTEE --- */}
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
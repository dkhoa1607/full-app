import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, Filter, X, Search, SlidersHorizontal } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const PRODUCT_LIMIT = 12; // Giảm limit để dễ test Load More

function Shop() {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get("search") || "",
      category: params.get("category") || "all",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      sort: params.get("sort") || "default",
      skip: 0
    };
  });

  // Khi URL thay đổi (từ category link), cập nhật state filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const search = params.get("search");
    setFilters(prev => ({ ...prev, category: category || "all", search: search || "", skip: 0 }));
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) { console.error(error); }
    };
    fetchCategories();
  }, []);

  // --- useEffect CHÍNH ĐỂ FETCH SẢN PHẨM ---
  // Sẽ chạy lại mỗi khi filters thay đổi (search, category, sort, price, skip)
  useEffect(() => {
    const fetchProducts = async () => {
      // Nếu là "load more" thì không cần set loading chính
      if (filters.skip > 0) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = new URLSearchParams({
          limit: PRODUCT_LIMIT,
          skip: filters.skip,
          search: filters.search,
          sort: filters.sort,
        });
        if (filters.category !== "all") params.append("category", filters.category);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

        const res = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
        const data = await res.json();

        if (data && data.products) {
          // Nếu skip > 0 (load more) thì nối vào mảng cũ, ngược lại thì thay thế
          setProducts(prev => filters.skip > 0 ? [...prev, ...data.products] : data.products);
          setTotalProducts(data.total);
        }
      } catch (error) {
        console.error("Lỗi fetch sản phẩm:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
  }, [filters]); // Phụ thuộc vào toàn bộ object filters

  const handleLoadMore = async () => {
    // Chỉ cần cập nhật skip, useEffect sẽ tự động fetch thêm
    setFilters(prev => ({ ...prev, skip: prev.skip + PRODUCT_LIMIT }));
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "all", minPrice: "", maxPrice: "", sort: "default", skip: 0 });
    window.history.pushState({}, '', '/shop');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Khi filter, luôn reset về trang đầu tiên
    setFilters(prev => ({ ...prev, [name]: value, skip: 0 }));
  };

  // --- GIAO DIỆN MỚI (PRO UI) ---
  return (
    <div className="bg-gray-50 min-h-screen font-poppins text-gray-800">
      
      {/* Header Banner Nhỏ */}
      <div className="bg-white border-b py-8 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-2">Shop All Products</h1>
          <p className="text-gray-500 text-sm">
            Home / <span className="text-black font-medium">Shop</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* --- SIDEBAR FILTER (Sticky & Clean) --- */}
          <div className={`
            lg:w-1/4 lg:block 
            ${showMobileFilter ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'}
            lg:static lg:bg-transparent lg:p-0 lg:overflow-visible
          `}>
            {/* Mobile Header */}
            <div className="flex justify-between items-center lg:hidden mb-6">
              <h3 className="text-xl font-bold">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)}><X /></button>
            </div>

            <div className="space-y-8 lg:sticky lg:top-24">
              {/* Category Filter */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-red-500" /> Categories
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${filters.category === "all" ? "border-red-500" : "border-gray-300"}`}>
                      {filters.category === "all" && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                    </div>
                    <input type="radio" name="category" value="all" checked={filters.category === "all"} onChange={handleFilterChange} className="hidden" />
                    <span className={`text-sm ${filters.category === "all" ? "font-semibold text-black" : "text-gray-600 group-hover:text-red-500"}`}>All Categories</span>
                  </label>
                  
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${filters.category === cat ? "border-red-500" : "border-gray-300"}`}>
                        {filters.category === cat && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                      </div>
                      <input type="radio" name="category" value={cat} checked={filters.category === cat} onChange={handleFilterChange} className="hidden" />
                      <span className={`text-sm capitalize ${filters.category === cat ? "font-semibold text-black" : "text-gray-600 group-hover:text-red-500"}`}>
                        {cat.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" name="minPrice" placeholder="0" 
                    value={filters.minPrice} onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-red-500 text-sm transition-colors"
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number" name="maxPrice" placeholder="10000" 
                    value={filters.maxPrice} onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-red-500 text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Clear Button */}
              <button 
                onClick={clearFilters}
                className="w-full py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Reset Filters
              </button>
            </div>
          </div>

          {/* --- PRODUCT GRID (Cột phải) --- */}
          <div className="flex-1">
            
            {/* Toolbar: Search & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              {/* Mobile Filter Button */}
              <button className="lg:hidden flex items-center gap-2 text-sm font-bold" onClick={() => setShowMobileFilter(true)}>
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>

              <div className="relative w-full sm:w-96">
                <input 
                  type="text" name="search" placeholder="Search products..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all shadow-sm"
                  value={filters.search} onChange={handleFilterChange} 
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                <select 
                  name="sort"
                  className="bg-white border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-red-500 cursor-pointer shadow-sm hover:bg-gray-50"
                  value={filters.sort} onChange={handleFilterChange}
                >
                  <option value="default">Newest Arrivals</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* LOADING STATE */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white h-[350px] rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500">Try changing your filters or search term.</p>
                <button onClick={clearFilters} className="mt-6 text-red-500 font-medium hover:underline">Clear all filters</button>
              </div>
            ) : (
              <>
                {/* PRODUCTS GRID (PRO UI) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link
                      to={`/product/${product._id}`} 
                      key={product._id} 
                      className="group relative bg-white rounded-2xl p-4 border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Wishlist Button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); e.stopPropagation(); toggleWishlist(product);
                        }}
                        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""}`} />
                      </button>

                      {/* Image Container */}
                      <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden p-6 flex items-center justify-center">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="object-contain w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                        />
                        
                        {/* Quick Add Button (Slide Up Effect) */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault(); e.stopPropagation(); addToCart(product);
                          }} 
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 hover:bg-gray-800 w-[90%] justify-center"
                        >
                          <ShoppingCart className="w-4 h-4" /> Add
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-col flex-1">
                        <div className="mb-1">
                          {product.category && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              {product.category}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-500 transition-colors" title={product.name}>
                          {product.name}
                        </h3>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-lg font-bold text-red-600">${product.price.toFixed(2)}</span>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> In Stock
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-16">
                  {products.length < totalProducts && (
                    <button 
                      onClick={handleLoadMore} 
                      className="px-10 py-3 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm disabled:opacity-50" 
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Loading..." : "Load More Products"}
                    </button>
                  )}
                  <p className="text-xs text-gray-400 mt-4">Showing {products.length} of {totalProducts} products</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
import { useState, useEffect } from "react";
// 1. Import useLocation
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, Filter, X } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const PRODUCT_LIMIT = 20;

function Shop() {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();
  
  // 2. Khởi tạo location
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
    sort: "default",
    skip: 0
  });

  // 3. USE EFFECT MỚI: ĐỌC URL KHI VÀO TRANG
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category"); // Lấy ?category=...
    const searchFromUrl = params.get("search");     // Lấy ?search=...

    if (categoryFromUrl || searchFromUrl) {
      // Nếu có tham số trên URL, cập nhật bộ lọc ngay
      setFilters(prev => ({
        ...prev,
        category: categoryFromUrl || "all",
        search: searchFromUrl || "",
        skip: 0
      }));
    }
  }, [location.search]); // Chạy lại mỗi khi URL thay đổi

  // Lấy danh sách Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Hàm gọi API lấy sản phẩm
  const fetchProducts = async (isLoadMore = false) => {
    try {
      const currentSkip = isLoadMore ? filters.skip : 0;
      
      const params = new URLSearchParams({
        limit: PRODUCT_LIMIT,
        skip: currentSkip,
        search: filters.search,
        sort: filters.sort,
      });

      if (filters.category !== "all") params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const res = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      const data = await res.json();

      if (data && data.products) {
        if (isLoadMore) {
          setProducts(prev => [...prev, ...data.products]);
        } else {
          setProducts(data.products);
        }
        setTotalProducts(data.total);
      }
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Gọi API khi bộ lọc thay đổi
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      // Reset skip về 0 khi đổi bộ lọc (trừ khi đang load more)
      if (!loadingMore) {
         // Logic ở đây hơi phức tạp vì filters.skip thay đổi cũng kích hoạt useEffect
         // Tuy nhiên, fetchProducts sẽ lo phần skip
      }
      fetchProducts(false);
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.category, filters.sort, filters.minPrice, filters.maxPrice]);

  // Load More
  const handleLoadMore = async () => {
    const newSkip = filters.skip + PRODUCT_LIMIT;
    setFilters(prev => ({ ...prev, skip: newSkip }));
    setLoadingMore(true);
    
    const params = new URLSearchParams({
        limit: PRODUCT_LIMIT,
        skip: newSkip,
        search: filters.search,
        sort: filters.sort,
    });
    if (filters.category !== "all") params.append("category", filters.category);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    try {
        const res = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
        const data = await res.json();
        if(data && data.products) {
            setProducts(prev => [...prev, ...data.products]);
        }
        setLoadingMore(false);
    } catch(e) { console.error(e); setLoadingMore(false); }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      sort: "default",
      skip: 0
    });
    // Xóa query param trên URL để sạch sẽ (Tùy chọn)
    window.history.pushState({}, '', '/shop');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-primary">Explore Our Products</h1>
        <p className="text-xl text-gray-600">
          {/* Hiển thị tên category đang lọc cho người dùng biết */}
          {filters.category !== 'all' 
            ? `Viewing: ${filters.category.replace('-', ' ')}` 
            : 'Find the best deals for you'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR */}
        <div className="w-full lg:w-1/4 space-y-8">
          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Categories
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="category" value="all" 
                  checked={filters.category === "all"}
                  onChange={handleFilterChange}
                  className="accent-red-500"
                />
                <span>All Categories</span>
              </label>
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer capitalize">
                  <input 
                    type="radio" name="category" value={cat} 
                    checked={filters.category === cat}
                    onChange={handleFilterChange}
                    className="accent-red-500"
                  />
                  <span>{cat.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-bold mb-4">Price Range</h3>
            <div className="flex items-center gap-2">
              <input 
                type="number" name="minPrice" placeholder="Min" 
                value={filters.minPrice} onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded outline-none focus:border-red-500 text-sm"
              />
              <span>-</span>
              <input 
                type="number" name="maxPrice" placeholder="Max" 
                value={filters.maxPrice} onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded outline-none focus:border-red-500 text-sm"
              />
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="w-full btn btn-outline flex items-center justify-center gap-2 hover:text-red-500 hover:border-red-500"
          >
            <X className="w-4 h-4" /> Clear Filters
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex gap-4 w-full md:w-auto flex-1">
              <input 
                type="text" name="search" placeholder="Search products..." 
                className="border rounded-md px-4 py-2 w-full" 
                value={filters.search} onChange={handleFilterChange} 
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <select 
                name="sort"
                className="border rounded-md px-4 py-2 outline-none focus:border-red-500" 
                value={filters.sort} onChange={handleFilterChange}
              >
                <option value="default">Sort by: Newest</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
              
              <Link to="/cart" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary whitespace-nowrap">
                <ShoppingCart className="h-5 w-5" /> Cart ({cartItems.length})
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 border rounded-lg">
              No products found matching your criteria.
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    to={`/product/${product._id}`} 
                    key={product._id} 
                    className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md relative group flex flex-col no-underline text-black bg-white"
                  >
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-transform active:scale-90 z-10"
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                    </button>

                    <div className="flex flex-col flex-1 mb-4">
                      <div className="h-48 w-full bg-gray-50 rounded-md mb-4 flex items-center justify-center p-4">
                         <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1 flex-1 hover:text-red-500 transition-colors line-clamp-2" title={product.name}>
                        {product.name}
                      </h3>
                      <div className="flex justify-center items-center gap-2 mt-2">
                        <span className="text-red-600 font-bold text-lg">${product.price.toFixed(2)}</span>
                        {product.category && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                                {product.category.replace('-', ' ')}
                            </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }} 
                      className="btn btn-primary w-full mt-auto"
                    >
                      Add to Cart
                    </button>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                {products.length < totalProducts && (
                  <button onClick={handleLoadMore} className="btn btn-primary px-8 py-3 disabled:opacity-50" disabled={loadingMore}>
                    {loadingMore ? "Loading..." : "Load More Products"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
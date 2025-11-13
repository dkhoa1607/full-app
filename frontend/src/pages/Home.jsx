import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const PRODUCT_LIMIT = 20;

function Home() {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [sortOrder, setSortOrder] = useState("default");

  // --- 1. HÀM GỌI API (CÓ THÊM SEARCH) ---
  const fetchProducts = async (currentSkip, currentSearch, isInitialLoad = false) => {
    try {
      // Gửi thêm tham số &search=... lên backend
      const res = await fetch(
        `http://localhost:5000/api/products?limit=${PRODUCT_LIMIT}&skip=${currentSkip}&search=${currentSearch}`
      );
      const data = await res.json();

      if (data && data.products) {
        if (isInitialLoad) {
          setProducts(data.products); // Thay thế hoàn toàn nếu là tìm kiếm mới
        } else {
          setProducts(prevProducts => [...prevProducts, ...data.products]); // Nối thêm nếu là Load More
        }
        setTotalProducts(data.total);
      }
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    }
  };

  // --- 2. USE EFFECT 1: CHẠY KHI VÀO TRANG HOẶC KHI TÌM KIẾM ---
  useEffect(() => {
    // Kỹ thuật Debounce: Đợi người dùng ngừng gõ 500ms mới gọi API
    // để tránh gọi server quá nhiều lần liên tục
    const delayDebounce = setTimeout(() => {
      const initialLoad = async () => {
        setLoading(true);
        setSkip(0); // Reset về trang đầu
        await fetchProducts(0, searchTerm, true); // Gọi API với từ khóa hiện tại
        setSkip(PRODUCT_LIMIT);
        setLoading(false);
      };
      initialLoad();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]); // Chạy lại mỗi khi searchTerm thay đổi

  // --- 3. HÀM LOAD MORE ---
  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    // Gọi tiếp với từ khóa đang tìm kiếm
    await fetchProducts(skip, searchTerm, false); 
    setSkip(prevSkip => prevSkip + PRODUCT_LIMIT);
    setLoadingMore(false);
  };

  // --- 4. CHỈ CÒN SẮP XẾP (LỌC ĐÃ DO BACKEND LÀM) ---
  const filteredProducts = products.sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    if (sortOrder === "asc") return priceA - priceB;
    if (sortOrder === "desc") return priceB - priceA;
    return 0;
  });

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-primary">Welcome to Exclusive</h1>
        <p className="text-xl text-gray-600">Your premier online shopping destination</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="border rounded-md px-4 py-2 w-full md:w-64" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <select 
            className="border rounded-md px-4 py-2" 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
        <Link to="/cart" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary">
          <ShoppingCart className="h-5 w-5" /> View Cart ({cartItems.length})
        </Link>
      </div>

      {/* Hiển thị Loading hoặc Lỗi nếu không có sản phẩm */}
      {loading ? (
        <div className="text-center py-20">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found for "{searchTerm}"</div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link
              to={`/product/${product._id}`} 
              key={product._id} 
              className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md relative group flex flex-col no-underline text-black"
            >
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-transform active:scale-90 z-10"
                title="Add to Wishlist"
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>

              <div className="flex flex-col flex-1">
                <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-4 rounded" />
                <h3 className="text-lg font-semibold mb-1 flex-1 hover:text-red-500 transition-colors">{product.name || "No name"}</h3>
                <p className="text-gray-500 mb-3">${product.price || 0}</p>
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
      )}

      <div className="text-center mt-12">
        {/* Chỉ hiện nút Load More nếu số sản phẩm hiện tại < tổng số kết quả tìm được */}
        {!loading && products.length < totalProducts && (
          <button onClick={handleLoadMore} className="btn btn-primary px-8 py-3 disabled:opacity-50" disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load More Products"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
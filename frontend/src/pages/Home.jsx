import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const PRODUCT_LIMIT = 20;

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

// 1. SỬA HÀM NÀY: Thêm 'isInitialLoad = false'
  const fetchProducts = async (currentSkip, isInitialLoad = false) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products?limit=${PRODUCT_LIMIT}&skip=${currentSkip}`
      );
      const data = await res.json();

      if (data && data.products) {
        // 2. THÊM LOGIC 'if' Ở ĐÂY
        if (isInitialLoad) {
          // Nếu là lần tải đầu (initial load), HÃY THAY THẾ state
          setProducts(data.products);
        } else {
          // Nếu là "Load More", HÃY THÊM VÀO state
          setProducts(prevProducts => [...prevProducts, ...data.products]);
        }
        setTotalProducts(data.total);
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm từ API:", error);
    }
  };

// useEffect cho lần tải ĐẦU TIÊN (Đã sửa lỗi StrictMode)
  useEffect(() => {
    let ignore = false; // 1. Thêm cờ 'ignore'

    const initialLoad = async () => {
      setLoading(true);
      await fetchProducts(0, true); // Tải 20 sản phẩm
      
      // 2. Chỉ setSkip và setLoading nếu đây là lần chạy HỢP LỆ
      if (!ignore) {
        setSkip(PRODUCT_LIMIT); // Đặt mốc 'skip' cho lần tải tiếp theo
        setLoading(false);
      }
    };

    initialLoad();

    // 3. Hàm cleanup: nếu component bị hủy, đặt 'ignore' = true
    return () => {
      ignore = true;
    };
  }, []); // Mảng rỗng [] vẫn giữ nguyên

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    await fetchProducts(skip);
    setSkip(prevSkip => prevSkip + PRODUCT_LIMIT);
    setLoadingMore(false);
  };

  // ====================================================
  //  PHẦN SỬA LỖI NẰM Ở ĐÂY
  // ====================================================
  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = storedCart.find((item) => item.id === product.id);

    let updatedCart;
    if (exists) {
      updatedCart = storedCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...storedCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart); // Cập nhật số lượng trên icon cart ở Home
    alert(`${product.name} added to cart!`);
  };
  // ====================================================

  const filteredProducts = products
    .filter((p) => 
        p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      if (sortOrder === "asc") return priceA - priceB;
      if (sortOrder === "desc") return priceB - priceA;
      return 0;
    });

  if (loading) {
    return (
        <div className="container mx-auto py-12 text-center">
            <h2 className="text-2xl font-bold">Loading products...</h2>
        </div>
    );
  }

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
          {/* SỐ LƯỢNG SẼ CẬP NHẬT TỪ STATE 'cartItems' */}
          <ShoppingCart className="h-5 w-5" /> View Cart ({cartItems.length})
        </Link>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product._id} className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-contain mb-4 rounded"
            />
            <h3 className="text-lg font-semibold mb-1">{product.name || "No name"}</h3>
            <p className="text-gray-500 mb-3">${product.price || 0}</p>
            <button
              onClick={() => addToCart(product)} // Đảm bảo gọi đúng hàm
              className="btn btn-primary w-full"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        {products.length < totalProducts && (
          <button
            onClick={handleLoadMore}
            className="btn btn-primary px-8 py-3 disabled:opacity-50"
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More Products"}
          </button>
        )}
        {products.length >= totalProducts && products.length > 0 && (
          <p className="text-gray-500">You've reached the end of the list.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
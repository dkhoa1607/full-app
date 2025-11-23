import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, Heart, ShoppingCart, ChevronRight, Truck, RefreshCcw, Minus, Plus } from 'lucide-react';

// Component Sao đánh giá
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
      {halfStar && <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)}
      <span className="ml-2 text-sm text-gray-500 font-medium">({rating} Reviews)</span>
    </div>
  );
};

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);

  // Hàm helper để map tên màu sang mã màu CSS (cho đẹp)
  const getColorCode = (colorName) => {
    const colors = {
      "Black": "#000000", "White": "#FFFFFF", "Red": "#DB4444", "Blue": "#1E40AF",
      "Green": "#10B981", "Silver": "#C0C0C0", "Gold": "#FFD700", "Purple": "#A855F7",
      "Titanium": "#808080", "Yellow Gold": "#E6C200", "Rose Gold": "#B76E79"
    };
    // Nếu không có trong map thì trả về gray
    return colors[colorName.split(" ")[0]] || "#808080"; 
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://full-app-da2f.vercel.app/api/products/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        const data = await res.json();
        setProduct(data);
        
        // Chọn mặc định option đầu tiên
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
        if (data.storage && data.storage.length > 0) setSelectedStorage(data.storage[0]);
        setSelectedImage(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedStorage);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );
  
  if (error || !product) return (
    <div className="container mx-auto py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
      <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4 md:px-0 font-poppins">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-black font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
        <div className="space-y-4">
          {/* Ảnh chính */}
          <div className="bg-[#F5F5F5] rounded-xl p-8 flex items-center justify-center h-[500px] relative group overflow-hidden">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
            />
          </div>
          
          {/* Thumbnail List */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-24 h-24 bg-[#F5F5F5] rounded-lg p-2 border-2 transition-all ${
                  selectedImage === index ? 'border-red-500' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={img} alt={`thumb-${index}`} className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        {/* --- CỘT PHẢI: THÔNG TIN CHI TIẾT --- */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
          
          {/* Rating & Stock Status */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <RatingStars rating={product.rating} />
            <span className="text-gray-300">|</span>
            <span className={product.stock > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="text-2xl font-medium text-red-500 mb-6">${product.price.toFixed(2)}</div>

          <p className="text-gray-600 leading-relaxed mb-8 border-b border-gray-200 pb-8">
            {product.description}
          </p>

          {/* --- TÙY CHỌN SẢN PHẨM --- */}
          <div className="space-y-6 mb-8">
            
            {/* Colours */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-6">
                <span className="text-lg font-medium min-w-[80px]">Colours:</span>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full ring-2 ring-offset-2 transition-all focus:outline-none ${
                        selectedColor === color ? 'ring-red-500 scale-110' : 'ring-transparent hover:ring-gray-300'
                      }`}
                      style={{ backgroundColor: getColorCode(color) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size / Storage */}
            {product.storage && product.storage.length > 0 && (
              <div className="flex items-center gap-6">
                <span className="text-lg font-medium min-w-[80px]">
                  {['mens-shirts', 'womens-dresses', 'tops', 'mens-shoes'].includes(product.category) ? 'Size:' : 'Option:'}
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.storage.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedStorage(opt)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                        selectedStorage === opt 
                          ? 'bg-red-500 text-white border-red-500 shadow-md' 
                          : 'text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- HÀNH ĐỘNG (QUANTITY + BUTTONS) --- */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-lg h-12 w-fit">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 h-full hover:bg-red-500 hover:text-white rounded-l-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-12 text-center font-medium border-x border-gray-300 h-full flex items-center justify-center">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 h-full hover:bg-red-500 hover:text-white rounded-r-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Buy Button */}
            <button 
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Buy Now
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={() => toggleWishlist(product)}
              className={`h-12 w-12 border border-gray-300 rounded-lg flex items-center justify-center transition-colors ${
                isInWishlist(product._id) 
                  ? 'bg-red-50 border-red-500 text-red-500' 
                  : 'hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          {/* --- DELIVERY INFO BOX --- */}
          <div className="border border-gray-300 rounded-lg divide-y divide-gray-300">
            <div className="p-6 flex items-center gap-4">
              <Truck className="w-8 h-8 text-gray-800" />
              <div>
                <h4 className="font-medium text-gray-900">Free Delivery</h4>
                <p className="text-xs text-gray-500 underline cursor-pointer">Enter your postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="p-6 flex items-center gap-4">
              <RefreshCcw className="w-8 h-8 text-gray-800" />
              <div>
                <h4 className="font-medium text-gray-900">Return Delivery</h4>
                <p className="text-xs text-gray-500">Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
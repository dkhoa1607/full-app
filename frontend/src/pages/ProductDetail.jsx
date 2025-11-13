import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, Heart, ShoppingCart, ChevronRight } from 'lucide-react';

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
      {halfStar && <Star key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400 opacity-50" />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)}
      <span className="ml-2 text-sm text-gray-500">({rating.toFixed(1)})</span>
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

  // State lưu lựa chọn của khách
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        const data = await res.json();
        setProduct(data);
        
        // Mặc định chọn option đầu tiên nếu có
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
    // Gọi hàm addToCart với đầy đủ thông tin
    addToCart(product, quantity, selectedColor, selectedStorage);
  };

  if (loading) return <div className="container mx-auto py-20 text-center">Loading product details...</div>;
  if (error) return <div className="container mx-auto py-20 text-center text-red-500">Error: {error}</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm mb-8 text-gray-500">
        <Link to="/" className="hover:underline">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="capitalize hover:underline cursor-pointer">{product.category}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-black truncate">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Phần Hình ảnh */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pr-2">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md p-2 cursor-pointer border-2 ${selectedImage === index ? 'border-red-500' : 'border-transparent'}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`thumbnail ${index}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-gray-100 rounded-lg p-6 flex items-center justify-center">
            <img src={product.images[selectedImage]} alt={product.name} className="max-h-[450px] object-contain" />
          </div>
        </div>

        {/* Phần Thông tin & Lựa chọn */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-4">
            <RatingStars rating={product.rating} />
            <span className="text-gray-400">|</span>
            <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </span>
          </div>
          <p className="text-3xl font-medium text-red-600">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          
          <div className="border-t border-gray-200 pt-6 space-y-6">
            
            {/* --- 1. CHỌN MÀU SẮC (Lấy từ DB) --- */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-medium min-w-[60px]">Color:</span>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 border rounded-md text-sm transition-all ${
                        selectedColor === color 
                          ? 'bg-red-500 text-white border-red-500' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* --- 2. CHỌN DUNG LƯỢNG / SIZE (Lấy từ DB) --- */}
            {product.storage && product.storage.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-medium min-w-[60px]">
                  {/* Nếu là quần áo thì hiện chữ Size, còn lại hiện Storage */}
                  {['mens-shirts', 'womens-dresses', 'tops', 'mens-shoes'].includes(product.category) ? 'Size:' : 'Storage:'}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {product.storage.map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => setSelectedStorage(opt)}
                      className={`px-3 py-1 border rounded-md text-sm font-medium transition-all ${
                        selectedStorage === opt 
                          ? 'bg-red-500 text-white border-red-500' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nút mua hàng */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex border rounded-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 border-r hover:bg-gray-100">-</button>
                <input type="number" value={quantity} readOnly className="w-14 text-center border-none focus:ring-0" />
                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 border-l hover:bg-gray-100">+</button>
              </div>
              
              <button 
                onClick={handleAddToCart} 
                className="btn btn-primary flex-1 py-3 shadow-md active:scale-95 transition-transform"
              >
                Add To Cart
              </button>
              
              <button 
                onClick={() => toggleWishlist(product)} 
                className="p-3 border rounded-md hover:bg-gray-100 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
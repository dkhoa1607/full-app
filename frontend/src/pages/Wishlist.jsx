import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { apiCall } from "../config/api.js";
import { Trash2, ShoppingCart, ShoppingBag } from "lucide-react";

function Wishlist() {
  const { wishlistItems, removeFromWishlist, refreshWishlist } = useWishlist();
  const { addToCart, refreshCart } = useCart();

  // --- LOGIC MOVE ALL (Gọi API Backend gộp 1 lần) ---
  const moveAllToBag = async () => {
    if (wishlistItems.length === 0) return;

    try {
      const res = await apiCall('/api/users/move-all-to-cart', {
        method: 'POST',
      });

      if (res.ok) {
        await refreshCart();     // Cập nhật số lượng giỏ
        await refreshWishlist(); // Làm sạch wishlist
        alert("Đã di chuyển tất cả sản phẩm vào giỏ hàng!");
      } else {
        alert("Có lỗi xảy ra khi di chuyển.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-poppins text-gray-800 pb-20">
      
      {/* Header Banner */}
      <div className="bg-white border-b py-8 mb-8 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">
            Wishlist <span className="text-gray-400 text-lg font-normal">({wishlistItems.length})</span>
          </h1>
          <button 
            onClick={moveAllToBag} 
            className="btn btn-outline px-6 py-2.5 rounded-lg text-sm hover:bg-black hover:text-white hover:border-black transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={wishlistItems.length === 0}
          >
            Move All To Bag
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {wishlistItems.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love to buy later.</p>
            <Link to="/shop" className="btn btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-red-200 transition-all">
              Go Shopping
            </Link>
          </div>
        ) : (
          // GRID SẢN PHẨM (Giao diện thẻ đẹp)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group flex flex-col">
                
                {/* Nút Xóa */}
                <button 
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full text-gray-400 shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Ảnh */}
                <div className="relative aspect-square bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Nút Add to Cart (Hiện khi hover) */}
                  <button 
                    onClick={async () => {
                      await addToCart(item);
                    }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-black text-white text-xs font-medium py-2 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-800"
                  >
                    <ShoppingCart className="w-3 h-3" /> Add To Cart
                  </button>
                </div>

                {/* Thông tin */}
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-sm truncate mb-1" title={item.name}>
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-auto">
                    {/* --- SỬA GIÁ TIỀN TẠI ĐÂY --- */}
                    <span className="text-red-500 font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                    {/* ---------------------------- */}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
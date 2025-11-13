import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext"; // Lấy dữ liệu Wishlist
import { useCart } from "../context/CartContext"; // Lấy hàm thêm giỏ hàng
import { Trash2, ShoppingCart } from "lucide-react";

function Wishlist() {
  // Lấy danh sách và hàm xóa từ Context Wishlist
  const { wishlistItems, removeFromWishlist } = useWishlist();
  
  // Lấy hàm addToCart từ Context Cart
  const { addToCart } = useCart();

  // --- LOGIC MOVE ALL TO BAG (ĐÃ SỬA: Thêm vào giỏ -> Xóa khỏi Wishlist) ---
  const moveAllToBag = async () => {
    if (wishlistItems.length === 0) return;

    // Dùng for...of để xử lý tuần tự (đợi thêm xong mới xóa)
    for (const item of wishlistItems) {
      // 1. Thêm vào giỏ hàng
      await addToCart(item);
      
      // 2. Xóa khỏi Wishlist ngay lập tức
      await removeFromWishlist(item._id);
    }

    alert("Đã di chuyển tất cả sản phẩm vào giỏ hàng!");
  };

  return (
    <div className="container mx-auto py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-gray-500 hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-primary font-medium">Wishlist</span>
      </div>

      {/* Header của Wishlist */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-xl font-medium">Wishlist ({wishlistItems.length})</h1>
        <button 
          onClick={moveAllToBag} 
          className="btn btn-outline px-8"
          disabled={wishlistItems.length === 0}
        >
          Move All To Bag
        </button>
      </div>

      {/* Nội dung chính */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-gray-50">
          <h2 className="text-2xl text-gray-600 mb-6">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you love to buy later.</p>
          <Link to="/" className="btn btn-primary px-8 py-3">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistItems.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 relative group hover:shadow-md transition-shadow">
              
              {/* Nút Xóa (Thùng rác) */}
              <button 
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors z-10"
                title="Remove from wishlist"
              >
                <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500" />
              </button>

              {/* Ảnh sản phẩm */}
              <div className="mb-4 bg-gray-100 rounded-md p-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-40 object-contain mix-blend-multiply" 
                />
              </div>
              
              {/* Thông tin sản phẩm */}
              <div className="space-y-2">
                <h3 className="font-medium truncate" title={item.name}>
                  {item.name}
                </h3>
                
                <div className="flex items-center gap-3">
                  <span className="text-red-500 font-medium">${item.price}</span>
                </div>

                {/* Nút Add to Cart */}
                <button 
                  onClick={async () => {
                    await addToCart(item); // Thêm vào giỏ
                    // Tùy chọn: Nếu muốn bấm nút này cũng xóa khỏi wishlist luôn thì bỏ comment dòng dưới
                    // await removeFromWishlist(item._id); 
                  }}
                  className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2"
                >
                  <ShoppingCart className="h-4 w-4" /> Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
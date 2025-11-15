import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Edit, Trash2, Plus, Search } from "lucide-react"; // Search đã có

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // --- BƯỚC 1: Thêm state cho tìm kiếm ---
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm lấy danh sách sản phẩm (Lấy 1000 sản phẩm để hiển thị hết cho Admin)
  const fetchProducts = async (currentSearchTerm) => {
    // Chỉ set loading=true ở lần đầu tiên, hoặc khi chưa fetch
    // Sửa: Luôn set loading = true để debounce có hiệu ứng
    setLoading(true); 
    
    try {
      // --- BƯỚC 2: Thêm 'search' vào API query ---
      const res = await fetch(`http://localhost:5000/api/products?limit=1000&search=${currentSearchTerm}`, {
        credentials: 'include', 
      });
      
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []); 
      } else {
        console.error("Failed to fetch products:", res.statusText);
        setProducts([]); 
      }
      
    } catch (error) {
      console.error("Fetch error:", error);
      setProducts([]); 
    } finally {
      // Luôn tắt loading dù thành công hay thất bại
      setLoading(false);
    }
  };

  // --- BƯỚC 3: Sửa useEffect để debounce (chống giật khi gõ) VÀ fix lỗi stale state ---
  useEffect(() => {
    // Sử dụng debounce để tránh gọi API trên mỗi phím gõ
    const delayDebounceFn = setTimeout(() => {
      // Truyền searchTerm (đã ổn định) vào hàm fetch
      fetchProducts(searchTerm); 
    }, 500); // Chờ 500ms sau khi user ngừng gõ

    return () => clearTimeout(delayDebounceFn); // Xóa timer nếu user gõ tiếp
  }, [searchTerm, location.key]); // Chạy lại khi search hoặc khi quay lại trang (location.key)


  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          credentials: 'include', // Gửi cookie Admin để xác thực
        });
        
        // --- SỬA LỖI: Thêm kiểm tra res.ok ---
        if (res.ok) {
           alert("Xóa thành công!");
           fetchProducts(searchTerm); // Tải lại danh sách (giữ nguyên bộ lọc)
        } else {
          // Báo lỗi nếu API thất bại
          const data = await res.json();
          alert(data.message || "Xóa thất bại");
        }
       
      } catch (error) {
        alert("Xóa thất bại: " + error.message);
      }
    }
  };

  // Hàm tạo sản phẩm mới (Đã sửa lỗi, không cần fetch)
  const createProductHandler = async () => {
    if (window.confirm("Tạo sản phẩm mới?")) {
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({}) 
        });
        
        if (res.ok) {
            const data = await res.json();
            if(data._id) {
                // Trang sẽ tự động fetch khi ta navigate quay lại (vì location.key thay đổi)
                alert("Đã tạo sản phẩm mẫu thành công. Giờ sẽ chuyển sang trang sửa.");
                navigate(`/admin/product/${data._id}/edit`);
            }
        } else {
             alert("Lỗi: Không thể tạo sản phẩm. (Kiểm tra backend productController)");
        }
      } catch (error) {
        alert("Lỗi tạo sản phẩm");
      }
    }
  };

  // Sửa: Đổi text "Loading..."
  if (loading && products.length === 0) return <div className="p-10 text-center">Loading products...</div>;

  return (
    <div>
      {/* --- BƯỚC 4: Sửa Layout và Thêm Thanh Search Bar --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Products ({products.length})</h1>
        
        <div className="flex-grow sm:flex-grow-0 relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Tìm sản phẩm (Sample name...)" 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button 
          onClick={createProductHandler}
          className="bg-black text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors w-full sm:w-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Product
        </button>
      </div>
      {/* --- KẾT THÚC SỬA --- */}

      {/* Thêm Loading Indicator khi search */}
      {loading && <div className="p-10 text-center text-sm text-gray-500">Searching...</div>}

      {/* Bảng sản phẩm */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Thêm kiểm tra (products && products.map) để tránh lỗi nếu products là undefined */}
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{product._id.substring(20, 24)}...</td>
                      <td className="px-6 py-4">
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-contain rounded border bg-white" />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate">{product.name}</td>
                      <td className="px-6 py-4">${product.price}</td>
                      <td className="px-6 py-4 capitalize">{product.category}</td>
                      <td className="px-6 py-4">{product.brand}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link to={`/admin/product/${product._id}/edit`} className="text-blue-600 hover:text-blue-800">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-500">
                      {searchTerm ? `Không tìm thấy sản phẩm nào với từ khóa "${searchTerm}"` : "Không có sản phẩm nào."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
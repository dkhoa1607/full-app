import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, Search } from "lucide-react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hàm lấy danh sách sản phẩm (Lấy 1000 sản phẩm để hiển thị hết cho Admin)
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products?limit=1000');
      const data = await res.json();
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          credentials: 'include', // Gửi cookie Admin để xác thực
        });
        // Load lại danh sách sau khi xóa
        fetchProducts();
      } catch (error) {
        alert("Xóa thất bại");
      }
    }
  };

  // Hàm tạo sản phẩm mới (Tạo bản nháp rồi chuyển sang trang Edit)
  const createProductHandler = async () => {
    if (window.confirm("Tạo sản phẩm mới?")) {
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({}) // Body rỗng cũng được vì controller tạo mẫu
        });
        const data = await res.json();
        if(data._id) {
            // Chuyển hướng sang trang Edit để nhập thông tin
            navigate(`/admin/product/${data._id}/edit`);
        }
      } catch (error) {
        alert("Lỗi tạo sản phẩm");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Products ({products.length})</h1>
        <button 
          onClick={createProductHandler}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Product
        </button>
      </div>

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
              {products.map((product) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
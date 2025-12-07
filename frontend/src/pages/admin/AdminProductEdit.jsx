import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../config/api.js";
import { ArrowLeft, Save, Upload } from "lucide-react";

function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- CẬP NHẬT: Thêm các trường cho mảng (dưới dạng chuỗi) ---
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: "",
    brand: "",
    category: "",
    stock: 0,
    description: "",
    imagesStr: "",  // Dùng cho <textarea> danh sách ảnh
    colorsStr: "",  // Dùng cho <textarea> màu sắc
    storageStr: "", // Dùng cho <textarea> tùy chọn
  });

  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // 1. Lấy thông tin sản phẩm hiện tại để điền vào form
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiCall(`/api/products/${id}`);
        const data = await res.json();
        
        if (data) {
          // --- CẬP NHẬT: Chuyển mảng thành chuỗi (phân tách bằng dấu phẩy) ---
          setFormData({
            name: data.name || "",
            price: data.price || 0,
            image: data.image || "",
            brand: data.brand || "",
            category: data.category || "",
            stock: data.stock || 0,
            description: data.description || "",
            imagesStr: data.images ? data.images.join(', ') : "",
            colorsStr: data.colors ? data.colors.join(', ') : "",
            storageStr: data.storage ? data.storage.join(', ') : "",
          });
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 2. Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Gửi dữ liệu cập nhật lên Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);

    try {
      const res = await apiCall(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData), // Gửi toàn bộ formData (đã bao gồm các chuỗi)
      });

      if (res.ok) {
        alert("Cập nhật sản phẩm thành công!");
        navigate("/admin/products"); // Quay về danh sách
      } else {
        alert("Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server");
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading details...</div>;

  return (
    <div className="max-w-4xl mx-auto font-poppins">
      <Link to="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-8">Edit Product</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tên & Giá */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Ảnh (URL) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image URL</label>
            <div className="flex gap-4">
              <input
                type="text"
                name="image"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
              />
              {/* Preview ảnh nhỏ bên cạnh */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg border overflow-hidden flex-shrink-0">
                {formData.image && <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Paste an image link from Unsplash or elsewhere.</p>
          </div>

          {/* --- THÊM MỚI: Danh sách ảnh (phân tách bằng dấu phẩy) --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (Comma-separated)</label>
            <textarea
              name="imagesStr"
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
              value={formData.imagesStr}
              onChange={handleChange}
              placeholder="https://.../img1.png, https://.../img2.png"
            ></textarea>
          </div>

          {/* Brand & Category & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Count In Stock</label>
              <input
                type="number"
                name="stock"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* --- THÊM MỚI: Màu sắc & Tùy chọn (phân tách bằng dấu phẩy) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Colors (Comma-separated)</label>
              <input
                type="text"
                name="colorsStr"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                value={formData.colorsStr}
                onChange={handleChange}
                placeholder="Red, Blue, Black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options/Sizes (Comma-separated)</label>
              <input
                type="text"
                name="storageStr"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                value={formData.storageStr}
                onChange={handleChange}
                placeholder="128GB, 256GB (hoặc S, M, L)"
              />
            </div>
          </div>


          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              rows="5"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Nút Update */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingUpdate}
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {loadingUpdate ? "Updating..." : <> <Save className="w-4 h-4" /> Update Product </>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductEdit;
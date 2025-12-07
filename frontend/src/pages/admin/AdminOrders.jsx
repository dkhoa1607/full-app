import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../../config/api.js";
import { Package, CheckCircle, Truck, Clock, XCircle } from "lucide-react";

// Component Badge trạng thái (Tái sử dụng từ MyOrders)
const StatusBadge = ({ status }) => {
  const statusMap = {
    Processing: { text: "Processing", icon: <Clock className="w-3 h-3" />, color: "yellow" },
    Shipped: { text: "Shipped", icon: <Truck className="w-3 h-3" />, color: "blue" },
    Delivered: { text: "Delivered", icon: <CheckCircle className="w-3 h-3" />, color: "green" },
    Cancelled: { text: "Cancelled", icon: <XCircle className="w-3 h-3" />, color: "red" },
  };
  const currentStatus = statusMap[status] || statusMap.Processing;
  const colors = {
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors[currentStatus.color]}`}>
      {currentStatus.icon} {currentStatus.text}
    </span>
  );
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- BƯỚC 1: Tách hàm fetch ra riêng ---
  const fetchAllOrders = async () => {
    try {
      const res = await apiCall('/api/orders', {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders");
        // Tắt alert đi để Polling không bị phiền
        // alert("Bạn không có quyền Admin hoặc Lỗi Server");
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Chỉ set loading false ở lần đầu tiên
      if (loading) {
        setLoading(false);
      }
    }
  };


  useEffect(() => {
    // --- BƯỚC 2: Chạy hàm fetch lần đầu tiên ---
    fetchAllOrders();

    // --- BƯỚC 3: Thiết lập Polling ---
    // Tự động gọi lại hàm fetchAllOrders mỗi 5 giây
    const interval = setInterval(() => {
      fetchAllOrders();
    }, 5000); // 5000ms = 5 giây

    // --- BƯỚC 4: Dọn dẹp khi rời khỏi trang ---
    return () => clearInterval(interval);
    
  }, []); // Dependency rỗng để chỉ chạy 1 lần duy nhất

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Manage Orders ({orders.length})</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-gray-800">
                    ...{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.billingDetails.firstName} {order.billingDetails.lastName}
                    <p className="text-xs text-gray-500 font-normal">{order.billingDetails.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    {/* Admin có thể xem chi tiết đơn hàng của người khác */}
                    <Link 
                      to={`/order-success/${order._id}`} 
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      Details
                    </Link>
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

export default AdminOrders;
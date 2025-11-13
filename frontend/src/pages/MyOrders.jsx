import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Calendar, ChevronRight, ShoppingBag, Clock, Truck, CheckCircle, XCircle } from "lucide-react";

// --- COMPONENT HIỂN THỊ TRẠNG THÁI (BADGE) ---
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

// --- COMPONENT MÔ PHỎNG GIAO HÀNG ---
const DeliverySimulator = ({ order, onStatusChange }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 1. Nếu đơn hàng KHÔNG còn là Processing (đã xong hoặc hủy)
    if (order.status !== 'Processing') {
      const statusMessages = {
        Delivered: 'Order has been delivered successfully.',
        Shipped: 'Order is being shipped.',
        Cancelled: 'Order was cancelled.',
      };
      setMessage(statusMessages[order.status] || '');
      setProgress(order.status === 'Delivered' ? 100 : 0);
      return; 
    }

    // 2. Thiết lập thông số mô phỏng
    let duration = 0; // Thời gian chạy (ms)
    let msg = 'Standard delivery.';

    // Giả lập logic (bạn có thể tùy chỉnh thêm)
    // Ở đây tôi giả định mặc định chạy 30s cho vui mắt nếu là Processing
    // Hoặc nếu backend có trả về deliveryOption thì dùng logic đó
    if (order.deliveryOption === 'express') {
        duration = 10000; // 10 giây
        msg = 'Express Delivery (10s)...';
    } else {
        duration = 30000; // 30 giây mặc định
        msg = 'Standard Delivery (Processing)...';
    }

    setMessage(msg);

    // 3. Chạy thanh Progress Bar
    const intervalTime = 100; // Cập nhật mỗi 100ms
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percent = Math.min(100, (currentStep / steps) * 100);
      setProgress(percent);

      if (percent >= 100) {
        clearInterval(timer);
        // Khi chạy xong 100% -> Tự động chuyển trạng thái sang Delivered
        onStatusChange(order._id, 'Delivered');
      }
    }, intervalTime);

    // Cleanup khi component unmount
    return () => clearInterval(timer);

  }, [order.status, order._id, onStatusChange]); // Chỉ chạy lại khi status thay đổi

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{message}</span>
        {order.status === 'Processing' && <span>{Math.round(progress)}%</span>}
      </div>
      
      {order.status === 'Processing' && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-100 ease-linear" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

// --- TRANG CHÍNH: MY ORDERS ---
function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          // Sắp xếp đơn mới nhất lên đầu
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(data);
        }
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Hàm cập nhật trạng thái (Gọi API Backend)
  const handleUpdateStatus = async (orderId, newStatus) => {
    // Kiểm tra nếu trạng thái chưa đổi thì thôi
    const currentOrder = orders.find(o => o._id === orderId);
    if (currentOrder && currentOrder.status === newStatus) return;

    try {
      // Gọi API cập nhật (Lưu ý: Bạn cần đảm bảo Backend có route PUT /:id/status chưa, 
      // nếu chưa thì dùng logic giả lập cập nhật state local tạm thời)
      
      // Giả sử Backend chưa có API update status riêng, ta update local state để UI mượt
      // (Thực tế bạn nên viết thêm API update status ở backend orderController)
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Nếu có API thì bỏ comment dòng dưới:
      /*
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      */

    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  // Hàm hủy đơn
  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      handleUpdateStatus(orderId, 'Cancelled');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-gray-500 text-sm">Loading your orders...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-poppins text-gray-800 pb-20">
      
      {/* Header Banner */}
      <div className="bg-white border-b py-8 mb-8 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-2">My Orders</h1>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <Link to="/" className="hover:text-black transition-colors">Home</Link> 
            <span>/</span> 
            <Link to="/my-account" className="hover:text-black transition-colors">Account</Link> 
            <span>/</span>
            <span className="text-black font-medium">History</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        
        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-md">You haven't placed any orders yet. Go explore our products and find something you love.</p>
            <Link to="/shop" className="btn btn-primary px-10 py-3 rounded-full shadow-lg hover:shadow-red-200 transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          // Order List
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Order ID</p>
                      <p className="font-mono font-bold text-gray-800 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Sử dụng Component StatusBadge */}
                    <StatusBadge status={order.status || 'Processing'} />
                    
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    
                    {/* Product Preview */}
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 p-2 flex-shrink-0">
                        <img 
                          src={order.orderItems[0]?.image} 
                          alt="Product" 
                          className="w-full h-full object-contain mix-blend-multiply" 
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{order.orderItems[0]?.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.orderItems.length > 1 
                            ? `and ${order.orderItems.length - 1} other item(s)` 
                            : `Qty: ${order.orderItems[0]?.quantity}`}
                        </p>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="w-full sm:w-auto sm:text-right border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0 flex sm:block justify-between items-center">
                      <p className="text-xs text-gray-500 uppercase mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-red-600">${order.total.toFixed(2)}</p>
                    </div>

                    {/* Action Button */}
                    <div className="w-full sm:w-auto">
                      <Link 
                        to={`/order-success/${order._id}`} 
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all"
                      >
                        View Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  
                  {/* --- PHẦN MÔ PHỎNG GIAO HÀNG --- */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                        {/* Thanh tiến trình */}
                        <div className="w-full sm:w-2/3">
                            <DeliverySimulator order={order} onStatusChange={handleUpdateStatus} />
                        </div>

                        {/* Nút hủy đơn (Chỉ hiện khi đang xử lý) */}
                        {(order.status === 'Processing' || !order.status) && (
                            <button 
                                onClick={() => handleCancelOrder(order._id)} 
                                className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium transition-colors"
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
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

export default MyOrders;
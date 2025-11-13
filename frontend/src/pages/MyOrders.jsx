import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye } from "lucide-react";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Gửi cookie
        });
        if (res.ok) {
          const data = await res.json();
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

  if (loading) return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <div className="flex items-center gap-2 text-sm mb-8 text-gray-500">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link to="/my-account" className="hover:underline">My Account</Link>
        <span>/</span>
        <span className="text-black font-medium">My Orders</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">My Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Go shopping and place your first order!</p>
          <Link to="/" className="btn btn-primary px-8 py-2">Start Shopping</Link>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase font-medium">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Total</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-gray-800">#{order._id.substring(0, 10)}...</td>
                  <td className="py-4 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Processing
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <Link 
                      to={`/order-success/${order._id}`} 
                      className="text-red-500 hover:text-red-700 inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
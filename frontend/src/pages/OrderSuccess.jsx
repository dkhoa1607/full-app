import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, Printer, ArrowRight, MapPin, Calendar, CreditCard, Package } from "lucide-react";

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Gọi API lấy chi tiết đơn hàng (kèm cookie để xác thực)
        const res = await fetch(`https://full-app-da2f.vercel.app/api/orders/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
            
        });

        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the order details. Please check your order history.</p>
        <Link to="/" className="btn btn-primary w-full py-3 rounded-xl block">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-poppins">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* --- HEADER THÀNH CÔNG --- */}
        <div className="bg-green-600 text-white p-8 text-center relative overflow-hidden">
          {/* Trang trí background nhẹ */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce-slow">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-green-100 text-lg">Your order has been received</p>
            <div className="mt-6 inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
              <span className="text-sm font-medium">Order ID: #{order._id}</span>
            </div>
          </div>
        </div>

        {/* --- NỘI DUNG CHI TIẾT --- */}
        <div className="p-6 md:p-10">
          
          {/* Thông tin chung (Grid 3 cột) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 border-b border-gray-100 pb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg"><Calendar className="w-5 h-5 text-gray-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                <p className="text-gray-800 font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg"><MapPin className="w-5 h-5 text-gray-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Shipping To</p>
                <p className="text-gray-800 font-medium">{order.billingDetails.firstName}</p>
                <p className="text-sm text-gray-500 truncate max-w-[150px]">{order.billingDetails.townCity}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg"><CreditCard className="w-5 h-5 text-gray-600" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Payment</p>
                <p className="text-gray-800 font-medium capitalize">{order.billingDetails.paymentMethod}</p>
                <p className="text-sm text-green-600 font-medium">Paid Success</p>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="space-y-6 mb-10">
            <h3 className="text-lg font-bold text-gray-800">Order Items</h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-0">
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-1 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                    <div className="text-xs text-gray-500 flex gap-3 mt-1">
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      {item.selectedStorage && <span>Size: {item.selectedStorage}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">${item.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="flex justify-end mb-10">
            <div className="w-full md:w-1/2 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              {/* Giả sử logic giảm giá đã trừ vào total, có thể hiển thị thêm nếu muốn */}
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-green-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-green-200 transition-all flex items-center justify-center gap-2">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => window.print()} 
              className="btn btn-outline px-8 py-3 rounded-full border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
          </div>

        </div>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-8">
        Need help? Contact us at <span className="text-blue-500 underline cursor-pointer">support@exclusive.com</span>
      </p>
    </div>
  );
}

export default OrderSuccess;
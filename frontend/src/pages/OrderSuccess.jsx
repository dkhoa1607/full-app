import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Printer, Home, Package } from "lucide-react";

function OrderSuccess() {
  const { id } = useParams(); // Lấy ID từ URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // SỬA LỖI: Thêm options để gửi kèm Cookie
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // <--- QUAN TRỌNG NHẤT
        });

        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          console.error("Lỗi tải đơn hàng:", res.status);
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading order details...</div>;

  if (!order) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Order Not Found</h2>
      <p className="text-gray-500 mb-6">Could not retrieve order details. Please check your My Orders page.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Header Xanh lá */}
        <div className="bg-green-50 p-8 text-center border-b border-green-100">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Thank You for Your Order!</h1>
          <p className="text-green-700">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-500 mt-2">Order ID: <span className="font-mono font-medium text-gray-800">#{order._id}</span></p>
        </div>

        <div className="p-8">
          {/* Thông tin khách hàng & Giao hàng */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-3">Delivery Address</h3>
              <div className="text-gray-800">
                <p className="font-medium text-lg">{order.billingDetails.firstName}</p>
                <p>{order.billingDetails.streetAddress}</p>
                <p>{order.billingDetails.townCity}</p>
                <p className="mt-2 text-gray-600">{order.billingDetails.phoneNumber}</p>
                <p className="text-gray-600">{order.billingDetails.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method:</span>
                  <span className="font-medium text-gray-800 capitalize">{order.billingDetails.paymentMethod || "Cash"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Date:</span>
                  <span className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Processing
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="border rounded-lg overflow-hidden mb-8">
            <div className="bg-gray-50 px-6 py-3 border-b text-sm font-medium text-gray-500">
              Order Items ({order.orderItems.length})
            </div>
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item, index) => (
                <div key={index} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 border rounded bg-white flex items-center justify-center shrink-0">
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.selectedColor && <span className="mr-3">Color: {item.selectedColor}</span>}
                      {item.selectedStorage && <span>Option: {item.selectedStorage}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="flex flex-col items-end gap-2 border-t pt-6 mb-8">
            <div className="w-full md:w-1/3 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total:</span>
                <span className="text-red-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Nút điều hướng */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary flex items-center justify-center gap-2 px-8 py-3">
              <Home className="w-4 h-4" /> Continue Shopping
            </Link>
            <button onClick={() => window.print()} className="btn btn-outline flex items-center justify-center gap-2 px-8 py-3">
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
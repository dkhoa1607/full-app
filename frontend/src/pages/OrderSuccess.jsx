import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="container mx-auto py-16 text-center">
      <div className="max-w-xl mx-auto bg-white p-10 rounded-lg shadow-md">
        <img
          src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
          alt="Success"
          className="w-20 h-20 mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-green-600 mb-4">Thank you for your order!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. We’ll send you a confirmation email shortly.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/shop" className="btn btn-outline">
            Continue Shopping
          </Link>
          <Link to="/my-account" className="btn btn-primary">
            View My Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
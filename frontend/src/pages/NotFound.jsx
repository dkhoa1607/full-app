import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <h2 className="text-2xl mb-8">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary px-8 py-3">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
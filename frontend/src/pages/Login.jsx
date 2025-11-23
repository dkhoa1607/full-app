import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrPhone.trim()) newErrors.emailOrPhone = "Vui lòng nhập Email";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch('https://full-app-da2f.vercel.app/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({
          email: formData.emailOrPhone,
          password: formData.password,
        }),
      });

      // Lấy dữ liệu JSON từ phản hồi
      const data = await res.json();

      if (res.ok) {
        // Cập nhật trạng thái đăng nhập toàn cục
        login(data); 
        
        // --- LOGIC ĐIỀU HƯỚNG ADMIN ---
        if (data.isAdmin) {
          navigate("/admin"); // Nếu là Admin -> Vào Dashboard
        } else {
          navigate("/");      // Nếu là Khách -> Vào Trang chủ
        }
        // ------------------------------

      } else {
        // Hiển thị lỗi từ Backend trả về
        alert(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-poppins py-12 px-4 sm:px-6 lg:px-8">
      {/* THAY ĐỔI: rounded-2xl shadow-xl border border-gray-100 */}
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* CỘT TRÁI: HÌNH ẢNH */}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1000&auto=format&fit=crop" 
            alt="Shopping Mall" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg text-gray-200">We missed you. Sign in to access your personalized shopping experience.</p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="text-center md:text-left mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Log In to Exclusive</h1>
            <p className="text-gray-500">Enter your details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                {/* THAY ĐỔI: Input nền trắng, border-gray-300, focus đẹp hơn */}
                <input
                  type="text"
                  name="emailOrPhone"
                  placeholder="Email or Phone Number"
                  className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.emailOrPhone ? 'border-red-500 text-red-700 focus:ring-red-300' : 'border-gray-300 focus:border-red-500'} rounded-xl focus:ring-2 focus:ring-red-400 transition-all outline-none`}
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                />
              </div>
              {errors.emailOrPhone && <p className="mt-1 text-xs text-red-500">{errors.emailOrPhone}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                {/* THAY ĐỔI: Input nền trắng, border-gray-300, focus đẹp hơn */}
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.password ? 'border-red-500 text-red-700 focus:ring-red-300' : 'border-gray-300 focus:border-red-500'} rounded-xl focus:ring-2 focus:ring-red-400 transition-all outline-none`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <span className="text-sm text-red-500 font-medium hover:underline cursor-pointer">
                Forget Password?
              </span>
            </div>

            {/* Submit Button */}
            {/* THAY ĐỔI: py-3, hover:shadow-red-500/30, active:scale-[0.98] */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button type="button" className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Log in with Google
            </button>

            <p className="text-center text-gray-600 mt-8">
              Don't have an account?{" "}
              <Link to="/signup" className="text-red-500 font-bold hover:underline  items-center justify-center gap-1 inline-flex">
                Sign up <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
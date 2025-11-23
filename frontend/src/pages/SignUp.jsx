import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Vui lòng nhập Email";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailOrPhone)) {
      newErrors.emailOrPhone = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng gõ lại
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Tách tên
    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      const res = await fetch('https://full-app-da2f.vercel.app/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.emailOrPhone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        alert(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-poppins py-12 px-4 sm:px-6 lg:px-8">
      {/* THAY ĐỔI: rounded-2xl shadow-xl border border-gray-100 */}
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* CỘT TRÁI: HÌNH ẢNH (Ẩn trên mobile) */}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop" 
            alt="Shopping" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Join Exclusive.</h2>
            <p className="text-lg text-gray-200">Get access to exclusive deals, personalized recommendations, and seamless checkout.</p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="text-center md:text-left mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Enter your details below to sign up</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                {/* THAY ĐỔI: Input nền trắng, border-gray-300, focus đẹp hơn */}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.name ? 'border-red-500 text-red-700 focus:ring-red-300' : 'border-gray-300 focus:border-red-500'} rounded-xl focus:ring-2 focus:ring-red-400 transition-all outline-none`}
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                {/* THAY ĐỔI: Input nền trắng, border-gray-300, focus đẹp hơn */}
                <input
                  type="email"
                  name="emailOrPhone"
                  placeholder="Email Address"
                  className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.emailOrPhone ? 'border-red-500 text-red-700 focus:ring-red-300' : 'border-gray-300 focus:border-red-500'} rounded-xl focus:ring-2 focus:ring-red-400 transition-all outline-none`}
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                />
              </div>
              {errors.emailOrPhone && <p className="mt-1 text-xs text-red-500">{errors.emailOrPhone}</p>}
            </div>

            {/* Password Input */}
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
            
            {/* THAY ĐỔI: py-3, hover:shadow-red-500/30, active:scale-[0.98] */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <button type="button" className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>

            <p className="text-center text-gray-600 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-red-500 font-bold hover:underline  items-center justify-center gap-1 inline-flex">
                Log in <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
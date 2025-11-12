import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Đảm bảo bạn đã 'npm install bcryptjs'

const userSchema = mongoose.Schema(
  {
    // Lấy từ form SignUp
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email không được trùng
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Tự động HASH mật khẩu trước khi lưu (pre-save hook)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next(); // Nếu mật khẩu không đổi, bỏ qua
  }
  
  // Băm mật khẩu
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Thêm một hàm để so sánh mật khẩu khi login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
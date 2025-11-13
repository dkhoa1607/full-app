import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    // --- THÔNG TIN CƠ BẢN ---
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, default: "" }, // Địa chỉ mặc định

    // --- SỔ ĐỊA CHỈ (Nhiều địa chỉ) ---
    addressBook: [
      {
        street: String,
        city: String,
        phone: String,
      }
    ],

    // --- PHƯƠNG THỨC THANH TOÁN ---
    paymentMethods: [
      {
        cardType: String,
        cardNumber: String, // Lưu ý: Chỉ lưu 4 số cuối
        holderName: String,
        expiry: String,
      }
    ],

    // --- DANH SÁCH YÊU THÍCH ---
    wishlist: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      }
    ],

    // --- GIỎ HÀNG (Có thêm tùy chọn màu/size) ---
    cart: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        selectedColor: { type: String },
        selectedStorage: { type: String },
      }
    ],

    // --- MINIGAME (Kiểm soát thời gian quay) ---
    lastSpinDate: { type: Date, default: null },
    isAdmin: { type: Boolean, required: true, default: false },

  },
  
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

// --- MIDDLEWARE: MÃ HÓA MẬT KHẨU TRƯỚC KHI LƯU ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- PHƯƠNG THỨC: SO SÁNH MẬT KHẨU KHI LOGIN ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
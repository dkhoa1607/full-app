// back-end/models/orderModel.js
import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        
        // --- SỬA ĐOẠN NÀY ---
        // Cũ: id: { type: String, required: true },
        // Mới: Đổi thành 'product' và dùng ObjectId
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        
        // Lưu thêm lựa chọn của khách (nếu có)
        selectedColor: { type: String },
        selectedStorage: { type: String },
      },
    ],
    // ... (Các phần billingDetails, paymentMethod... giữ nguyên)
    billingDetails: {
      firstName: { type: String, required: true },
      companyName: { type: String },
      streetAddress: { type: String, required: true },
      apartment: { type: String },
      townCity: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    // --- THÊM TRƯỜNG MỚI ---
    status: {
      type: String,
      required: true,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    // --- THÊM TRƯỜNG MỚI ĐỂ HẸN NGÀY GIAO ---
    deliveryOption: { type: String, default: 'standard' }, // 'standard', 'express_30s', 'scheduled', 'custom_seconds'
    scheduledDeliveryDate: { type: Date },
    customDeliverySeconds: { type: Number },

  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
// models/orderModel.js
import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    // Chúng ta sẽ lưu các sản phẩm
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        id: {
          type: String, // Dùng 'id' từ 'dummyjson' hoặc 'localStorage'
          required: true,
        },
      },
    ],
    // Lưu chi tiết thanh toán
    billingDetails: {
      firstName: { type: String, required: true },
      companyName: { type: String },
      streetAddress: { type: String, required: true },
      apartment: { type: String },
      townCity: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
    // Lưu tổng tiền
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  {
    timestamps: true, // Tự động thêm 'createdAt' và 'updatedAt'
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
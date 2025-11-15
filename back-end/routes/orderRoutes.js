import express from 'express';
const router = express.Router();
import { 
  createOrder, 
  getOrderById, 
  getMyOrders, 
  updateOrderStatus,
  getOrders // <-- Import hàm mới
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Cần 'admin'

// Route tạo đơn hàng (Cần protect để lấy ID người mua)
// Route lấy TẤT CẢ đơn hàng (Admin)
router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders); // <-- Thêm route GET cho Admin

// Route lấy danh sách đơn hàng của tôi (QUAN TRỌNG: Đặt trước /:id)
router.route('/myorders').get(protect, getMyOrders);

// Route lấy chi tiết 1 đơn (đặt cuối cùng để tránh nhầm lẫn với /myorders)
router.route('/:id').get(protect, getOrderById);

// Route cập nhật trạng thái đơn hàng
router.route('/:id/status').put(protect, updateOrderStatus);

export default router;
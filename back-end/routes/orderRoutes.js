import express from 'express';
const router = express.Router();
import { createOrder, getOrderById, getMyOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js'; // Cần protect để biết ai đang đăng nhập

// Route tạo đơn hàng (Cần protect để lấy ID người mua)
router.route('/').post(protect, createOrder);

// Route lấy danh sách đơn hàng của tôi (QUAN TRỌNG: Đặt trước /:id)
router.route('/myorders').get(protect, getMyOrders);

// Route lấy chi tiết 1 đơn (đặt cuối cùng để tránh nhầm lẫn với /myorders)
router.route('/:id').get(protect, getOrderById);

// Route cập nhật trạng thái đơn hàng
router.route('/:id/status').put(protect, updateOrderStatus);

export default router;
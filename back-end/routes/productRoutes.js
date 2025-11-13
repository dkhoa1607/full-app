import express from 'express';
const router = express.Router();
import { getProducts, getProductById } from '../controllers/productController.js'; // Import hàm mới

// Route cũ: Lấy danh sách
router.route('/').get(getProducts);

// Route MỚI: Lấy 1 sản phẩm bằng ID
// (Lưu ý: :id phải nằm dưới các route tĩnh khác nếu có)
router.route('/:id').get(getProductById);

export default router;
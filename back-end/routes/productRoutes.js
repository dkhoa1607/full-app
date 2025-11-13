import express from 'express';
const router = express.Router();
import { getProducts, getProductById, getCategories } from '../controllers/productController.js';

// Route lấy danh sách sản phẩm (có filter)
router.route('/').get(getProducts);

// Route lấy danh sách categories (QUAN TRỌNG: Đặt trước /:id)
router.route('/categories').get(getCategories);

// Route chi tiết sản phẩm
router.route('/:id').get(getProductById);

export default router;
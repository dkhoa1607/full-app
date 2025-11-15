import express from 'express';
const router = express.Router();
import { 
  getProducts, 
  getProductById, 
  getCategories,
  deleteProduct,
  createProduct,
  updateProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Import bảo vệ

// Route gốc: Lấy tất cả (Ai cũng xem được) | Tạo mới (Chỉ Admin)
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// Route categories (Đặt trước /:id)
router.route('/categories').get(getCategories);

// Route chi tiết: Xem (Ai cũng được) | Xóa/Sửa (Chỉ Admin)
router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);


export default router;
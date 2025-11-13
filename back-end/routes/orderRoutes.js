import express from 'express';
const router = express.Router();

// IMPORT ĐẦY ĐỦ CẢ 2 HÀM TỪ CONTROLLER
import { createOrder, getOrderById } from '../controllers/orderController.js'; 

router.route('/').post(createOrder);
router.route('/:id').get(getOrderById);

export default router;
// routes/orderRoutes.js
import express from 'express';
const router = express.Router();
import { createOrder } from '../controllers/orderController.js';

// Khi có 1 request POST đến /api/orders/, nó sẽ gọi hàm createOrder
router.route('/').post(createOrder);

export default router;
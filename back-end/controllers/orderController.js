// controllers/orderController.js
import Order from '../models/orderModel.js';

// @desc   Tạo đơn hàng mới
// @route  POST /api/orders
const createOrder = async (req, res) => {
  try {
    // 1. Lấy dữ liệu từ body của frontend
    const { orderItems, billingDetails, subtotal, shipping, total } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'Không có sản phẩm trong đơn hàng' });
      return;
    }

    // 2. Tạo một đối tượng Order mới
    const order = new Order({
      orderItems,
      billingDetails,
      subtotal,
      shipping,
      total,
    });

    // 3. Lưu vào database
    const createdOrder = await order.save();

    // 4. Trả về thông báo thành công
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createOrder };
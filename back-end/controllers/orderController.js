import Order from '../models/orderModel.js';

// @desc   Tạo đơn hàng mới
// @route  POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { orderItems, billingDetails, subtotal, shipping, total } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'Không có sản phẩm trong đơn hàng' });
      return;
    }

    // CHUYỂN ĐỔI DỮ LIỆU: Đổi _id thành product để khớp với Model
    const dbOrderItems = orderItems.map((item) => ({
      ...item,
      product: item._id, // Quan trọng
      _id: undefined,
    }));

    const order = new Order({
      orderItems: dbOrderItems,
      billingDetails,
      subtotal,
      shipping,
      total,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Lấy đơn hàng theo ID
// @route  GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// XUẤT KHẨU CẢ 2 HÀM
export { createOrder, getOrderById };
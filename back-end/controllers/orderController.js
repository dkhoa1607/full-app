import Order from '../models/orderModel.js';
import sendOrderEmail from '../ultis/sendEmail.js';

// @desc   Tạo đơn hàng mới
// @route  POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { orderItems, billingDetails, subtotal, shipping, total, deliveryOption, scheduledDeliveryDate, customDeliverySeconds } = req.body;

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
      user: req.user._id,
      orderItems: dbOrderItems,
      billingDetails,
      subtotal,
      shipping,
      total,
      deliveryOption,
      scheduledDeliveryDate,
      customDeliverySeconds,
      sendOrderEmail
    });

    const createdOrder = await order.save();
    sendOrderEmail(createdOrder);
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

const getMyOrders = async (req, res) => {
  try {
    // Tìm tất cả đơn hàng mà user._id trùng với người đang đăng nhập
    // Sắp xếp theo thời gian tạo mới nhất trước (createdAt: -1)
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật trạng thái đơn hàng (cho người dùng)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // Kiểm tra đơn hàng có tồn tại và thuộc về user đang đăng nhập không
    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status } = req.body;

    // Logic nghiệp vụ: Chỉ cho phép hủy khi đang 'Processing'
    if (status === 'Cancelled' && order.status !== 'Processing') {
      return res.status(400).json({ message: 'Cannot cancel an order that is already being processed.' });
    }

    // Không cho phép thay đổi khi đã giao hoặc đã hủy
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.status(400).json({ message: `Cannot change status of a ${order.status.toLowerCase()} order.` });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export { createOrder, getMyOrders, getOrderById, updateOrderStatus };
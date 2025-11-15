import Order from '../models/orderModel.js';
import sendOrderEmail from '../ultis/sendEmail.js';
import User from '../models/userModel.js'; // <-- FIX 1: THÊM IMPORT USER

// @desc   Tạo đơn hàng mới
// @route  POST /api/orders
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

    // --- FIX 1: LOGIC TỰ ĐỘNG XÓA GIỎ HÀNG ---
    const user = await User.findById(req.user._id);
    if (user) {
      user.cart = []; // Xóa sạch giỏ hàng
      await user.save();
    }
    // --- KẾT THÚC SỬA ---

    sendOrderEmail(createdOrder);
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Lấy đơn hàng theo ID
// @route  GET /api/orders/:id
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

// @desc   Lấy đơn hàng CỦA TÔI
// @route  GET /api/orders/myorders
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

// @desc    Cập nhật trạng thái đơn hàng (cho người dùng hoặc Admin)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // --- FIX 2: CẬP NHẬT LOGIC PHÂN QUYỀN ADMIN ---
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status } = req.body;

    // Logic cho Admin: Admin có thể thay đổi trạng thái tự do
    if (req.user.isAdmin) {
        order.status = status || order.status;
        const updatedOrder = await order.save();
        return res.json(updatedOrder);
    }

    // Logic cho Người dùng: Chỉ có thể tự hủy đơn của mình
    if (order.user.toString() !== req.user._id.toString()) {
         return res.status(401).json({ message: 'Not authorized to update this order' });
    }

    // Logic nghiệp vụ: Chỉ cho phép hủy khi đang 'Processing'
    if (status === 'Cancelled' && order.status !== 'Processing') {
      return res.status(400).json({ message: 'Cannot cancel an order that is already being processed.' });
    }

    // Người dùng không thể tự đổi sang status khác (trừ 'Cancelled')
    if (status && status !== 'Cancelled') {
         return res.status(401).json({ message: 'User can only cancel orders.' });
    }

    // Không cho phép thay đổi khi đã giao hoặc đã hủy
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.status(400).json({ message: `Cannot change status of a ${order.status.toLowerCase()} order.` });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
    // --- KẾT THÚC SỬA ---
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- HÀM MỚI CHO ADMIN ---
// @desc   Lấy TẤT CẢ đơn hàng (Admin)
// @route  GET /api/orders
// @access Private/Admin
const getOrders = async (req, res) => {
  try {
    // Lấy tất cả đơn hàng, .populate('user', 'id firstName') để lấy thêm tên user
    const orders = await Order.find({})
      .populate('user', 'id firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { createOrder, getMyOrders, getOrderById, updateOrderStatus, getOrders };
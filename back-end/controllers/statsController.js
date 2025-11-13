import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// @desc   Lấy số liệu thống kê (Dashboard)
// @route  GET /api/stats
const getStats = async (req, res) => {
  try {
    // 1. Đếm tổng số sản phẩm
    const totalProducts = await Product.countDocuments();

    // 2. Đếm tổng số khách hàng (User)
    const totalUsers = await User.countDocuments();

    // 3. Đếm tổng số đơn hàng
    const totalOrders = await Order.countDocuments();

    // 4. Tính tổng doanh thu (Cộng dồn trường 'total' của tất cả đơn hàng)
    const totalRevenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);
    const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalRevenue : 0;

    res.json({
      products: totalProducts,
      users: totalUsers,
      orders: totalOrders,
      revenue: totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getStats };
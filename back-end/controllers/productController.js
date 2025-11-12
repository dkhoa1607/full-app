// controllers/productController.js
import Product from '../models/productModel.js';

// @desc   Lấy tất cả sản phẩm (có phân trang)
// @route  GET /api/products
const getProducts = async (req, res) => {
  try {
    // 1. Lấy 'limit' và 'skip' từ query (giống hệt dummyjson)
    const limit = Number(req.query.limit) || 20; // Mặc định là 20
    const skip = Number(req.query.skip) || 0;  // Mặc định là 0

    // 2. Lấy tổng số sản phẩm (để báo cho frontend biết khi nào hết)
    const total = await Product.countDocuments();

    // 3. Lấy sản phẩm từ DB, áp dụng .limit() và .skip()
    const products = await Product.find({}).limit(limit).skip(skip);

    // 4. Trả về data y hệt format của dummyjson
    res.json({
      products: products, // Mảng sản phẩm
      total: total,       // Tổng số sản phẩm
      skip: skip,
      limit: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi Server' });
  }
};

export { getProducts };
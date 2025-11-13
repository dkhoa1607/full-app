// back-end/controllers/productController.js

import Product from '../models/productModel.js';

// @desc   Lấy sản phẩm (Phân trang + Tìm kiếm)
// @route  GET /api/products
const getProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const skip = Number(req.query.skip) || 0;
    
    // 1. Lấy từ khóa tìm kiếm từ URL (ví dụ: ?search=iphone)
    const search = req.query.search 
      ? {
          name: {
            $regex: req.query.search, // Tìm gần đúng
            $options: 'i',            // Không phân biệt hoa thường
          },
        }
      : {}; // Nếu không search thì lấy tất cả

    // 2. Đếm tổng số kết quả KHỚP với từ khóa (để tính Load More)
    const total = await Product.countDocuments({ ...search });

    // 3. Tìm sản phẩm khớp từ khóa + Phân trang
    const products = await Product.find({ ...search })
      .limit(limit)
      .skip(skip);

    res.json({
      products: products,
      total: total,
      skip: skip,
      limit: limit,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server' });
  }
};

const getProductById = async (req, res) => {
    // ... (Giữ nguyên hàm này)
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Không tìm thấy sản phẩm (lỗi ID)' });
    }
};

export { getProducts, getProductById };
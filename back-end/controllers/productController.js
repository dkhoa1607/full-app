import Product from '../models/productModel.js';

// @desc   Lấy tất cả danh mục (Categories) để hiển thị Sidebar
// @route  GET /api/products/categories
const getCategories = async (req, res) => {
  try {
    // Lấy danh sách các category khác nhau trong DB
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Lấy sản phẩm (Hỗ trợ: Phân trang, Tìm kiếm, Lọc, Sắp xếp)
// @route  GET /api/products
const getProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const skip = Number(req.query.skip) || 0;
    
    // --- 1. XÂY DỰNG BỘ LỌC (QUERY) ---
    let query = {};

    // Tìm kiếm theo tên (Search) - Gần đúng, không phân biệt hoa thường
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Lọc theo Danh mục (Category) - Chính xác, không phân biệt hoa thường
    if (req.query.category && req.query.category !== 'all') {
      // Dùng Regex ^...$ để đảm bảo khớp chính xác từ đầu đến cuối
      // Ví dụ: 'Laptops' sẽ khớp với 'laptops' trong DB
      query.category = { $regex: `^${req.query.category}$`, $options: 'i' };
    }

    // Lọc theo Giá (Min - Max)
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // --- 2. XÂY DỰNG SẮP XẾP (SORT) ---
    let sort = {};
    if (req.query.sort === 'asc') sort.price = 1; // Giá tăng dần
    else if (req.query.sort === 'desc') sort.price = -1; // Giá giảm dần
    else sort.createdAt = -1; // Mặc định: Mới nhất trước

    // --- 3. THỰC HIỆN TRUY VẤN ---
    
    // Đếm tổng số kết quả khớp (để tính toán nút Load More)
    const total = await Product.countDocuments(query);

    // Lấy danh sách sản phẩm
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    res.json({
      products,
      total,
      skip,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server: ' + error.message });
  }
};

// @desc   Lấy chi tiết 1 sản phẩm theo ID
// @route  GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    // Lỗi CastError thường do ID không đúng định dạng MongoDB
    res.status(404).json({ message: 'Lỗi ID sản phẩm không hợp lệ' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Tạo sản phẩm mẫu (Admin)
// @route  POST /api/products
const createProduct = async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: 'https://placehold.co/600x400',
    brand: 'Sample brand',
    category: 'Sample category',
    stock: 0,
    rating: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc   Cập nhật sản phẩm (Admin)
// @route  PUT /api/products/:id
const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.stock = stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};



export { getProducts, getProductById, getCategories, deleteProduct, createProduct, updateProduct};
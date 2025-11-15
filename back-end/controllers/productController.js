import Product from '../models/productModel.js';

// @desc   Lấy tất cả danh mục (Categories) để hiển thị Sidebar
const getCategories = async (req, res) => {
  try {
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
    
    let query = {};

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.category && req.query.category !== 'all') {
      query.category = { $regex: `^${req.query.category}$`, $options: 'i' };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    let sort = {};
    if (req.query.sort === 'asc') sort.price = 1;
    else if (req.query.sort === 'desc') sort.price = -1;
    else sort.createdAt = -1; // <-- Giờ đã hoạt động vì có timestamps

    const total = await Product.countDocuments(query);

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
    res.status(404).json({ message: 'Lỗi ID sản phẩm không hợp lệ' });
  }
};

// @desc   Xóa sản phẩm (Admin)
// @route  DELETE /api/products/:id
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
  // --- SỬA LỖI TẠI ĐÂY ---
  // Xóa các trường 'user' và 'numReviews' vì chúng không có trong Schema
  const product = new Product({
    name: 'Sample name',
    price: 0,
    // user: req.user._id, // <-- LỖI: Đã Xóa
    image: 'https://placehold.co/600x400',
    brand: 'Sample brand',
    category: 'Sample category',
    stock: 0,
    rating: 0,
    // numReviews: 0, // <-- LỖI: Đã Xóa
    description: 'Sample description',
    images: [],
    colors: [],
    storage: [],
  });
  // --- KẾT THÚC SỬA ---

  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
     res.status(400).json({ message: error.message });
  }
};

// @desc   Cập nhật sản phẩm (Admin)
// @route  PUT /api/products/:id
const updateProduct = async (req, res) => {
  const { 
    name, price, description, image, brand, category, stock,
    imagesStr, colorsStr, storageStr 
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.stock = stock;

    // Chuyển đổi chuỗi (phân tách bằng dấu phẩy) thành mảng
    // Thêm .filter(Boolean) để loại bỏ các chuỗi rỗng
    product.images = imagesStr ? imagesStr.split(',').map(s => s.trim()).filter(Boolean) : [];
    product.colors = colorsStr ? colorsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
    product.storage = storageStr ? storageStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};



export { getProducts, getProductById, getCategories, deleteProduct, createProduct, updateProduct};
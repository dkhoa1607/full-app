// seeder/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios'; // Dùng để gọi API dummyjson
import connectDB from '../config/db.js';
import Product from '../models/productModel.js'; // Import model sản phẩm
import productRoutes from '../routes/productRoutes.js'; // Import route sản phẩm
import orderRoutes from '../routes/orderRoutes.js'; // Import route đơn hàng

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes)

dotenv.config();

const importData = async () => {
  try {
    // 1. Kết nối tới DB
    await connectDB();

    // 2. Xóa tất cả sản phẩm cũ
    await Product.deleteMany();
    console.log('Data đã xóa!');

    // 3. Lấy 100+ sản phẩm từ dummyjson
    const { data } = await axios.get('https://dummyjson.com/products?limit=0');
    
    // 4. Định dạng lại data cho khớp với Model của chúng ta
    const sampleProducts = data.products.map(item => ({
      name: item.title,
      price: item.price,
      image: item.images[0] || 'https://i.dummyjson.com/R.png',
      // Thêm các trường khác từ model của bạn nếu cần
    }));

    // 5. Thêm sản phẩm mới vào DB
    await Product.insertMany(sampleProducts);

    console.log('Data đã được nạp thành công!');
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  // (Hàm này để xóa data nếu bạn muốn)
  try {
    await connectDB();
    await Product.deleteMany();
    console.log('Data đã xóa!');
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error.message}`);
    process.exit(1);
  }
};

// 6. Logic để chạy file này từ terminal
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import connectDB from '../config/db.js';
import Product from '../models/productModel.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    console.log('Data đã xóa!');

    const { data } = await axios.get('https://dummyjson.com/products?limit=0');
    
    const sampleProducts = data.products.map(item => {
      // --- LOGIC TỰ ĐỘNG GÁN OPTION ---
      let colors = [];
      let storage = [];

      // Nếu là điện thoại, laptop, tablet -> Có màu và dung lượng
      if (['smartphones', 'laptops', 'tablets', 'mobile-accessories'].includes(item.category)) {
        colors = ["Black", "Silver", "Gold", "Blue"];
        storage = ["128GB", "256GB", "512GB", "1TB"];
      } 
      // Nếu là quần áo, giày dép -> Có màu, không có dung lượng
      else if (['mens-shirts', 'womens-dresses', 'mens-shoes', 'tops'].includes(item.category)) {
        colors = ["Red", "Blue", "Green", "Black", "White"];
        storage = []; // Quần áo không có GB
      }
      // Các loại khác (nước hoa, skincare...) -> Mặc định không có hoặc tùy ý
      else {
        colors = ["Standard"];
      }

      return {
        name: item.title,
        price: item.price,
        image: item.thumbnail || item.images[0],
        description: item.description,
        brand: item.brand,
        category: item.category,
        rating: item.rating,
        stock: item.stock,
        images: item.images,
        // Lưu vào DB
        colors: colors,
        storage: storage,
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data chi tiết (Colors/Storage) đã được nạp thành công!');
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData();
} else {
  importData();
}
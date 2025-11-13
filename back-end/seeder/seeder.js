import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import connectDB from '../config/db.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js'; // Đã thêm import này

dotenv.config();

// Số lần nhân bản dữ liệu (DummyJSON có ~100 món, nhân 20 lần = 2000 món)
const REPEAT_TIMES = 20; 

const importData = async () => {
  try {
    await connectDB();
    
    // 1. Xóa sạch dữ liệu cũ
    await Product.deleteMany();
    await User.deleteMany();
    console.log('🧹 Đã dọn dẹp dữ liệu cũ (User & Product)...');

    // ---------------------------------------------------------
    // 2. TẠO TÀI KHOẢN ADMIN & USER
    // ---------------------------------------------------------
    console.log('👤 Đang tạo tài khoản Admin & User mẫu...');
    
    // Mã hóa mật khẩu "123456"

    // Tạo Admin
    await User.create({
        firstName: "Admin",
        lastName: "Manager",
        email: "admin@gmail.com",
        password: "123456", // Lưu password đã mã hóa
        isAdmin: true, // Set quyền Admin
        address: "Admin Headquarters"
    });

    // Tạo Khách hàng mẫu
    await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "user@gmail.com",
        password: "123456",
        isAdmin: false,
    });

    console.log('✅ Đã tạo xong User!');

    // ---------------------------------------------------------
    // 3. TẠO SẢN PHẨM TỪ DUMMYJSON
    // ---------------------------------------------------------
    console.log('📥 Đang tải dữ liệu ổn định từ DummyJSON...');
    const { data } = await axios.get('https://dummyjson.com/products?limit=0');
    
    let finalProducts = [];

    console.log(`🔄 Đang lọc bỏ "Đồ ăn" và nhân bản dữ liệu lên ${REPEAT_TIMES} lần...`);

    // Vòng lặp nhân bản
    for (let i = 1; i <= REPEAT_TIMES; i++) {
      const batch = data.products
        // --- LỌC BỎ ĐỒ ĂN (GROCERIES) ---
        .filter(item => item.category !== 'groceries') 
        .map(item => {
        
        // --- TỰ ĐỘNG GÁN OPTION (Màu/Size) ---
        let colors = [];
        let storage = [];
        const cat = item.category;

        // Nhóm Công nghệ (Phone, Laptop)
        if (['smartphones', 'laptops', 'tablets', 'mobile-accessories'].includes(cat)) {
          colors = ["Titanium Black", "Silver", "Gold", "Deep Purple"];
          storage = ["128GB", "256GB", "512GB", "1TB"];
        } 
        // Nhóm Thời trang (Quần áo, Giày)
        else if (['mens-shirts', 'womens-dresses', 'mens-shoes', 'tops', 'womens-bags'].includes(cat)) {
          colors = ["Red", "Blue", "Black", "White", "Beige"];
          storage = ["S", "M", "L", "XL"]; 
        } 
        // Nhóm Trang sức / Đồng hồ
        else if (['womens-jewellery', 'mens-watches', 'womens-watches', 'sunglasses'].includes(cat)) {
          colors = ["Gold", "Silver", "Rose Gold"];
          storage = ["Standard Size"];
        }
        // Nhóm Mỹ phẩm / Nước hoa
        else if (['fragrances', 'skincare', 'beauty'].includes(cat)) {
          colors = ["Standard"];
          storage = ["50ml", "100ml"];
        }
        // Các loại khác
        else {
          colors = ["Standard Color"];
          storage = [];
        }

        // --- BIẾN ĐỔI GIÁ & TỒN KHO ---
        const randomPriceReq = Math.floor(Math.random() * 20) - 10; 
        const newPrice = Math.max(1, item.price + randomPriceReq);

        return {
          // Thêm hậu tố Ver... để phân biệt
          name: i === 1 ? item.title : `${item.title} (Ver ${i})`, 
          price: newPrice,
          image: item.thumbnail, // Link ảnh DummyJSON
          description: item.description,
          brand: item.brand || "No Brand",
          category: item.category,
          rating: item.rating,
          stock: item.stock,
          images: item.images, 
          
          // Hai trường quan trọng
          colors: colors,
          storage: storage,
        };
      });

      finalProducts = [...finalProducts, ...batch];
    }

    // 4. Nạp sản phẩm vào MongoDB
    console.log(`🚀 Đang nạp ${finalProducts.length} sản phẩm vào Database...`);
    await Product.insertMany(finalProducts);

    console.log('✅ THÀNH CÔNG TOÀN BỘ QUÁ TRÌNH!');
    console.log('🔑 Tài khoản Admin: admin@gmail.com / 123456');
    
    process.exit();

  } catch (error) {
    console.error(`❌ Lỗi: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData();
} else {
  importData();
}
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios'; // Nhớ cài axios: npm install axios
import connectDB from '../config/db.js';
import Product from '../models/productModel.js';

dotenv.config();

// Số lần nhân bản dữ liệu để có database lớn
// DummyJSON có 194 sản phẩm. Nhân 15 lần = ~2900 sản phẩm.
const REPEAT_TIMES = 15; 

const importData = async () => {
  try {
    await connectDB();
    
    // 1. Xóa sạch dữ liệu cũ
    await Product.deleteMany();
    console.log('🧹 Đã dọn dẹp dữ liệu cũ...');

    // 2. Lấy dữ liệu gốc từ DummyJSON
    console.log('📥 Đang tải dữ liệu gốc từ DummyJSON...');
    const { data } = await axios.get('https://dummyjson.com/products?limit=0');
    
    let finalProducts = [];

    console.log(`🔄 Đang nhân bản dữ liệu lên ${REPEAT_TIMES} lần...`);

    // 3. Vòng lặp nhân bản
    for (let i = 1; i <= REPEAT_TIMES; i++) {
      const batch = data.products.map(item => {
        
        // --- LOGIC TỰ ĐỘNG GÁN OPTION (Màu/Size) ---
        // Vì DummyJSON không có sẵn, ta phải tự thêm để trang Detail không bị lỗi
        let colors = [];
        let storage = [];

        const cat = item.category;

        // Nhóm Điện tử
        if (['smartphones', 'laptops', 'tablets', 'mobile-accessories'].includes(cat)) {
          colors = ["Black", "Silver", "Gold", "Blue Titanium"];
          storage = ["128GB", "256GB", "512GB", "1TB"];
        } 
        // Nhóm Thời trang (Quần áo, Giày)
        else if (['mens-shirts', 'womens-dresses', 'mens-shoes', 'tops', 'womens-bags'].includes(cat)) {
          colors = ["Red", "Blue", "Black", "White", "Beige"];
          storage = ["S", "M", "L", "XL"]; // Size quần áo
        } 
        // Nhóm Trang sức / Đồng hồ
        else if (['womens-jewellery', 'mens-watches', 'womens-watches'].includes(cat)) {
          colors = ["Gold", "Silver", "Rose Gold"];
          storage = ["Standard Size"];
        }
        // Các loại khác
        else {
          colors = ["Standard"];
          storage = [];
        }

        // --- BIẾN ĐỔI GIÁ MỘT CHÚT ---
        // Để khi sắp xếp giá nhìn nó đa dạng hơn
        const randomPriceReq = Math.floor(Math.random() * 20) - 10; // Random từ -10 đến 10
        const newPrice = Math.max(1, item.price + randomPriceReq);

        return {
          // Thêm hậu tố vào tên để phân biệt các bản copy (chỉ hiện khi debug)
          name: i === 1 ? item.title : `${item.title} (Ver ${i})`, 
          price: newPrice,
          image: item.thumbnail, // Ảnh đại diện từ DummyJSON
          description: item.description,
          brand: item.brand || "No Brand",
          category: item.category,
          rating: item.rating,
          stock: item.stock,
          images: item.images, // Bộ sưu tập ảnh từ DummyJSON
          
          // Hai trường quan trọng mình tự thêm
          colors: colors,
          storage: storage,
        };
      });

      finalProducts = [...finalProducts, ...batch];
    }

    // 4. Nạp vào MongoDB
    console.log(`🚀 Đang nạp ${finalProducts.length} sản phẩm vào Database...`);
    await Product.insertMany(finalProducts);

    console.log('✅ THÀNH CÔNG! Đã nạp xong dữ liệu từ DummyJSON!');
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
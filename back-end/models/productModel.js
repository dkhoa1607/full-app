import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true, default: "No description" },
  brand: { type: String, default: "No Brand" },
  category: { type: String, required: true, default: "uncategorized" },
  rating: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  images: { type: [String], default: [] },
  
  // --- THÊM 2 TRƯỜNG MỚI NÀY ---
  colors: { type: [String], default: [] },   // Ví dụ: ["Red", "Blue"]
  storage: { type: [String], default: [] },  // Ví dụ: ["128GB", "256GB"]
});

const Product = mongoose.model('Product', productSchema);
export default Product;
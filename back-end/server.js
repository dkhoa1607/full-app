import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js'; // Đảm bảo bạn đã import
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import minigameRoutes from './routes/minigameRoutes.js';



// Nạp biến môi trường
dotenv.config();

// Kết nối CSDL
connectDB();

// BƯỚC 1: KHỞI TẠO APP TRƯỚC
const app = express();

// BƯỚC 2: SỬ DỤNG CÁC MIDDLEWARE
app.use(cors({
  origin: 'full-app-ten.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// BƯỚC 3: ĐỊNH NGHĨA CÁC ROUTE
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Đây chính là dòng 8 của bạn, bây giờ nó đã đúng vị trí
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/newsletter', subscriberRoutes);
app.use('/api/minigame', minigameRoutes);
// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
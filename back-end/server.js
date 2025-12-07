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

// Kết nối CSDL (async - won't block serverless function)
// In Vercel, this will connect when the function is invoked
connectDB().catch(err => {
  console.error('Database connection error:', err);
  // Don't exit in serverless - let it retry on next invocation
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    process.exit(1);
  }
});

// BƯỚC 1: KHỞI TẠO APP TRƯỚC
const app = express();

// BƯỚC 2: SỬ DỤNG CÁC MIDDLEWARE
// CORS configuration for Vercel deployment
// Support both development and production origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174'
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, curl, or serverless-to-serverless)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      // In development, allow localhost variations
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In production, be more permissive for Vercel deployments
      // Allow if it's a Vercel domain or matches frontend URL
      if (origin.includes('.vercel.app') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log for debugging but allow in production to avoid blocking
        console.warn('CORS: Origin not in allowed list:', origin);
        callback(null, true); // Allow for now - tighten later if needed
      }
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

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
// Export app for Vercel serverless functions
// Vercel automatically handles Express apps
export default app;

// For local development, start the server
// Vercel will ignore this in production
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, console.log(`Server running on port ${PORT}`));
}
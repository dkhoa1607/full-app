// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  // Đọc token từ cookie tên là 'jwt'
  token = req.cookies.jwt;

  if (token) {
    try {
      // Giải mã token để lấy userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB (trừ password) và gắn vào req.user
      req.user = await User.findById(decoded.userId).select('-password');

      next(); // Cho phép đi tiếp đến Controller
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại' });
    }
  } else {
    res.status(401).json({ message: 'Chưa đăng nhập, không có quyền truy cập' });
  }
};

export { protect };
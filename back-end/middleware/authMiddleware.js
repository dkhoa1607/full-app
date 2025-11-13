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
      
      // Thêm bước kiểm tra: Nếu không tìm thấy user (ví dụ: đã bị xóa)
      if (!req.user) {
        throw new Error(); // Ném lỗi để đi vào catch block
      }
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại' });
    }
  } else {
    res.status(401).json({ message: 'Chưa đăng nhập, không có quyền truy cập' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Là Admin -> Cho qua
  } else {
    res.status(401).json({ message: 'Không có quyền Admin!' }); // Chặn lại
  }
};

export { protect, admin };
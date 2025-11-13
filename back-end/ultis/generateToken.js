import jwt from 'jsonwebtoken'; // Đảm bảo bạn đã 'npm install jsonwebtoken'

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token hết hạn sau 30 ngày
  });

  // Gửi token qua httpOnly cookie (an toàn hơn localStorage)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: false, // Chỉ dùng HTTPS ở production
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
    path: '/',
  });
};

export default generateToken;
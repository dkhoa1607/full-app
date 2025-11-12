import User from '../models/userModel.js';
import generateToken from '../ultis/generateToken.js';


// @desc   Đăng ký (Sign Up)
// @route  POST /api/users/register
const registerUser = async (req, res) => {
  // 1. Lấy thông tin từ frontend
  const { firstName, lastName, email, password } = req.body;

  try {
    // 2. Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'Email đã tồn tại' });
      return;
    }

    // 3. Tạo user mới (mật khẩu sẽ tự động được hash bởi Model)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Đăng nhập (Login)
// @route  POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Tìm user bằng email
    const user = await User.findOne({ email });

    // 2. Kiểm tra user có tồn tại VÀ mật khẩu có khớp không
    if (user && (await user.matchPassword(password))) {
      // 3. TẠO TOKEN và gửi về client
      generateToken(res, user._id); 
      
      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser };
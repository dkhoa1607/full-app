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

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address, // Trả về address
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc   Cập nhật thông tin người dùng
// @route  PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Cập nhật thông tin (nếu có gửi lên, không thì giữ nguyên cái cũ)
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;

    // Nếu có gửi password mới thì cập nhật (Model sẽ tự hash)
    if (req.body.newPassword) {
      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      address: updatedUser.address,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc   Đăng xuất / Xóa cookie
// @route  POST /api/users/logout
const logoutUser = (req, res) => {
  // Ghi đè cookie 'jwt' bằng một cookie rỗng và hết hạn ngay lập tức
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Ngày trong quá khứ -> Trình duyệt tự xóa
    secure: false, // Chỉ dùng HTTPS ở production
    samSite: 'lax',
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc   Lấy danh sách yêu thích
// @route  GET /api/users/wishlist
const getWishlist = async (req, res) => {
  // req.user đã được middleware 'protect' gắn vào
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc   Thêm hoặc Xóa sản phẩm khỏi wishlist (Toggle)
// @route  POST /api/users/wishlist
const toggleWishlist = async (req, res) => {
  const { product } = req.body; // Sản phẩm được gửi lên từ frontend
  const user = await User.findById(req.user._id);

  if (user) {
    // Kiểm tra xem sản phẩm đã có trong wishlist chưa
    const exists = user.wishlist.find((item) => item._id === product._id);

    if (exists) {
      // NẾU CÓ RỒI -> XÓA ĐI (Lọc bỏ sản phẩm đó ra khỏi mảng)
      user.wishlist = user.wishlist.filter((item) => item._id !== product._id);
    } else {
      // NẾU CHƯA CÓ -> THÊM VÀO
      user.wishlist.push(product);
    }

    await user.save(); // Lưu lại vào MongoDB
    res.json(user.wishlist); // Trả về danh sách mới nhất
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};



// @desc   Lấy giỏ hàng
// @route  GET /api/users/cart
const getCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) res.json(user.cart);
  else res.status(404).json({ message: 'User not found' });
};

// @desc   Thêm vào giỏ hàng (Nếu có rồi thì tăng số lượng)
// @route  POST /api/users/cart
const addToCart = async (req, res) => {
  // Nhận thêm color và storage từ frontend
  const { product, quantity, color, storage } = req.body; 
  const user = await User.findById(req.user._id);

  if (user) {
    // Logic kiểm tra trùng: Cùng ID + Cùng Màu + Cùng Dung lượng thì mới coi là trùng
    const existItem = user.cart.find((item) => 
      item._id === product._id && 
      item.selectedColor === color && 
      item.selectedStorage === storage
    );

    if (existItem) {
      existItem.quantity += quantity;
    } else {
      user.cart.push({ 
        ...product, 
        quantity, 
        selectedColor: color, 
        selectedStorage: storage 
      });
    }

    await user.save();
    res.json(user.cart);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc   Cập nhật số lượng (Update)
// @route  PUT /api/users/cart/:id
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;
  const user = await User.findById(req.user._id);

  if (user) {
    const item = user.cart.find((item) => item._id === productId);
    if (item) {
      item.quantity = quantity; // Gán số lượng mới
      await user.save();
      res.json(user.cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc   Xóa sản phẩm khỏi giỏ
// @route  DELETE /api/users/cart/:id
const removeCartItem = async (req, res) => {
  const productId = req.params.id;
  const user = await User.findById(req.user._id);

  if (user) {
    user.cart = user.cart.filter((item) => item._id !== productId);
    await user.save();
    res.json(user.cart);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc   Xóa sạch giỏ hàng
// @route  DELETE /api/users/cart
const clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.cart = [];
    await user.save();
    res.json(user.cart);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const addAddress = async (req, res) => {
  const { street, city, phone } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.addressBook.push({ street, city, phone });
    await user.save();
    res.json(user.addressBook);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const removeAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.addressBook = user.addressBook.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addressBook);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// --- XỬ LÝ THANH TOÁN ---
const addPaymentMethod = async (req, res) => {
  const { cardType, cardNumber, holderName, expiry } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    // Demo: Chỉ lưu 4 số cuối để bảo mật
    const maskedCard = `**** **** **** ${cardNumber.slice(-4)}`;
    user.paymentMethods.push({ cardType, cardNumber: maskedCard, holderName, expiry });
    await user.save();
    res.json(user.paymentMethods);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const removePaymentMethod = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.paymentMethods = user.paymentMethods.filter(card => card._id.toString() !== req.params.id);
    await user.save();
    res.json(user.paymentMethods);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const moveAllToCart = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.wishlist.length === 0) {
      return res.status(400).json({ message: "Wishlist đang trống" });
    }

    // Duyệt qua từng món trong wishlist
    user.wishlist.forEach((wishItem) => {
      // Kiểm tra xem món này đã có trong giỏ chưa
      const existItem = user.cart.find((cartItem) => cartItem._id === wishItem._id);

      if (existItem) {
        // Nếu có rồi -> Tăng số lượng lên 1
        existItem.quantity += 1;
      } else {
        // Nếu chưa có -> Thêm vào giỏ với số lượng 1
        // (Lưu ý: Bạn có thể cần map thêm các trường như selectedColor/Storage mặc định nếu muốn)
        user.cart.push({ 
          ...wishItem, 
          quantity: 1,
          // Mặc định chọn option đầu tiên hoặc để trống tùy logic
          selectedColor: wishItem.colors ? wishItem.colors[0] : "",
          selectedStorage: wishItem.storage ? wishItem.storage[0] : ""
        });
      }
    });

    // Xóa sạch wishlist sau khi chuyển
    user.wishlist = [];

    await user.save();

    // Trả về cả cart và wishlist mới để frontend cập nhật
    res.json({ cart: user.cart, wishlist: user.wishlist });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};



export { registerUser, loginUser, getUserProfile, updateUserProfile, logoutUser, getWishlist, toggleWishlist, getCart, addToCart, updateCartItem, removeCartItem, clearCart, addAddress, removeAddress, addPaymentMethod, removePaymentMethod, moveAllToCart };
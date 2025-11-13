// back-end/routes/userRoutes.js
import express from 'express';
const router = express.Router();
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  logoutUser,
  getWishlist,
  toggleWishlist,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.post('/logout', logoutUser); // <-- Thêm route logout

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, toggleWishlist);

router.route('/cart')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.route('/cart/:id')
  .put(protect, updateCartItem)
  .delete(protect, removeCartItem);

export default router;
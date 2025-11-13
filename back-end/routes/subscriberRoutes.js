import express from 'express';
import Subscriber from '../models/subscriberModel.js';

const router = express.Router();

// @desc   Đăng ký nhận tin
// @route  POST /api/newsletter
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Kiểm tra email tồn tại chưa
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email này đã đăng ký rồi!' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ message: 'Đăng ký nhận tin thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
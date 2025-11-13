import express from 'express';
// Import controller xử lý quay thưởng (đảm bảo bạn đã có file controller này)
import { spinWheel } from '../controllers/minigameController.js';
// Import middleware bảo vệ (để đảm bảo user đã đăng nhập mới được quay)
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Định nghĩa đường dẫn: /api/minigame/spin
router.post('/spin', protect, spinWheel);

export default router;
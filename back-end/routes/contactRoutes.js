import express from 'express';
const router = express.Router();
import { sendMessage } from '../controllers/contactController.js';

router.route('/').post(sendMessage);

export default router;
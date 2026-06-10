import express from 'express';
import { adminLogin, verifyAdminToken } from '../controllers/adminController.js';
import authMiddleware from '../middleware/auth.js';
import { authLimiter } from '../middleware/security.js';

const router = express.Router();

router.post('/login', authLimiter, adminLogin);
router.get('/verify', authMiddleware, verifyAdminToken);

export default router;

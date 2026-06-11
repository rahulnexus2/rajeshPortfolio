import express from 'express';
import { getPortfolio, updatePortfolio, uploadProfileImage, uploadResume } from '../controllers/portfolioController.js';
import authMiddleware from '../middleware/auth.js';
import { handleMulterImage, handleMulterResume } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPortfolio);
router.put('/', authMiddleware, updatePortfolio);

// Cloudinary upload routes
router.post('/upload/image', authMiddleware, handleMulterImage, uploadProfileImage);
router.post('/upload/resume', authMiddleware, handleMulterResume, uploadResume);

export default router;

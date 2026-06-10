import express from 'express';
import { getAnalytics, trackEvent } from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getAnalytics);
router.post('/track', trackEvent);

export default router;

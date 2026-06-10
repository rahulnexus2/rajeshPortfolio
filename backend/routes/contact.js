import express from 'express';
import { submitContact, getMessages, toggleReadMessage, deleteMessage } from '../controllers/contactController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', authMiddleware, getMessages);
router.put('/:id/read', authMiddleware, toggleReadMessage);
router.delete('/:id', authMiddleware, deleteMessage);

export default router;

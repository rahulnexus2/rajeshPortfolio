import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, reorderProjects } from '../controllers/projectsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', authMiddleware, createProject);
router.put('/reorder', authMiddleware, reorderProjects);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

export default router;

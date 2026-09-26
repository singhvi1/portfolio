import { Router } from 'express';
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listFeaturedProjects,
  getProjectBySlug,
} from '../controllers/projectController.js';
import { createProjectRules, updateProjectRules, projectIdParam } from '../validators/projectValidators.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', listProjects);
router.get('/featured', listFeaturedProjects);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id', projectIdParam, handleValidation, getProject);

// Admin-only
router.post('/', requireAdmin, createProjectRules, handleValidation, createProject);
router.put('/:id', requireAdmin, projectIdParam, updateProjectRules, handleValidation, updateProject);
router.delete('/:id', requireAdmin, projectIdParam, handleValidation, deleteProject);

export default router;

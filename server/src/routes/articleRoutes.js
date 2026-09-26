import { Router } from 'express';
import {
  listArticles,
  getArticleBySlug,
  listAllArticlesAdmin,
  getArticleAdmin,
  createArticle,
  updateArticle,
  deleteArticle,
  setArticleStatus,
} from '../controllers/articleController.js';
import { createRules, updateRules, idParam } from '../validators/articleValidators.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public — published only
router.get('/', listArticles);
router.get('/slug/:slug', getArticleBySlug);

// Admin — sees drafts too, full CRUD + publish toggle
router.get('/admin/all', requireAdmin, listAllArticlesAdmin);
router.get('/admin/:id', requireAdmin, idParam, handleValidation, getArticleAdmin);
router.post('/', requireAdmin, createRules, handleValidation, createArticle);
router.put('/:id', requireAdmin, idParam, updateRules, handleValidation, updateArticle);
router.delete('/:id', requireAdmin, idParam, handleValidation, deleteArticle);
router.patch('/:id/status', requireAdmin, idParam, handleValidation, setArticleStatus);

export default router;

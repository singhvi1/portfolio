import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout, me } from '../controllers/authController.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password required')],
  handleValidation,
  login
);
router.post('/logout', logout);
router.get('/me', requireAdmin, me);

export default router;

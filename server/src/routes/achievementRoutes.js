import { Router } from 'express';
import {
  listAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievementController.js';
import { createRules, updateRules, idParam } from '../validators/achievementValidators.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listAchievements);
router.get('/:id', idParam, handleValidation, getAchievement);
router.post('/', requireAdmin, createRules, handleValidation, createAchievement);
router.put('/:id', requireAdmin, idParam, updateRules, handleValidation, updateAchievement);
router.delete('/:id', requireAdmin, idParam, handleValidation, deleteAchievement);

export default router;

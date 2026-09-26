import { Router } from 'express';
import {
  listExperience,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { createRules, updateRules, idParam } from '../validators/experienceValidators.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listExperience);
router.get('/:id', idParam, handleValidation, getExperience);
router.post('/', requireAdmin, createRules, handleValidation, createExperience);
router.put('/:id', requireAdmin, idParam, updateRules, handleValidation, updateExperience);
router.delete('/:id', requireAdmin, idParam, handleValidation, deleteExperience);

export default router;

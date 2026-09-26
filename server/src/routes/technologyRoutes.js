import { Router } from 'express';
import {
  listTechnologies,
  getTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from '../controllers/technologyController.js';
import { createRules, updateRules, idParam } from '../validators/technologyValidators.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listTechnologies);
router.get('/:id', idParam, handleValidation, getTechnology);
router.post('/', requireAdmin, createRules, handleValidation, createTechnology);
router.put('/:id', requireAdmin, idParam, updateRules, handleValidation, updateTechnology);
router.delete('/:id', requireAdmin, idParam, handleValidation, deleteTechnology);

export default router;

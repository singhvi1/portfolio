import { Router } from 'express';
import {
  listDsaProblems,
  getDsaProblem,
  createDsaProblem,
  updateDsaProblem,
  deleteDsaProblem,
  dsaStats,
} from '../controllers/dsaController.js';
import { createRules, updateRules, idParam } from '../validators/dsaValidators.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listDsaProblems);
router.get('/stats', dsaStats);
router.get('/:id', idParam, handleValidation, getDsaProblem);
router.post('/', requireAdmin, createRules, handleValidation, createDsaProblem);
router.put('/:id', requireAdmin, idParam, updateRules, handleValidation, updateDsaProblem);
router.delete('/:id', requireAdmin, idParam, handleValidation, deleteDsaProblem);

export default router;

import { Router } from 'express';
import {
  listAiExperiments,
  getAiExperiment,
  createAiExperiment,
  updateAiExperiment,
  deleteAiExperiment,
} from '../controllers/aiExperimentController.js';
import { createRules, updateRules, idParam } from '../validators/aiExperimentValidators.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listAiExperiments);
router.get('/:id', idParam, handleValidation, getAiExperiment);
router.post('/', requireAdmin, createRules, handleValidation, createAiExperiment);
router.put('/:id', requireAdmin, idParam, updateRules, handleValidation, updateAiExperiment);
router.delete('/:id', requireAdmin, idParam, handleValidation, deleteAiExperiment);

export default router;

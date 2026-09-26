import { Router } from 'express';
import {
  listJourneyEntries,
  getJourneyEntry,
  createJourneyEntry,
  updateJourneyEntry,
  deleteJourneyEntry,
} from '../controllers/journeyController.js';
import { createRules, updateRules, monthParam } from '../validators/journeyValidators.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listJourneyEntries);
router.get('/:month', monthParam, handleValidation, getJourneyEntry);
router.post('/', requireAdmin, createRules, handleValidation, createJourneyEntry);
router.put('/:month', requireAdmin, monthParam, updateRules, handleValidation, updateJourneyEntry);
router.delete('/:month', requireAdmin, monthParam, handleValidation, deleteJourneyEntry);

export default router;

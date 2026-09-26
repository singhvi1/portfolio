import { Router } from 'express';
import { listCourses, getCourse, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { createRules, updateRules, idParam } from '../validators/courseValidators.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listCourses);
router.get('/:id', idParam, handleValidation, getCourse);
router.post('/', requireAdmin, createRules, handleValidation, createCourse);
router.put('/:id', requireAdmin, idParam, updateRules, handleValidation, updateCourse);
router.delete('/:id', requireAdmin, idParam, handleValidation, deleteCourse);

export default router;

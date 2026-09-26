import { body, param } from 'express-validator';
import Course from '../models/Course.js';

export const idParam = [param('id').isMongoId().withMessage('Invalid id')];

export const createRules = [
  body('courseName').trim().notEmpty().withMessage('courseName is required'),
  body('platform').trim().notEmpty().withMessage('platform is required'),
  body('status').optional().isIn(Course.STATUS).withMessage(`status must be one of: ${Course.STATUS.join(', ')}`),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('progress must be 0-100'),
];

export const updateRules = [
  body('courseName').optional().notEmpty(),
  body('status').optional().isIn(Course.STATUS),
  body('progress').optional().isInt({ min: 0, max: 100 }),
];

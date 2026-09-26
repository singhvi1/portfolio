import { body, param } from 'express-validator';
import Achievement from '../models/Achievement.js';

export const idParam = [param('id').isMongoId().withMessage('Invalid id')];

export const createRules = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('date').isISO8601().withMessage('date must be a valid date (YYYY-MM-DD)'),
  body('category').isIn(Achievement.CATEGORIES).withMessage(`category must be one of: ${Achievement.CATEGORIES.join(', ')}`),
];

export const updateRules = [
  body('title').optional().notEmpty(),
  body('date').optional().isISO8601(),
  body('category').optional().isIn(Achievement.CATEGORIES),
];

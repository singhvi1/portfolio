import { body, param } from 'express-validator';
import Technology from '../models/Technology.js';

export const idParam = [param('id').isMongoId().withMessage('Invalid id')];

export const createRules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('category').isIn(Technology.CATEGORIES).withMessage(`category must be one of: ${Technology.CATEGORIES.join(', ')}`),
  body('proficiency').isIn(Technology.PROFICIENCY).withMessage(`proficiency must be one of: ${Technology.PROFICIENCY.join(', ')}`),
  body('monthLearned').matches(/^\d{4}-\d{2}$/).withMessage('monthLearned must be YYYY-MM'),
];

export const updateRules = [
  body('name').optional().notEmpty(),
  body('category').optional().isIn(Technology.CATEGORIES),
  body('proficiency').optional().isIn(Technology.PROFICIENCY),
  body('monthLearned').optional().matches(/^\d{4}-\d{2}$/).withMessage('monthLearned must be YYYY-MM'),
];

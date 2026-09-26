import { body, param } from 'express-validator';
import DsaProblem from '../models/DsaProblem.js';

export const idParam = [param('id').isMongoId().withMessage('Invalid id')];

export const createRules = [
  body('problemName').trim().notEmpty().withMessage('problemName is required'),
  body('platform').isIn(DsaProblem.PLATFORMS).withMessage(`platform must be one of: ${DsaProblem.PLATFORMS.join(', ')}`),
  body('difficulty').isIn(DsaProblem.DIFFICULTY).withMessage(`difficulty must be one of: ${DsaProblem.DIFFICULTY.join(', ')}`),
  body('topic').trim().notEmpty().withMessage('topic is required'),
  body('dateSolved').isISO8601().withMessage('dateSolved must be a valid date (YYYY-MM-DD)'),
];

export const updateRules = [
  body('problemName').optional().notEmpty(),
  body('platform').optional().isIn(DsaProblem.PLATFORMS),
  body('difficulty').optional().isIn(DsaProblem.DIFFICULTY),
  body('dateSolved').optional().isISO8601(),
];

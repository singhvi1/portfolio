import { body, param } from 'express-validator';

export const idParam = [param('id').isMongoId().withMessage('Invalid id')];

export const createRules = [
  body('company').trim().notEmpty().withMessage('company is required'),
  body('position').trim().notEmpty().withMessage('position is required'),
  body('startDate').matches(/^\d{4}-\d{2}$/).withMessage('startDate must be YYYY-MM'),
  body('endDate').optional({ nullable: true }).matches(/^\d{4}-\d{2}$/).withMessage('endDate must be YYYY-MM'),
];

export const updateRules = [
  body('company').optional().notEmpty(),
  body('position').optional().notEmpty(),
  body('startDate').optional().matches(/^\d{4}-\d{2}$/),
  body('endDate').optional({ nullable: true }).matches(/^\d{4}-\d{2}$/),
];

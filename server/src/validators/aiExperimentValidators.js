import { body, param } from 'express-validator';

export const idParam = [param('id').isMongoId().withMessage('Invalid id')];

export const createRules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('description').trim().notEmpty().withMessage('description is required'),
  body('date').matches(/^\d{4}-\d{2}$/).withMessage('date must be YYYY-MM'),
  body('githubUrl').optional({ nullable: true }).isURL().withMessage('githubUrl must be a valid URL'),
  body('demoUrl').optional({ nullable: true }).isURL().withMessage('demoUrl must be a valid URL'),
];

export const updateRules = [
  body('name').optional().notEmpty(),
  body('date').optional().matches(/^\d{4}-\d{2}$/),
  body('githubUrl').optional({ nullable: true }).isURL(),
  body('demoUrl').optional({ nullable: true }).isURL(),
];

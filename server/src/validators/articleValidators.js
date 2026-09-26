import { body, param } from 'express-validator';

export const idParam = [param('id').isMongoId().withMessage('Invalid id')];

export const createRules = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('slug').trim().notEmpty().isSlug().withMessage('slug must be URL-safe (e.g. how-api-gateways-work)'),
  body('shortDescription').trim().notEmpty().withMessage('shortDescription is required'),
  body('content').trim().notEmpty().withMessage('content is required'),
  body('status').optional().isIn(['draft', 'published']),
];

export const updateRules = [
  body('title').optional().notEmpty(),
  body('slug').optional().isSlug(),
  body('content').optional().notEmpty(),
  body('status').optional().isIn(['draft', 'published']),
];

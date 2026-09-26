import { body, param } from 'express-validator';

export const projectIdParam = [param('id').isMongoId().withMessage('Invalid project id')];

export const createProjectRules = [
  body('slug').trim().notEmpty().withMessage('slug is required').isSlug().withMessage('slug must be URL-safe (e.g. my-project)'),
  body('name').trim().notEmpty().withMessage('name is required'),
  body('shortDescription').trim().notEmpty().withMessage('shortDescription is required'),
  body('tags').optional().isArray().withMessage('tags must be an array'),
  body('githubUrl').optional({ nullable: true }).isURL().withMessage('githubUrl must be a valid URL'),
  body('liveUrl').optional({ nullable: true }).isURL().withMessage('liveUrl must be a valid URL'),
  body('featured').optional().isBoolean().withMessage('featured must be true/false'),
];

// Same rules, but every field optional — this is a PATCH-style update
export const updateProjectRules = [
  body('slug').optional().isSlug().withMessage('slug must be URL-safe'),
  body('name').optional().notEmpty().withMessage('name cannot be empty'),
  body('tags').optional().isArray().withMessage('tags must be an array'),
  body('githubUrl').optional({ nullable: true }).isURL().withMessage('githubUrl must be a valid URL'),
  body('liveUrl').optional({ nullable: true }).isURL().withMessage('liveUrl must be a valid URL'),
  body('featured').optional().isBoolean().withMessage('featured must be true/false'),
];

import { body, param } from 'express-validator';

export const monthParam = [
  param('month').matches(/^\d{4}-\d{2}$/).withMessage('month must be YYYY-MM'),
];

const objectIdArray = (field) =>
  body(field).optional().isArray().withMessage(`${field} must be an array of ids`);

export const createRules = [
  body('month').matches(/^\d{4}-\d{2}$/).withMessage('month must be YYYY-MM'),
  objectIdArray('projects'),
  objectIdArray('technologies'),
  objectIdArray('achievements'),
  objectIdArray('articles'),
  objectIdArray('aiExperiments'),
  body('dsaProblemsSolvedCount').optional().isInt({ min: 0 }),
  body('coursesCompletedCount').optional().isInt({ min: 0 }),
];

export const updateRules = [
  objectIdArray('projects'),
  objectIdArray('technologies'),
  objectIdArray('achievements'),
  objectIdArray('articles'),
  objectIdArray('aiExperiments'),
  body('dsaProblemsSolvedCount').optional().isInt({ min: 0 }),
  body('coursesCompletedCount').optional().isInt({ min: 0 }),
];

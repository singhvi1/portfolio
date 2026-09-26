import { validationResult } from 'express-validator';
import { fail } from '../utils/apiResponse.js';

// Run after an array of express-validator checks. If any failed, respond
// with a consistent 422 instead of letting the request continue.
export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return fail(res, 422, 'Validation failed', errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    })));
  }
  next();
}

import { fail } from '../utils/apiResponse.js';

export function notFound(req, res) {
  return fail(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Known, thrown ApiError
  if (err.statusCode) {
    return fail(res, err.statusCode, err.message, err.errors);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return fail(res, 422, 'Validation failed', errors);
  }

  // Invalid ObjectId / cast error
  if (err.name === 'CastError') {
    return fail(res, 400, `Invalid ${err.path}: ${err.value}`);
  }

  // Duplicate key (e.g. unique slug)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return fail(res, 409, `${field ? field : 'Field'} already exists`, err.keyValue);
  }

  // JWT errors that slipped past auth middleware
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return fail(res, 401, 'Invalid or expired session');
  }

  console.error('[unhandled error]', err);
  return fail(res, 500, 'Something went wrong on the server');
}

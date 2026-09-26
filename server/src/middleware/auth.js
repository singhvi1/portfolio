import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Reads the JWT from the httpOnly cookie (browser admin dashboard) or an
// Authorization: Bearer header (useful for testing with curl/Postman).
export const requireAdmin = asyncHandler(async (req, res, next) => {
  const cookieToken = req.cookies?.[process.env.COOKIE_NAME || 'portfolio_admin_token'];
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const token = cookieToken || headerToken;

  if (!token) {
    throw new ApiError(401, 'Not authenticated. Admin login required.');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { email: payload.email };
    next();
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired session. Please log in again.');
  }
});

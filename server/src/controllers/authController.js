import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const COOKIE_NAME = process.env.COOKIE_NAME || 'portfolio_admin_token';

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    throw new ApiError(
      500,
      'Admin credentials are not configured on the server. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env.'
    );
  }

  const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatches = emailMatches && (await bcrypt.compare(password, adminPasswordHash));

  if (!emailMatches || !passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign({ email: adminEmail }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie(COOKIE_NAME, token, cookieOptions());

  // Token is also returned in the body so the admin dashboard (or a tool
  // like Postman/curl) can use a Bearer header instead of cookies if needed.
  return ok(res, { email: adminEmail, token }, 'Logged in');
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  return ok(res, null, 'Logged out');
});

export const me = asyncHandler(async (req, res) => {
  // req.admin is set by the requireAdmin middleware
  return ok(res, req.admin);
});

import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateTokenPair } from '../utils/tokenUtils';
import { sendWelcomeEmail, sendPasswordResetEmail, sendLoginNotificationEmail } from '../services/emailService';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const isProd = process.env.NODE_ENV === 'production';

/**
 * Helper to set HTTP-only cookie for refresh token
 */
const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, 'AUTH_006: Email already registered');
  }

  // Password validation: min 8, uppercase, lowercase, number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new ApiError(400, 'AUTH_007: Password too weak');
  }

  const user = new User({
    name,
    email,
    password,
    provider: 'local',
  });

  const verificationToken = user.generateEmailVerificationToken();
  
  const { accessToken, refreshToken } = generateTokenPair(user);
  user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
  
  await user.save();
  await sendWelcomeEmail(user.email, user.name, verificationToken);

  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    message: 'Account created. Check your email to verify.',
    user: user.publicProfile,
    accessToken,
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Generic error to prevent enumeration
  const invalidError = new ApiError(401, 'AUTH_001: Invalid email or password');

  const user = await User.findByEmail(email).select('+password');
  if (!user || user.provider !== 'local') {
    throw invalidError;
  }

  if (!user.isActive) {
    throw new ApiError(403, 'AUTH_003: Account disabled');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw invalidError;
  }

  user.lastLoginAt = new Date();
  
  const { accessToken, refreshToken } = generateTokenPair(user);
  
  // Maintain max 5 sessions
  user.refreshTokens.push({ token: refreshToken, createdAt: new Date(), device: req.headers['user-agent'] });
  if (user.refreshTokens.length > 5) {
    user.refreshTokens.shift();
  }

  await user.save();
  
  // Optional: Send login notification
  if (user.isEmailVerified) {
    // sendLoginNotificationEmail(user.email, req.headers['user-agent'] || 'Unknown', new Date().toLocaleString());
  }

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    user: user.publicProfile,
    accessToken,
  });
});

/**
 * Google OAuth login/register
 * POST /api/auth/google
 */
export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (error) {
    throw new ApiError(401, 'AUTH_008: Google auth failed');
  }

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new ApiError(401, 'AUTH_008: Google auth failed');
  }

  const { email, name, sub: googleId, picture: avatar } = payload;
  
  let user = await User.findByEmail(email);
  let isNewUser = false;

  if (user) {
    if (!user.isActive) throw new ApiError(403, 'AUTH_003: Account disabled');
    // Link google account if local
    user.googleId = googleId;
    user.avatar = user.avatar || avatar;
    user.isEmailVerified = true;
    user.lastLoginAt = new Date();
  } else {
    isNewUser = true;
    user = new User({
      name: name || 'Google User',
      email,
      provider: 'google',
      googleId,
      avatar,
      isEmailVerified: true,
      lastLoginAt: new Date(),
    });
  }

  const { accessToken, refreshToken } = generateTokenPair(user);
  user.refreshTokens.push({ token: refreshToken, createdAt: new Date(), device: req.headers['user-agent'] });
  if (user.refreshTokens.length > 5) {
    user.refreshTokens.shift();
  }

  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    user: user.publicProfile,
    accessToken,
    isNewUser,
  });
});

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(401, 'AUTH_005: Token invalid or missing');
  }

  const user = await User.findOne({ 'refreshTokens.token': refreshToken });
  if (!user || !user.isActive) {
    res.clearCookie('refreshToken');
    throw new ApiError(401, 'AUTH_005: Token invalid');
  }

  // Token rotation
  user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
  
  const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user);
  user.refreshTokens.push({ token: newRefreshToken, createdAt: new Date(), device: req.headers['user-agent'] });
  
  await user.save();
  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({ accessToken });
});

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  
  if (refreshToken) {
    await User.updateOne(
      { 'refreshTokens.token': refreshToken },
      { $pull: { refreshTokens: { token: refreshToken } } }
    );
  }

  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * Forgot password
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findByEmail(email);

  // Generic success to prevent email enumeration
  const successMsg = 'If that email exists, a reset link was sent.';

  if (!user || user.provider !== 'local') {
    return res.status(200).json({ message: successMsg });
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save();

  await sendPasswordResetEmail(user.email, resetToken);

  res.status(200).json({ message: successMsg });
});

/**
 * Reset password
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'AUTH_005: Token invalid or expired');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  user.refreshTokens = []; // Invalidate all sessions

  await user.save(); // pre-save hook will hash the new password

  res.status(200).json({ message: 'Password reset successfully. Please log in.' });
});

/**
 * Verify Email
 * POST /api/auth/verify-email
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'AUTH_005: Token invalid or expired');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  
  await user.save();

  res.status(200).json({ message: 'Email verified.' });
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'AUTH_005: Unauthorized');
  }
  
  const user = await User.findById(req.user.userId);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'AUTH_003: Account disabled or not found');
  }

  res.status(200).json({ user: user.publicProfile });
});

import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_for_dev_only';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export interface AccessTokenPayload {
  userId: string;
  role: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  userId: string;
  type: 'refresh';
}

/**
 * Generate a short-lived access token
 */
export const generateAccessToken = (userId: string, role: string): string => {
  const payload: AccessTokenPayload = { userId, role, type: 'access' };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRY as any });
};

/**
 * Generate a long-lived refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  const payload: RefreshTokenPayload = { userId, type: 'refresh' };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY as any });
};

/**
 * Verify an access token and return its payload
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as any;
  if (decoded.type !== 'access') {
    throw new Error('Invalid token type');
  }
  return decoded as AccessTokenPayload;
};

/**
 * Verify a refresh token and return its payload
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  return decoded as RefreshTokenPayload;
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (user: IUser) => {
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());
  return { accessToken, refreshToken };
};

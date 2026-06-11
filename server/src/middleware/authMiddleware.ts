import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokenUtils';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Extract token from Authorization header
 */
const extractToken = (req: Request): string | null => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

/**
 * Middleware: Protect routes, require valid access token
 */
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    throw new ApiError(401, 'AUTH_005: Not authorized, no token');
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'AUTH_004: Token expired');
    }
    throw new ApiError(401, 'AUTH_005: Not authorized, token failed');
  }
});

/**
 * Middleware: Require specific role(s)
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'AUTH_005: Not authorized, insufficient permissions');
    }
    next();
  };
};

/**
 * Middleware: Optional auth, attaches user if token exists but doesn't block if not
 */
export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch (error) {
      // Don't throw, just ignore invalid token for optional auth
    }
  }
  
  next();
});

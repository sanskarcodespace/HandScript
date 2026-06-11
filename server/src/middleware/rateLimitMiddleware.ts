import rateLimit from 'express-rate-limit';

// Global API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.', statusCode: 429 },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints specific limiters
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per IP
  message: { message: 'AUTH_009: Too many registration attempts, please try again later.', statusCode: 429 },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per IP
  message: { message: 'AUTH_009: Too many login attempts, please try again later.', statusCode: 429 },
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per IP
  message: { message: 'AUTH_009: Too many password reset requests, please try again later.', statusCode: 429 },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per IP
  message: { message: 'AUTH_009: Too many reset attempts, please try again later.', statusCode: 429 },
});

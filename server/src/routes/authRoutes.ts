import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import {
  registerLimiter,
  loginLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from '../middleware/rateLimitMiddleware';

const router = Router();

// Public auth routes
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/google', loginLimiter, googleAuth);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPasswordLimiter, resetPassword);
router.post('/verify-email', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);

export default router;

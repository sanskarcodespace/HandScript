import { Router } from 'express';
import {
  uploadAssignment,
  retryAssignment,
  getAssignmentStatus,
  deleteAssignment,
} from '../controllers/uploadController';
import { protect } from '../middleware/authMiddleware';
import { assignmentUpload } from '../config/multer';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Rate limit: 20 uploads per hour per user
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { message: 'Too many uploads from this IP, please try again after an hour.', statusCode: 429 },
});

// Middleware to handle multer errors gracefully
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 10MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files uploaded. Maximum is 3.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next();
};

// All upload routes require authentication
router.use(protect);

router.post(
  '/assignment',
  uploadLimiter,
  (req, res, next) => {
    assignmentUpload.array('files', 3)(req, res, (err) => handleMulterError(err, req, res, next));
  },
  uploadAssignment
);

router.post('/assignment/:id/retry', retryAssignment);
router.get('/assignment/:id/status', getAssignmentStatus);
router.delete('/assignment/:id', deleteAssignment);

export default router;

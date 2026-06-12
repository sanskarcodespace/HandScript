import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeFilename, ALLOWED_MIME_TYPES } from '../utils/fileUtils';

// Base storage directory
const baseUploadDir = path.resolve(process.cwd(), 'uploads');

// Create storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine type based on originalUrl or another parameter
    let type = 'misc';
    if (req.originalUrl.includes('/assignment')) type = 'assignments';
    if (req.originalUrl.includes('/handwriting')) type = 'handwriting';

    // Assume user is attached to req by authMiddleware
    const userId = req.user?.userId || 'anonymous';
    
    const dir = path.join(baseUploadDir, userId, type);
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeName = sanitizeFilename(file.originalname);
    const uniqueFilename = `${Date.now()}_${uuidv4().substring(0, 8)}_${safeName}`;
    cb(null, uniqueFilename);
  }
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, and image files are allowed'));
  }
};

// Instance for Assignment Uploads
export const assignmentUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 3 // Max 3 files per upload
  }
});

// Instance for Handwriting Samples
export const handwritingUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Handwriting only accepts images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for handwriting profiles'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 20 // Max 20 files per profile
  }
});

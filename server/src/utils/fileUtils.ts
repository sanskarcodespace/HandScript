import fs from 'fs';
import path from 'path';
import { logger } from './logger';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp'
];

/**
 * Strips special characters, normalizes unicode, max 100 chars
 */
export const sanitizeFilename = (filename: string): string => {
  const parsed = path.parse(filename);
  let name = parsed.name;
  
  // Normalize unicode
  name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Remove special characters, replace spaces with underscores
  name = name.replace(/[^a-zA-Z0-9]/g, '_');
  // Collapse multiple underscores
  name = name.replace(/_+/g, '_');
  // Truncate to 100 chars
  name = name.substring(0, 100);

  return `${name}${parsed.ext.toLowerCase()}`;
};

/**
 * Verify actual file magic bytes match declared type (concept implementation)
 * In a real production system, you'd use a package like 'file-type'
 * For this implementation, we just double check the declared type against our allowed list
 * and optionally check the file extension if available.
 */
export const validateFileType = (declaredMimeType: string, filename?: string): boolean => {
  if (!ALLOWED_MIME_TYPES.includes(declaredMimeType)) {
    return false;
  }
  
  // Basic extension validation
  if (filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeToExt: Record<string, string[]> = {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    };
    
    const validExts = mimeToExt[declaredMimeType];
    if (validExts && !validExts.includes(ext)) {
      return false;
    }
  }

  return true;
};

/**
 * Calculate human readable file size
 */
export const calculateFileSizeLabel = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Delete temp files after processing
 */
export const cleanupTempFiles = async (paths: string[]): Promise<void> => {
  for (const filePath of paths) {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        logger.info(`Cleaned up temp file: ${filePath}`);
      }
    } catch (error) {
      logger.error(`Error cleaning up file ${filePath}:`, error);
    }
  }
};

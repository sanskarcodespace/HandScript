import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

export interface IStorageService {
  uploadFile(buffer: Buffer, key: string, mimeType: string): Promise<{ url: string; key: string }>;
  deleteFile(key: string): Promise<void>;
  getSignedUrl(key: string, expirySeconds?: number): Promise<string>;
  fileExists(key: string): Promise<boolean>;
}

export class LocalStorageService implements IStorageService {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private getFullPath(key: string): string {
    return path.join(this.baseDir, key);
  }

  async uploadFile(buffer: Buffer, key: string, mimeType: string): Promise<{ url: string; key: string }> {
    const fullPath = this.getFullPath(key);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(fullPath, buffer);
    logger.info(`File saved locally: ${fullPath}`);

    // Generate a local URL (assuming the server serves static files from /uploads)
    const url = `${process.env.API_URL || 'http://localhost:5000'}/uploads/${key}`;

    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    const fullPath = this.getFullPath(key);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      logger.info(`File deleted locally: ${fullPath}`);
    }
  }

  async getSignedUrl(key: string, expirySeconds: number = 3600): Promise<string> {
    // Local storage doesn't really have signed URLs in the same way S3 does.
    // For development, we just return the direct URL.
    // In production with local storage, you'd want to generate a JWT token and append it as a query param.
    return `${process.env.API_URL || 'http://localhost:5000'}/uploads/${key}`;
  }

  async fileExists(key: string): Promise<boolean> {
    const fullPath = this.getFullPath(key);
    try {
      await fs.promises.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

export class S3StorageService implements IStorageService {
  // S3 implementation placeholder
  // using @aws-sdk/client-s3

  async uploadFile(buffer: Buffer, key: string, mimeType: string): Promise<{ url: string; key: string }> {
    throw new Error('S3StorageService not implemented');
  }

  async deleteFile(key: string): Promise<void> {
    throw new Error('S3StorageService not implemented');
  }

  async getSignedUrl(key: string, expirySeconds: number = 3600): Promise<string> {
    throw new Error('S3StorageService not implemented');
  }

  async fileExists(key: string): Promise<boolean> {
    throw new Error('S3StorageService not implemented');
  }
}

// Factory
export const getStorageService = (): IStorageService => {
  const storageType = process.env.STORAGE_TYPE || 'local';
  
  if (storageType === 's3') {
    return new S3StorageService();
  }
  
  return new LocalStorageService();
};

export const storageService = getStorageService();

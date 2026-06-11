import os

def create(filepath, content):
    full_path = os.path.abspath(filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content.strip() + '\n')
    print(f"Created: {filepath}")

create('server/tsconfig.json', """
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "index.ts"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
""")

create('server/.env.example', """
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/handnote_ai
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
STORAGE_TYPE=local
STORAGE_LOCAL_PATH=./uploads
AWS_S3_BUCKET=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
EMAIL_FROM=noreply@handnoteai.com
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
""")

create('server/index.ts', """
/**
 * Server entry point (listen, graceful shutdown)
 */
import app from './src/app';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// TODO: Implement graceful shutdown for SIGTERM/SIGINT
""")

create('server/src/app.ts', """
/**
 * Express app setup (middleware registration, route mounting)
 */
import express from 'express';

const app = express();

// TODO: Apply middleware (cors, helmet, rate-limiter, morgan)
// TODO: Mount routes

export default app;
""")

create('server/src/config/db.ts', """
/**
 * MongoDB connection with retry logic
 */
export const connectDB = async () => {
  // TODO: Implement mongoose.connect with retry
};
""")

create('server/src/config/env.ts', """
/**
 * Validated environment config using zod
 */
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  // TODO: Add other env variables
});

export const env = envSchema.parse(process.env);
""")

create('server/src/config/cors.ts', """
/**
 * CORS configuration settings
 */
export const corsOptions = {
  // TODO: Configure allowed origins and methods
};
""")

create('server/src/config/multer.ts', """
/**
 * Multer configuration for file uploads (limits, storage options)
 */
export const uploadConfig = {
  // TODO: Setup local or memory storage for multer
};
""")

controllers = [
  ('authController', 'Login, register, google OAuth, refresh, logout'),
  ('uploadController', 'File upload and OCR trigger'),
  ('assignmentController', 'Create, get, list, delete assignments'),
  ('handwritingController', 'Upload and manage handwriting profiles'),
  ('exportController', 'PDF export and download'),
  ('subscriptionController', 'Plans, credits, upgrades'),
  ('adminController', 'Admin user and system management')
]

for name, desc in controllers:
    create(f'server/src/controllers/{name}.ts', f"""
/**
 * Controller: {name}
 * Purpose: {desc}
 * Handles incoming requests, interacts with services, and returns responses.
 */
import {{ Request, Response }} from 'express';

export const handleRequest = async (req: Request, res: Response) => {{
  // TODO: Implement controller logic
  res.send('Not implemented');
}};
""")

middlewares = [
  ('authMiddleware', 'JWT verification, role checking'),
  ('rateLimitMiddleware', 'Per-route rate limiting with express-rate-limit'),
  ('validateMiddleware', 'Request body validation with zod'),
  ('uploadMiddleware', 'File type/size validation'),
  ('errorMiddleware', 'Global error handler'),
  ('loggerMiddleware', 'Request logging with morgan')
]

for name, desc in middlewares:
    create(f'server/src/middleware/{name}.ts', f"""
/**
 * Middleware: {name}
 * Purpose: {desc}
 */
import {{ Request, Response, NextFunction }} from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {{
  // TODO: Implement middleware logic
  next();
}};
""")

models = [
  ('User', 'User schema for authentication and profile'),
  ('Assignment', 'Assignment schema storing extracted text and generated answers'),
  ('HandwritingProfile', 'Handwriting profile schema mapping user fonts/styles'),
  ('Subscription', 'Subscription schema tracking user plans and billing'),
  ('CreditTransaction', 'Credit usage log for auditing tokens spent'),
  ('AuditLog', 'Admin audit log for sensitive system actions')
]

for name, desc in models:
    create(f'server/src/models/{name}.ts', f"""
/**
 * Mongoose Model: {name}
 * Purpose: {desc}
 */
import mongoose from 'mongoose';

const schema = new mongoose.Schema({{
  // TODO: Define schema fields
}});

export const {name} = mongoose.model('{name}', schema);
""")

routes = ['authRoutes', 'uploadRoutes', 'assignmentRoutes', 'handwritingRoutes', 'exportRoutes', 'subscriptionRoutes', 'adminRoutes']
for route in routes:
    create(f'server/src/routes/{route}.ts', f"""
/**
 * Express Route Map: {route}
 * Binds endpoints to corresponding controller methods.
 */
import {{ Router }} from 'express';

const router = Router();
// TODO: Define routes (e.g., router.get('/', controller))

export default router;
""")

services = [
  ('ocrService', 'Tesseract OCR integration for extracting text from images/PDFs'),
  ('openaiService', 'OpenAI API integration for answering assignment questions'),
  ('notebookService', 'Logic to compose and render text onto notebook pages'),
  ('handwritingService', 'Handles handwriting style parameters and font application'),
  ('pdfService', 'PDFKit or Puppeteer logic to stitch images into a final PDF'),
  ('storageService', 'File storage abstraction (local disk or AWS S3)'),
  ('emailService', 'Email notification dispatch via nodemailer')
]

for name, desc in services:
    create(f'server/src/services/{name}.ts', f"""
/**
 * Service: {name}
 * Purpose: {desc}
 * Encapsulates core business logic and external integrations.
 */
export const executeService = async () => {{
  // TODO: Implement service logic
}};
""")

create('server/src/utils/asyncHandler.ts', """
/**
 * Utility: Async error wrapper
 * Catches rejected promises in controllers and passes them to next(err)
 */
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
""")

create('server/src/utils/ApiError.ts', """
/**
 * Utility: Custom API Error class
 * Standardizes error status codes and messages.
 */
export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
""")

create('server/src/utils/ApiResponse.ts', """
/**
 * Utility: Standardized API response helper
 */
export class ApiResponse {
  constructor(public statusCode: number, public data: any, public message: string = "Success") {}
}
""")

create('server/src/utils/logger.ts', """
/**
 * Utility: Winston logger configuration
 */
export const logger = {
  info: (msg: string) => console.log(msg),
  error: (msg: string) => console.error(msg),
  // TODO: Integrate winston fully
};
""")

create('server/src/utils/tokenUtils.ts', """
/**
 * Utility: JWT generation and verification helpers
 */
export const generateToken = (userId: string) => {
  // TODO: Implement jwt.sign
  return 'token';
};
""")

create('server/src/utils/fileUtils.ts', """
/**
 * Utility: File validation, cleanup helpers
 */
export const deleteFile = async (path: string) => {
  // TODO: Implement fs.unlink
};
""")

create('server/src/types/express.d.ts', """
/**
 * Extend Express Request to include custom properties (like authenticated user info)
 */
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: any; // TODO: Replace 'any' with actual User type
    }
  }
}
""")

create('server/src/types/index.ts', """
/**
 * Shared server-side type definitions
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
""")

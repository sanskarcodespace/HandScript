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

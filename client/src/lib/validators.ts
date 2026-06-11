/**
 * Zod schemas for form validation across the client
 */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
// TODO: Add more validation schemas

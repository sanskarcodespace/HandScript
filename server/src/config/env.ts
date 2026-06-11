/**
 * Validated environment config using zod
 */
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  // TODO: Add other env variables
});

export const env = envSchema.parse(process.env);

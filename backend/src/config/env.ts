import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config } from 'dotenv';
import { z } from 'zod';

const currentDir = fileURLToPath(new URL('.', import.meta.url));

config({
  path: resolve(currentDir, '../../../.env'),
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string('JWT_SECRET is required').min(1, 'JWT_SECRET is required'),
});

export const env = envSchema.parse(process.env);

import { z } from 'zod';

export const registerBodySchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(12, 'Password must contain at least 12 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;

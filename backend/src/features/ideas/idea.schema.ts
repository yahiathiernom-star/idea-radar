import { z } from 'zod';

export const createIdeaBodySchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().min(1, 'Description is required'),
  })
  .strict();

export type CreateIdeaBody = z.infer<typeof createIdeaBodySchema>;

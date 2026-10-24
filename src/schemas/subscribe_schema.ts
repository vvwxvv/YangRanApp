import { z } from 'zod';

export const subscribeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  isActive: z.boolean().optional().default(true),
  createdAt: z.date().optional(),
});

export type Subscribe = z.infer<typeof subscribeSchema>;

export const createSubscribeSchema = subscribeSchema.omit({ id: true, createdAt: true });
export type CreateSubscribeInput = z.infer<typeof createSubscribeSchema>;

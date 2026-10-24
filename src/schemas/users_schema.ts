import { z } from 'zod';

export const usersSchema = z.object({
  id: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  createdAt: z.date().optional(),
  lastLoginAt: z.date().optional().nullable(),
});

export type Users = z.infer<typeof usersSchema>;

export const createUsersSchema = usersSchema.omit({ id: true, createdAt: true, lastLoginAt: true });
export type CreateUsersInput = z.infer<typeof createUsersSchema>;

export const updateUsersSchema = usersSchema.omit({ id: true, createdAt: true });
export type UpdateUsersInput = z.infer<typeof updateUsersSchema>;

export const loginUsersSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
});
export type LoginUsersInput = z.infer<typeof loginUsersSchema>;

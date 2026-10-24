import { z } from 'zod';

export const enquireSchema = z.object({
  id: z.string().optional(), // Handled by DB via ObjectId
  name: z.string({ required_error: "Name is required" }),
  email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
  message: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]).optional(), // Accepts Date object or ISO string
  status: z.string().optional(),
});

export type Enquire = z.infer<typeof enquireSchema>;

// Omit 'id' and 'createdAt' for creation since Prisma handles these defaults
export const createEnquireSchema = enquireSchema.omit({ 
  id: true, 
  createdAt: true 
});
export type CreateEnquireInput = z.infer<typeof createEnquireSchema>;

// Make all fields optional for updates, but strictly require the 'id'
export const updateEnquireSchema = enquireSchema.partial().required({ 
  id: true 
});
export type UpdateEnquireInput = z.infer<typeof updateEnquireSchema>;
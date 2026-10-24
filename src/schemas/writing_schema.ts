import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

// Writing schema - FIXED to match Prisma exactly
export const writingSchema = z.object({
  id: z.string().optional(),
  cover_img_url: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  paragraphs: z.array(z.string()).default([]),
  caption: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  tag: z.array(z.string()).optional(),
  // `mark` + `language` live on the Prisma Writing model and the form renders
  // them — without them listed here zodResolver strips the values before
  // submission, so edits never reached the API.
  mark: markFieldSchema,
  language: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Writing = z.infer<typeof writingSchema>;

// Schema for creating writing
export const createWritingSchema = writingSchema.omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true 
});

export type CreateWritingInput = z.infer<typeof createWritingSchema>;

// Schema for updating writing
export const updateWritingSchema = writingSchema.partial().required({ id: true });

export type UpdateWritingInput = z.infer<typeof updateWritingSchema>;
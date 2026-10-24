import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

export const resumeSchema = z.object({
  id: z.string().optional(),
  artist: z.string().optional(),
  year: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  introduction: z.array(z.string()).optional(),
  mark: markFieldSchema,
  language: z.string().optional(),
});

export type Resume = z.infer<typeof resumeSchema>;

export const createResumeSchema = resumeSchema.omit({ id: true });
export type CreateResumeInput = z.infer<typeof createResumeSchema>;

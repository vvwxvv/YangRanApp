import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

export const bibliographySchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().nullable().optional(),
  cover_img_url: z.string().nullable().optional(),
  author: z.string().optional(),
  type: z.string().nullable().optional(),
  year: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  published_at: z.string().nullable().optional(),
  pdf_url: z.string().nullable().optional(),
  web_url: z.string().nullable().optional(),
  video_url: z.string().nullable().optional(),
  related_exhibition: z.array(z.string()).optional(),
  related_artist: z.array(z.string()).optional(),
  order: z.string().optional(),
  mark: markFieldSchema,
  language: z.string().optional(),
});

export type Bibliography = z.infer<typeof bibliographySchema>;

export const createBibliographySchema = bibliographySchema.omit({ id: true });
export type CreateBibliographyInput = z.infer<typeof createBibliographySchema>;
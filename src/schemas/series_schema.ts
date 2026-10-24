import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

export const seriesSchema = z.object({
  id: z.string().optional(),
  cover_img_url: z.string().nullable().optional(),
  artist: z.string().optional(),
  title: z.string().optional(),
  type: z.string().nullable().optional(),
  medium: z.string().nullable().optional(),
  year: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  credits: z.string().nullable().optional(),
  special_thanks: z.string().nullable().optional(),
  introduction: z.array(z.string()).optional(),
  order: z.string().optional(),
  mark: markFieldSchema,
  tag: z.array(z.string()).optional(),
  language: z.string().optional(),
});

export type Series = z.infer<typeof seriesSchema>;

export const createSeriesSchema = seriesSchema.omit({ id: true });
export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;

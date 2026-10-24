import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

export const aboutSchema = z.object({
  id: z.string().optional(),
  artist: z.string().optional(),
  portrait_image_url: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  introductions: z.array(z.string()).optional(),
  pdf_url: z.string().nullable().optional(),   // 新增
  web_url: z.string().nullable().optional(),   // 新增
  language: z.string().optional(),
  order: z.string().optional(),
  mark: markFieldSchema,
});

export type About = z.infer<typeof aboutSchema>;

export const createAboutSchema = aboutSchema.omit({ id: true });
export type CreateAboutInput = z.infer<typeof createAboutSchema>;
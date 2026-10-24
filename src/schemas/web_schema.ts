import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

// ObjectId validation regex (24-character hex string)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const webSchema = z.object({
  id: z.string().optional(),
  web_url: z.string().optional(),
  cover_img_url: z.string().optional(),
  type: z.string().optional(),
  tag_en: z.string().optional(),
  tag_cn: z.string().optional(),
  caption_en: z.string().optional(),
  caption_cn: z.string().optional(),
  mark: markFieldSchema,
  order: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Web = z.infer<typeof webSchema>;

export const createWebSchema = webSchema.omit({ id: true, updatedAt: true });
export type CreateWebInput = z.infer<typeof createWebSchema>;

export const updateWebSchema = webSchema.partial().required({ id: true });
export type UpdateWebInput = z.infer<typeof updateWebSchema>;
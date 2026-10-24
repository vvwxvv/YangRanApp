import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

// ObjectId validation regex (24-character hex string)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const videoSchema = z.object({
  id: z.string().optional(),
  video_url: z.string().optional(),      //  Simple like web
  cover_img_url: z.string().optional(),  //  Simple like web
  type: z.string().optional(),
  tag_en: z.string().max(200, 'tag_en cannot exceed 200 characters').optional(),
  tag_cn: z.string().max(200, 'tag_cn cannot exceed 200 characters').optional(),
  caption_en: z.string().max(1000, 'caption_en cannot exceed 1000 characters').optional(),
  caption_cn: z.string().max(1000, 'caption_cn cannot exceed 1000 characters').optional(),
  mark: markFieldSchema,
  order: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Video = z.infer<typeof videoSchema>;

export const createVideoSchema = videoSchema.omit({ id: true, updatedAt: true });
export type CreateVideoInput = z.infer<typeof createVideoSchema>;

export const updateVideoSchema = videoSchema.partial().required({ id: true });
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
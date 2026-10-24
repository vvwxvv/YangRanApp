import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

// Per-page ordering for an image. Mirrors the artwork order plus a rolling
// image position:
//   { artist_page_order, exhibition_page_order, art_fair_page_order,
//     rolling_img_order, artist_detail_rolling_img_order }
export const imageOrderSchema = z.object({
  artist_page_order: z.string().optional(),
  exhibition_page_order: z.string().optional(),
  art_fair_page_order: z.string().optional(),
  rolling_img_order: z.string().optional(),
  // The artist DETAIL page's own rolling sequence (separate from the artist
  // page one, and with its own hide flag).
  artist_detail_rolling_img_order: z.string().optional(),
});

export type ImageOrder = z.infer<typeof imageOrderSchema>;

export const imageSchema = z.object({
  id: z.string().optional(),
  img_url: z.string().optional(),
  tag_en: z.string().optional(),
  tag_cn: z.string().optional(),
  type: z.string().optional(),
  caption_en: z.string().optional(),
  caption_cn: z.string().optional(),
  mark: markFieldSchema,
  tag_source: z.string().optional(),
  // JSON object (artist_page_order / exhibition_page_order /
  // art_fair_page_order / rolling_img_order / artist_detail_rolling_img_order).
  // A plain string is still
  // accepted so legacy rows keep validating.
  order: z.union([imageOrderSchema, z.string(), z.null()]).optional(),
});

export type Image = z.infer<typeof imageSchema>;

export const createImageSchema = imageSchema.omit({ id: true });
export type CreateImageInput = z.infer<typeof createImageSchema>;

export const updateImageSchema = imageSchema.partial().required({ id: true });
export type UpdateImageInput = z.infer<typeof updateImageSchema>;

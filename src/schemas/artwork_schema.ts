import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

// Per-page ordering for an artwork. A single artwork can appear on the
// artist page, the exhibition page and the art fair page, and each of those
// may want its own position — so `order` is a JSON object with one key per
// page instead of a single string.
export const artworkOrderSchema = z.object({
  artist_page_order: z.string().optional(),
  exhibition_page_order: z.string().optional(),
  art_fair_page_order: z.string().optional(),
});

export type ArtworkOrder = z.infer<typeof artworkOrderSchema>;

export const artworkSchema = z.object({
  id: z.string().optional(),
  cover_img_url: z.string().optional(),
  related_exhibition: z.array(z.string()).optional(), // 新增字段
  artist: z.string().optional(),
  title: z.string().optional(),
  type: z.string().optional(),
  medium: z.string().optional(),
  year: z.string().optional(),
  size: z.string().optional(),
  series: z.string().optional(),
  caption: z.string().optional(),
  duration: z.string().optional(),
  credits: z.string().optional(),
  special_thanks: z.string().optional(),
  introduction: z.array(z.string()).optional(),
  video_url: z.string().optional(),
  web_url: z.string().optional(),
  work_value: z.string().optional(),
  sold: z.string().optional(),
  // JSON object with artist_page_order / exhibition_page_order /
  // art_fair_page_order. A plain string is still accepted so legacy rows
  // (saved before this change) keep validating.
  order: z.union([artworkOrderSchema, z.string(), z.null()]).optional(),
  mark: markFieldSchema,
  tag: z.array(z.string()).optional(),
  language: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Artwork = z.infer<typeof artworkSchema>;

export const createArtworkSchema = artworkSchema.omit({ id: true, updatedAt: true });
export type CreateArtworkInput = z.infer<typeof createArtworkSchema>;

export const updateArtworkSchema = artworkSchema.partial().required({ id: true });
export type UpdateArtworkInput = z.infer<typeof updateArtworkSchema>;
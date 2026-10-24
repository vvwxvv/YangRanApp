import { z } from 'zod';

/**
 * `mark` is a JSON object now:
 *
 *   { value?: string, hide?: string[] }
 *
 *   value → the classic scalar mark ("Slider" / "Feature" / "Private" / …)
 *   hide  → page tokens this record is hidden on
 *           ("artist_page" | "exhibition_page" | "art_fair_page" |
 *            "artist_rolling_image")
 *
 * A plain string (legacy rows + scalar form inputs) and null are still
 * accepted so nothing saved before this change stops validating.
 */
export const markSchema = z.object({
  value: z.string().optional(),
  hide: z.array(z.string()).optional(),
  marks: z.array(z.string()).optional(),
});

export const markFieldSchema = z
  .union([markSchema, z.string(), z.null()])
  .optional();

export type Mark = z.infer<typeof markSchema>;

/** Page tokens a record can be hidden on. */
export const MARK_HIDE_TOKENS = [
  'artist_page',
  'exhibition_page',
  'art_fair_page',
  'artist_rolling_image',
] as const;

/** Named flags a record can carry (positive marks). */
export const MARK_FLAGS = ['artist_hover_image'] as const;

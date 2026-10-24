import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

// Event schema – exactly matching the Prisma model
export const eventSchema = z.object({
  id: z.string().optional(),                // mapped to _id in Prisma
  cover_img_url: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  year: z.string().optional(),
  date_time: z.string().optional(),
  type: z.string().optional(),
  host: z.string().optional(),
  support: z.string().optional(),
  special_thanks: z.string().optional(),
  venue: z.string().optional(),
  address: z.string().optional(),
  caption: z.string().optional(),
  introduction: z.array(z.string()).optional(),
  related_artist: z.array(z.string()).optional(),
  web_url: z.string().optional(),
  video_url: z.string().optional(),
  mark: markFieldSchema,
  order: z.string().optional(),
  language: z.string().optional(),
  updatedAt: z.string().optional(),         // ISO string from API
});

export type Event = z.infer<typeof eventSchema>;

// Schema for creating an event (omit the auto-generated id)
export const createEventSchema = eventSchema.omit({ id: true });

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Schema for updating an event (id required, all others optional)
export const updateEventSchema = eventSchema.partial().required({ id: true });

export type UpdateEventInput = z.infer<typeof updateEventSchema>;
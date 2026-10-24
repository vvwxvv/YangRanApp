import { z } from 'zod';

// Fully lenient schema — no format validation.
// The server (beforeCreate / beforeUpdate) normalises whatever the admin
// types (lowercases email, prefixes https:// on URLs, drops empty
// social_media entries), so the form never blocks submission on a
// "wrong" format. Fill any single field and it will submit fine.
export const ArtistContactSchema = z.object({
  id: z.string().optional(),
 artist_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.array(z.string()).optional(),
  social_media: z.array(
    z.object({
      platform: z.string().optional(),
      account: z.string().optional(),
      url: z.string().optional(),
    })
  ).optional(),
  web_url: z.string().nullable().optional(),
  language: z.string().optional(),
  order: z.string().optional(),
});

export type ArtistContact = z.infer<typeof ArtistContactSchema>;

export const createArtistContactSchema = ArtistContactSchema.omit({ id: true });
export type CreateArtistContactInput = z.infer<typeof createArtistContactSchema>;

import { normalizeArtworkOrder } from '@/utils/artworkOrder';

/**
 * Normalise a submitted `order` into the JSON object shape
 * ({ artist_page_order, exhibition_page_order, art_fair_page_order }).
 * Returns undefined when the key wasn't submitted, or null when every
 * page order is empty (so we don't store empty objects).
 */
const cleanArtworkOrder = (value) => {
  if (value === undefined) return undefined;
  const normalised = normalizeArtworkOrder(value);
  const hasValue = Object.values(normalised).some((v) => v !== '');
  return hasValue ? normalised : null;
};

/**
 * Artwork covers live under two names: the DB rows (and the public pages)
 * store/read `cover_image_url`, while the legacy manager code asks for
 * `cover_img_url`. READ side: mirror the two so every consumer finds the
 * image. WRITE side: keep a single canonical field on disk
 * (`cover_image_url`) so the document matches `prisma/schema.prisma`.
 */
const mirrorCoverFields = (data) => {
  if (!data || typeof data !== 'object') return data;
  const url = data.cover_image_url || data.cover_img_url || '';
  if (!url) return data;
  return { ...data, cover_image_url: url, cover_img_url: url };
};

/** Write side — collapse the two cover names into the canonical one. */
const canonicalCoverFields = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (!('cover_image_url' in data) && !('cover_img_url' in data)) return data;
  const out = { ...data };
  const url = out.cover_image_url || out.cover_img_url || '';
  delete out.cover_img_url;
  out.cover_image_url = url;
  return out;
};

export const artworkApiConfig = {
  // Basic configuration
  collectionName: 'Artwork',

  // Pagination settings
  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,

  // Feature flags
  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: false,
  enableAutoFillArtist: false,

  // Sorting
  // `order` is a JSON object — sort by the artist-page position (the key the
  // artwork order page writes) so the list stays deterministic.
  defaultSortField: 'order.artist_page_order',
  defaultSortOrder: 1,

  // Schema configuration — fully matches Prisma Artwork model
  requiredFields: [],
  uniqueFields: [],
  searchableFields: ['title', 'artist', 'caption', 'type', 'medium', 'series'],
  arrayFields: ['introduction', 'related_exhibition','tag'],   // 添加了 related_exhibition
  // `order` is a JSON object now (artist_page_order / exhibition_page_order /
  // art_fair_page_order) — keep it as an object, never stringify it.
  jsonFields: ['order', 'mark'],
  validFields: [
    'id',                                // 改为 id（原 _id 为数据库映射名，Prisma 字段名为 id）
    'cover_img_url',
    'cover_image_url',   // seed name — mirrored with cover_img_url (see above)
    'artist',
    'title',
    'type',
    'medium',
    'year',
    'size',
    'series',
    'caption',
    'duration',
    'credits',
    'special_thanks',
    'introduction',
    'video_url',
    'web_url',
    'work_value',
    'sold',
    'order',
    'mark',
    'language',
    'updatedAt',
  ],

  // Custom validation
  customValidation: async (data, operation) => {
    return { valid: true };
  },

  // Before hooks
  beforeCreate: async (data) => {
    data = canonicalCoverFields(data);
    if (data && 'order' in data) data.order = cleanArtworkOrder(data.order);
    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    if (data && 'order' in data) data.order = cleanArtworkOrder(data.order);
    // Mirror the cover fields without touching anything else (never echo
    // `_id`/`id` back into an update).
    if (data && ('cover_image_url' in data || 'cover_img_url' in data)) {
      const cover =
        data.cover_image_url || data.cover_img_url || existing?.cover_image_url || existing?.cover_img_url || '';
      delete data.cover_img_url;
      data.cover_image_url = cover;
    }
    return data;
  },

  // Response transform — the list handler hands over the WHOLE array, the
  // single-item handler one object, so handle both.
  transformResponse: async (data) =>
    Array.isArray(data) ? data.map(mirrorCoverFields) : mirrorCoverFields(data),
};
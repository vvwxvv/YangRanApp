// exhibitionApiConfig.js — 适配 Prisma Exhibition 模型（related_artwork 为 JSON 对象数组，清洗逻辑对齐 ArtistContact.social_media）
/**
 * related_artwork is a plain STRING array of artwork titles — the same shape the
 * artwork form uses for related_exhibition. Older rows stored
 * `[{ title, order, mark }]`; those are collapsed to their title.
 *
 * Ordering is NOT stored here any more: the position of a work inside an
 * exhibition comes from that artwork's own `order.exhibition_page_order`, set
 * on the artwork order page.
 */
const normalizeRelatedArtwork = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => (item && typeof item === 'object' ? item.title : item))
    .map((title) => String(title ?? '').trim())
    .filter(Boolean);

export const exhibitionApiConfig = {
  // Basic configuration
  collectionName: 'Exhibition',

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
  defaultSortField: 'order',
  defaultSortOrder: 1,

  // Schema configuration — matches Prisma Exhibition model
  requiredFields: [],
  uniqueFields: [],
  searchableFields: [
    'title',
    'subtitle',
    'venue',
    'location',
    'curator',
    'organiser',
    'participating_artists',
    'related_artist',
    'caption',
    'description',
    'type',
  ],
  // related_artwork 不在此列 —— 它是 JSON 对象数组，在 before hooks 里
  // inline 清洗（对齐 social_media 的做法），不走通用字符串数组处理。
  arrayFields: [
    'introduction',
    'press_release',
    'related_artist',
    // Related artworks are picked from the artwork list → plain string array
    // of titles (same shape as related_artist).
    'related_artwork',
  ],
  jsonFields: ['mark'],
  validFields: [
    '_id',
    'cover_img_url',
    'title',
    'subtitle',
    'type',
    'date_start',
    'date_end',
    'opening_date',
    'year',
    'venue',
    'location',
    'curator',
    'organiser',
    'participating_artists',
    'caption',
    'description',
    'introduction',
    'press_release',
    'related_artwork', // 原 related_artwork_title，现为 JSON 对象数组
    'related_artist',
    'video_url',
    'web_url',
    'language',
    'order',
    'mark',
    'status',
    'updatedAt',
  ],

  // ---- 辅助函数 ----
  _sanitizeUrl(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const v = raw.trim();
    if (!v) return null;
    if (v === 'https://' || v === 'http://') return null;
    if (/^https?:\/\//.test(v)) return v;
    if (v.startsWith('/')) return v;
    return `https://${v}`;
  },

  _processArray(value) {
    if (Array.isArray(value)) {
      return value
        .filter((x) => x != null && x !== '')
        .map((x) => String(x).trim())
        .filter(Boolean);
    }
    if (typeof value === 'string' && value.trim()) {
      return value.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  },

  // 字符串字段统一 trim，空字符串转 null
  _trimStringFields(data, fields) {
    for (const field of fields) {
      if (!(field in data)) continue;
      if (typeof data[field] === 'string') {
        data[field] = data[field].trim() || null;
      } else if (data[field] === '') {
        data[field] = null;
      }
    }
    return data;
  },

  // ---- Custom validation ----
  customValidation: async (data, operation) => {
    // 检查日期先后顺序
    if (data.date_start && data.date_end) {
      const start = new Date(data.date_start);
      const end = new Date(data.date_end);
      if (!isNaN(start) && !isNaN(end) && start > end) {
        return { valid: false, error: '开始日期不能晚于结束日期' };
      }
    }
    return { valid: true };
  },

  // ---- Before hooks ----
  beforeCreate: async (data) => {
    // URL 清洗
    const urlFields = ['cover_img_url', 'web_url', 'video_url'];
    for (const field of urlFields) {
      if (field in data) {
        data[field] = exhibitionApiConfig._sanitizeUrl(data[field]);
      }
    }

    // 字符串字段 trim
    const stringFields = [
      'title', 'subtitle', 'type', 'date_start', 'date_end',
      'opening_date', 'year', 'venue', 'location', 'curator',
      'organiser', 'participating_artists', 'caption', 'description',
      'language', 'order', 'status'
    ];
    exhibitionApiConfig._trimStringFields(data, stringFields);

    // 普通字符串数组字段规范化
    const arrayFields = [
      'introduction',
      'press_release',
      'related_artist',
    ];
    for (const field of arrayFields) {
      if (field in data) {
        data[field] = exhibitionApiConfig._processArray(data[field]);
      }
    }

    // related_artwork is normalised by itself (it may arrive as legacy objects).
    if (data.related_artwork !== undefined) {
      data.related_artwork = normalizeRelatedArtwork(data.related_artwork);
    }

    // 如果 language 未设置，默认英文
    if (!data.language) data.language = 'EN';

    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    // URL 清洗
    const urlFields = ['cover_img_url', 'web_url', 'video_url'];
    for (const field of urlFields) {
      if (field in data) {
        data[field] = exhibitionApiConfig._sanitizeUrl(data[field]);
      }
    }

    // 字符串字段 trim
    const stringFields = [
      'title', 'subtitle', 'type', 'date_start', 'date_end',
      'opening_date', 'year', 'venue', 'location', 'curator',
      'organiser', 'participating_artists', 'caption', 'description',
      'language', 'order', 'status'
    ];
    exhibitionApiConfig._trimStringFields(data, stringFields);

    // 普通字符串数组字段规范化
    const arrayFields = [
      'introduction',
      'press_release',
      'related_artist',
    ];
    for (const field of arrayFields) {
      if (field in data) {
        data[field] = exhibitionApiConfig._processArray(data[field]);
      }
    }

    // related_artwork is normalised by itself (it may arrive as legacy objects).
    if (data.related_artwork !== undefined) {
      data.related_artwork = normalizeRelatedArtwork(data.related_artwork);
    }

    return data;
  },

  // ---- Response transform ----
  transformResponse: async (data) => {
    return data;
  },
};
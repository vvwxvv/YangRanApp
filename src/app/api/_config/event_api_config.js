export const eventApiConfig = {
  collectionName: 'Event',

  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,

  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: true,
  enableAutoFillArtist: false,

  defaultSortField: 'year',        // 或改为 'date_time'，按需调整
  defaultSortOrder: -1,

  requiredFields: [],
  uniqueFields: [],
  searchableFields: [
    'title', 'subtitle', 'caption', 'introduction',
    'venue', 'address', 'type', 'host', 'support',
    'special_thanks', 'related_artist', 'web_url', 'video_url'
  ],
  arrayFields: ['introduction', 'related_artist'],
  objectIdArrayFields: [],
  dateFields: ['updatedAt'],
  jsonFields: ['mark'],

  validFields: [
    '_id',
    'cover_img_url',
    'title',
    'subtitle',
    'year',
    'date_time',
    'type',
    'host',
    'support',
    'special_thanks',
    'venue',
    'address',
    'caption',
    'introduction',
    'related_artist',
    'web_url',
    'video_url',
    'mark',
    'order',
    'language',
    'updatedAt',
  ],

  _sanitizeUrl(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const v = raw.trim();
    if (!v) return null;
    if (v === 'https://' || v === 'http://') return null;
    if (/^https?:\/\//.test(v)) return v;
    if (v.startsWith('/')) return v;
    return `https://${v}`;
  },

  customValidation: async function (data, operation) {
    if (data.year && data.year !== '') {
      const n = parseInt(data.year, 10);
      if (isNaN(n) || n < 1900 || n > 2100) {
        return { valid: false, error: 'Year must be between 1900 and 2100' };
      }
    }

    if (data.language && !['EN', 'CN'].includes(data.language)) {
      return { valid: false, error: 'Language must be either EN or CN' };
    }

    // 验证 URL 字段（cover_img_url, web_url, video_url）
    const urlFields = ['cover_img_url', 'web_url', 'video_url'];
    for (const field of urlFields) {
      if (data[field]) {
        const val = data[field];
        if (!val.startsWith('/') && /^https?:\/\//.test(val)) {
          if (val.length > 2048) {
            return { valid: false, error: `${field} cannot exceed 2048 characters` };
          }
          try { new URL(val); }
          catch { return { valid: false, error: `Invalid URL format for ${field}: "${val}"` }; }
        }
      }
    }

    if (Array.isArray(data.introduction) && data.introduction.length > 100) {
      return { valid: false, error: 'Introduction cannot have more than 100 items' };
    }
    if (Array.isArray(data.related_artist) && data.related_artist.length > 100) {
      return { valid: false, error: 'Related artist cannot have more than 100 items' };
    }

    return { valid: true };
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

  beforeCreate: async function (data) {
    // 处理 URL 字段
    const urlFields = ['cover_img_url', 'web_url', 'video_url'];
    for (const field of urlFields) {
      if (field in data) {
        data[field] = this._sanitizeUrl(data[field]);
      }
    }

    // 普通字符串字段（去除首尾空格，空字符串转为 null）
    const stringFields = [
      'title', 'subtitle', 'year', 'date_time',
      'type', 'host', 'support', 'special_thanks',
      'venue', 'address', 'caption', 'order', 'language'
    ];
    for (const field of stringFields) {
      if (!(field in data)) continue;
      if (typeof data[field] === 'string') {
        data[field] = data[field].trim() || null;
      } else if (data[field] === '') {
        data[field] = null;
      }
    }

    // 处理数组字段
    data.introduction = this._processArray(data.introduction);
    data.related_artist = this._processArray(data.related_artist);

    // 确保 year 为字符串
    if (data.year) data.year = String(data.year);
    if (!data.language) data.language = 'EN';

    return data;
  },

  beforeUpdate: async function (id, data, existing) {
    // 处理 URL 字段
    const urlFields = ['cover_img_url', 'web_url', 'video_url'];
    for (const field of urlFields) {
      if (field in data) {
        data[field] = this._sanitizeUrl(data[field]);
      }
    }

    // 普通字符串字段
    const stringFields = [
      'title', 'subtitle', 'year', 'date_time',
      'type', 'host', 'support', 'special_thanks',
      'venue', 'address', 'caption', 'order', 'language'
    ];
    for (const field of stringFields) {
      if (!(field in data)) continue;
      if (typeof data[field] === 'string') {
        data[field] = data[field].trim() || null;
      } else if (data[field] === '') {
        data[field] = null;
      }
    }

    // 处理数组字段
    if ('introduction' in data) {
      data.introduction = this._processArray(data.introduction);
    }
    if ('related_artist' in data) {
      data.related_artist = this._processArray(data.related_artist);
    }

    // 确保 year 为字符串
    if ('year' in data && data.year) {
      data.year = String(data.year);
    } else if (data.year === '') {
      data.year = null;
    }

    return data;
  },
};
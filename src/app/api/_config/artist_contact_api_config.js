export const ArtistContactApiConfig = {
  collectionName: 'ArtistContact',

  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,

  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: false,
  enableAutoFillArtist: false,

  defaultSortField: 'artist_name',
  defaultSortOrder: 1,

  requiredFields: [],
  uniqueFields: ['email'],
  searchableFields: ['artist_name', 'email', 'phone', 'address'],
  arrayFields: ['address', 'social_media'],
  objectIdArrayFields: [],
  dateFields: [],
  validFields: [
    '_id',
    'artist_name',
    'email',
    'phone',
    'address',
    'social_media',
    'web_url',
    'language',
  ],

  customValidation: async (data, operation) => {
    // Lenient by design: accept ANY input and let beforeCreate/beforeUpdate
    // normalize it (lowercase email, prefix https:// on URLs, drop empty
    // social_media entries). We intentionally do NOT reject on format here
    // so the admin can save a partial / loosely-typed record with no friction.
    return { valid: true };
  },

  // 处理可能传入的 ObjectId 数组（本模型无此类字段，保留空函数）
  processObjectIdArray: (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .filter(item => item !== null && item !== undefined && item !== '')
        .map(item => String(item).trim())
        .filter(item => item.length === 24 && item.match(/^[0-9a-fA-F]{24}$/));
    }
    if (typeof value === 'string' && value.trim() !== '') {
      return value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length === 24 && item.match(/^[0-9a-fA-F]{24}$/));
    }
    return [];
  },

  beforeCreate: async (data) => {
    // 处理artist_name
    if (data.artist_name !== undefined && data.artist_name !== null) {
      data.artist_name = String(data.artist_name).trim() || null;
    }

    // 处理 opening_time
    if (data.opening_time !== undefined && data.opening_time !== null) {
      data.opening_time = String(data.opening_time).trim() || null;
    }

    // 处理 email
    if (data.email !== undefined && data.email !== null) {
      data.email = String(data.email).trim().toLowerCase() || null;
    }

    // 处理 phone
    if (data.phone !== undefined && data.phone !== null) {
      data.phone = String(data.phone).trim() || null;
    }

    // 处理 address 数组
    if (data.address !== undefined) {
      if (Array.isArray(data.address)) {
        data.address = data.address
          .filter(item => item !== null && item !== undefined && String(item).trim() !== '')
          .map(item => String(item).trim());
      } else if (typeof data.address === 'string' && data.address.trim() !== '') {
        data.address = data.address
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else {
        data.address = [];
      }
    }

    // 处理 social_media 数组（对象数组）
    if (data.social_media !== undefined) {
      if (Array.isArray(data.social_media)) {
        data.social_media = data.social_media
          .filter(item => item !== null && typeof item === 'object')
          .map(item => {
            const { platform, account, url } = item;
            const newItem = {};
            if (platform) newItem.platform = String(platform).trim();
            if (account) newItem.account = String(account).trim();
            if (url) {
              let urlTrim = String(url).trim();
              if (urlTrim && !urlTrim.match(/^https?:\/\//)) {
                urlTrim = `https://${urlTrim}`;
              }
              if (urlTrim === 'https://' || urlTrim === '') urlTrim = null;
              newItem.url = urlTrim;
            }
            return newItem;
          })
          .filter(item => item.platform && item.account && item.url);
      } else {
        data.social_media = [];
      }
    }

    // 处理 web_url
    if (data.web_url !== undefined && data.web_url !== null) {
      let url = String(data.web_url).trim();
      if (url && !url.match(/^https?:\/\//)) {
        url = `https://${url}`;
      }
      if (url === 'https://' || url === '') {
        url = null;
      }
      data.web_url = url;
    } else if (data.web_url === '') {
      data.web_url = null;
    }

    // 语言默认 EN
    if (!data.language) {
      data.language = 'EN';
    } else {
      data.language = String(data.language).trim().toUpperCase();
      if (!['EN', 'CN'].includes(data.language)) {
        data.language = 'EN';
      }
    }

    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    // 与 beforeCreate 逻辑相同，但只处理传入的字段
    if (data.artist_name !== undefined) {
      data.artist_name = data.artist_name ? String(data.artist_name).trim() : null;
    }
    if (data.opening_time !== undefined) {
      data.opening_time = data.opening_time ? String(data.opening_time).trim() : null;
    }
    if (data.email !== undefined) {
      data.email = data.email ? String(data.email).trim().toLowerCase() : null;
    }
    if (data.phone !== undefined) {
      data.phone = data.phone ? String(data.phone).trim() : null;
    }
    if (data.address !== undefined) {
      if (Array.isArray(data.address)) {
        data.address = data.address
          .filter(item => item !== null && item !== undefined && String(item).trim() !== '')
          .map(item => String(item).trim());
      } else if (typeof data.address === 'string' && data.address.trim() !== '') {
        data.address = data.address
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else {
        data.address = [];
      }
    }
    if (data.social_media !== undefined) {
      if (Array.isArray(data.social_media)) {
        data.social_media = data.social_media
          .filter(item => item !== null && typeof item === 'object')
          .map(item => {
            const { platform, account, url } = item;
            const newItem = {};
            if (platform) newItem.platform = String(platform).trim();
            if (account) newItem.account = String(account).trim();
            if (url) {
              let urlTrim = String(url).trim();
              if (urlTrim && !urlTrim.match(/^https?:\/\//)) {
                urlTrim = `https://${urlTrim}`;
              }
              if (urlTrim === 'https://' || urlTrim === '') urlTrim = null;
              newItem.url = urlTrim;
            }
            return newItem;
          })
          .filter(item => item.platform && item.account && item.url);
      } else {
        data.social_media = [];
      }
    }
    if (data.web_url !== undefined) {
      if (data.web_url && typeof data.web_url === 'string') {
        let url = data.web_url.trim();
        if (url && !url.match(/^https?:\/\//)) {
          url = `https://${url}`;
        }
        if (url === 'https://' || url === '') {
          url = null;
        }
        data.web_url = url;
      } else {
        data.web_url = null;
      }
    }
    if (data.language !== undefined) {
      if (data.language) {
        data.language = String(data.language).trim().toUpperCase();
        if (!['EN', 'CN'].includes(data.language)) {
          data.language = 'EN';
        }
      } else {
        data.language = 'EN';
      }
    }

    return data;
  }
};
export const aboutApiConfig = {
  collectionName: 'About',

  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,

  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: false,
  enableAutoFillArtist: true,

  defaultSortField: 'order',
  defaultSortOrder: -1,

  requiredFields: [],
  uniqueFields: [],
  searchableFields: ['mark'],
  arrayFields: ['introductions'],
  objectIdArrayFields: [],
  dateFields: [],
  jsonFields: ['mark'],
  validFields: [
    '_id',
    'portrait_image_url',
    'artist',
    'caption',
    'introductions',
    'pdf_url',
    'web_url',           // 新增
    'language',
    'order',
    'mark',
  ],

  customValidation: async (data, operation) => {
    if (data.language && !['EN', 'CN'].includes(data.language)) {
      return { valid: false, error: 'Language must be either EN or CN' };
    }
    // 验证 portrait_image_url
    if (data.portrait_image_url && data.portrait_image_url !== null && String(data.portrait_image_url).trim() !== '') {
      const urlToValidate = String(data.portrait_image_url).trim();
      if (urlToValidate.match(/^https?:\/\//)) {
        try {
          new URL(urlToValidate);
        } catch (error) {
          return { valid: false, error: 'Invalid URL format for portrait_image_url' };
        }
      }
      if (urlToValidate.length > 2048) {
        return { valid: false, error: 'portrait_image_url cannot exceed 2048 characters' };
      }
    }
    // 验证 pdf_url
    if (data.pdf_url && data.pdf_url !== null && String(data.pdf_url).trim() !== '') {
      const urlToValidate = String(data.pdf_url).trim();
      if (urlToValidate.match(/^https?:\/\//)) {
        try {
          new URL(urlToValidate);
        } catch (error) {
          return { valid: false, error: 'Invalid URL format for pdf_url' };
        }
      }
      if (urlToValidate.length > 2048) {
        return { valid: false, error: 'pdf_url cannot exceed 2048 characters' };
      }
    }
    // 验证 web_url（与上述相同规则）
    if (data.web_url && data.web_url !== null && String(data.web_url).trim() !== '') {
      const urlToValidate = String(data.web_url).trim();
      if (urlToValidate.match(/^https?:\/\//)) {
        try {
          new URL(urlToValidate);
        } catch (error) {
          return { valid: false, error: 'Invalid URL format for web_url' };
        }
      }
      if (urlToValidate.length > 2048) {
        return { valid: false, error: 'web_url cannot exceed 2048 characters' };
      }
    }
    if (data.introductions && Array.isArray(data.introductions) && data.introductions.length > 100) {
      return { valid: false, error: 'Introductions cannot have more than 100 items' };
    }
    return { valid: true };
  },

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
    // 处理 portrait_image_url
    if (data.portrait_image_url !== undefined && data.portrait_image_url !== null) {
      if (typeof data.portrait_image_url === 'string') {
        data.portrait_image_url = data.portrait_image_url.trim();
        if (data.portrait_image_url && !data.portrait_image_url.match(/^https?:\/\//)) {
          data.portrait_image_url = `https://${data.portrait_image_url}`;
        }
        if (data.portrait_image_url === 'https://' || data.portrait_image_url === '') {
          data.portrait_image_url = null;
        }
      }
    } else if (data.portrait_image_url === '') {
      data.portrait_image_url = null;
    }

    // 处理 pdf_url
    if (data.pdf_url !== undefined && data.pdf_url !== null) {
      if (typeof data.pdf_url === 'string') {
        data.pdf_url = data.pdf_url.trim();
        if (data.pdf_url && !data.pdf_url.match(/^https?:\/\//)) {
          data.pdf_url = `https://${data.pdf_url}`;
        }
        if (data.pdf_url === 'https://' || data.pdf_url === '') {
          data.pdf_url = null;
        }
      }
    } else if (data.pdf_url === '') {
      data.pdf_url = null;
    }

    // 处理 web_url（新增）
    if (data.web_url !== undefined && data.web_url !== null) {
      if (typeof data.web_url === 'string') {
        data.web_url = data.web_url.trim();
        if (data.web_url && !data.web_url.match(/^https?:\/\//)) {
          data.web_url = `https://${data.web_url}`;
        }
        if (data.web_url === 'https://' || data.web_url === '') {
          data.web_url = null;
        }
      }
    } else if (data.web_url === '') {
      data.web_url = null;
    }

    const stringFields = ['caption'];
    for (const field of stringFields) {
      if (data[field] && typeof data[field] === 'string') {
        data[field] = data[field].trim() || null;
      } else if (data[field] === '') {
        data[field] = null;
      }
    }

    if (data.introductions) {
      if (Array.isArray(data.introductions)) {
        data.introductions = data.introductions
          .filter(item => item !== null && item !== undefined && item !== '')
          .map(item => String(item).trim())
          .filter(item => item.length > 0);
      } else if (typeof data.introductions === 'string' && data.introductions.trim() !== '') {
        data.introductions = data.introductions
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else {
        data.introductions = [];
      }
    }

    if (!data.language) {
      data.language = 'EN';
    }

    if (!data.order || data.order === '') {
      data.order = '0';
    } else {
      data.order = String(data.order);
    }

    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    // 处理 portrait_image_url
    if (data.portrait_image_url !== undefined) {
      if (data.portrait_image_url && typeof data.portrait_image_url === 'string') {
        data.portrait_image_url = data.portrait_image_url.trim();
        if (data.portrait_image_url && !data.portrait_image_url.match(/^https?:\/\//)) {
          data.portrait_image_url = `https://${data.portrait_image_url}`;
        }
        if (data.portrait_image_url === 'https://' || data.portrait_image_url === '') {
          data.portrait_image_url = null;
        }
      } else if (data.portrait_image_url === '') {
        data.portrait_image_url = null;
      }
    }

    // 处理 pdf_url
    if (data.pdf_url !== undefined) {
      if (data.pdf_url && typeof data.pdf_url === 'string') {
        data.pdf_url = data.pdf_url.trim();
        if (data.pdf_url && !data.pdf_url.match(/^https?:\/\//)) {
          data.pdf_url = `https://${data.pdf_url}`;
        }
        if (data.pdf_url === 'https://' || data.pdf_url === '') {
          data.pdf_url = null;
        }
      } else if (data.pdf_url === '') {
        data.pdf_url = null;
      }
    }

    // 处理 web_url（新增）
    if (data.web_url !== undefined) {
      if (data.web_url && typeof data.web_url === 'string') {
        data.web_url = data.web_url.trim();
        if (data.web_url && !data.web_url.match(/^https?:\/\//)) {
          data.web_url = `https://${data.web_url}`;
        }
        if (data.web_url === 'https://' || data.web_url === '') {
          data.web_url = null;
        }
      } else if (data.web_url === '') {
        data.web_url = null;
      }
    }

    const stringFields = ['caption'];
    for (const field of stringFields) {
      if (data[field] !== undefined) {
        if (data[field] && typeof data[field] === 'string') {
          data[field] = data[field].trim() || null;
        } else if (data[field] === '') {
          data[field] = null;
        }
      }
    }

    if (data.introductions !== undefined) {
      if (Array.isArray(data.introductions)) {
        data.introductions = data.introductions
          .filter(item => item !== null && item !== undefined && item !== '')
          .map(item => String(item).trim())
          .filter(item => item.length > 0);
      } else if (typeof data.introductions === 'string' && data.introductions.trim() !== '') {
        data.introductions = data.introductions
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else {
        data.introductions = [];
      }
    }

    if (data.order !== undefined && data.order !== null && data.order !== '') {
      data.order = String(data.order);
    } else if (data.order === '') {
      data.order = '0';
    }

    return data;
  }
};
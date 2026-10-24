export const webApiConfig = {
  // Basic configuration
  collectionName: 'Web',

  // Pagination settings
  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,

  // Feature flags
  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: true,

  // Sorting
  defaultSortField: 'updatedAt',
  defaultSortOrder: -1,

  // Schema configuration
  requiredFields: [], // No required fields in the Prisma model
  uniqueFields: [], // No unique constraints in the Prisma model
  searchableFields: ['web_url', 'cover_img_url', 'type', 'tag_en', 'tag_cn', 'caption_en', 'caption_cn', 'mark', 'order'],
  arrayFields: [], // No array fields in the Prisma model
  objectIdArrayFields: [], // No ObjectId array fields in the Prisma model
  dateFields: ['updatedAt'],
  jsonFields: ['mark'],
  validFields: [
    '_id',
    'web_url',
    'cover_img_url',
    'type',
    'tag_en',
    'tag_cn',
    'caption_en',
    'caption_cn',
    'mark',
    'order',
    'updatedAt'
  ],

  // Valid types
  validTypes: [
    'portfolio',
    'gallery',
    'exhibition',
    'publication',
    'interview',
    'review',
    'news',
    'social',
    'shop',
    'other'
  ],

  // Custom validation - runs AFTER beforeCreate/beforeUpdate
  customValidation: async (data, operation) => {
    // No validation needed - accept all string values like video does
    return { valid: true };
  },

  // Helper function to process ObjectId arrays (for future use)
  processObjectIdArray: (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .filter(item => item !== null && item !== undefined && item !== '')
        .map(item => String(item).trim())
        .filter(item => item.length === 24 && item.match(/^[0-9a-fA-F]{24}$/));
    }

    if (typeof value === 'string' && value.trim() !== '') {
      // Handle comma-separated string of ObjectIds
      return value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length === 24 && item.match(/^[0-9a-fA-F]{24}$/));
    }

    return [];
  },

  // Custom hooks
  beforeCreate: async (data) => {
    console.log(' WEB beforeCreate - Raw data:', JSON.stringify(data, null, 2));

    // Filter out invalid fields
    const validFieldsSet = new Set(webApiConfig.validFields);
    const cleanedData = {};
    for (const key of Object.keys(data)) {
      if (validFieldsSet.has(key) || key === 'id') {
        cleanedData[key] = data[key];
      } else {
        console.log(` WEB beforeCreate - Filtering out invalid field: ${key}`);
      }
    }
    data = cleanedData;

    // Process web_url - convert empty to null, add https if needed
    if (data.web_url !== undefined) {
      if (data.web_url === '' || data.web_url === null) {
        data.web_url = null;
      } else if (typeof data.web_url === 'string') {
        data.web_url = data.web_url.trim();
        if (data.web_url === '') {
          data.web_url = null;
        } else if (!data.web_url.match(/^https?:\/\//)) {
          data.web_url = `https://${data.web_url}`;
        }
      }
    }

    // Process cover_img_url - convert empty to null, add https if needed
    if (data.cover_img_url !== undefined) {
      if (data.cover_img_url === '' || data.cover_img_url === null) {
        data.cover_img_url = null;
      } else if (typeof data.cover_img_url === 'string') {
        data.cover_img_url = data.cover_img_url.trim();
        if (data.cover_img_url === '') {
          data.cover_img_url = null;
        } else if (!data.cover_img_url.match(/^https?:\/\//)) {
          data.cover_img_url = `https://${data.cover_img_url}`;
        }
      }
    }

    // Process string fields - trim and convert empty to null
    const stringFields = ['type', 'tag_en', 'tag_cn', 'caption_en', 'caption_cn'];
    for (const field of stringFields) {
      if (data[field] !== undefined) {
        if (data[field] === '' || data[field] === null) {
          data[field] = null;
        } else if (typeof data[field] === 'string') {
          data[field] = data[field].trim();
          if (data[field] === '') {
            data[field] = null;
          }
        }
      }
    }

    // Set default order if not provided
    if (!data.order || data.order === '') {
      data.order = '0';
    } else {
      data.order = String(data.order);
    }

    console.log(' WEB beforeCreate - Processed data:', JSON.stringify(data, null, 2));
    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    console.log(' WEB beforeUpdate - Raw data:', JSON.stringify(data, null, 2));
    console.log(' WEB beforeUpdate - Existing:', JSON.stringify(existing, null, 2));

    // Filter out invalid fields
    const validFieldsSet = new Set(webApiConfig.validFields);
    const cleanedData = {};
    for (const key of Object.keys(data)) {
      if (validFieldsSet.has(key) || key === 'id' || key === '_id') {
        cleanedData[key] = data[key];
      } else {
        console.log(` WEB beforeUpdate - Filtering out invalid field: ${key}`);
      }
    }
    data = cleanedData;

    // Process web_url
    if (data.web_url !== undefined) {
      if (data.web_url === '' || data.web_url === null) {
        data.web_url = null;
      } else if (typeof data.web_url === 'string') {
        data.web_url = data.web_url.trim();
        if (data.web_url === '') {
          data.web_url = null;
        } else if (!data.web_url.match(/^https?:\/\//)) {
          data.web_url = `https://${data.web_url}`;
        }
      }
    }

    // Process cover_img_url
    if (data.cover_img_url !== undefined) {
      if (data.cover_img_url === '' || data.cover_img_url === null) {
        data.cover_img_url = null;
      } else if (typeof data.cover_img_url === 'string') {
        data.cover_img_url = data.cover_img_url.trim();
        if (data.cover_img_url === '') {
          data.cover_img_url = null;
        } else if (!data.cover_img_url.match(/^https?:\/\//)) {
          data.cover_img_url = `https://${data.cover_img_url}`;
        }
      }
    }

    // Process string fields - trim and convert empty to null
    const stringFields = ['type', 'tag_en', 'tag_cn', 'caption_en', 'caption_cn'];
    for (const field of stringFields) {
      if (data[field] !== undefined) {
        if (data[field] === '' || data[field] === null) {
          data[field] = null;
        } else if (typeof data[field] === 'string') {
          data[field] = data[field].trim();
          if (data[field] === '') {
            data[field] = null;
          }
        }
      }
    }

    // Process order field - convert to string
    if (data.order !== undefined) {
      if (data.order === null || data.order === '') {
        data.order = '0';
      } else {
        data.order = String(data.order);
      }
    }

    console.log(' WEB beforeUpdate - Processed data:', JSON.stringify(data, null, 2));
    return data;
  },

  // For batch operations
  beforeBatchUpdate: async (items) => {
    // Ensure order is a string for all items
    return items.map(item => {
      if (item.order !== undefined && item.order !== null) {
        item.order = String(item.order);
      }
      return item;
    });
  },

  // Delete hooks
  beforeDelete: async (id) => {
    console.log('Web config - Before delete:', id);
    // Don't prevent deletion, just log
    return null;
  },

  afterDelete: async (id, result) => {
    console.log('Web config - After delete:', id, result);
  }
};
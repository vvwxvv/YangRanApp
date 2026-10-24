export const videoApiConfig = {
  // Basic configuration
  collectionName: 'Video',

  // Pagination settings
  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,
  
  // Feature flags
  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: true,
  enableAutoFillArtist: false,
  
  // Sorting
  defaultSortField: 'updatedAt',
  defaultSortOrder: -1,
  
  // Schema configuration
  requiredFields: [], // All fields are optional per Prisma schema
  uniqueFields: [],
  searchableFields: ['video_url', 'cover_img_url', 'tag_en', 'tag_cn', 'type', 'mark', 'caption_en', 'caption_cn'],
  arrayFields: [],
  objectIdArrayFields: [],
  dateFields: ['updatedAt'],
  jsonFields: ['mark'],
  validFields: [
    '_id',
    'video_url',
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
    'performance',
    'documentation',
    'interview',
    'studio',
    'exhibition',
    'process',
    'animation',
    'music',
    'other'
  ],
  
  // Custom validation - runs AFTER beforeCreate/beforeUpdate
  customValidation: async (data, operation) => {
    // No validation needed - accept all string values like web does
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
      return value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length === 24 && item.match(/^[0-9a-fA-F]{24}$/));
    }
    
    return [];
  },
  
  // Custom hooks
  beforeCreate: async (data) => {
    console.log(' VIDEO beforeCreate - Raw data:', JSON.stringify(data, null, 2));
    
    // Filter out invalid fields (like cover_image_url, introduction, language, artist)
    const validFieldsSet = new Set(videoApiConfig.validFields);
    const cleanedData = {};
    for (const key of Object.keys(data)) {
      if (validFieldsSet.has(key) || key === 'id') {
        cleanedData[key] = data[key];
      } else {
        console.log(` VIDEO beforeCreate - Filtering out invalid field: ${key}`);
      }
    }
    data = cleanedData;
    
    // Process video_url - convert empty to null, add https if needed
    if (data.video_url !== undefined) {
      if (data.video_url === '' || data.video_url === null) {
        data.video_url = null;
      } else if (typeof data.video_url === 'string') {
        data.video_url = data.video_url.trim();
        if (data.video_url === '') {
          data.video_url = null;
        } else if (!data.video_url.match(/^https?:\/\//)) {
          data.video_url = `https://${data.video_url}`;
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
    
    console.log(' VIDEO beforeCreate - Processed data:', JSON.stringify(data, null, 2));
    return data;
  },
  
  beforeUpdate: async (id, data, existing) => {
    console.log(' VIDEO beforeUpdate - Raw data:', JSON.stringify(data, null, 2));
    console.log(' VIDEO beforeUpdate - Existing:', JSON.stringify(existing, null, 2));
    
    // Filter out invalid fields (like cover_image_url, introduction, language, artist)
    const validFieldsSet = new Set(videoApiConfig.validFields);
    const cleanedData = {};
    for (const key of Object.keys(data)) {
      if (validFieldsSet.has(key) || key === 'id' || key === '_id') {
        cleanedData[key] = data[key];
      } else {
        console.log(` VIDEO beforeUpdate - Filtering out invalid field: ${key}`);
      }
    }
    data = cleanedData;
    
    // Process video_url
    if (data.video_url !== undefined) {
      if (data.video_url === '' || data.video_url === null) {
        data.video_url = null;
      } else if (typeof data.video_url === 'string') {
        data.video_url = data.video_url.trim();
        if (data.video_url === '') {
          data.video_url = null;
        } else if (!data.video_url.match(/^https?:\/\//)) {
          data.video_url = `https://${data.video_url}`;
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
    
    console.log(' VIDEO beforeUpdate - Processed data:', JSON.stringify(data, null, 2));
    return data;
  },
  
  // For batch operations
  beforeBatchUpdate: async (items) => {
    return items.map(item => {
      if (item.order !== undefined && item.order !== null) {
        item.order = String(item.order);
      }
      return item;
    });
  },
  
  // Delete hooks
  beforeDelete: async (id) => {
    console.log('Video config - Before delete:', id);
    return null;
  },
  
  afterDelete: async (id, result) => {
    console.log('Video config - After delete:', id, result);
  }
};
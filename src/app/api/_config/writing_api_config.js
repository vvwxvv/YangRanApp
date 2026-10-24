// app/api/_config/writing_api_config.js - Writing API Configuration

export const writingApiConfig = {
  // Basic configuration
  collectionName: 'Writing',

  // Pagination settings
  enablePagination: true,
  defaultPageSize: 20,
  maxPageSize: 100,

  // Feature flags
  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: true,
  enableAutoFillAuthor: true,

  // Sorting
  defaultSortField: 'createdAt',
  defaultSortOrder: -1,

  // Schema configuration
  requiredFields: ['title'], // Example: title is required
  uniqueFields: ['id'], // id is unique
  searchableFields: [
    'title',
    'subtitle',
    'author',
    'summary',
    'keywords',
    'category',
    'type',
    'tag',
    'mark',
  ],
  arrayFields: ['paragraphs','tag'],
  dateFields: ['createdAt', 'updatedAt'],
  jsonFields: ['mark'],
  validFields: [
    'id',
    'cover_img_url',
    'author',
    'title',
    'subtitle',
    'summary',
    'keywords',
    'category',
    'type',
    'year',
    'paragraphs',
    'caption',
    'status',
    'mark',
    'tag',
    'language',
    'createdAt',
    'updatedAt',
  ],

  // Custom validation for writing-specific logic
  customValidation: async (data, operation) => {
    // Validate year
    if (data.year && data.year !== '') {
      const yearNum = parseInt(data.year);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
        return { valid: false, error: 'Year must be between 1900 and 2100' };
      }
    }

    // Validate language
    if (data.language && !['EN', 'CN'].includes(data.language)) {
      return { valid: false, error: 'Language must be either EN or CN' };
    }

    // Validate cover_img_url format if provided
    if (data.cover_img_url && data.cover_img_url.trim() !== '') {
      const urlToValidate = data.cover_img_url.trim();
      if (!urlToValidate.match(/^https?:\/\//)) {
        return { valid: false, error: 'Invalid URL format for cover_img_url' };
      }
      if (data.cover_img_url.length > 2048) {
        return { valid: false, error: 'cover_img_url cannot exceed 2048 characters' };
      }
    }

    // Validate readTime
    if (data.readTime !== undefined && data.readTime !== null) {
      const readTimeNum = parseInt(data.readTime);
      if (isNaN(readTimeNum) || readTimeNum < 0 || readTimeNum > 1000) {
        return { valid: false, error: 'readTime must be between 0 and 1000 minutes' };
      }
    }

    // Validate paragraphs array length
    if (data.paragraphs && Array.isArray(data.paragraphs) && data.paragraphs.length > 500) {
      return { valid: false, error: 'Paragraphs cannot have more than 500 items' };
    }

    // Validate summary length
    if (data.summary && data.summary.length > 5000) {
      return { valid: false, error: 'Summary cannot exceed 5000 characters' };
    }

    return { valid: true };
  },

  // Helper function to process string arrays
  processStringArray: (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .filter(item => item !== null && item !== undefined && item !== '')
        .map(item => String(item).trim())
        .filter(item => item.length > 0);
    }

    if (typeof value === 'string' && value.trim() !== '') {
      // Handle comma-separated string
      return value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }

    return [];
  },

  // Custom hooks for writing-specific processing
  beforeCreate: async (data) => {
    // Process cover_img_url - ensure proper format
    if (data.cover_img_url && typeof data.cover_img_url === 'string') {
      data.cover_img_url = data.cover_img_url.trim();
      if (data.cover_img_url && !data.cover_img_url.match(/^https?:\/\//)) {
        data.cover_img_url = `https://${data.cover_img_url}`;
      }
      if (data.cover_img_url === 'https://') {
        data.cover_img_url = null;
      }
    }

    // Process string fields - trim
    const stringFields = [
      'author',
      'title',
      'subtitle',
      'summary',
      'keywords',
      'category',
      'type',
      'caption',
      'status',
      'tag',
    ];
    for (const field of stringFields) {
      if (data[field] && typeof data[field] === 'string') {
        data[field] = data[field].trim() || null;
      }
    }

    // Process tags field for array handling
    if (data.tags !== undefined) {
      data.tags = writingApiConfig.processStringArray(data.tags);
    } else {
      data.tags = [];
    }

    // Process paragraphs field for array handling
    if (data.paragraphs) {
      if (Array.isArray(data.paragraphs)) {
        data.paragraphs = data.paragraphs
          .filter(item => item !== null && item !== undefined && item !== '')
          .map(item => String(item).trim())
          .filter(item => item.length > 0);
      } else if (typeof data.paragraphs === 'string' && data.paragraphs.trim() !== '') {
        data.paragraphs = data.paragraphs
          .split('\n\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else {
        data.paragraphs = [];
      }
    }

    // Ensure year is a string
    if (data.year && data.year !== '') {
      data.year = String(data.year);
    }

    // Set default language if not provided
    if (!data.language) {
      data.language = 'EN';
    }

    // Set default status if not provided
    if (!data.status) {
      data.status = 'draft';
    }

    // Process readTime - ensure it's an integer
    if (data.readTime !== undefined && data.readTime !== null && data.readTime !== '') {
      data.readTime = parseInt(data.readTime) || 0;
    } else {
      data.readTime = 0;
    }

    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    // Process cover_img_url - ensure proper format
    if (data.cover_img_url !== undefined) {
      if (data.cover_img_url && typeof data.cover_img_url === 'string') {
        data.cover_img_url = data.cover_img_url.trim();
        if (data.cover_img_url && !data.cover_img_url.match(/^https?:\/\//)) {
          data.cover_img_url = `https://${data.cover_img_url}`;
        }
        if (data.cover_img_url === 'https://') {
          data.cover_img_url = null;
        }
      } else if (data.cover_img_url === '') {
        data.cover_img_url = null;
      }
    }

    // Process string fields - trim
    const stringFields = [
      'author',
      'title',
      'subtitle',
      'summary',
      'keywords',
      'category',
      'type',
      'caption',
      'status',
      'tag',
    ];
    for (const field of stringFields) {
      if (data[field] !== undefined) {
        if (data[field] && typeof data[field] === 'string') {
          data[field] = data[field].trim() || null;
        } else if (data[field] === '') {
          data[field] = null;
        }
      }
    }

    // Process tags field for array handling
    if (data.tags !== undefined) {
      data.tags = writingApiConfig.processStringArray(data.tags);
    }

    // Process paragraphs field for array handling
    if (data.paragraphs !== undefined) {
      if (Array.isArray(data.paragraphs)) {
        data.paragraphs = data.paragraphs
          .filter(item => item !== null && item !== undefined && item !== '')
          .map(item => String(item).trim())
          .filter(item => item.length > 0);
      } else if (typeof data.paragraphs === 'string' && data.paragraphs.trim() !== '') {
        data.paragraphs = data.paragraphs
          .split('\n\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else {
        data.paragraphs = [];
      }
    }

    // Ensure year is a string
    if (data.year !== undefined && data.year !== null && data.year !== '') {
      data.year = String(data.year);
    }

    // Process readTime - ensure it's an integer
    if (data.readTime !== undefined && data.readTime !== null && data.readTime !== '') {
      data.readTime = parseInt(data.readTime) || 0;
    }

    // Process viewCount - ensure it's an integer
    if (data.viewCount !== undefined && data.viewCount !== null && data.viewCount !== '') {
      data.viewCount = parseInt(data.viewCount) || 0;
    }

    return data;
  },
};
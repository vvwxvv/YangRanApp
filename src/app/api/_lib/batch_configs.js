// Example configurations for batch API shell
// This file shows how to configure the batch API shell for different collections

// Example 1: Artwork batch configuration
export const artworkBatchConfig = {
  collectionName: 'Artwork',
  validFields: [
    'id', 'title', 'description', 'artist', 'year', 'medium', 
    'dimensions', 'category', 'tags', 'image_url', 'order',
    'createdAt', 'updatedAt'
  ],
  requiredFields: ['title'], // Title is required
  uniqueFields: ['title'], // Title must be unique
  arrayFields: ['tags'],
  enableSoftDelete: true,
  
  customValidation: async (data, operation) => {
    // Custom validation for artwork
    if (data.year && (data.year < 1000 || data.year > new Date().getFullYear())) {
      return { valid: false, error: 'Invalid year' };
    }
    return { valid: true };
  },
  
  beforeBatchUpdate: async (items) => {
    // Ensure tags are properly formatted
    return items.map(item => {
      if (item.tags && !Array.isArray(item.tags)) {
        item.tags = item.tags.split(',').map(tag => tag.trim());
      }
      return item;
    });
  }
};

// Example 2: Event batch configuration
export const eventBatchConfig = {
  collectionName: 'Event',
  validFields: [
    'id', 'title', 'description', 'start_date', 'end_date', 
    'location', 'category', 'status', 'order',
    'createdAt', 'updatedAt'
  ],
  requiredFields: ['title', 'start_date'],
  uniqueFields: [],
  arrayFields: [],
  enableSoftDelete: false,
  
  customValidation: async (data, operation) => {
    // Validate date range
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      if (start > end) {
        return { valid: false, error: 'Start date must be before end date' };
      }
    }
    return { valid: true };
  },
  
  beforeBatchUpdate: async (items) => {
    // Format dates
    return items.map(item => {
      if (item.start_date) {
        item.start_date = new Date(item.start_date).toISOString();
      }
      if (item.end_date) {
        item.end_date = new Date(item.end_date).toISOString();
      }
      return item;
    });
  }
};

// Example 3: User batch configuration
export const userBatchConfig = {
  collectionName: 'User',
  validFields: [
    'id', 'username', 'email', 'first_name', 'last_name', 
    'role', 'status', 'permissions', 'last_login',
    'createdAt', 'updatedAt'
  ],
  requiredFields: ['username', 'email'],
  uniqueFields: ['username', 'email'],
  arrayFields: ['permissions'],
  enableSoftDelete: true,
  
  customValidation: async (data, operation) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      return { valid: false, error: 'Invalid email format' };
    }
    return { valid: true };
  },
  
  beforeBatchUpdate: async (items) => {
    // Ensure permissions are properly formatted
    return items.map(item => {
      if (item.permissions && !Array.isArray(item.permissions)) {
        item.permissions = item.permissions.split(',').map(p => p.trim());
      }
      return item;
    });
  }
};

// Example 4: Writing batch configuration
export const writingBatchConfig = {
  collectionName: 'Writing',
  validFields: [
    'id', 'title', 'content', 'author', 'category', 'tags', 
    'published_date', 'status', 'word_count', 'order',
    'createdAt', 'updatedAt'
  ],
  requiredFields: ['title', 'content'],
  uniqueFields: ['title'],
  arrayFields: ['tags'],
  enableSoftDelete: false,
  
  customValidation: async (data, operation) => {
    // Validate word count
    if (data.word_count && data.word_count < 0) {
      return { valid: false, error: 'Word count cannot be negative' };
    }
    return { valid: true };
  },
  
  beforeBatchUpdate: async (items) => {
    // Calculate word count if not provided
    return items.map(item => {
      if (item.content && !item.word_count) {
        item.word_count = item.content.split(/\s+/).length;
      }
      return item;
    });
  }
};


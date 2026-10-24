import bcrypt from 'bcryptjs';

export const userApiConfig = {
  collectionName: 'users',

  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,

  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: false,
  enableAutoFillArtist: false,

  defaultSortField: 'createdAt',
  defaultSortOrder: -1,

  requiredFields: ['username', 'email', 'password'],
  uniqueFields: ['username', 'email'],
  searchableFields: ['username', 'email'],
  arrayFields: [],
  validFields: [
    '_id',
    'username',
    'email',
    'password',
    'lastLoginAt',
    'createdAt',
  ],

  customValidation: async (data, operation) => {
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { valid: false, error: 'Invalid email format' };
      }
    }
    if (operation === 'create' && data.password) {
      if (data.password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters long' };
      }
    }
    return { valid: true };
  },

  beforeCreate: async (data) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    data.lastLoginAt = null;
    if (data.username) {
      data.username = data.username.trim();
    }
    if (data.email) {
      data.email = data.email.trim().toLowerCase();
    }
    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    if (data.password && data.password !== existing.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    if (data.username) {
      data.username = data.username.trim();
    }
    if (data.email) {
      data.email = data.email.trim().toLowerCase();
    }
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }
    }
    return data;
  },

  transformResponse: async (data) => {
    if (Array.isArray(data)) {
      return data.map(item => {
        const { password, ...safeData } = item;
        return safeData;
      });
    }
    const { password, ...safeData } = data;
    return safeData;
  }
};

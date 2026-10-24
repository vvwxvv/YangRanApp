export const subscribeApiConfig = {
  collectionName: 'Subscribe',

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

  requiredFields: ['name', 'email'],
  uniqueFields: ['email'],
  searchableFields: ['name', 'email'],
  arrayFields: [],
  validFields: [
    '_id',
    'name',
    'email',
    'isActive',
    'createdAt',
  ],

  customValidation: async (data, operation) => {
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { valid: false, error: 'Invalid email format' };
      }
    }
    if (data.name && data.name.trim().length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters long' };
    }
    return { valid: true };
  },

  beforeCreate: async (data) => {
    if (data.name) {
      data.name = data.name.trim();
    }
    if (data.email) {
      data.email = data.email.trim().toLowerCase();
    }
    if (data.isActive === undefined) {
      data.isActive = true;
    }
    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    if (data.name) {
      data.name = data.name.trim();
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
    if (data.name && data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    return data;
  }
};

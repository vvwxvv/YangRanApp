export const seriesApiConfig = {
  // Basic configuration
  collectionName: 'Series',

  // Pagination settings
  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,

  // Feature flags
  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: false,
  enableAutoFillArtist: false,   // 有 artist 字段，但沿用 Bibliography 行为，不自动填充

  // Sorting
  defaultSortField: 'order',
  defaultSortOrder: 1,

  // Schema configuration — fully matches Prisma Series model
  requiredFields: [],           // 所有字段均为可选（除自动生成的 id 和 updatedAt）
  uniqueFields: [],             // 无唯一约束
  searchableFields: [
    'title',
    'artist',
    'type',
    'medium',
    'year',
    'caption'
  ],
  arrayFields: ['introduction','tag'],   // 数组字段
  jsonFields: [],                  // mark 为 String?，非 Json
  validFields: [
    'id',                               // Prisma 字段名，数据库映射为 _id
    'cover_img_url',
    'artist',
    'title',
    'type',
    'medium',
    'year',
    'caption',
    'credits',
    'special_thanks',
    'introduction',
    'order',
    'mark',
    'language',
    'updatedAt',
  ],

  // Custom validation (可保留默认实现)
  customValidation: async (data, operation) => {
    return { valid: true };
  },

  // Before hooks
  beforeCreate: async (data) => {
    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    return data;
  },

  // Response transform
  transformResponse: async (data) => {
    return data;
  },
};

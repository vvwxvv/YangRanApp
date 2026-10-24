export const bibliographyApiConfig = {
  // Basic configuration
  collectionName: 'Bibliography',

  // Pagination settings
  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,

  // Feature flags
  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: false,
  enableAutoFillArtist: false,   // 无 artist 字段，保留不影响

  // Sorting
  defaultSortField: 'order',
  defaultSortOrder: 1,

  // Schema configuration — fully matches Prisma Bibliography model
  requiredFields: [],           // 所有字段均为可选（除自动生成的 id 和 updatedAt）
  uniqueFields: [],             // 无唯一约束
  searchableFields: [
    'title',
    'subtitle',
    'author',
    'type',
    'year',
    'date',
    'published_at',
    'related_artist'
  ],
  arrayFields: ['related_exhibition', 'related_artist'],   // 数组字段
  jsonFields: ['mark'],
  validFields: [
    'id',                               // Prisma 字段名，数据库映射为 _id
    'related_exhibition',
    'related_artist',
    'title',
    'subtitle',
    'cover_img_url',
    'author',
    'type',
    'year',
    'date',
    'published_at',
    'pdf_url',
    'web_url',
    'video_url',
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
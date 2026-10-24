import { normalizeImageOrder } from '@/utils/mediaOrder';

/**
 * Normalise a submitted `order` into the JSON object shape
 * ({ artist_page_order, exhibition_page_order, art_fair_page_order,
 * rolling_img_order }). Returns the value unchanged when it wasn't
 * submitted, or null when every page order is empty.
 */
const cleanImageOrder = (value) => {
  if (value === undefined) return undefined;
  const normalised = normalizeImageOrder(value);
  const hasValue = Object.values(normalised).some((v) => v !== '');
  return hasValue ? normalised : null;
};

export const imageApiConfig = {
  collectionName: 'Image',

  enablePagination: false,
  defaultPageSize: 10000,
  maxPageSize: 10000,

  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: true,

  defaultSortField: 'order.rolling_img_order',
  defaultSortOrder: 1,

  requiredFields: [],
  uniqueFields: [],
  searchableFields: ['img_url', 'type', 'tag_en', 'tag_cn', 'caption_en', 'caption_cn', 'mark', 'tag_source'],
  arrayFields: [],
  // `order` is a JSON object now (artist_page_order / exhibition_page_order /
  // art_fair_page_order / rolling_img_order) — keep it as an object.
  jsonFields: ['order', 'mark'],
  objectIdArrayFields: [],
  dateFields: [],
  validFields: [
    '_id',
    'img_url',
    'type',
    'tag_en',
    'tag_cn',
    'caption_en',
    'caption_cn',
    'mark',
    'tag_source',
    'order',
  ],

  validTypes: [
    'artwork', 'photo', 'sketch', 'digital', 'painting',
    'sculpture', 'installation', 'performance', 'documentation', 'other',
  ],

  customValidation: async (data, operation) => {
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
    const validFieldsSet = new Set(imageApiConfig.validFields);
    const cleanedData = {};
    for (const key of Object.keys(data)) {
      if (validFieldsSet.has(key) || key === 'id') {
        cleanedData[key] = data[key];
      }
    }
    data = cleanedData;

    if (data.img_url !== undefined) {
      if (data.img_url === '' || data.img_url === null) {
        data.img_url = null;
      } else if (typeof data.img_url === 'string') {
        data.img_url = data.img_url.trim();
        if (data.img_url === '') {
          data.img_url = null;
        } else if (!data.img_url.match(/^https?:\/\//)) {
          data.img_url = `https://${data.img_url}`;
        }
      }
    }

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

    if ('order' in data) {
      data.order = cleanImageOrder(data.order);
    }

    return data;
  },

  beforeUpdate: async (id, data, existing) => {
    const validFieldsSet = new Set(imageApiConfig.validFields);
    const cleanedData = {};
    for (const key of Object.keys(data)) {
      if (validFieldsSet.has(key) || key === 'id' || key === '_id') {
        cleanedData[key] = data[key];
      }
    }
    data = cleanedData;

    if (data.img_url !== undefined) {
      if (data.img_url === '' || data.img_url === null) {
        data.img_url = null;
      } else if (typeof data.img_url === 'string') {
        data.img_url = data.img_url.trim();
        if (data.img_url === '') {
          data.img_url = null;
        } else if (!data.img_url.match(/^https?:\/\//)) {
          data.img_url = `https://${data.img_url}`;
        }
      }
    }

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

    if ('order' in data) {
      data.order = cleanImageOrder(data.order);
    }

    return data;
  },

  beforeBatchUpdate: async (items) => {
    return items.map(item => {
      if (item && 'order' in item) {
        item.order = cleanImageOrder(item.order);
      }
      return item;
    });
  },

  beforeDelete: async (id) => {
    return null;
  },

  afterDelete: async (id, result) => {},
};

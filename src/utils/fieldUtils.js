// ============================================
// FIELD UTILITY FUNCTIONS
// Reusable field name and key helpers
// ============================================

import { NO_SUFFIX_FIELDS, STATE_KEY_MAP, ALL_LABELS } from '@/components/pages/manager/utils/schemaFilterConstants';

/**
 * Get the actual field name based on language suffix
 * Handles Prisma schema convention: field_en, field_cn
 * @param {string} baseField - Base field name (type, artist, series, etc.)
 * @param {Array<string>} noSuffixFields - Fields that don't have language suffix
 * @returns {string} Actual field name to query (defaults to _cn suffix)
 */
export const getFieldNameWithSuffix = (baseField, noSuffixFields = NO_SUFFIX_FIELDS) => {
  if (noSuffixFields.includes(baseField)) {
    return baseField;
  }
  return `${baseField}_cn`;
};

/**
 * Get both language field names
 * @param {string} baseField - Base field name
 * @returns {object} Object with cn and en field names
 */
export const getBilingualFieldNames = (baseField) => ({
  cn: `${baseField}_cn`,
  en: `${baseField}_en`
});

/**
 * Get state key for a filter field
 * @param {string} field - Field name
 * @param {object} stateKeyMap - Custom state key mapping
 * @returns {string} State key name (e.g., 'selectedType')
 */
export const getStateKey = (field, stateKeyMap = STATE_KEY_MAP) => {
  return stateKeyMap[field] || `selected${capitalizeFirst(field)}`;
};

/**
 * Get handler key for a filter field
 * @param {string} field - Field name
 * @returns {string} Handler key name (e.g., 'handleTypeChangeWithReset')
 */
export const getHandlerKey = (field) => {
  return `handle${capitalizeFirst(field)}ChangeWithReset`;
};

/**
 * Get setter key for a filter field
 * @param {string} field - Field name
 * @returns {string} Setter key name (e.g., 'setSelectedType')
 */
export const getSetterKey = (field) => {
  return `setSelected${capitalizeFirst(field)}`;
};

/**
 * Capitalize first letter of string
 * @param {string} str - Input string
 * @returns {string} String with first letter capitalized
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert camelCase to snake_case
 * @param {string} str - Input string
 * @returns {string} Snake case string
 */
export const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Convert snake_case to camelCase
 * @param {string} str - Input string
 * @returns {string} Camel case string
 */
export const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Field Utilities
 * Reusable functions for field filtering, rendering, and formatting
 */

// Constants
export const HIDDEN_FIELDS_FOR_VISITOR = ['order', 'language', 'mark', 'createdAt', 'updatedAt', 'id', '_id'];

export const TYPOGRAPHY = {
  title: {
    fontSize: '18px',
    lineHeight: '1.4'
  },
  sub: {
    fontSize: '13px',
    lineHeight: '1.3'
  },
  detail: {
    fontSize: '12px'
  }
};

/**
 * Format field key to readable label
 * @param {string} key - Field key (e.g., 'title_en')
 * @returns {string} - Formatted label (e.g., 'Title En')
 */
export const formatFieldLabel = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Check if a field key represents an image
 * @param {string} key - Field key
 * @returns {boolean}
 */
export const isImageField = (key) => {
  const lowerKey = key.toLowerCase();
  return lowerKey.includes('image') || 
         lowerKey.includes('cover') || 
         lowerKey.includes('img') ||
         lowerKey.includes('photo') ||
         lowerKey.includes('picture');
};


/**
 * Check if a field key represents a video
 * @param {string} key - Field key
 * @returns {boolean}
 */
export const isVideoField = (key) => {
  const lowerKey = key.toLowerCase();
  return lowerKey.includes('video') || 
         lowerKey.includes('mp4') ||
         lowerKey.includes('webm');
};

/**
 * Check if a value is empty
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

/**
 * Filter array to remove empty values
 * @param {Array} array - Array to filter
 * @returns {Array} - Filtered array
 */
export const filterEmptyValues = (array) => {
  if (!Array.isArray(array)) return [];
  return array.filter(item => item !== null && item !== undefined && item !== '');
};

/**
 * Generate fields from item keys
 * @param {Object} item - Data item
 * @param {Array} excludeKeys - Keys to exclude
 * @param {number} limit - Maximum number of fields (0 = no limit)
 * @returns {Array} - Array of field objects with key and label
 */
export const generateFieldsFromItem = (item, excludeKeys = [], limit = 0) => {
  const fields = Object.keys(item)
    .filter(key => 
      !HIDDEN_FIELDS_FOR_VISITOR.includes(key) &&
      !excludeKeys.includes(key) &&
      !isEmpty(item[key])
    )
    .map(key => ({
      key,
      label: formatFieldLabel(key)
    }));

  return limit > 0 ? fields.slice(0, limit) : fields;
};

/**
 * Get visible summary fields
 * @param {Object} item - Data item
 * @param {Array} customFields - Custom field configuration
 * @param {string} imageKey - Image field key
 * @param {string} videoKey - Video field key
 * @param {string} titleKey - Title field key
 * @param {string} subtitleKey - Subtitle field key
 * @param {number} limit - Maximum fields to show
 * @returns {Array} - Visible summary fields
 */
export const getVisibleSummaryFields = (
  item, 
  customFields = [], 
  imageKey = 'cover_img_url',
  videoKey = 'video_url',
  titleKey = 'title_en',
  subtitleKey = null,
  limit = 3
) => {
  if (customFields.length > 0) return customFields;
  
  const excludeKeys = [imageKey, videoKey, titleKey];
  if (subtitleKey) excludeKeys.push(subtitleKey);
  
  return generateFieldsFromItem(item, excludeKeys, limit);
};

/**
 * Get visible detail fields
 * @param {Object} item - Data item
 * @param {Array} customFields - Custom field configuration
 * @param {string} imageKey - Image field key
 * @param {string} videoKey - Video field key
 * @param {string} titleKey - Title field key
 * @param {string} subtitleKey - Subtitle field key
 * @returns {Array} - Visible detail fields
 */
export const getVisibleDetailFields = (
  item,
  customFields = [],
  imageKey = 'cover_img_url',
  videoKey = 'video_url',
  titleKey = 'title_en',
  subtitleKey = null
) => {
  if (customFields.length > 0) return customFields;
  
  const excludeKeys = [imageKey, videoKey, titleKey];
  if (subtitleKey) excludeKeys.push(subtitleKey);
  
  return generateFieldsFromItem(item, excludeKeys);
};

/**
 * Format value for display
 * @param {*} value - Value to format
 * @returns {string} - Formatted value
 */
export const formatDisplayValue = (value) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  return String(value);
};

/**
 * Create media info object
 * @param {Object} item - Data item
 * @param {string} imageKey - Image field key
 * @param {string} videoKey - Video field key
 * @returns {Object} - Media info
 */
export const getMediaInfo = (item, imageKey = 'cover_img_url', videoKey = 'video_url') => {
  const imgUrl = item[imageKey];
  const videoUrl = item[videoKey];
  const hasMedia = (imgUrl && imgUrl.trim() !== '') || (videoUrl && videoUrl.trim() !== '');
  const displayUrl = imgUrl && imgUrl.trim() !== '' ? imgUrl : '/error.png';
  const hasVideo = videoUrl && videoUrl.trim() !== '';

  return { imgUrl, videoUrl, hasMedia, displayUrl, hasVideo };
};

/**
 * Create item data object
 * @param {Object} item - Data item
 * @param {string} titleKey - Title field key
 * @param {string} subtitleKey - Subtitle field key
 * @returns {Object} - Item data with title and subtitle
 */
export const getItemData = (item, titleKey = 'title_en', subtitleKey = null) => {
  return {
    title: item[titleKey] || 'Untitled',
    subtitle: subtitleKey ? item[subtitleKey] : null
  };
};

/**
 * Get localized "All" label for a field
 * @param {string} field - Field name
 * @returns {string} Localized "All" label
 */
export const getLocalizedAllLabel = (field) => {
  const labelConfig = ALL_LABELS[field] || ALL_LABELS.default;
  return `${labelConfig.cn} / ${labelConfig.en}`;
};
/**
 * Converts text to a URL-friendly slug
 * @param {string} text - The text to convert
 * @returns {string} The slugified text
 */
export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w_-]/g, '');
};

/**
 * Truncates text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} The truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalizes the first letter of a string
 * @param {string} text - The text to capitalize
 * @returns {string} The capitalized text
 */
export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Normalizes whitespace in text
 * @param {string} text - The text to normalize
 * @returns {string} Text with normalized whitespace
 */
export const normalizeWhitespace = (text) => {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
};
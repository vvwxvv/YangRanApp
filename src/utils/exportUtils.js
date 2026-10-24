// Utility to generate export filename with timestamp
export function generateExportFilename(base = 'export') {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${base}_${timestamp}.xlsx`;
}

/**
 * Validates artwork configuration
 * @param {Object} config - Artwork configuration
 * @returns {boolean} - Whether config is valid
 */
export function validateArtworkConfig(config) {
  return !!(config?.api?.endpoints?.list && config?.api?.endpoints?.delete);
}

/**
 * Safely processes array data with fallback
 * @param {any} data - Raw data
 * @returns {Array} - Safe array
 */
export function safelyProcessData(data) {
  if (!Array.isArray(data)) {
    console.warn('Data is not an array, using empty array fallback');
    return [];
  }
  return data;
}

/**
 * Validates item ID
 * @param {string} id - Item ID
 * @returns {boolean} - Whether ID is valid
 */
export function isValidId(id) {
  return typeof id === 'string' && id.trim().length > 0;
} 
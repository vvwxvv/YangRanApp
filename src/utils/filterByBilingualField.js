/**
 * Filter items by checking if bilingual fields are empty or have values
 * @param {Array} items - Array of items to filter
 * @param {string} cnField - Chinese field name
 * @param {string} enField - English field name
 * @param {string} mode - Filter mode: 'empty' (both empty), 'hasValue' (at least one has value), 'bothHaveValue' (default: 'empty')
 * @returns {Array} - Filtered array
 */
const filterByBilingualField = (items, cnField, enField, mode = 'empty') => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return [];
  }

  return items.filter(item => {
    const cnValue = item?.[cnField];
    const enValue = item?.[enField];
    
    const isCnEmpty = !cnValue || (typeof cnValue === 'string' && cnValue.trim() === '');
    const isEnEmpty = !enValue || (typeof enValue === 'string' && enValue.trim() === '');

    switch (mode) {
      case 'empty':
        // Both fields are empty
        return isCnEmpty && isEnEmpty;
      case 'hasValue':
        // At least one field has value
        return !isCnEmpty || !isEnEmpty;
      case 'bothHaveValue':
        // Both fields have values
        return !isCnEmpty && !isEnEmpty;
      default:
        return isCnEmpty && isEnEmpty;
    }
  });
};


export default filterByBilingualField;
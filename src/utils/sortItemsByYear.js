/**
 * Sort items by year field
 * @param {Array} items - Array of objects containing year data
 * @param {Object} options - Sort options
 * @param {boolean} options.ascending - Sort ascending (oldest first) if true, descending (newest first) if false (default: false)
 * @param {string} options.yearField - Field name for year (default: 'year')
 * @returns {Array} Sorted items array
 */
const sortItemsByYear = (items, options = {}) => {
  const {
    ascending = false,
    yearField = 'year',
  } = options;

  if (!items || !Array.isArray(items)) return [];
  
  return [...items].sort((a, b) => {
    const yearA = Number(a?.[yearField]) || 0;
    const yearB = Number(b?.[yearField]) || 0;
    return ascending ? yearA - yearB : yearB - yearA;
  });
};

export default sortItemsByYear;
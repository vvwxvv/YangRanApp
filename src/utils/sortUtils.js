// ============================================
// SORT UTILITY FUNCTIONS
// Reusable sorting functions for arrays
// ============================================

/**
 * Sort strings alphabetically (case-insensitive)
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Sort comparison result
 */
export const sortAlphabetically = (a, b) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
};

/**
 * Sort strings alphabetically in descending order
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Sort comparison result
 */
export const sortAlphabeticallyDesc = (a, b) => -sortAlphabetically(a, b);

/**
 * Sort years in descending order (newest first)
 * @param {string|number} a - First year
 * @param {string|number} b - Second year
 * @returns {number} Sort comparison result
 */
export const sortYearsDescending = (a, b) => {
  const yearA = parseInt(a) || 0;
  const yearB = parseInt(b) || 0;
  return yearB - yearA;
};

/**
 * Sort years in ascending order (oldest first)
 * @param {string|number} a - First year
 * @param {string|number} b - Second year
 * @returns {number} Sort comparison result
 */
export const sortYearsAscending = (a, b) => {
  const yearA = parseInt(a) || 0;
  const yearB = parseInt(b) || 0;
  return yearA - yearB;
};

/**
 * Sort numbers in descending order
 * @param {string|number} a - First number
 * @param {string|number} b - Second number
 * @returns {number} Sort comparison result
 */
export const sortNumbersDescending = (a, b) => {
  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  return numB - numA;
};

/**
 * Sort numbers in ascending order
 * @param {string|number} a - First number
 * @param {string|number} b - Second number
 * @returns {number} Sort comparison result
 */
export const sortNumbersAscending = (a, b) => {
  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  return numA - numB;
};

/**
 * Sort dates in descending order (newest first)
 * @param {string|Date} a - First date
 * @param {string|Date} b - Second date
 * @returns {number} Sort comparison result
 */
export const sortDatesDescending = (a, b) => {
  const dateA = new Date(a) || 0;
  const dateB = new Date(b) || 0;
  return dateB - dateA;
};

/**
 * Sort dates in ascending order (oldest first)
 * @param {string|Date} a - First date
 * @param {string|Date} b - Second date
 * @returns {number} Sort comparison result
 */
export const sortDatesAscending = (a, b) => {
  const dateA = new Date(a) || 0;
  const dateB = new Date(b) || 0;
  return dateA - dateB;
};

/**
 * Create a sort function for a specific field
 * @param {string} field - Field name to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {function} Sort function
 */
export const createFieldSorter = (field, direction = 'asc') => {
  return (a, b) => {
    const valA = a?.[field];
    const valB = b?.[field];
    const result = sortAlphabetically(valA, valB);
    return direction === 'desc' ? -result : result;
  };
};
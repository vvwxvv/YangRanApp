// ============================================
// FILTER VALUE GENERATORS
// Reusable functions for generating filter options
// ============================================

/**
 * Create basic filter values with ALL option
 * @param {string} allValue - Value for "All" option
 * @returns {object} Filter values object { ALL: allValue }
 */
export const createFilterValues = (allValue = 'all') => ({
  ALL: allValue
});

/**
 * Generate alphabet filter values (A-Z)
 * @param {string} allValue - Value for "All" option
 * @returns {object} Filter values with ALL and A-Z
 */
export const generateAlphabetFilterValues = (allValue = 'all') => {
  const values = { ALL: allValue };
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    values[letter] = letter;
  }
  return values;
};

/**
 * Generate numeric filter values
 * @param {number} start - Start number
 * @param {number} end - End number
 * @param {string} allValue - Value for "All" option
 * @returns {object} Filter values with ALL and numbers
 */
export const generateNumericFilterValues = (start, end, allValue = 'all') => {
  const values = { ALL: allValue };
  for (let i = start; i <= end; i++) {
    values[`N${i}`] = i.toString();
  }
  return values;
};

/**
 * Generate year filter values
 * @param {number} startYear - Start year
 * @param {number} endYear - End year (defaults to current year)
 * @param {string} allValue - Value for "All" option
 * @returns {object} Filter values with ALL and years (descending)
 */
export const generateYearFilterValues = (startYear, endYear = new Date().getFullYear(), allValue = 'all') => {
  const values = { ALL: allValue };
  for (let year = endYear; year >= startYear; year--) {
    values[`Y${year}`] = year.toString();
  }
  return values;
};

/**
 * Generate custom filter values from items array
 * @param {Array<string>} items - Array of filter items
 * @param {string} allValue - Value for "All" option
 * @returns {object} Filter values object
 */
export const generateCustomFilterValues = (items, allValue = 'all') => {
  const values = { ALL: allValue };
  items.forEach(item => {
    const key = item.toUpperCase().replace(/\s+/g, '_');
    values[key] = item;
  });
  return values;
};

/**
 * Generate boolean filter values
 * @param {object} labels - Labels for true/false { true: { cn, en }, false: { cn, en } }
 * @param {string} allValue - Value for "All" option
 * @returns {object} Filter values object
 */
export const generateBooleanFilterValues = (labels, allValue = 'all') => ({
  ALL: allValue,
  TRUE: 'true',
  FALSE: 'false'
});

/**
 * Generate filter values from data array
 * @param {Array} data - Data array
 * @param {string} field - Field to extract values from
 * @param {string} allValue - Value for "All" option
 * @returns {object} Filter values object
 */
export const generateFilterValuesFromData = (data, field, allValue = 'all') => {
  const values = { ALL: allValue };
  const uniqueValues = [...new Set(data.map(item => item?.[field]).filter(Boolean))];
  
  uniqueValues.forEach(value => {
    const key = String(value).toUpperCase().replace(/\s+/g, '_');
    values[key] = value;
  });
  
  return values;
};

// Pre-generated common filter values
export const ALPHABET_FILTER_VALUES = generateAlphabetFilterValues('all');
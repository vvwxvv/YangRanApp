/**
 * Alphabet Pagination Utility
 * Provides reusable functions for paginating data by alphabet letters
 */

// ============================================================
// CONSTANTS
// ============================================================

/**
 * Standard alphabet letters for pagination
 */
export const ALPHABET_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

/**
 * Special filter values
 */
export const ALPHABET_FILTER_VALUES = {
  ALL: 'all',
  NUMERIC: '#',
  OTHER: '?',
};

/**
 * Get the first letter of a string (uppercase)
 * @param {string} value - The string to get the first letter from
 * @returns {string} The first letter (uppercase) or '#' for numbers, '?' for other
 */
export const getFirstLetter = (value) => {
  if (!value || typeof value !== 'string') return ALPHABET_FILTER_VALUES.OTHER;
  
  const trimmed = value.trim();
  if (!trimmed) return ALPHABET_FILTER_VALUES.OTHER;
  
  const firstChar = trimmed.charAt(0).toUpperCase();
  
  // Check if it's a letter
  if (/^[A-Z]$/.test(firstChar)) {
    return firstChar;
  }
  
  // Check if it's a number
  if (/^[0-9]$/.test(firstChar)) {
    return ALPHABET_FILTER_VALUES.NUMERIC;
  }
  
  // Check if it's a Chinese character
  if (/[\u4e00-\u9fa5]/.test(firstChar)) {
    return ALPHABET_FILTER_VALUES.OTHER;
  }
  
  return ALPHABET_FILTER_VALUES.OTHER;
};

/**
 * Get unique letters that exist in the data
 * @param {Array} data - The data array
 * @param {string} field - The field to extract letters from
 * @returns {Array} Array of unique letters found in the data
 */
export const getAvailableLetters = (data, field) => {
  if (!Array.isArray(data) || !field) return [];
  
  const letterSet = new Set();
  
  data.forEach(item => {
    if (item && item[field]) {
      const letter = getFirstLetter(item[field]);
      letterSet.add(letter);
    }
  });
  
  // Sort letters: A-Z first, then #, then ?
  const letters = Array.from(letterSet).sort((a, b) => {
    if (a === ALPHABET_FILTER_VALUES.NUMERIC) return 1;
    if (b === ALPHABET_FILTER_VALUES.NUMERIC) return -1;
    if (a === ALPHABET_FILTER_VALUES.OTHER) return 1;
    if (b === ALPHABET_FILTER_VALUES.OTHER) return -1;
    return a.localeCompare(b);
  });
  
  return letters;
};

/**
 * Filter data by alphabet letter
 * @param {Array} data - The data array to filter
 * @param {string} field - The field to filter by
 * @param {string} letter - The letter to filter by ('all' for no filter)
 * @returns {Array} Filtered data array
 */
export const filterByAlphabetLetter = (data, field, letter) => {
  if (!Array.isArray(data) || !field) return [];
  if (letter === ALPHABET_FILTER_VALUES.ALL || !letter) return data;
  
  return data.filter(item => {
    if (!item || !item[field]) {
      return letter === ALPHABET_FILTER_VALUES.OTHER;
    }
    return getFirstLetter(item[field]) === letter;
  });
};

/**
 * Group data by alphabet letters
 * @param {Array} data - The data array to group
 * @param {string} field - The field to group by
 * @returns {Object} Object with letters as keys and arrays of items as values
 */
export const groupByAlphabetLetter = (data, field) => {
  if (!Array.isArray(data) || !field) return {};
  
  const groups = {};
  
  data.forEach(item => {
    const letter = item && item[field] 
      ? getFirstLetter(item[field]) 
      : ALPHABET_FILTER_VALUES.OTHER;
    
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(item);
  });
  
  return groups;
};

/**
 * Get count of items for each letter
 * @param {Array} data - The data array
 * @param {string} field - The field to count by
 * @returns {Object} Object with letters as keys and counts as values
 */
export const getLetterCounts = (data, field) => {
  if (!Array.isArray(data) || !field) return {};
  
  const counts = {};
  
  data.forEach(item => {
    const letter = item && item[field] 
      ? getFirstLetter(item[field]) 
      : ALPHABET_FILTER_VALUES.OTHER;
    
    counts[letter] = (counts[letter] || 0) + 1;
  });
  
  return counts;
};

/**
 * Create alphabet pagination state
 * @param {string} initialLetter - Initial selected letter
 * @returns {Object} Initial state object
 */
export const createAlphabetPaginationState = (initialLetter = ALPHABET_FILTER_VALUES.ALL) => ({
  selectedLetter: initialLetter,
  availableLetters: [],
  letterCounts: {},
});

/**
 * Build full letter list with counts and availability
 * @param {Array} data - The data array
 * @param {string} field - The field to analyze
 * @returns {Array} Array of letter objects with label, value, count, and available status
 */
export const buildLetterList = (data, field) => {
  const counts = getLetterCounts(data, field);
  const available = getAvailableLetters(data, field);
  
  const letters = [
    { 
      label: 'All', 
      labelCn: '全部',
      value: ALPHABET_FILTER_VALUES.ALL, 
      count: data.length, 
      available: true 
    },
    ...ALPHABET_LETTERS.map(letter => ({
      label: letter,
      labelCn: letter,
      value: letter,
      count: counts[letter] || 0,
      available: available.includes(letter),
    })),
    { 
      label: '#', 
      labelCn: '#',
      value: ALPHABET_FILTER_VALUES.NUMERIC, 
      count: counts[ALPHABET_FILTER_VALUES.NUMERIC] || 0, 
      available: available.includes(ALPHABET_FILTER_VALUES.NUMERIC) 
    },
    { 
      label: '?', 
      labelCn: '其他',
      value: ALPHABET_FILTER_VALUES.OTHER, 
      count: counts[ALPHABET_FILTER_VALUES.OTHER] || 0, 
      available: available.includes(ALPHABET_FILTER_VALUES.OTHER) 
    },
  ];
  
  return letters;
};

/**
 * Sort data alphabetically by a field
 * @param {Array} data - The data array to sort
 * @param {string} field - The field to sort by
 * @param {string} order - 'asc' or 'desc'
 * @param {string} locale - Locale for sorting (default: 'en')
 * @returns {Array} Sorted data array
 */
export const sortAlphabetically = (data, field, order = 'asc', locale = 'en') => {
  if (!Array.isArray(data) || !field) return data;
  
  return [...data].sort((a, b) => {
    const valueA = (a && a[field]) ? String(a[field]).toLowerCase() : '';
    const valueB = (b && b[field]) ? String(b[field]).toLowerCase() : '';
    
    const comparison = valueA.localeCompare(valueB, locale, { sensitivity: 'base' });
    return order === 'asc' ? comparison : -comparison;
  });
};

// ============================================================
// REACT HOOK HELPERS
// ============================================================

/**
 * Create handlers for alphabet pagination
 * @param {Function} setSelectedLetter - State setter for selected letter
 * @param {Function} setPage - Optional state setter for page (resets to 0)
 * @returns {Object} Handler functions
 */
export const createAlphabetPaginationHandlers = (setSelectedLetter, setPage = null) => ({
  handleLetterChange: (letter) => {
    setSelectedLetter(letter);
    if (setPage) setPage(0);
  },
  handleLetterClear: () => {
    setSelectedLetter(ALPHABET_FILTER_VALUES.ALL);
    if (setPage) setPage(0);
  },
});

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  ALPHABET_LETTERS,
  ALPHABET_FILTER_VALUES,
  getFirstLetter,
  getAvailableLetters,
  filterByAlphabetLetter,
  groupByAlphabetLetter,
  getLetterCounts,
  createAlphabetPaginationState,
  buildLetterList,
  sortAlphabetically,
  createAlphabetPaginationHandlers,
};
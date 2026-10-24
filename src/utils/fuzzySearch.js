import Fuse from 'fuse.js';

/**
 * Universal fuzzy search utility using Fuse.js
 * @param {Array} data - The array of objects to search
 * @param {string} searchTerm - The search string
 * @param {Object} options - Fuse.js options (keys, threshold, etc.)
 * @returns {Array} Filtered results (array of items)
 */
export default function fuzzySearch(data, searchTerm, options = {}) {
  if (!searchTerm || !Array.isArray(data) || data.length === 0) return data;
  const fuse = new Fuse(data, {
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 1,
    ...options,
  });
  return fuse.search(searchTerm).map(result => result.item);
} 
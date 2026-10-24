import { useMemo, useCallback } from 'react';

/**
 * Custom hook for sortable data functionality
 * 
 * @param {Array} data - The data array to sort
 * @param {Object} sortConfig - Configuration object defining sort options
 * @param {string} initialSortKey - Initial sort key
 * @param {string} initialSortOrder - Initial sort order ('asc' or 'desc')
 * 
 * @returns {Object} Sorting functionality and state
 * 
 * @example
 * const sortConfig = {
 *   title: {
 *     compareFn: (a, b) => a.title.localeCompare(b.title),
 *     label: 'Sort by Title'
 *   },
 *   date: {
 *     compareFn: (a, b) => new Date(a.date) - new Date(b.date),
 *     label: 'Sort by Date'
 *   }
 * };
 * 
 * const {
 *   sortedData,
 *   currentSortKey,
 *   currentSortOrder,
 *   handleSortChange,
 *   handleSortOrderToggle,
 *   getSortLabel
 * } = useSortableData(data, sortConfig, 'title', 'asc');
 */
export function useSortableData(
  data = [],
  sortConfig = {},
  initialSortKey = '',
  initialSortOrder = 'asc'
) {
  // Validate inputs
  if (!Array.isArray(data)) {
    console.warn('useSortableData: data must be an array');
    return {
      sortedData: [],
      currentSortKey: initialSortKey,
      currentSortOrder: initialSortOrder,
      handleSortChange: () => {},
      handleSortOrderToggle: () => {},
      getSortLabel: () => ''
    };
  }

  if (typeof sortConfig !== 'object' || sortConfig === null) {
    console.warn('useSortableData: sortConfig must be an object');
    return {
      sortedData: data,
      currentSortKey: initialSortKey,
      currentSortOrder: initialSortOrder,
      handleSortChange: () => {},
      handleSortOrderToggle: () => {},
      getSortLabel: () => ''
    };
  }

  // Sort the data based on current sort key and order
  const sortedData = useMemo(() => {
    if (!data.length || !initialSortKey || !sortConfig[initialSortKey]) {
      return [...data];
    }

    const config = sortConfig[initialSortKey];
    if (!config.compareFn || typeof config.compareFn !== 'function') {
      console.warn(`useSortableData: compareFn for "${initialSortKey}" is not a valid function`);
      return [...data];
    }

    try {
      return [...data].sort((a, b) => {
        const compareResult = config.compareFn(a, b);
        return initialSortOrder === 'desc' ? -compareResult : compareResult;
      });
    } catch (error) {
      console.log('useSortableData: Error during sorting:', error);
      return [...data];
    }
  }, [data, initialSortKey, initialSortOrder, sortConfig]);

  // Handle sort key change
  const handleSortChange = useCallback((newSortKey) => {
    if (!sortConfig[newSortKey]) {
      console.warn(`useSortableData: Sort key "${newSortKey}" is not defined in sortConfig`);
      return { sortKey: initialSortKey, sortOrder: initialSortOrder };
    }

    // If same key, toggle order; otherwise, set new key with ascending order
    if (initialSortKey === newSortKey) {
      const newOrder = initialSortOrder === 'asc' ? 'desc' : 'asc';
      return { sortKey: newSortKey, sortOrder: newOrder };
    } else {
      return { sortKey: newSortKey, sortOrder: 'asc' };
    }
  }, [initialSortKey, initialSortOrder, sortConfig]);

  // Handle sort order toggle
  const handleSortOrderToggle = useCallback(() => {
    return initialSortOrder === 'asc' ? 'desc' : 'asc';
  }, [initialSortOrder]);

  // Get label with sort order indicator
  const getSortLabel = useCallback((key) => {
    if (!sortConfig[key]) {
      return key;
    }

    const baseLabel = sortConfig[key].label || key;
    
    if (initialSortKey === key) {
      const orderIndicator = initialSortOrder === 'asc' ? ' ↑' : ' ↓';
      return baseLabel + orderIndicator;
    }
    
    return baseLabel;
  }, [initialSortKey, initialSortOrder, sortConfig]);

  // Get available sort keys
  const availableSortKeys = useMemo(() => 
    Object.keys(sortConfig), 
    [sortConfig]
  );

  // Validation helper
  const isValidSortKey = useCallback((key) => 
    availableSortKeys.includes(key), 
    [availableSortKeys]
  );

  return {
    sortedData,
    currentSortKey: initialSortKey,
    currentSortOrder: initialSortOrder,
    availableSortKeys,
    handleSortChange,
    handleSortOrderToggle,
    getSortLabel,
    isValidSortKey
  };
}

// Alternative hook for simpler use cases
export function useSimpleSort(data, sortKey, sortOrder = 'asc', compareFn) {
  return useMemo(() => {
    if (!Array.isArray(data) || !sortKey || typeof compareFn !== 'function') {
      return data;
    }

    try {
      return [...data].sort((a, b) => {
        const compareResult = compareFn(a, b, sortKey);
        return sortOrder === 'desc' ? -compareResult : compareResult;
      });
    } catch (error) {
      console.log('useSimpleSort: Error during sorting:', error);
      return data;
    }
  }, [data, sortKey, sortOrder, compareFn]);
}

// Utility functions for common sorting scenarios
export const sortUtils = {
  // String comparison (case-insensitive)
  stringCompare: (a, b, key) => {
    const aVal = (a[key] || '').toString().toLowerCase();
    const bVal = (b[key] || '').toString().toLowerCase();
    return aVal.localeCompare(bVal);
  },

  // Numeric comparison
  numberCompare: (a, b, key) => {
    const aVal = parseFloat(a[key]) || 0;
    const bVal = parseFloat(b[key]) || 0;
    return aVal - bVal;
  },

  // Date comparison
  dateCompare: (a, b, key) => {
    const aVal = new Date(a[key]);
    const bVal = new Date(b[key]);
    return aVal.getTime() - bVal.getTime();
  },

  // Boolean comparison (true values first)
  booleanCompare: (a, b, key) => {
    const aVal = Boolean(a[key]);
    const bVal = Boolean(b[key]);
    return bVal - aVal;
  },

  // Multi-field comparison
  multiFieldCompare: (fields) => (a, b) => {
    for (const field of fields) {
      const { key, compareFn, order = 'asc' } = field;
      const result = compareFn(a, b, key);
      if (result !== 0) {
        return order === 'desc' ? -result : result;
      }
    }
    return 0;
  }
};

export default useSortableData;
"use client";

import { useMemo, useCallback } from 'react';

/**
 * Generic data processing hook for index pages
 * @param {Object} config - Configuration object
 * @returns {Object} Processed data and utilities
 */
export const useIndexData = (config) => {
  const {
    primaryData = [],
    secondaryData = [],
    searchQuery = '',
    language = 'en',
    processingFunction,
    filterConfig = {}
  } = config;

  // Process data using provided function or default processing
  const processedData = useMemo(() => {
    if (processingFunction) {
      return processingFunction(primaryData, secondaryData, language === 'cn', searchQuery);
    }
    return { filteredItems: primaryData, allCategories: [], allTypes: [] };
  }, [primaryData, secondaryData, language, searchQuery, processingFunction]);

  // Extract unique values for filter options
  const extractUniqueValues = useCallback((items, field) => {
    return Array.from(new Set(items.map(item => item[field]))).filter(Boolean);
  }, []);

  return {
    ...processedData,
    extractUniqueValues
  };
}; 
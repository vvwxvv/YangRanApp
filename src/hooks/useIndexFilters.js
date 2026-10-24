"use client";

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing filters state for index pages
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Filter state and handlers
 */
export const useIndexFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value, resetOthers = []) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Reset other filters if specified
      resetOthers.forEach(resetKey => {
        if (resetKey !== key) {
          newFilters[resetKey] = '';
        }
      });
      return newFilters;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const resetFilter = useCallback((key) => {
    setFilters(prev => ({ ...prev, [key]: initialFilters[key] || '' }));
  }, [initialFilters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    resetFilter,
    setFilters
  };
}; 
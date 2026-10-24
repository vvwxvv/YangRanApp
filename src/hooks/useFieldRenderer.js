"use client";

import { useMemo } from 'react';
import { getFilteredFieldOptions } from '@/utils/filterAndSortItems';

/**
 * Generic hook for generating filter options for any schema
 * @param {Array} data - The data array
 * @param {Object} config - Configuration object
 * @param {Array} config.fields - Array of field names to create filters for
 * @param {Function} config.getAllLabel - Function to get "All" label for current language
 * @param {boolean} config.isCn - Whether Chinese language is selected
 * @param {Object} config.dependencies - Field dependencies (e.g., { year: 'series' })
 * @returns {Object} Filter options for each field
 */
const useFilterOptions = (data, config) => {
  const { fields = [], getAllLabel, isCn, dependencies = {} } = config;

  const filterOptions = useMemo(() => {
    const options = {};

    fields.forEach(field => {
      // Get all unique values for this field
      const allValues = Array.from(new Set(data.map(item => item[field]))).filter(Boolean);
      
      // Check if this field has dependencies
      const dependentField = dependencies[field];
      let filteredData = data;
      
      if (dependentField) {
        // Filter data based on dependent field selection
        // This would need to be implemented based on your specific needs
        filteredData = data;
      }

      options[field] = getFilteredFieldOptions({
        allValues,
        allLabel: getAllLabel(field),
        filteredItems: filteredData,
        fieldName: field,
        dependentField,
        dependentValue: null, // This would come from state
      });
    });

    return options;
  }, [data, fields, getAllLabel, dependencies, isCn]);

  return filterOptions;
};

export default useFilterOptions;
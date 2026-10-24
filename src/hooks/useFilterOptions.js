"use client";

import { useMemo } from 'react';

/**
 * Generic filter options generator hook
 * @param {Object} config - Filter configuration
 * @returns {Array} Filter options
 */
export const useFilterOptionsGenerator = (config) => {
  const {
    allValues = [],
    allLabel = 'All',
    filteredItems = [],
    fieldName = '',
    dependentField = '',
    dependentValue = '',
    configOptions = [],
    language = 'en'
  } = config;

  const filterOptions = useMemo(() => {
    const allOption = { value: '', label: allLabel };

    let availableValues = allValues;

    // Filter values based on dependency
    if (dependentField && dependentValue && filteredItems.length > 0) {
      const dependentItems = filteredItems.filter(item => item[dependentField] === dependentValue);
      availableValues = Array.from(new Set(dependentItems.map(item => item[fieldName]))).filter(Boolean);
    }

    // Map to proper labels using config if provided
    const options = availableValues.map(value => {
      if (configOptions.length > 0) {
        const configOption = configOptions.find(opt => 
          opt.label_en === value || opt.label_cn === value
        );
        
        if (configOption) {
          return {
            value: language === 'cn' ? configOption.label_cn : configOption.label_en,
            label: language === 'cn' ? configOption.label_cn : configOption.label_en
          };
        }
      }
      
      return { value, label: value };
    });

    // Sort options alphabetically
    const sortedOptions = options.sort((a, b) => {
      if (!a.label && !b.label) return 0;
      if (!a.label) return 1;
      if (!b.label) return -1;
      return a.label.localeCompare(b.label, 'en', { sensitivity: 'base' });
    });

    return [allOption, ...sortedOptions];
  }, [allValues, allLabel, filteredItems, fieldName, dependentField, dependentValue, configOptions, language]);

  return filterOptions;
}; 
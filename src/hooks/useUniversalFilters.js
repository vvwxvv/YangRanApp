// hooks/useUniversalFilters.js
import { useState, useMemo, useCallback, useEffect } from "react";

const useUniversalFilters = (data, filterConfigs, getLabel, languageMode = false) => {
  const [filterValues, setFilterValues] = useState({});

  // Reset filters when language changes (optional - you might want to preserve filter state)
  useEffect(() => {
    // You can choose to reset filters on language change or keep them
    // setFilterValues({});
  }, [getLabel]);

  // Generate filter options from data with optional language-aware filtering
  const filterOptions = useMemo(() => {
    const options = {};
    
    // Determine if there's a language filter active (only if languageMode is enabled)
    const languageFilter = languageMode ? (filterValues.language || filterValues.lang) : null;
    
    // Get the base dataset - if language filter is active and languageMode is enabled, filter by language first
    let baseData = data;
    if (languageMode && languageFilter) {
      baseData = data.filter(item => {
        const itemLanguage = item.language || item.lang;
        return itemLanguage === languageFilter;
      });
    }
    
    filterConfigs.forEach(config => {
      if (config.type === 'select' && config.dataSource) {
        // For language field, always use all data
        // For other fields, use baseData (which may be language-filtered if languageMode is true)
        const isLanguageField = config.field === 'language' || config.field === 'lang';
        const sourceData = (languageMode && !isLanguageField) ? baseData : data;
        
        const uniqueValues = [...new Set(
          sourceData
            .map(item => item[config.dataSource])
            .filter(value => value != null && value !== '')
        )].sort();
        
        options[config.field] = uniqueValues.map(value => 
          config.optionTransform ? config.optionTransform(value) : { value, label: value }
        );
      }
    });
    
    return options;
  }, [data, filterConfigs, filterValues, languageMode]);

  // Filter data based on current filter values with optional language-aware logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Apply language filter first if languageMode is enabled
      if (languageMode) {
        const languageFilter = filterValues.language || filterValues.lang;
        if (languageFilter) {
          const itemLanguage = item.language || item.lang;
          if (itemLanguage !== languageFilter) {
            return false; // Exclude items that don't match the language filter
          }
        }
      }

      // Apply all filters (including language if languageMode is disabled)
      return filterConfigs.every(config => {
        const filterValue = filterValues[config.field];
        if (!filterValue) return true;

        // Skip language filter if languageMode is enabled (already handled above)
        if (languageMode && (config.field === 'language' || config.field === 'lang')) {
          return true;
        }

        if (config.type === 'search' || config.type === 'text') {
          const searchFields = config.searchFields || [config.dataSource || config.field];
          return searchFields.some(field => {
            const itemValue = item[field];
            return itemValue && itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
          });
        }

        if (config.type === 'select') {
          const itemValue = item[config.dataSource || config.field];
          return itemValue === filterValue;
        }

        return true;
      });
    });
  }, [data, filterValues, filterConfigs, languageMode]);

  const handleFilterChange = useCallback((field, value) => {
    setFilterValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterValues({});
  }, []);

  return {
    filterValues,
    filterOptions,
    filteredData,
    handleFilterChange,
    resetFilters
  };
};

export default useUniversalFilters;
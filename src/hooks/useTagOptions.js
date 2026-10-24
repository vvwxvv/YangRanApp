import { useMemo } from 'react';

/**
 * Universal hook for generating tag options from different data sources
 * @param {string} tagSource - The data source key (e.g., 'artwork', 'event', 'about')
 * @param {Object} dataState - Object containing all data arrays
 * @param {string} lang - Language code ('EN' or 'CN')
 * @param {Object} fieldConfig - Configuration for field names
 * @param {string} fieldConfig.titleField - Primary title field name (default: 'title')
 * @param {string} fieldConfig.titleFieldCN - Chinese title field name (default: 'title_cn')
 * @param {string} fieldConfig.titleFieldEN - English title field name (default: 'title_en')
 * @param {string} fieldConfig.idField - ID field name (default: 'id')
 * @param {string} fieldConfig.fallbackIdField - Fallback ID field name (default: '_id')
 * @returns {Array} Sorted array of option objects with value, label, and type
 */
export const useTagOptions = (
  tagSource, 
  dataState, 
  lang = 'EN', 
  fieldConfig = {}
) => {
  const {
    titleField = 'title',
    titleFieldCN = 'title_cn',
    titleFieldEN = 'title_en',
    idField = 'id',
    fallbackIdField = '_id'
  } = fieldConfig;

  return useMemo(() => {
    // Early return if dataState is invalid
    if (!dataState || typeof dataState !== 'object') {
      console.warn('useTagOptions: dataState is invalid or undefined', { tagSource, dataState });
      return [];
    }

    // Early return if tagSource is invalid
    if (!tagSource || typeof tagSource !== 'string') {
      console.warn('useTagOptions: tagSource is invalid', { tagSource, dataState });
      return [];
    }

    // Get the data array for the specified source
    const sourceData = dataState[tagSource];
    
    if (!Array.isArray(sourceData)) {
      console.warn(`useTagOptions: No valid array found for tagSource "${tagSource}"`, { 
        tagSource, 
        availableKeys: Object.keys(dataState),
        sourceData 
      });
      return [];
    }

    if (sourceData.length === 0) {
      return [];
    }

    const options = sourceData.map(item => {
      // Ensure item is an object
      if (!item || typeof item !== 'object') {
        console.warn('useTagOptions: Invalid item in sourceData', { item, tagSource });
        return null;
      }

      // Get ID (primary or fallback)
      const id = item[idField] || item[fallbackIdField];
      
      // Skip items without valid IDs
      if (!id && id !== 0) {
        console.warn('useTagOptions: Item missing valid ID', { 
          item, 
          idField, 
          fallbackIdField, 
          tagSource 
        });
        return null;
      }

      // Get title based on language preference - use the main title field since we don't have language variants
      let label = item[titleField] || `${tagSource} ${id}`;

      // Ensure label is a string
      if (typeof label !== 'string') {
        label = String(label || `${tagSource} ${id}`);
      }

      return {
        value: id,
        label: label.trim(),
        type: tagSource
      };
    }).filter(option => option !== null); // Filter out null items

    // Sort alphabetically by label with proper locale
    options.sort((a, b) => {
      try {
        return a.label.localeCompare(
          b.label, 
          lang === 'CN' ? 'zh-Hans-CN' : 'en', 
          { sensitivity: 'base' }
        );
      } catch (error) {
        console.warn('useTagOptions: Sort error', error);
        // Fallback to simple string comparison
        return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
      }
    });

    return options;
  }, [
    tagSource, 
    dataState?.[tagSource], // Safe access with optional chaining
    lang, 
    titleField, 
    titleFieldCN, 
    titleFieldEN, 
    idField, 
    fallbackIdField
  ]);
};

// Convenience wrapper for common use cases with error handling
export const useArtworkTagOptions = (dataState, lang = 'EN') => {
  return useTagOptions('artwork', dataState, lang, {
    titleField: 'title',
    titleFieldCN: 'title', // Use same field since no language variants exist
    titleFieldEN: 'title'  // Use same field since no language variants exist
  });
};

export const useEventTagOptions = (dataState, lang = 'EN') => {
  return useTagOptions('event', dataState, lang, {
    titleField: 'title',
    titleFieldCN: 'title', // Use same field since no language variants exist
    titleFieldEN: 'title'  // Use same field since no language variants exist
  });
};

export const useAboutTagOptions = (dataState, lang = 'EN') => {
  return useTagOptions('about', dataState, lang, {
    titleField: 'artist', // About pages use 'artist' as title
    titleFieldCN: 'artist', // Use same field since no language variants exist
    titleFieldEN: 'artist'  // Use same field since no language variants exist
  });
};

// For data sources with simple title fields (no language variants)
export const useSimpleTagOptions = (tagSource, dataState, lang = 'EN', titleField = 'title') => {
  return useTagOptions(tagSource, dataState, lang, {
    titleField: titleField,
    titleFieldCN: titleField, // Use same field for all languages
    titleFieldEN: titleField
  });
};

// Safe wrapper that handles undefined dataState
export const useSafeTagOptions = (tagSource, dataState, lang = 'EN', fieldConfig = {}) => {
  const safeDataState = useMemo(() => {
    if (!dataState) return {};
    return dataState;
  }, [dataState]);

  return useTagOptions(tagSource, safeDataState, lang, fieldConfig);
};
import { useMemo } from 'react';

/**
 * Custom hook for splitting data by language
 * @param {Object} dataState - The data state containing different sources
 * @param {string} source - The source key to filter (e.g., 'artwork', 'album')
 * @param {Object} options - Configuration options
 * @param {Array} options.languages - Language codes to filter by (default: ['en', 'EN'])
 * @param {string} options.idField - Field name for ID (default: 'id' with fallback to '_id')
 * @param {Array} options.titleFields - Array of field names to use for title (default: ['title', 'artist', 'name'])
 * @param {Function} options.customTitleGenerator - Custom function to generate title
 * @returns {Array} Filtered and formatted options array
 */
export const useLanguageData = (dataState, source, options = {}) => {
  const {
    languages = ['en', 'EN'],
    idField = 'id',
    titleFields = ['title', 'artist', 'name'],
    customTitleGenerator,
    includeMetadata = false
  } = options;

  return useMemo(() => {
    if (!dataState || !dataState[source] || !Array.isArray(dataState[source])) {
      return [];
    }

    const sourceData = dataState[source];
    
    // Filter items by language
    const filteredData = sourceData.filter(item => {
      if (!item || typeof item !== 'object') return false;
      const itemLanguage = item.language;
      return languages.some(lang => 
        itemLanguage === lang || itemLanguage === lang.toLowerCase() || itemLanguage === lang.toUpperCase()
      );
    });

    // Convert to options format
    return filteredData
      .map(item => {
        const id = item[idField] || item._id;
        if (!id) return null;

        let title;
        
        // Use custom title generator if provided
        if (customTitleGenerator && typeof customTitleGenerator === 'function') {
          title = customTitleGenerator(item, source);
        } else {
          // Try to find title from titleFields in order
          title = titleFields.find(field => item[field])
            ? item[titleFields.find(field => item[field])]
            : `${source} ${id}`;
        }

        const option = {
          value: id,
          label: String(title).trim(),
          type: source
        };

        // Include original item metadata if requested
        if (includeMetadata) {
          option.metadata = item;
        }

        return option;
      })
      .filter(option => option && option.label && option.label.length > 0);
  }, [dataState, source, languages, idField, titleFields, customTitleGenerator, includeMetadata]);
};

/**
 * Hook for getting multiple language datasets at once
 * @param {Object} dataState - The data state
 * @param {string} source - The source key
 * @param {Object} languageConfig - Configuration for different languages
 * @returns {Object} Object with language keys and their corresponding data
 */
export const useMultiLanguageData = (dataState, source, languageConfig = {}) => {
  const defaultConfig = {
    en: { languages: ['en', 'EN'] },
    cn: { languages: ['cn', 'CN', 'zh', 'ZH'] },
    ...languageConfig
  };

  const results = {};
  
  Object.keys(defaultConfig).forEach(langKey => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[langKey] = useLanguageData(dataState, source, defaultConfig[langKey]);
  });

  return results;
};
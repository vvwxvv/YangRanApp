import { useMemo } from 'react';

/**
 * Hook for generating tag source messages
 * @param {boolean} hasOptions - Whether options are available
 * @param {boolean} isCn - Whether to use Chinese language
 * @param {Object} customMessages - Custom message overrides
 * @returns {string} The appropriate message
 */
export const useTagMessage = (hasOptions, isCn = false, customMessages = {}) => {
  const defaultMessages = {
    en: {
      withOptions: 'You can select from below',
      withoutOptions: 'No data, you can input below'
    },
    cn: {
      withOptions: '你可以从下方选择',
      withoutOptions: '暂无数据，你可以手动输入'
    }
  };

  return useMemo(() => {
    const messages = {
      ...defaultMessages,
      ...customMessages
    };

    const lang = isCn ? 'cn' : 'en';
    const messageType = hasOptions ? 'withOptions' : 'withoutOptions';
    
    return messages[lang]?.[messageType] || messages.en[messageType];
  }, [hasOptions, isCn, customMessages]);
};

/**
 * Hook for generating multiple tag messages for different scenarios
 * @param {Object} optionsMap - Map of option arrays by key
 * @param {boolean} isCn - Whether to use Chinese language
 * @param {Object} customMessages - Custom message overrides
 * @returns {Object} Object with keys and their corresponding messages
 */
export const useTagMessages = (optionsMap, isCn = false, customMessages = {}) => {
  return useMemo(() => {
    const messages = {};
    
    Object.keys(optionsMap).forEach(key => {
      const hasOptions = Array.isArray(optionsMap[key]) && optionsMap[key].length > 0;
      messages[key] = useTagMessage(hasOptions, isCn, customMessages);
    });
    
    return messages;
  }, [optionsMap, isCn, customMessages]);
};
// hooks/useSorting.js
import { useState, useMemo, useCallback, useContext } from 'react';
import { getMarkValue, hasMarkValue } from "@/utils/mediaMarks";
import { orderValue } from "@/utils/mediaOrder";
import { LanguageContext } from '@/components/contexts/LanguageContext';

export default function useSorting(getLabel) {
  const { isCn } = useContext(LanguageContext);
  
  // Sort configuration that updates with language
  const sortConfig = useMemo(() => {
    const baseConfig = {
      artist: { 
        label: getLabel('artist'),
        getValue: (item) => item.artist || ''
      },
      caption: { 
        label: getLabel('caption'),
        getValue: (item) => item.caption || ''
      },
      language: { 
        label: getLabel('language'),
        getValue: (item) => item.language || ''
      },
      order: { 
        label: getLabel('order'),
        getValue: (item) => orderValue(item, 'artist_page_order')
      },
      mark: { 
        label: getLabel('mark'),
        getValue: (item) => getMarkValue(item)
      }
    };

    // Add language-aware tag sorting
    const tagKey = isCn ? 'tag_cn' : 'tag_en';
    const tagLabel = isCn ? getLabel('tag_cn') || '标签(中文)' : getLabel('tag_en') || 'Tag (EN)';
    
    return {
      ...baseConfig,
      tag: {
        label: tagLabel,
        getValue: (item) => item[tagKey] || item.tag_en || item.tag_cn || ''
      }
    };
  }, [getLabel, isCn]);

  // Initialize sortKey with the first available sort key instead of empty string
  const [sortKey, setSortKey] = useState(() => {
    const availableKeys = Object.keys(sortConfig);
    return availableKeys.length > 0 ? availableKeys[0] : '';
  });
  
  const [sortOrder, setSortOrder] = useState('asc');

  // Update sortKey if it becomes invalid
  const validatedSortKey = useMemo(() => {
    const availableKeys = Object.keys(sortConfig);
    if (availableKeys.length === 0) return '';
    if (!sortKey || !sortConfig[sortKey]) {
      return availableKeys[0];
    }
    return sortKey;
  }, [sortKey, sortConfig]);

  // Apply sorting function
  const applySorting = useCallback((data) => {
    const currentSortKey = validatedSortKey;
    if (!currentSortKey || !sortConfig[currentSortKey]) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const aValue = sortConfig[currentSortKey].getValue(a);
      const bValue = sortConfig[currentSortKey].getValue(b);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortOrder === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return sorted;
  }, [validatedSortKey, sortOrder, sortConfig]);

  // Custom setSortKey that validates the key
  const handleSetSortKey = useCallback((newKey) => {
    const availableKeys = Object.keys(sortConfig);
    if (availableKeys.includes(newKey)) {
      setSortKey(newKey);
    }
  }, [sortConfig]);

  return {
    sortKey: validatedSortKey,
    setSortKey: handleSetSortKey,
    sortOrder,
    setSortOrder,
    sortConfig,
    applySorting
  };
}
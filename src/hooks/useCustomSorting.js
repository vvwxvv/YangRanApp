// hooks/useCustomSorting.js
import { useState, useMemo, useCallback, useContext } from 'react';
import { LanguageContext } from '@/components/contexts/LanguageContext';

export default function useCustomSorting(getLabel, sortFields = []) {
  const { isCn } = useContext(LanguageContext);
  
  // Sort configuration that updates with language and custom fields
  const sortConfig = useMemo(() => {
    const baseConfig = {
      // Common fields
      title: { 
        label: getLabel('title'),
        getValue: (item) => item.title || ''
      },
      artist: { 
        label: getLabel('artist'),
        getValue: (item) => item.artist || ''
      },
      type: { 
        label: getLabel('type'),
        getValue: (item) => item.type || ''
      },
      year: { 
        label: getLabel('year'),
        getValue: (item) => Number(item.year) || 0
      },
      order: { 
        label: getLabel('order'),
        getValue: (item) => Number(item.order) || 0
      },
      number: { 
        label: getLabel('number'),
        getValue: (item) => Number(item.number) || 0
      },
      venue: { 
        label: getLabel('venue'),
        getValue: (item) => item.venue || ''
      },
      language: { 
        label: getLabel('language'),
        getValue: (item) => item.language || ''
      },
      email: { 
        label: getLabel('email'),
        getValue: (item) => item.email || ''
      },
      name: { 
        label: getLabel('name'),
        getValue: (item) => item.name || ''
      },
      isActive: { 
        label: getLabel('isActive'),
        getValue: (item) => item.isActive ? 1 : 0
      },
      createdAt: { 
        label: getLabel('createdAt'),
        getValue: (item) => new Date(item.createdAt || 0).getTime()
      },
      updatedAt: { 
        label: getLabel('updatedAt'),
        getValue: (item) => new Date(item.updatedAt || 0).getTime()
      }
    };

    // Add language-aware tag sorting
    const tagKey = isCn ? 'tag_cn' : 'tag_en';
    const tagLabel = isCn ? getLabel('tag_cn') || '标签(中文)' : getLabel('tag_en') || 'Tag (EN)';
    
    const configWithTags = {
      ...baseConfig,
      tag_en: {
        label: getLabel('tag_en') || 'Tag (EN)',
        getValue: (item) => item.tag_en || ''
      },
      tag_cn: {
        label: getLabel('tag_cn') || '标签(中文)',
        getValue: (item) => item.tag_cn || ''
      }
    };

    // Filter config to only include specified sort fields
    const filteredConfig = {};
    sortFields.forEach(field => {
      if (configWithTags[field]) {
        filteredConfig[field] = configWithTags[field];
      }
    });

    return filteredConfig;
  }, [getLabel, isCn, sortFields]);

  // Initialize sortKey with the first available sort key
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
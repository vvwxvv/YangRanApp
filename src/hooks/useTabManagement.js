import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSystemLabel } from '@/components/labels/system_labels';

export default function useTabManagement(uniqueTypes, currentLanguage = null) {
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    if (selectedTab !== 'all' && !uniqueTypes.includes(selectedTab)) {
      setSelectedTab('all');
    }
  }, [uniqueTypes, selectedTab]);

  // Filter tabs based on current language if provided
  const filteredTabs = useMemo(() => {
    if (!currentLanguage) return uniqueTypes;
    
    return uniqueTypes.filter(tabKey => {
      if (tabKey === 'all') return true;
      
      // For language-specific tabs (e.g., "painting_CN", "painting_EN")
      if (tabKey.includes('_')) {
        const [, language] = tabKey.split('_');
        return language === currentLanguage;
      }
      
      // For regular type tabs, include them (backward compatibility)
      return true;
    });
  }, [uniqueTypes, currentLanguage]);

  const handleTabChange = useCallback((event, newValue) => {
    setSelectedTab(newValue);
  }, []);

  return { selectedTab, handleTabChange, filteredTabs };
} 
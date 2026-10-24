import { useState, useCallback } from 'react';

// Hook for managing view mode state
export const useViewMode = (initialMode = 'list') => {
  const [viewMode, setViewMode] = useState(initialMode);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  return {
    viewMode,
    setViewMode: handleViewModeChange
  };
}; 


import { useState, useCallback } from 'react';

const useFilterState = (primaryField = 'series', secondaryField = 'type') => {
  const [search, setSearch] = useState('');
  const [selectedPrimary, setSelectedPrimary] = useState('');
  const [selectedSecondary, setSelectedSecondary] = useState('');

  const handlePrimaryChange = useCallback((val) => {
    // Convert 'all' to empty string for internal state
    const normalizedValue = val === 'all' ? '' : val;
    setSelectedPrimary(normalizedValue);
    setSelectedSecondary(''); // Reset secondary when primary changes
  }, []);

  const handleSecondaryChange = useCallback((val) => {
    // Convert 'all' to empty string for internal state
    const normalizedValue = val === 'all' ? '' : val;
    setSelectedSecondary(normalizedValue);
  }, []);

  return {
    search,
    setSearch,
    selectedPrimary,
    selectedSecondary,
    handlePrimaryChange,
    handleSecondaryChange,
    primaryField,
    secondaryField
  };
};

export default useFilterState;
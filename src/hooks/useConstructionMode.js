import { useState, useEffect } from 'react';

/**
 * Hook to manage construction mode state
 * @param {boolean} initialState - Initial construction mode state (default: false)
 * @returns {Object} - { isUnderConstruction, setIsUnderConstruction }
 */
function useConstructionMode(initialState = false) {
  const [isUnderConstruction, setIsUnderConstruction] = useState(initialState);

  useEffect(() => {
    // Log construction mode state for debugging
    console.log('Construction Mode:', isUnderConstruction);
  }, [isUnderConstruction]);

  return {
    isUnderConstruction,
    setIsUnderConstruction
  };
}

export default useConstructionMode;
import React from 'react';

/**
 * RedDotIndicator Component
 * Displays a red dot indicator for sold items
 */
const RedDotIndicator = ({ sold, isCn = false }) => {
  if (sold !== 'sold') return null;

  return (
    <span
      className="inline-block w-2.5 h-2.5 min-w-[10px] min-h-[10px] max-w-[10px] max-h-[10px] 
                 rounded-full bg-red-500 mr-1.5 align-middle flex-shrink-0"
      title={isCn ? '已售' : 'Sold'}
      aria-label={isCn ? '已售' : 'Sold'}
    />
  );
};

export default RedDotIndicator;

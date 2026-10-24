import { useMemo } from 'react';

/**
 * useResponsiveColumns
 * Returns the number of columns for a grid based on the window width.
 * @param {number} width - The current window width
 * @returns {number} Number of columns
 */
export default function useResponsiveColumns(width) {
  return useMemo(() => {
    if (width < 640) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  }, [width]);
} 
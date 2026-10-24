import { useState, useEffect } from 'react';

/**
 * Debounce a value by a given delay
 * @param {any} value
 * @param {number} delay
 * @returns {any}
 */
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
} 
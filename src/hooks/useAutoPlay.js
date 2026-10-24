import { useRef, useEffect } from 'react';

export const useAutoPlay = (isEnabled, interval, onNext, totalItems) => {
    const autoPlayRef = useRef(null);
  
    useEffect(() => {
      if (!isEnabled || totalItems <= 1) return;
  
      autoPlayRef.current = setInterval(onNext, interval);
  
      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }, [isEnabled, interval, onNext, totalItems]);
  
    return autoPlayRef;
  };
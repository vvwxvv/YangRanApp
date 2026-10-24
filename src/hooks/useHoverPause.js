import { useState, useCallback } from 'react';

export const useHoverPause = (pauseOnHover) => {
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover) setIsAutoPlaying(false);
    }, [pauseOnHover]);
  
    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) setIsAutoPlaying(true);
    }, [pauseOnHover]);
  
    return { isAutoPlaying, handleMouseEnter, handleMouseLeave };
  };
  
import { useState, useCallback } from 'react';

export const useSlideNavigation = (totalItems, onSlideChange) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const handleNextSlide = useCallback(() => {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex === totalItems - 1 ? 0 : prevIndex + 1;
        if (onSlideChange) onSlideChange(newIndex);
        return newIndex;
      });
    }, [totalItems, onSlideChange]);
  
    const handlePrevSlide = useCallback(() => {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex === 0 ? totalItems - 1 : prevIndex - 1;
        if (onSlideChange) onSlideChange(newIndex);
        return newIndex;
      });
    }, [totalItems, onSlideChange]);
  
    const goToSlide = useCallback((index) => {
      if (index >= 0 && index < totalItems) {
        setCurrentIndex(index);
        if (onSlideChange) onSlideChange(index);
      }
    }, [totalItems, onSlideChange]);
  
    return { currentIndex, handleNextSlide, handlePrevSlide, goToSlide };
  };
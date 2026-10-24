import { useEffect } from 'react';

export const useKeyboardNavigation = (enabled, containerRef, onNext, onPrev) => {
    useEffect(() => {
      if (!enabled) return;
  
      const handleKeyDown = (e) => {
        e.preventDefault();
        if (e.key === 'ArrowLeft') {
          onPrev();
        } else if (e.key === 'ArrowRight') {
          onNext();
        }
      };
  
      const container = containerRef.current;
      if (container) {
        container.addEventListener('keydown', handleKeyDown);
        container.tabIndex = 0;
      }
  
      return () => {
        if (container) {
          container.removeEventListener('keydown', handleKeyDown);
        }
      };
    }, [enabled, onNext, onPrev]);
  };
  
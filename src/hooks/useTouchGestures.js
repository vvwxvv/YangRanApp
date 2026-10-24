import { useState, useCallback } from 'react';

// Minimum horizontal travel (px) before a touch counts as a swipe.
const SWIPE_THRESHOLD = 50;

const isLeftSwipe = (start, end) => start - end > SWIPE_THRESHOLD;
const isRightSwipe = (start, end) => end - start > SWIPE_THRESHOLD;

export const useTouchGestures = (enabled, onNext, onPrev) => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
  
    const handleTouchStart = useCallback((e) => {
      if (!enabled) return;
      setTouchStart(e.targetTouches[0].clientX);
    }, [enabled]);
  
    const handleTouchMove = useCallback((e) => {
      if (!enabled) return;
      setTouchEnd(e.targetTouches[0].clientX);
    }, [enabled]);
  
    const handleTouchEnd = useCallback(() => {
      if (!enabled || !touchStart || !touchEnd) return;
      
      if (isLeftSwipe(touchStart, touchEnd)) {
        onNext();
      } else if (isRightSwipe(touchStart, touchEnd)) {
        onPrev();
      }
    }, [enabled, touchStart, touchEnd, onNext, onPrev]);
  
    return { handleTouchStart, handleTouchMove, handleTouchEnd };
  };
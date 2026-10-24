import { useState, useCallback } from "react";

/**
 * Reusable slider navigation state & handlers.
 * @param {number} totalCount – total number of slides
 */
export default function useSliderNav(totalCount) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev <= 0 ? totalCount - 1 : prev - 1));
  }, [totalCount]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev >= totalCount - 1 ? 0 : prev + 1));
  }, [totalCount]);

  const handleGoTo = useCallback(
    (index) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    },
    [handlePrev, handleNext]
  );

  return {
    currentIndex,
    direction,
    handlePrev,
    handleNext,
    handleGoTo,
    handleKeyDown,
  };
}
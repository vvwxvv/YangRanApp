import { useState, useCallback } from 'react';

/**
 * Custom hook for managing image loading states
 * @returns {Object} Object containing image state and handlers
 */
const useImageState = () => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const resetImageState = useCallback(() => {
    setImageLoading(true);
    setImageError(false);
  }, []);

  return {
    imageLoading,
    imageError,
    handleImageLoad,
    handleImageError,
    resetImageState
  };
};

export default useImageState;

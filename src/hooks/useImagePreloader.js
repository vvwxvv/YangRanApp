import { useState, useEffect, useCallback } from 'react';
import { imageUtils } from '@/utils/imageUtils';
export const useImagePreloader = (images, enabled = true) => {
    const [imageLoadStates, setImageLoadStates] = useState({});
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (!enabled || images.length === 0) {
        setIsLoading(false);
        return;
      }
  
      const preloadAll = async () => {
        const promises = images.map((src, index) => 
          imageUtils.preloadImage(src)
            .then(() => {
              setImageLoadStates(prev => ({ ...prev, [index]: 'loaded' }));
            })
            .catch(() => {
              setImageLoadStates(prev => ({ ...prev, [index]: 'error' }));
            })
        );
  
        await Promise.allSettled(promises);
        setIsLoading(false);
      };
  
      preloadAll();
    }, [images, enabled]);
  
    const handleImageError = useCallback((index) => {
      setImageLoadStates(prev => ({ ...prev, [index]: 'error' }));
    }, []);
  
    return { imageLoadStates, isLoading, handleImageError };
  };
  
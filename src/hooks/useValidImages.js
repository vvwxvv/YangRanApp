import { useMemo } from 'react';
import { imageUtils } from '@/utils/imageUtils';
export const useValidImages = (images, fallbackImage = "/no-image.png") => {
    return useMemo(() => {
      const filtered = images.filter(imageUtils.isValidImage);
      return filtered.length > 0 ? filtered : [fallbackImage];
    }, [images, fallbackImage]);
  };
  
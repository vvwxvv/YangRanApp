import { useState, useCallback } from 'react';
import { imageUtils } from '@/utils/imageUtils';

export const useGifManager = (images, forceRestart = true) => {
    const [gifKeys, setGifKeys] = useState({});
  
    const restartGif = useCallback((index) => {
      if (forceRestart && imageUtils.isGif(images[index])) {
        setGifKeys(prev => ({ ...prev, [index]: Date.now() }));
      }
    }, [forceRestart, images]);
  
    const getGifSrc = useCallback((src, index) => {
      const isGif = imageUtils.isGif(src);
      if (isGif) {
        console.log(`GIF detected at index ${index}:`, src);
      }
      if (!isGif || !forceRestart) return src;
      const key = gifKeys[index] || Date.now();
      const gifSrc = imageUtils.addTimestampToGif(src, key);
      console.log(`GIF restarted at index ${index}:`, gifSrc);
      return gifSrc;
    }, [forceRestart, gifKeys]);
  
    return { gifKeys, restartGif, getGifSrc };
  };
  
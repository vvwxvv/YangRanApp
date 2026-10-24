import { useRef, useEffect, useState } from 'react';
import { imageUtils } from '@/utils/imageUtils';

export const useGifAwareAutoPlay = (isEnabled, interval, onNext, totalItems, currentIndex, images, gifDuration = 3000) => {
  const autoPlayRef = useRef(null);
  const [isGifPlaying, setIsGifPlaying] = useState(false);
  const [gifStartTime, setGifStartTime] = useState(null);

  // Detect if current image is a GIF
  const isCurrentImageGif = () => {
    if (!images || !images[currentIndex]) return false;
    return imageUtils.isGif(images[currentIndex]);
  };

  // Use the provided GIF duration
  const getGifDuration = () => {
    return gifDuration;
  };

  // Start GIF timer when a GIF is detected
  useEffect(() => {
    if (isCurrentImageGif() && !isGifPlaying) {
      setIsGifPlaying(true);
      setGifStartTime(Date.now());
      
      // Set a timer for the estimated GIF duration
      const gifDuration = getGifDuration();
      const timer = setTimeout(() => {
        setIsGifPlaying(false);
        setGifStartTime(null);
      }, gifDuration);

      return () => clearTimeout(timer);
    } else if (!isCurrentImageGif()) {
      setIsGifPlaying(false);
      setGifStartTime(null);
    }
  }, [currentIndex, images, isGifPlaying]);

  useEffect(() => {
    if (!isEnabled || totalItems <= 1) return;

    // Clear any existing interval
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    // If current image is a GIF and it's still playing, don't start auto-play yet
    if (isGifPlaying) {
      return;
    }

    // Start auto-play interval
    autoPlayRef.current = setInterval(() => {
      // Check if we should advance (not during GIF playback)
      if (!isGifPlaying) {
        onNext();
      }
    }, interval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isEnabled, interval, onNext, totalItems, isGifPlaying]);

  return { isGifPlaying, gifStartTime };
}; 
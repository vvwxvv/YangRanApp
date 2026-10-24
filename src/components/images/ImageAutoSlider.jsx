import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHoverPause } from '@/hooks/useHoverPause';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useSlideNavigation } from '@/hooks/useSlideNavigation';
import { useValidImages } from '@/hooks/useValidImages';
import { useGifManager } from '@/hooks/useGifManager';
import { useGifAwareAutoPlay } from '@/hooks/useGifAwareAutoPlay';
import { useReverseTheme } from '@/hooks/useReverseTheme';

  const ImageAutoSlider = ({ 
  images = [], 
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = false,
  className = "",
  fallbackImage = "/no-image.png",
  loadingImage = null, // Image to show while loading (optional)
  pauseOnHover = true,
  enableKeyboardNavigation = true,
  enableTouchGestures = true,
  preloadImages = true,
  onSlideChange = null,
  dotPosition = "bottom", // "bottom" | "top"
  arrowStyle = "circle", // "circle" | "square"
  transitionDuration = 0.8,
  maxHeight = "100vh",
  maxWidth = "100%",
  enableGifRestart = true,
  gifDuration = 3000 // Duration to wait for GIF to finish (in milliseconds)
}) => {
  const containerRef = useRef(null);
  const { colors } = useReverseTheme();

  // Validate and filter images
  const validImages = useValidImages(images, fallbackImage);

  // Preload images
  const { imageLoadStates, isLoading, handleImageError } = useImagePreloader(validImages, preloadImages);

  // GIF management
  const { getGifSrc, restartGif } = useGifManager(validImages, enableGifRestart);

  // Slide navigation
  const { currentIndex, handleNextSlide, handlePrevSlide, goToSlide } = useSlideNavigation(validImages.length, onSlideChange);

  // Restart GIF when slide changes
  React.useEffect(() => {
    if (enableGifRestart) {
      restartGif(currentIndex);
    }
  }, [currentIndex, enableGifRestart, restartGif]);

  // Auto-play functionality with GIF awareness
  const { isAutoPlaying, handleMouseEnter, handleMouseLeave } = useHoverPause(pauseOnHover);
  const { isGifPlaying } = useGifAwareAutoPlay(
    isAutoPlaying, 
    autoPlayInterval, 
    handleNextSlide, 
    validImages.length, 
    currentIndex, 
    validImages,
    gifDuration
  );

  // Keyboard navigation
  useKeyboardNavigation(enableKeyboardNavigation, containerRef, handleNextSlide, handlePrevSlide);

  // Touch gestures
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchGestures(enableTouchGestures, handleNextSlide, handlePrevSlide);

  const getImageSrc = useMemo(() => {
    return (index) => {
      // Show loading image while image is loading (if provided)
      if (imageLoadStates[index] === 'loading' && loadingImage) {
        return loadingImage;
      }
      // Show fallback image if there's an error
      if (imageLoadStates[index] === 'error') {
        return fallbackImage;
      }
      // Show the actual image
      const baseSrc = validImages[index];
      return getGifSrc(baseSrc, index);
    };
  }, [imageLoadStates, fallbackImage, validImages, getGifSrc, loadingImage]);

  // Loading state
  if (isLoading && preloadImages) {
    return (
      <div className={`relative w-full h-full overflow-hidden flex items-center justify-center ${className}`}>
        <div 
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{
            borderColor: `${colors.text}40`,
            borderTopColor: colors.text
          }}
        />
      </div>
    );
  }

  // Arrow styles
  const arrowClasses = arrowStyle === 'square' 
    ? "p-2 transition-all duration-300 shadow-lg"
    : "p-2 rounded-full transition-all duration-300 backdrop-blur-sm";

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden focus:outline-none ${className}`}
      style={{ 
        maxHeight,
        width: `calc(${maxWidth} + 100px)`,
        maxWidth: `calc(${maxWidth} + 100px)`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: transitionDuration, ease: "easeInOut" }}
          >
            <img
              src={getImageSrc(currentIndex)}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              onError={() => handleImageError(currentIndex)}
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Fallback content when no valid images */}
            {validImages.length === 1 && validImages[0] === fallbackImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                <div className="text-center">
                  <div className="text-lg" style={{ color: colors.text, opacity: 0.7 }}>No images available</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows 
      {showArrows && validImages.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${arrowClasses}`}
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextSlide}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 ${arrowClasses}`}
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
 */}
      {/* Dots Indicator 
      {showDots && validImages.length > 1 && (
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 ${
            dotPosition === 'top' ? 'top-4' : 'bottom-4'
          } z-10`}
        >
          <div className="flex justify-center items-center space-x-2">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-600 ${
                  index === currentIndex 
                    ? 'w-5 h-2 bg-black rounded-full' 
                    : 'w-2 h-2 bg-gray-300 opacity-40 hover:bg-gray-600 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      )}
        */}


    </div>
  );
};

export default ImageAutoSlider;
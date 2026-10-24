import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { imageUtils } from '@/utils/imageUtils';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import ImageCaptionTooltip from './ImageCaptionTooltip';

const VISITOR_HIDDEN_FIELDS = ['order', 'language', 'mark'];

const ImageThumbnail = React.memo(({ 
  src, 
  alt, 
  onMouseEnter, 
  onMouseLeave, 
  isHovered,
  enableGifRestart = true,
  // New tooltip props
  isCn = false,
  captionEn,
  captionCn,
  showTooltip = true,
  tooltipPosition = 'bottom'
}) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!src || src.trim() === '') {
    return (
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded flex items-center justify-center">
        <LoadingSpinner size={24} />
      </div>
    );
  }

  return (
    <div 
      className="relative w-20 h-20 rounded overflow-hidden cursor-pointer group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        className="w-full h-full"
        animate={isHovered ? { 
          scale: 2, 
          zIndex: 50,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)' 
        } : { 
          scale: 1, 
          zIndex: 1,
          boxShadow: 'none' 
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 260, 
          damping: 20,
          duration: 0.3 
        }}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <LoadingSpinner size={30} />
          </div>
        )}
        
        <img
          src={enableGifRestart && imageUtils.isGif(src) 
            ? imageUtils.addTimestampToGif(src, Date.now())
            : src
          }
          alt={alt}
          className="w-full h-full object-cover rounded"
          style={{
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
          loading="lazy"
          onLoad={() => {
            setIsLoading(false);
            if (imageUtils.isGif(src)) {
              console.log('GIF loaded in ImageThumbnail:', src);
            }
          }}
          onError={(e) => {
            setIsLoading(false);
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<div class="w-full h-full bg-gray-100 dark:bg-gray-900 rounded flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400 dark:text-gray-600"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/></svg></div>';
          }}
        />
      </motion.div>

      {/* Tooltip */}
      <ImageCaptionTooltip
        caption={isCn ? captionCn : captionEn}
        altText={alt}
        isCn={isCn}
        showTooltip={showTooltip}
        position={tooltipPosition}
      />
    </div>
  );
});

ImageThumbnail.displayName = 'ImageThumbnail';

export default ImageThumbnail; 
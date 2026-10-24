import React, { useState, useCallback } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation configuration for thumbnail
const THUMBNAIL_ANIMATION = {
  hover: { scale: 2, zIndex: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.25)' },
  initial: { scale: 1, zIndex: 2, boxShadow: 'none' },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
};

/**
 * MediaThumbnail Component
 * Displays a clickable thumbnail with hover effects and video indicator
 */
const MediaThumbnail = ({ 
  imgUrl, 
  videoUrl, 
  title, 
  isCn = false, 
  onMediaClick,
  className = "relative w-20 h-20 overflow-hidden ml-5 flex-shrink-0"
}) => {
  const [thumbHover, setThumbHover] = useState(false);

  const handleThumbnailEnter = useCallback(() => {
    setThumbHover(true);
  }, []);

  const handleThumbnailLeave = useCallback(() => {
    setThumbHover(false);
  }, []);

  const handleClick = useCallback(() => {
    if (onMediaClick) {
      onMediaClick();
    }
  }, [onMediaClick]);

  const hasMedia = (imgUrl && imgUrl.trim() !== '') || (videoUrl && videoUrl.trim() !== '');
  const displayUrl = imgUrl && imgUrl.trim() !== '' ? imgUrl : '/error.png';
  const hasVideo = videoUrl && videoUrl.trim() !== '';

  if (!hasMedia) return null;

  return (
    <div className={className}>
      <motion.div
        className="w-full h-full cursor-pointer relative"
        animate={thumbHover ? THUMBNAIL_ANIMATION.hover : THUMBNAIL_ANIMATION.initial}
        transition={THUMBNAIL_ANIMATION.transition}
        onMouseEnter={handleThumbnailEnter}
        onMouseLeave={handleThumbnailLeave}
        onClick={handleClick}
      >
        <img
          src={displayUrl}
          alt={imgUrl && imgUrl.trim() !== '' 
            ? title 
            : (isCn ? '图片加载失败' : 'Image not available')
          }
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/error.png';
          }}
        />
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 
                        opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Play 
              size={24} 
              className="text-white fill-white" 
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MediaThumbnail;

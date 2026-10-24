import React, { useState } from 'react';
import { motion } from 'framer-motion';

import LoadingSpinner from '@/components/animations/LoadingSpinner';

const MediaPreview = ({
  // Media sources
  imageUrl,
  videoUrl,
  
  // Display options
  altText = '',
  isCn = false,
  isHovered = false,
  
  // Caption data
  captionEn,
  captionCn,
  
  // Event handlers
  onPreview,
  onImageClick,
  
  // Styling
  className = '',
  aspectRatio = 'aspect-[1/1]',
  minHeight = 180,
  showTooltip = true,
  tooltipPosition = 'bottom',
  tooltipDelay = 300, // Add this prop
  
  // Animation settings
  enableHoverScale = true,
  hoverScale = 1.05,
  
  // Loading and error states
  showLoadingSpinner = true,
  showErrorState = true,
  
  // Video settings
  videoMuted = true,
  videoLoop = true,
  videoAutoPlay = true,
  videoPlaysInline = true,
  
  // Rest props - but filter out non-DOM props
  ...restProps
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Determine media type
  const hasVideo = Boolean(videoUrl && videoUrl.trim());
  const hasImage = Boolean(imageUrl && imageUrl.trim());
  
  // Get the appropriate caption based on language
  const getCaption = () => {
    if (isCn && captionCn) return captionCn;
    if (!isCn && captionEn) return captionEn;
    return null;
  };

  const caption = getCaption();

  // Event handlers
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleMediaClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onImageClick) {
      onImageClick(e);
    } else if (onPreview) {
      onPreview(e);
    }
  };

  // Filter out non-DOM props to prevent React warnings
  const domProps = Object.keys(restProps).reduce((acc, key) => {
    // Only include props that are valid HTML attributes
    const validDomProps = [
      'id', 'style', 'data-*', 'aria-*', 'role', 'tabIndex', 'onKeyDown', 'onKeyUp', 'onKeyPress'
    ];
    
    if (validDomProps.includes(key) || key.startsWith('data-') || key.startsWith('aria-')) {
      acc[key] = restProps[key];
    }
    return acc;
  }, {});

  // Render video content
  const renderVideo = () => (
    <video 
      src={videoUrl}
      className="w-full h-full object-cover"
      muted={videoMuted}
      loop={videoLoop}
      autoPlay={videoAutoPlay}
      playsInline={videoPlaysInline}
    />
  );

  // Render image content
  const renderImage = () => (
    <>
      {showLoadingSpinner && imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <LoadingSpinner />
        </div>
      )}
      
      {showErrorState && imageError && (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">
            {isCn ? '图片加载失败' : 'Image failed to load'}
          </span>
        </div>
      )}
      
      <img 
        src={imageUrl}
        alt={altText}
        className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
      />
    </>
  );

  // Render no media state
  const renderNoMedia = () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <span className="text-gray-400 text-sm">
        {isCn ? '无图片' : 'No image available'}
      </span>
    </div>
  );

  // Determine media content
  const mediaContent = hasVideo ? renderVideo() : 
                      hasImage ? renderImage() : 
                      renderNoMedia();

  // Tooltip content
  const tooltipContent = caption || altText || (isCn ? '点击查看大图' : 'Click to view larger');

  return (
    <div 
      className={`relative overflow-hidden group cursor-pointer ${className}`}
      onClick={handleMediaClick}
      {...domProps} // Only spread valid DOM props
    >
      {/* Media container with hover animation */}
      <motion.div
        className="w-full h-full"
        animate={{
          scale: enableHoverScale && isHovered ? hoverScale : 1,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        style={{
          transformOrigin: 'center center',
          height: '100%',
          width: '100%'
        }}
      >
        {mediaContent}
      </motion.div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
      
      {/* Tooltip for image caption */}
      {showTooltip && caption && (
        <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-lg mb-2 max-w-[90%] text-center">
            {caption}
          </div>
        </div>
      )}

      {/* Hover tooltip using title attribute for accessibility */}
      {showTooltip && (
        <div 
          className="absolute inset-0"
          title={tooltipContent}
          aria-label={tooltipContent}
        />
      )}
    </div>
  );
};

export default MediaPreview;

"use client";

import React, { useState, useCallback } from 'react';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import ImageCaptionTooltip from './ImageCaptionTooltip';

const CardImage = React.memo(({ 
  imageUrl, 
  title, 
  config = {}, 
  isCn = false, 
  children,
  captionEn,
  captionCn,
  showTooltip = true,
  tooltipPosition = 'bottom'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!imageUrl) return null;

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback((e) => {
    setIsLoading(false);
    setHasError(true);
    e.target.style.background = config.imageErrorColor || '#f0f0f0';
    e.target.alt = config.imageErrorText || 'Image unavailable';
  }, [config.imageErrorColor, config.imageErrorText]);

  const imageClassName = `w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
    config.imageClassName || 'aspect-[4/3]'
  } rounded-t-lg`;

  const imageStyle = {
    minHeight: config.minImageHeight || 200,
    maxHeight: config.maxImageHeight || 300,
    background: config.imagePlaceholderColor || '#f4f4f4',
    display: 'block',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    opacity: isLoading ? 0 : 1,
    transition: 'opacity 0.3s ease',
    ...config.imageStyle
  };

  return (
    <div className="relative overflow-hidden rounded-t-lg group">
      {children}
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <LoadingSpinner size={40} />
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={title}
        className={imageClassName}
        style={imageStyle}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Tooltip */}
      <ImageCaptionTooltip
        caption={isCn ? captionCn : captionEn}
        altText={title}
        isCn={isCn}
        showTooltip={showTooltip}
        position={tooltipPosition}
      />
    </div>
  );
});

CardImage.displayName = 'CardImage';

export default CardImage;
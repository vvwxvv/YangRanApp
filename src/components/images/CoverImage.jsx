"use client";

import { useState, useCallback } from 'react';
import OptimizedImage from '@/components/images/OptimizedImage';

const CoverImage = ({
  coverImageUrl,
  zoomLevel = 1,
  onImageClick,
  onWheel,
  isSmallScreen = false,
  title = "Cover Image",
  alt = "Cover Image"
}) => {
  // null = not yet loaded, true = portrait, false = landscape
  const [isPortrait, setIsPortrait] = useState(null);

  const handleLoad = useCallback((e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setIsPortrait(naturalHeight > naturalWidth);
  }, []);

  return (

    <div className="w-full flex justify-center items-center bg-transparent">
      <OptimizedImage
        src={coverImageUrl}
        alt={alt}
        onClick={onImageClick ? () => onImageClick(coverImageUrl, title) : undefined}
        onWheel={!isSmallScreen ? onWheel : undefined}
        onLoad={handleLoad}
        loading="eager"
        style={{
          display: 'block',
          // Portrait → fill 90vh tall, auto width
          // Landscape → fill 100% width, auto height (capped at 90vh)
          width: isPortrait ? 'auto' : '100%',
          height: isPortrait ? '90vh' : 'auto',
          maxWidth: '100%',
          maxHeight: '90vh',
          objectFit: 'contain',
          transform: !isSmallScreen ? `scale(${zoomLevel})` : 'none',
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out',
          cursor: onImageClick ? 'pointer' : 'default',
        }}
      />
    </div>
  );
};

export default CoverImage;
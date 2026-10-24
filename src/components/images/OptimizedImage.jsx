"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { imageUtils } from '@/utils/imageUtils';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import { useReverseTheme } from '@/hooks/useReverseTheme';

const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = '/no-image.png',
  width,
  height,
  style = {},
  loading = 'lazy',
  quality = 75,
  placeholder = 'blur',
  onLoad,
  onError,
  onClick,
  enableGifRestart = true,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const { colors } = useReverseTheme();

  // Memoized optimized image URL
  const optimizedSrc = useMemo(() => {
    if (!imageSrc || imageSrc === fallbackSrc) return imageSrc;
    
    if (enableGifRestart && imageUtils.isGif(imageSrc)) {
      return imageUtils.addTimestampToGif(imageSrc, Date.now());
    }
    
    // Add your image optimization service logic here
    return imageSrc;
  }, [imageSrc, fallbackSrc, enableGifRestart]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading !== 'lazy' || !imgRef.current) {
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observerRef.current.observe(imgRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading]);

  // Update src when prop changes
  useEffect(() => {
    if (src !== imageSrc && src) {
      setImageSrc(src);
      setHasError(false);
      setIsLoading(true);
    }
  }, [src, imageSrc]);

  const handleImageLoad = useCallback((event) => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.(event);
  }, [onLoad]);

  const handleImageError = useCallback((event) => {
    setHasError(true);
    setIsLoading(false);
    
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    
    onError?.(event);
  }, [imageSrc, fallbackSrc, onError]);

  // Memoized styles
  const placeholderStyle = useMemo(() => ({
    backgroundColor: colors.background,
    backgroundImage: placeholder === 'blur' ? 
      `linear-gradient(45deg, ${colors.text}10 25%, transparent 25%), linear-gradient(-45deg, ${colors.text}10 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${colors.text}10 75%), linear-gradient(-45deg, transparent 75%, ${colors.text}10 75%)` :
      'none',
    backgroundSize: placeholder === 'blur' ? '20px 20px' : 'auto',
    backgroundPosition: placeholder === 'blur' ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'auto',
    borderRadius: '0px',
    ...style
  }), [placeholder, style, colors]);

  const imageStyle = useMemo(() => ({
    ...style,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoading ? 0 : 1,
    borderRadius: '0px',
  }), [style, isLoading]);

  // Don't render if not in view and lazy loading
  if (loading === 'lazy' && !isInView) {
    return (
      <div
        ref={imgRef}
        className={className}
        style={{
          ...placeholderStyle,
          width: '100%',
          height: height || 'auto',
          minHeight: height || '200px',
        }}
      />
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height, ...style }}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center" style={placeholderStyle}>
          <LoadingSpinner size={40} />
        </div>
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        style={{
          ...imageStyle,
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          display: 'block',
          borderRadius: '0px',
          overflow: 'hidden'
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        onClick={onClick}
        loading={loading}
        {...props}
      />
      
      {/* Error overlay */}
      {hasError && imageSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedImage);
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image } from 'antd';
import { imageUtils } from '@/utils/imageUtils';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import { useReverseTheme } from '@/hooks/useReverseTheme';

const FALLBACK_IMAGE = "/error.png";

const ImageZoomModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  title, 
  content,
  enableGifRestart = true
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gifKey, setGifKey] = useState(Date.now());
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const { colors } = useReverseTheme();

  // Memoized values
  const isGif = useMemo(() => 
    currentImageUrl ? imageUtils.isGif(currentImageUrl) : false, 
    [currentImageUrl]
  );

  const finalImageSrc = useMemo(() => {
    if (enableGifRestart && isGif) {
      return imageUtils.addTimestampToGif(currentImageUrl, gifKey);
    }
    return currentImageUrl;
  }, [enableGifRestart, isGif, currentImageUrl, gifKey]);

  // Update current image when imageUrl prop changes
  useEffect(() => {
    if (imageUrl && imageUrl !== currentImageUrl) {
      setCurrentImageUrl(imageUrl);
      setZoomLevel(1);
      setGifKey(Date.now());
    }
  }, [imageUrl, currentImageUrl]);

  // Reset zoom when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      if (imageUrl) {
        setCurrentImageUrl(imageUrl);
        setGifKey(Date.now());
      }
    }
  }, [isOpen, imageUrl]);

  const restartGif = useCallback(() => {
    if (isGif) {
      setGifKey(Date.now());
    }
  }, [isGif]);

  const handleImageWheel = useCallback((e) => {
    e.preventDefault();
    setZoomLevel(prev => {
      let next = prev + (e.deltaY < 0 ? 0.1 : -0.1);
      next = Math.max(1, Math.min(3, next));
      return Math.round(next * 100) / 100;
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(3, prev + 0.1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(1, prev - 0.1));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'r':
        case 'R':
          if (isGif) restartGif();
          break;
        case '0':
          resetZoom();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isGif, restartGif, resetZoom, handleZoomIn, handleZoomOut]);

  // Don't render if not open or no image
  if (!isOpen || !currentImageUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: `${colors.background}E6`
        }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Artwork image zoom"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-opacity-75 transition-all duration-200 z-50"
          style={{
            backgroundColor: `${colors.background}80`,
            color: colors.text
          }}
          aria-label="Close zoom view"
        >
          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* GIF Restart Button */}
        {isGif && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              restartGif();
            }}
            className="fixed left-6 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-opacity-75 transition-all duration-200 z-50"
            style={{
              backgroundColor: `${colors.background}80`,
              color: colors.text
            }}
            aria-label="Restart GIF"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}

        {/* Zoom Controls */}
        <div 
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 rounded-lg"
          style={{
            backgroundColor: `${colors.background}80`,
            color: colors.text
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
            aria-label="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <span className="text-sm min-w-[3rem] text-center">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
            aria-label="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetZoom();
            }}
            className="w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
            aria-label="Reset zoom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Help text for GIFs */}
        {isGif && (
          <div 
            className="fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: `${colors.background}80`,
              color: colors.text
            }}
          >
            Press <kbd style={{ backgroundColor: `${colors.text}20`, padding: '2px 4px', borderRadius: '4px' }}>R</kbd> to restart GIF
          </div>
        )}

        {/* Image Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-full max-h-full"
          onClick={e => e.stopPropagation()}
        >
          <Image
            src={finalImageSrc}
            alt={title || 'Image'}
            style={{ 
              maxWidth: '72vw', 
              maxHeight: '72vh', 
              objectFit: 'contain', 
              display: 'block', 
              margin: '0 auto', 
              borderRadius: 0,
              transition: 'transform 0.2s',
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
            fallback={FALLBACK_IMAGE}
            preview={false}
            onWheel={handleImageWheel}
            placeholder={
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: colors.background }}
              >
                <LoadingSpinner size={60} />
              </div>
            }
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(ImageZoomModal);

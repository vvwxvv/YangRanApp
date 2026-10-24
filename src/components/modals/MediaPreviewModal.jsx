import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageZoomModal from '@/components/images/ImageZoomModal';

// Animation configurations
const MODAL_ANIMATIONS = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  content: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
};

/**
 * MediaPreviewModal Component
 * Unified modal for previewing both images and videos with smooth animations
 */
const MediaPreviewModal = ({ 
  isOpen = false, 
  onClose, 
  imageUrl, 
  videoUrl, 
  title = '', 
  isCn = false,
  enableGifRestart = true,
  className = ''
}) => {
  // Determine if we have video content
  const hasVideo = videoUrl && videoUrl.trim() !== '';
  const hasImage = imageUrl && imageUrl.trim() !== '';
  
  // If no content, don't render
  if (!isOpen || (!hasVideo && !hasImage)) return null;

  // For images, use the existing ImageZoomModal for consistency
  if (hasImage && !hasVideo) {
    return (
      <ImageZoomModal
        isOpen={isOpen}
        onClose={onClose}
        imageUrl={imageUrl}
        title={title}
        enableGifRestart={enableGifRestart}
      />
    );
  }

  // For videos (with or without poster image)
  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-[10000] flex items-center justify-center ${className}`}
        initial={MODAL_ANIMATIONS.overlay.initial}
        animate={MODAL_ANIMATIONS.overlay.animate}
        exit={MODAL_ANIMATIONS.overlay.exit}
        transition={MODAL_ANIMATIONS.overlay.transition}
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/80"
          onClick={onClose}
        />
        
        {/* Content Container */}
        <motion.div
          className={`relative max-w-[90vw] max-h-[90vh] w-[80vw] rounded-lg overflow-hidden ${className}`}
          initial={MODAL_ANIMATIONS.content.initial}
          animate={MODAL_ANIMATIONS.content.animate}
          exit={MODAL_ANIMATIONS.content.exit}
          transition={MODAL_ANIMATIONS.content.transition}
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center 
                     bg-black/60 text-white border-none shadow-lg hover:bg-black/80 transition-colors 
                     focus:ring-2 focus:ring-white focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isCn ? '关闭预览' : 'Close preview'}
          >
            <span className="text-2xl font-bold">&times;</span>
          </motion.button>
          
          {/* Video Content */}
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-full max-h-[90vh]"
            poster={hasImage ? imageUrl : undefined}
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            {isCn ? '您的浏览器不支持视频播放。' : 'Your browser does not support the video tag.'}
          </video>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaPreviewModal;

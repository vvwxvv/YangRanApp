import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * CardMediaPreviewModal - A modal component for previewing card images and videos
 * Extracted from InfoCard for reusability
 */
const CardMediaPreviewModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  videoUrl, 
  hasVideo, 
  isCn 
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="absolute inset-0 bg-black/80"
          onClick={onClose}
        />
        <motion.div
          className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
          {hasVideo ? (
            <video src={videoUrl} controls className="w-full h-full" />
          ) : (
            <img src={imageUrl} alt="" className="w-full h-full object-contain" />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CardMediaPreviewModal; 
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UnderlineTitleAnimation = ({ title, isHovered, className, style }) => (
  <div className={`relative ${className}`} style={{ backgroundColor: 'transparent' }}>
    <h3 style={{ ...style, backgroundColor: 'transparent' }} className="text-black dark:text-white">
      {title}
    </h3>
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-0.5 bg-black dark:bg-white rounded-sm mt-0.5 absolute left-0 right-0 bottom-0 origin-left"
        />
      )}
    </AnimatePresence>
  </div>
);

export default UnderlineTitleAnimation;

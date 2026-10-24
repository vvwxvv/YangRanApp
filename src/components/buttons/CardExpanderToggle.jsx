import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CardExpanderToggle = ({ isExpanded, isCn, onClick }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div
      className="flex justify-center items-center py-3 bg-gray-50 dark:bg-black border-t border-gray-100 dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-200 cursor-pointer touch-manipulation"
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      role="button"
      aria-label={isExpanded ? (isCn ? '收起详情' : 'Collapse details') : (isCn ? '展开详情' : 'Expand details')}
      tabIndex={0}
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
    <motion.div
      className="focus:outline-none"
      animate={{ rotate: isExpanded ? 180 : 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <ChevronDown className="w-5 h-5 text-gray-600 dark:text-white" />
    </motion.div>
  </div>
  );
};

export default CardExpanderToggle; 
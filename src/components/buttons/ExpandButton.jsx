import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation configuration for expand button
const EXPAND_BUTTON_ANIMATION = {
  hover: { scale: 1.03 }, // slightly reduced to avoid jumpiness on touch
  tap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 400, damping: 25 }
};

/**
 * ExpandButton Component
 * Displays an animated expand/collapse button with chevron icons
 */
const ExpandButton = ({
  expanded = false,
  isCn = false,
  onToggle,
  className = "p-1 bg-transparent rounded-full transition-all duration-200 cursor-pointer border-none outline-none hover:shadow-lg focus:ring-2 focus:ring-black dark:focus:ring-white"
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onToggle) onToggle(e);
  };

  // Space/Enter activation for completeness
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onToggle) onToggle(e);
    }
  };

  // Prefer a minimum touch target size while keeping your padding
  const touchTargetClasses =
    "min-w-[44px] min-h-[44px] flex items-center justify-center " +
    "touch-manipulation select-none " +
    "[-webkit-tap-highlight-color:transparent]";

  // Slightly larger icon on small screens; keep 18px on md+
  const iconClass = "text-black dark:text-white transition-colors duration-200";
  const iconSize = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(min-width: 768px)').matches ? 18 : 20;

  return (
    <motion.button
      type="button"
      className={`${touchTargetClasses} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={EXPAND_BUTTON_ANIMATION.hover}
      whileTap={EXPAND_BUTTON_ANIMATION.tap}
      transition={EXPAND_BUTTON_ANIMATION.transition}
      aria-label={expanded ? (isCn ? '收起详情' : 'Collapse details') : (isCn ? '展开详情' : 'Expand details')}
      aria-pressed={expanded}
      // Improves scrolling vs tapping on mobile; allows taps to be responsive
      style={{ touchAction: 'manipulation' }}
    >
      {expanded ? (
        <ChevronUp size={iconSize} className={iconClass} />
      ) : (
        <ChevronDown size={iconSize} className={iconClass} />
      )}
    </motion.button>
  );
};

export default ExpandButton;
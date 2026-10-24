import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for the underline
const ANIMATION_VARIANTS = {
  underline: {
    initial: { width: 0, opacity: 0, x: -40 },
    animate: { width: 'calc(100% - 20px)', opacity: 1, x: 0 },
    exit: { width: 0, opacity: 0, x: -40 },
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

/**
 * TitleHoverUnderline Component
 * Displays a title with an animated underline that appears on hover
 * 
 * @param {Object} props
 * @param {string} props.title - The title text to display
 * @param {boolean} props.isHovered - Whether the title is currently hovered
 * @param {string} props.className - Additional CSS classes for the container
 * @param {Object} props.style - Additional inline styles for the title
 * @param {string} props.underlineColor - Color of the underline (defaults to CSS variable --text-primary)
 * @param {string} props.underlineWidth - Width of the underline (defaults to 'calc(100% - 20px)')
 * @param {number} props.underlineHeight - Height of the underline (defaults to 2px)
 * @param {string} props.underlinePosition - Position of the underline relative to title (defaults to 'bottom-0')
 */
const TitleHoverUnderline = ({
  title,
  isHovered,
  className = '',
  style = {},
  underlineColor = 'var(--text-primary, #000)',
  underlineWidth = 'calc(100% - 20px)',
  underlineHeight = '2px',
  underlinePosition = 'bottom-0'
}) => {
  return (
    <div className={`relative ${className}`}>
      <h3 
        className="text-black dark:text-white" 
        style={style}
      >
        {title}
      </h3>
      
      {isHovered && (
        <motion.div
          initial={ANIMATION_VARIANTS.underline.initial}
          animate={ANIMATION_VARIANTS.underline.animate}
          exit={ANIMATION_VARIANTS.underline.exit}
          transition={ANIMATION_VARIANTS.underline.transition}
          className={`h-0.5 rounded absolute left-0 right-5 ${underlinePosition} mt-0.5`}
          style={{
            backgroundColor: underlineColor,
            boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
            width: underlineWidth,
            height: underlineHeight
          }}
        />
      )}
    </div>
  );
};

export default TitleHoverUnderline;
export { ANIMATION_VARIANTS };

// components/cards/InfoCard.jsx
"use client";

import React, { useState, useCallback, useContext } from 'react';
import { Card } from 'antd';
import { motion } from 'framer-motion';
import { DeviceContext } from '@/components/contexts/DeviceContext';

// ============================================================================
// CONFIGURATION
// ============================================================================

export const INFO_CARD_CONFIG = {
  animation: {
    card: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    },
    content: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.1 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  },
  styles: {
    default: {
      border: '2px solid',
      borderColor: 'var(--border-color, #000)'
    }
  }
};

// ============================================================================
// BASE INFO CARD COMPONENT
// ============================================================================

const InfoCard = ({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  hoverable = true,
  height = '500px',
  backgroundColor = '#ffffff',
  useTransparentBackground = false,
  style = {},
  config = INFO_CARD_CONFIG,
  className = '',
  bodyPadding = 0,
  ...restProps
}) => {
  const { isMobile, isMiddleSizeDevice } = useContext(DeviceContext) || {};
  const isMobileDevice = isMobile || isMiddleSizeDevice;
  const [isHovered, setIsHovered] = useState(false);

  // ==================== CONFIG MERGE ====================
  const mergedConfig = {
    ...INFO_CARD_CONFIG,
    ...config,
    animation: { ...INFO_CARD_CONFIG.animation, ...config?.animation }
  };

  // ==================== EVENT HANDLERS ====================
  const handleMouseEnter = useCallback((e) => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter(e);
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback((e) => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  }, [onMouseLeave]);

  const handleClick = useCallback((e) => {
 // Allow click events on mobile but prevent bubbling from excluded elements
    if (e.target.closest('.no-card-click')) {
      e.stopPropagation();
      return;
    }
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }
  }, [onClick]);

  const handleTouchEnd = useCallback((e) => {
 // Mobile-specific touch handler
    if (!isMobileDevice || !onClick) return;
    
    if (e.target.closest('.no-card-click')) {
      e.stopPropagation();
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  }, [onClick, isMobileDevice]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) onClick(e);
    }
  }, [onClick]);

  // ==================== RENDER ====================
  return (
    <motion.div
      initial={mergedConfig.animation.card.initial}
      animate={mergedConfig.animation.card.animate}
      transition={mergedConfig.animation.card.transition}
      whileTap={onClick ? mergedConfig.animation.tap : undefined}
      className={className}
    >
      <Card
        hoverable={!isMobileDevice && hoverable && !!onClick}
        variant="bordered"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : -1}
        role={onClick ? "button" : undefined}
        aria-label={onClick ? "Interactive card" : undefined}
        styles={{ 
          body: {
            padding: bodyPadding,
            height: isMobileDevice ? 'auto' : height,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
        style={{
          ...INFO_CARD_CONFIG.styles.default,
          ...style,
          backgroundColor: useTransparentBackground ? 'transparent' : backgroundColor,
          cursor: onClick ? 'pointer' : 'default',
 // Enhanced mobile touch optimization
          touchAction: onClick ? 'manipulation' : 'auto',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          pointerEvents: 'auto',
        }}
        {...restProps}
      >
        {typeof children === 'function' 
          ? children({ isHovered, isMobileDevice, config: mergedConfig })
          : children
        }
      </Card>
    </motion.div>
  );
};

export default React.memo(InfoCard);

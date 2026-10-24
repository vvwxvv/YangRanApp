
import React from 'react';
import { motion } from 'framer-motion';

const GlaseeButton = ({
  children,
  onClick,
  className = "",
  style = {},
  variant = "default", // "default", "outlined", "filled"
  size = "medium", // "small", "medium", "large"
  position = "center", // "center", "top", "bottom", "left", "right"
  disabled = false,
  loading = false,
  fullWidth = false,
  minWidth = "200px",
  maxWidth = "80%",
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  // Size variants
  const sizeStyles = {
    small: {
      padding: "8px 16px",
      fontSize: "14px",
      minWidth: "120px"
    },
    medium: {
      padding: "12px 24px",
      fontSize: "18px",
      minWidth: "200px"
    },
    large: {
      padding: "16px 32px",
      fontSize: "22px",
      minWidth: "280px"
    }
  };

  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      color: 'white'
    },
    outlined: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.8)',
      color: 'white'
    },
    filled: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.6)',
      color: 'white'
    }
  };

  // Position styles
  const getPositionStyles = () => {
    const baseTransform = 'translate(-50%, -50%)';
    
    switch (position) {
      case 'top':
        return { top: '20%', left: '50%', transform: baseTransform };
      case 'bottom':
        return { bottom: '20%', left: '50%', transform: baseTransform };
      case 'left':
        return { top: '50%', left: '20%', transform: baseTransform };
      case 'right':
        return { top: '50%', right: '20%', transform: baseTransform };
      default: // center
        return { top: '50%', left: '50%', transform: baseTransform };
    }
  };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    
    // Enhanced hover effect - preserve original transform
    e.currentTarget.style.backgroundColor = variant === 'filled' 
      ? 'rgba(255, 255, 255, 0.3)' 
      : 'rgba(255, 255, 255, 0.2)';
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
    // Preserve the original transform and just add scale
    const originalTransform = e.currentTarget.style.transform || 'translate(-50%, -50%)';
    e.currentTarget.style.transform = originalTransform.replace('scale(1)', 'scale(1.05)') || originalTransform + ' scale(1.05)';
    
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;
    
    // Reset to original state - preserve original transform
    e.currentTarget.style.backgroundColor = variantStyles[variant].backgroundColor;
    e.currentTarget.style.borderColor = variantStyles[variant].borderColor;
    // Remove scale but keep original transform
    const originalTransform = e.currentTarget.style.transform || 'translate(-50%, -50%)';
    e.currentTarget.style.transform = originalTransform.replace(' scale(1.05)', '') || originalTransform;
    
    onMouseLeave?.(e);
  };

  const buttonStyles = {
    ...getPositionStyles(),
    ...variantStyles[variant],
    ...sizeStyles[size],
    backdropFilter: 'blur(10px)',
    border: `1px solid ${variantStyles[variant].borderColor}`,
    borderRadius: "10px",
    fontWeight: "600",
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    minWidth: fullWidth ? '100%' : sizeStyles[size].minWidth,
    maxWidth: fullWidth ? '100%' : maxWidth,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: disabled ? 0.6 : 1,
    ...style
  };

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
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={`absolute z-20 touch-manipulation ${className}`}
      style={{
        ...buttonStyles,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default GlaseeButton;

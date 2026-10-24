"use client";
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// CSS Styles Constants
const STYLES = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  
  modal: {
    base: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      textAlign: 'center',
      maxWidth: '450px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
      position: 'relative',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    success: {
      borderTop: '4px solid #4caf50',
    },
    
    error: {
      borderTop: '4px solid #f44336',
    },
    
    warning: {
      borderTop: '4px solid #ff9800',
    },
    
    info: {
      borderTop: '4px solid #2196f3',
    },
  },
  
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)',
    },
  },
  
  iconContainer: {
    base: {
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      position: 'relative',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    
    success: {
      backgroundColor: '#4caf50',
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
    },
    
    error: {
      backgroundColor: '#f44336',
      background: 'linear-gradient(135deg, #f44336 0%, #c62828 100%)',
    },
    
    warning: {
      backgroundColor: '#ff9800',
      background: 'linear-gradient(135deg, #ff9800 0%, #e65100 100%)',
    },
    
    info: {
      backgroundColor: '#2196f3',
      background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
    },
  },
  
  icon: {
    color: '#ffffff',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  
  title: {
    mb: 2,
    fontWeight: 600,
    color: '#1a1a1a',
    fontSize: '1.375rem',
    lineHeight: 1.3,
  },
  
  message: {
    mb: 3,
    color: '#4a4a4a',
    fontSize: '1rem',
    lineHeight: 1.5,
    maxWidth: '320px',
    margin: '0 auto 24px',
  },
  
  redirectMessage: {
    color: '#6b7280',
    fontSize: '0.875rem',
    fontStyle: 'italic',
    lineHeight: 1.4,
  },
  
  actionButton: {
    mt: 2,
    px: 3,
    py: 1.5,
    borderRadius: '8px',
    fontWeight: 500,
    textTransform: 'none',
    minWidth: '120px',
  },
};

// Animation Constants
const ANIMATIONS = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  
  modal: {
    initial: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    },
  },
  
  icon: {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.2,
      }
    },
  },
  
  content: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.3,
      }
    },
  },
};

// Component Constants
const CONSTANTS = {
  types: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
  
  defaultTexts: {
    success: {
      title: 'Success!',
      message: 'Operation completed successfully.',
    },
    error: {
      title: 'Error',
      message: 'Something went wrong. Please try again.',
    },
    warning: {
      title: 'Warning',
      message: 'Please review your action.',
    },
    info: {
      title: 'Information',
      message: 'Here\'s some important information.',
    },
  },
  
  icons: {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  },
};

/**
 * SuccessPopup Component
 * A versatile modal popup for displaying success, error, warning, or info messages
 * 
 * @param {boolean} show - Whether to show the popup
 * @param {string} type - Type of popup (success, error, warning, info)
 * @param {string} title - Title text to display
 * @param {string} message - Main message text
 * @param {string} redirectMessage - Optional redirect/additional message
 * @param {boolean} showCloseButton - Whether to show close button
 * @param {Function} onClose - Callback when popup is closed
 * @param {boolean} autoClose - Whether to auto-close after delay
 * @param {number} autoCloseDelay - Delay in milliseconds before auto-closing
 * @param {React.ReactNode} customIcon - Custom icon to display
 * @param {Object} customStyles - Custom styles to override defaults
 * @param {boolean} disableBackdropClick - Disable closing on backdrop click
 * @param {boolean} disableAnimation - Disable entry/exit animations
 * @param {React.ReactNode} children - Additional content to render
 */
const SuccessPopup = ({
  show = false,
  type = CONSTANTS.types.SUCCESS,
  title,
  message,
  redirectMessage,
  showCloseButton = true,
  onClose,
  autoClose = false,
  autoCloseDelay = 3000,
  customIcon,
  customStyles = {},
  disableBackdropClick = false,
  disableAnimation = false,
  children,
  ...otherProps
}) => {
  // Auto-close functionality
  React.useEffect(() => {
    if (!autoClose || !show) return;

    const timer = setTimeout(() => {
      handleClose();
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoClose, autoCloseDelay, show]);

  // Keyboard event handler
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && show && onClose) {
        handleClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (!disableBackdropClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Validation
  if (!Object.values(CONSTANTS.types).includes(type)) {
    console.warn(`Invalid type "${type}". Using "success" instead.`);
    type = CONSTANTS.types.SUCCESS;
  }

  const getModalStyles = () => {
    const baseStyles = STYLES.modal.base;
    const typeStyles = STYLES.modal[type] || {};
    
    return {
      ...baseStyles,
      ...typeStyles,
      ...customStyles.modal,
    };
  };

  const getIconContainerStyles = () => {
    const baseStyles = STYLES.iconContainer.base;
    const typeStyles = STYLES.iconContainer[type] || STYLES.iconContainer.success;
    
    return {
      ...baseStyles,
      ...typeStyles,
      ...customStyles.iconContainer,
    };
  };

  const renderIcon = () => {
    if (customIcon) {
      return customIcon;
    }

    const IconComponent = CONSTANTS.icons[type] || CONSTANTS.icons.success;
    return <IconComponent size={32} color="white" />;
  };

  const getDefaultTitle = () => {
    return title || CONSTANTS.defaultTexts[type]?.title || CONSTANTS.defaultTexts.success.title;
  };

  const getDefaultMessage = () => {
    return message || CONSTANTS.defaultTexts[type]?.message || CONSTANTS.defaultTexts.success.message;
  };

  const MotionBox = disableAnimation ? Box : motion.div;
  const animationProps = disableAnimation ? {} : ANIMATIONS;

  return (
    <AnimatePresence>
      {show && (
        <MotionBox
          {...(disableAnimation ? {} : animationProps.overlay)}
          sx={STYLES.overlay}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
          aria-describedby="popup-message"
          {...otherProps}
        >
          <MotionBox
            {...(disableAnimation ? {} : animationProps.modal)}
            sx={getModalStyles()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {showCloseButton && onClose && (
              <IconButton
                onClick={handleClose}
                sx={{ ...STYLES.closeButton, ...customStyles.closeButton }}
                aria-label="Close popup"
                size="small"
              >
                <X size={18} />
              </IconButton>
            )}

            {/* Icon */}
            <motion.div
              {...(disableAnimation ? {} : animationProps.icon)}
              style={getIconContainerStyles()}
            >
              {renderIcon()}
            </motion.div>

            {/* Content */}
            <motion.div {...(disableAnimation ? {} : animationProps.content)}>
              <Typography 
                id="popup-title"
                variant="h6" 
                sx={{ ...STYLES.title, ...customStyles.title }}
              >
                {getDefaultTitle()}
              </Typography>
              
              <Typography 
                id="popup-message"
                variant="body1" 
                sx={{ ...STYLES.message, ...customStyles.message }}
              >
                {getDefaultMessage()}
              </Typography>

              {redirectMessage && (
                <Typography 
                  variant="body2" 
                  sx={{ ...STYLES.redirectMessage, ...customStyles.redirectMessage }}
                >
                  {redirectMessage}
                </Typography>
              )}

              {/* Additional content */}
              {children}
            </motion.div>
          </MotionBox>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default SuccessPopup;
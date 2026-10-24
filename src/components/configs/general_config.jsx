// General configuration for the application
// This file contains common settings that can be used across different components

// Layout constants
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1200;

// Animation constants
export const ANIMATION_DURATION = {
  FAST: 150,
  MEDIUM: 250,
  SLOW: 400
};

// Layout dimensions
export const LAYOUT_DIMENSIONS = {
  SIDEBAR_WIDTH: 500,
  HEADER_HEIGHT: 56,
  MOBILE_HEADER_HEIGHT: 44,
  PADDING: {
    SMALL: 10,
    MEDIUM: 20,
    LARGE: 40
  }
};

// View modes
export const VIEW_MODES = {
  LIST: 'list',
  CARD: 'card',
  GRID: 'grid',
  TABLE: 'table'
};

// Z-index layers
export const Z_INDEX = {
  BACKGROUND: 1,
  CONTENT: 10,
  OVERLAY: 20,
  MODAL: 30,
  TOOLTIP: 40,
  NOTIFICATION: 50
};

// Common animation variants
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  },
  listItem: {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 }
    }
  },
  detail: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.15 }
    }
  },
  mobileSlide: {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: '100%',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Successfully saved.',
  UPDATED: 'Successfully updated.',
  DELETED: 'Successfully deleted.',
  UPLOADED: 'Successfully uploaded.'
};

// Theme configuration
export const THEME = {
  COLORS: {
    PRIMARY: '#000000',
    SECONDARY: '#ffffff',
    ACCENT: '#f0f0f0',
    TEXT: '#333333',
    BORDER: '#e0e0e0',
    BACKGROUND: '#ffffff',
    OVERLAY: 'rgba(0, 0, 0, 0.5)'
  },
  FONTS: {
    MONO: 'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", monospace',
    SANS: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  }
};

// Configuration object for easy access
export const CONFIG = {
  BREAKPOINTS: {
    MOBILE: MOBILE_BREAKPOINT,
    TABLET: TABLET_BREAKPOINT,
    DESKTOP: DESKTOP_BREAKPOINT
  },
  ANIMATION: ANIMATION_DURATION,
  LAYOUT: LAYOUT_DIMENSIONS,
  VIEW_MODES,
  Z_INDEX,
  THEME
};

// Common utility functions
export const sortAlphabetically = (a, b) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
};

export const sortYearsDescending = (a, b) => {
  const yearA = parseInt(a) || 0;
  const yearB = parseInt(b) || 0;
  return yearB - yearA;
};

export default CONFIG;

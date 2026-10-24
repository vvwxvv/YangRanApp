"use client";

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Comprehensive custom hook for managing background colors across the entire application
 * @param {string} customColor - Custom hex color (e.g., 'transparent')
 * @param {Object} options - Additional options
 * @param {boolean} options.useCustomColor - Whether to use custom color or fallback to CSS variables
 * @param {string} options.fallbackColor - Fallback color if custom color is not provided
 * @param {boolean} options.enableTransparency - Whether to enable transparency variants
 * @param {boolean} options.isDarkMode - Whether dark mode is active
 * @returns {Object} Object containing comprehensive background color utilities
 */
const useBackgroundColor = (customColor = null, options = {}) => {
  const {
    useCustomColor = true,
    fallbackColor = 'var(--background-primary, #ffffff)',
    enableTransparency = true,
    isDarkMode = false
  } = options;

  const pathname = usePathname();
  const isManagerPage = pathname?.includes('/manager/');

  const pageBackgroundColor = useMemo(() => {
    // If it's dark mode, use black background for page
    if (isDarkMode) {
      return '#000000';
    }
    
    // If it's a manager page, use transparent background for page too
    if (isManagerPage) {
      return 'transparent';
    }
    
    // Otherwise use the custom color or fallback for page only
    if (useCustomColor && customColor) {
      return customColor;
    }
    return fallbackColor;
  }, [customColor, useCustomColor, fallbackColor, isManagerPage, isDarkMode]);

  const backgroundStyles = useMemo(() => {
    const baseStyles = {
      // ONLY the main page gets the custom background color
      page: {
        backgroundColor: pageBackgroundColor,
        minHeight: '100vh',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      
      // EVERYTHING ELSE gets transparent background
      body: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      
      // Layout backgrounds - ALL TRANSPARENT
      layout: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      container: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      wrapper: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      
      // Section backgrounds - ALL TRANSPARENT
      section: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      main: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      content: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      
      // Navigation backgrounds - ALL TRANSPARENT
      nav: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      navbar: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      header: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      footer: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      sidebar: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      menu: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      
      // Image and media backgrounds - ALL TRANSPARENT
      imageArea: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      gallery: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      slider: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      carousel: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      mediaContainer: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      
      // Card and component backgrounds - ALL TRANSPARENT
      card: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      infoCard: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      artworkCard: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      eventCard: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      modal: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      dialog: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      popup: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      tooltip: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      
      // Form and input backgrounds - ALL TRANSPARENT
      form: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      input: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      button: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      select: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      
      // List and table backgrounds - ALL TRANSPARENT
      list: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      table: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      row: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      cell: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      
      // Overlay and backdrop backgrounds - ALL TRANSPARENT
      overlay: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      backdrop: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      mask: {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: isDarkMode ? '#ffffff' : '#000000'
      }
    };

    // Add transparency variants if enabled
    if (enableTransparency) {
      const transparencyLevels = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      transparencyLevels.forEach(level => {
        baseStyles[`transparent${level}`] = {
          backgroundColor: 'transparent',
          background: 'transparent'
        };
      });
    }

    return baseStyles;
  }, [pageBackgroundColor, enableTransparency, isDarkMode]);

  const getBackgroundStyle = (type = 'page') => {
    return backgroundStyles[type] || backgroundStyles.page;
  };

  const getBackgroundColor = (type = 'page') => {
    if (type === 'page') {
      return pageBackgroundColor;
    }
    return 'transparent';
  };

  const applyBackgroundToElement = (elementRef, type = 'page') => {
    if (elementRef?.current) {
      Object.assign(elementRef.current.style, backgroundStyles[type]);
    }
  };

  const applyBackgroundToMultipleElements = (elementRefs, type = 'page') => {
    elementRefs.forEach(ref => {
      if (ref?.current) {
        Object.assign(ref.current.style, backgroundStyles[type]);
      }
    });
  };

  // CSS-in-JS utilities
  const createBackgroundStyle = (type = 'page', additionalStyles = {}) => {
    return {
      ...backgroundStyles[type],
      ...additionalStyles
    };
  };

  const createResponsiveBackground = (mobileType = 'page', desktopType = 'page') => {
    return {
      '@media (max-width: 768px)': backgroundStyles[mobileType],
      '@media (min-width: 769px)': backgroundStyles[desktopType]
    };
  };

  // Theme-aware utilities
  const getThemeAwareBackground = (isDark = false) => {
    if (isDark) {
      return {
        backgroundColor: 'transparent',
        background: 'transparent',
        color: '#ffffff'
      };
    }
    return {
      backgroundColor: 'transparent',
      background: 'transparent',
      color: '#000000'
    };
  };

  // Color manipulation utilities
  const getLighterVariant = (percentage = 20) => {
    return 'transparent';
  };

  const getDarkerVariant = (percentage = 20) => {
    return 'transparent';
  };

  return {
    // Core values
    backgroundColor: pageBackgroundColor, // Only for page
    backgroundStyles,
    
    // Style getters
    getBackgroundStyle,
    getBackgroundColor,
    
    // Application methods
    applyBackgroundToElement,
    applyBackgroundToMultipleElements,
    
    // Style creation utilities
    createBackgroundStyle,
    createResponsiveBackground,
    getThemeAwareBackground,
    
    // Color manipulation
    getLighterVariant,
    getDarkerVariant,
    
    // Utility functions
    isCustomColor: useCustomColor && !!customColor,
    hasTransparency: enableTransparency,
    
    // Predefined color schemes
    colorSchemes: {
      default: fallbackColor,
      custom: customColor,
      light: '#f9fafb',
      dark: '#1f2937',
      green: 'transparent',
      blue: '#dbeafe',
      yellow: '#fef3c7',
      red: '#fee2e2',
      purple: '#f3e8ff',
      orange: '#fed7aa',
      teal: '#ccfbf1'
    },
    
    // Common component types for easy access
    components: {
      navigation: ['nav', 'navbar', 'header', 'footer', 'sidebar', 'menu'],
      media: ['imageArea', 'gallery', 'slider', 'carousel', 'mediaContainer'],
      cards: ['card', 'infoCard', 'artworkCard', 'eventCard'],
      forms: ['form', 'input', 'button', 'select'],
      layouts: ['page', 'layout', 'container', 'wrapper', 'section', 'main', 'content']
    }
  };
};

export default useBackgroundColor;
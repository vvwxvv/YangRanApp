/**
 * Utility functions for theme management
 */

/**
 * Set CSS variables for theme colors
 * @param {Object} colors - Theme colors object
 */
export const setThemeCSSVariables = (colors) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Set CSS variables for theme colors
  root.style.setProperty('--text-primary', colors.text);
  root.style.setProperty('--background-primary', colors.background);
  root.style.setProperty('--border-light', colors.border);
  root.style.setProperty('--drawer-bg', colors.background);
  root.style.setProperty('--interactive-background-hover', colors.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)');
};

/**
 * Clear theme CSS variables
 */
export const clearThemeCSSVariables = () => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Remove CSS variables
  root.style.removeProperty('--text-primary');
  root.style.removeProperty('--background-primary');
  root.style.removeProperty('--border-light');
  root.style.removeProperty('--drawer-bg');
  root.style.removeProperty('--interactive-background-hover');
}; 
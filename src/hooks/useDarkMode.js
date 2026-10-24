import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const detectTheme = () => {
      try {
        // Check multiple sources for theme
        const dataTheme = document.documentElement.getAttribute('data-theme');
        const hasDarkClass = document.documentElement.classList.contains('dark');
        
        // Check CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        const bgColor = computedStyle.getPropertyValue('--background-primary').trim();
        const textColor = computedStyle.getPropertyValue('--text-primary').trim();
        
        // Priority: data-theme attribute > dark class > CSS variables > system preference
        if (dataTheme === 'dark' || hasDarkClass) {
          setIsDark(true);
        } else if (dataTheme === 'light') {
          setIsDark(false);
        } else if (bgColor === '#000000' || bgColor === '#1a1a1a' || textColor === '#ffffff') {
          // Check if CSS variables indicate dark mode
          setIsDark(true);
        } else if (bgColor === '#ffffff' || bgColor === 'transparent' || textColor === '#000000') {
          setIsDark(false);
        } else {
          // Fallback to system preference
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          setIsDark(mediaQuery.matches);
        }
      } catch (error) {
        console.log('Theme detection error:', error);
        // Fallback to system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);
      }
    };

    // Initial detection
    detectTheme();

    // Listen for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    // Listen for storage changes (next-themes)
    const handleStorageChange = () => detectTheme();
    window.addEventListener('storage', handleStorageChange);

    // Force refresh on window focus
    const handleFocus = () => detectTheme();
    window.addEventListener('focus', handleFocus);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return isDark;
};

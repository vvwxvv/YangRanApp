"use client";

import { useEffect } from 'react';

const ThemeInitializer = () => {
  useEffect(() => {
    // Initialize theme on client side
    const initializeTheme = () => {
      try {
        // Get theme from localStorage or default to light
        const storedTheme = localStorage.getItem('theme') || 'light';
        
        // Set data-theme attribute
        document.documentElement.setAttribute('data-theme', storedTheme);
        
        // Set dark class for Tailwind compatibility
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        
        // Ensure CSS variables are applied
        const isDark = storedTheme === 'dark';
        const root = document.documentElement;
        
        if (isDark) {
          root.style.setProperty('--background-primary', '#000000');
          root.style.setProperty('--text-primary', '#ffffff');
        } else {
          root.style.setProperty('--background-primary', '#ffffff');
          root.style.setProperty('--text-primary', '#000000');
        }
      } catch (error) {
        console.log('Theme initialization error:', error);
      }
    };

    // Run initialization
    initializeTheme();
    
    // Listen for theme changes
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        initializeTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ThemeInitializer; 
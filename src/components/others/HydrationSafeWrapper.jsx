"use client";

import { useState, useEffect } from 'react';

const HydrationSafeWrapper = ({ children, fallback = null }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ensure theme is properly initialized
    const initializeTheme = () => {
      // Check if theme is stored in localStorage
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      }
      
      setIsHydrated(true);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeTheme, 0);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return fallback || (
      <div style={{ 
        backgroundColor: 'var(--background-primary, #ffffff)', 
        color: 'var(--text-primary, #000000)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading...
      </div>
    );
  }

  return children;
};

export default HydrationSafeWrapper; 
"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import useBackgroundColor from '@/hooks/useBackgroundColor';

const ThemeSwitcher = ({ className = '', size = 'normal', style = {} }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  

  
  // Background color hook - let the hook handle the logic
  const { backgroundColor } = useBackgroundColor('#ffffff', {
    useCustomColor: true,
    isDarkMode: resolvedTheme === 'dark'
  });

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Size configurations
  const sizeConfig = {
    small: {
      buttonSize: '12px',
      iconSize: '8px',
      padding: '2px'
    },
    medium: {
      buttonSize: '18px',
      iconSize: '14px',
      padding: '2px'
    },
    normal: {
      buttonSize: 'auto',
      iconSize: '24px',
      padding: '8px'
    }
  };

  const config = sizeConfig[size] || sizeConfig.normal;
  const isDark = mounted && resolvedTheme === 'dark';

  const toggleTheme = () => {
    if (!mounted) return;
    
    try {
      const newTheme = isDark ? 'light' : 'dark';
      setTheme(newTheme);
      
      // Ensure CSS variables are updated immediately
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    } catch (error) {
      console.log('Theme toggle error:', error);
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className={`rounded-full transition-all duration-300 ${className}`}
        style={{
          backgroundColor: backgroundColor,
          background: backgroundColor,
          border: 'none !important',
          boxShadow: 'none !important',
          width: config.buttonSize,
          height: config.buttonSize,
          padding: config.padding,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
        disabled
      >
        <div style={{ width: config.iconSize, height: config.iconSize }} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-current ${className}`}
      style={{
        backgroundColor: backgroundColor,
        background: backgroundColor,
        color: 'var(--text-primary)',
        border: 'none !important',
        boxShadow: 'none !important',
        width: config.buttonSize,
        height: config.buttonSize,
        padding: config.padding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        // Sun icon for dark mode (click to switch to light)
        <svg
          style={{ 
            color: 'var(--text-primary)',
            width: config.iconSize,
            height: config.iconSize
          }}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      ) : (
        // Moon icon for light mode (click to switch to dark)
        <svg
          style={{ 
            color: 'var(--text-primary)',
            width: config.iconSize,
            height: config.iconSize
          }}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default ThemeSwitcher; 
"use client";

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { setThemeCSSVariables } from '@/utils/themeUtils';

/**
 * Custom hook that provides theme colors:
 * - Day mode: White backgrounds with black text
 * - Dark mode: Black backgrounds with white text (simple reverse)
 */
export const useReverseTheme = () => {
  const { resolvedTheme } = useTheme();
  
  const isDark = resolvedTheme === 'dark';
  
  const colors = {
    // Form colors - simple reverse
    background: isDark ? '#000000' : '#ffffff',
    text: isDark ? '#ffffff' : '#000000',
    border: isDark ? '#ffffff' : '#e0e0e0',
    
    // Section colors - simple reverse
    sectionBackground: isDark ? '#000000' : '#ffffff',
    sectionText: isDark ? '#ffffff' : '#000000',
    sectionBorder: isDark ? '#ffffff' : '#e0e0e0',
    
    // Input field colors
    inputBackground: isDark ? '#000000' : '#ffffff',
    inputBorder: isDark ? '#ffffff' : '#e0e0e0',
    inputText: isDark ? '#ffffff' : '#000000',
    
    // Additional color variations
    surface: isDark ? '#1a1a1a' : '#ffffff',
    surfaceVariant: isDark ? '#2a2a2a' : '#f8f8f8',
  };
  
  // Set CSS variables when colors change
  useEffect(() => {
    setThemeCSSVariables(colors);
  }, [colors]);
  
  return {
    isDark,
    colors,
    resolvedTheme,
  };
}; 
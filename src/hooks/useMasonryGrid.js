import { useState, useCallback, useMemo, useEffect } from 'react';

export const useMasonryGrid = (config = {}) => {
  const defaultConfig = {
    breakpoints: {
      default: 3,
      1100: 2,
      700: 1
    },
    mainFields: ['type', 'year', 'series'],
    expandedFields: ['caption', 'medium', 'size'],
    fieldMappings: {},
    fieldLabels: {},
    showExpandArrow: true,
    showDetailButton: true,
    detailButtonText: null,
    defaultTitle: null,
    emptyMessage: null,
    cardClassName: '',
    cardStyle: {},
    imageClassName: 'aspect-square',
    imageStyle: {},
    minImageHeight: 180,
    imagePlaceholderColor: '#f4f4f4',
    imageErrorColor: '#f0f0f0',
    imageErrorText: 'Image unavailable',
    hoverScale: 1.02,
    hoverShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    columnSpacing: 20
  };

  const mergedConfig = useMemo(() => ({
    ...defaultConfig,
    ...config,
    breakpoints: { ...defaultConfig.breakpoints, ...(config.breakpoints || {}) }
  }), [config]);

  const [expandedId, setExpandedId] = useState(null);

  const handleExpandToggle = useCallback((itemId) => {
    setExpandedId(prev => prev === itemId ? null : itemId);
  }, []);

  // Responsive columns calculation
  const getColumnCount = useCallback(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      const breakpoints = mergedConfig.breakpoints;
      
      for (const [breakpoint, cols] of Object.entries(breakpoints)) {
        if (breakpoint === 'default') continue;
        if (width <= parseInt(breakpoint)) {
          return cols;
        }
      }
    }
    return mergedConfig.breakpoints.default;
  }, [mergedConfig.breakpoints]);

  const [columnCount, setColumnCount] = useState(getColumnCount);

  // Update columns on resize
  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [getColumnCount]);

  const masonryStyle = useMemo(() => ({
    display: 'flex',
    marginLeft: `-${mergedConfig.columnSpacing}px`,
    width: 'auto'
  }), [mergedConfig.columnSpacing]);

  const masonryColumnStyle = useMemo(() => ({
    paddingLeft: `${mergedConfig.columnSpacing}px`,
    backgroundClip: 'padding-box'
  }), [mergedConfig.columnSpacing]);

  return {
    config: mergedConfig,
    expandedId,
    handleExpandToggle,
    columnCount,
    masonryStyle,
    masonryColumnStyle
  };
};

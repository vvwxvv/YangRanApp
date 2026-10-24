"use client";

import { useState, useEffect, useCallback } from 'react';

const DEFAULT_ZOOM_CONFIG = {
  STEP: 0.1,
  MIN: 1,
  MAX: 3,
};

const useZoomControl = (mainImageUrl, config = DEFAULT_ZOOM_CONFIG) => {
  const [zoomLevel, setZoomLevel] = useState(config.MIN);

  // Handle mouse wheel zoom with debouncing
  const handleImageWheel = useCallback((e) => {
    e.preventDefault();
    
    setZoomLevel((prev) => {
      const delta = e.deltaY < 0 ? config.STEP : -config.STEP;
      const next = Math.max(config.MIN, Math.min(config.MAX, prev + delta));
      return Math.round(next * 100) / 100;
    });
  }, [config.STEP, config.MIN, config.MAX]);

  // Reset zoom when main image changes
  useEffect(() => {
    setZoomLevel(config.MIN);
  }, [mainImageUrl, config.MIN]);

  // Reset zoom to minimum
  const resetZoom = useCallback(() => {
    setZoomLevel(config.MIN);
  }, [config.MIN]);

  // Set specific zoom level
  const setZoom = useCallback((level) => {
    const clampedLevel = Math.max(config.MIN, Math.min(config.MAX, level));
    setZoomLevel(clampedLevel);
  }, [config.MIN, config.MAX]);

  return { 
    zoomLevel, 
    handleImageWheel, 
    resetZoom, 
    setZoom,
    zoomConfig: config
  };
};

export default useZoomControl;

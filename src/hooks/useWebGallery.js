"use client";

import { useMemo } from 'react';
import { useWebMatching } from '@/hooks/useWebMatching';

const useWebGallery = (webs, item, isCn, options = {}) => {
  const {
    webUrlField = 'web_url',
    fallbackUrl = null
  } = options;

  const matchedWebs = useWebMatching(webs, item, isCn);
  
  // Memoize unique web URLs with better deduplication
  const uniqueWebs = useMemo(() => {
    if (!Array.isArray(matchedWebs) || matchedWebs.length === 0) return [];
    
    const seen = new Set();
    return matchedWebs.filter((web) => {
      if (!web?.[webUrlField]?.trim()) return false;
      if (seen.has(web[webUrlField])) return false;
      seen.add(web[webUrlField]);
      return true;
    });
  }, [matchedWebs, webUrlField]);

  // Gallery web URLs (all matched web URLs)
  const galleryWebs = useMemo(() => {
    return uniqueWebs;
  }, [uniqueWebs]);

  return { galleryWebs, uniqueWebs };
};

export default useWebGallery;

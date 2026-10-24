import { useState, useMemo, useEffect } from 'react';

export const useTagFilter = (images, isCn) => {
  const [selectedTag, setSelectedTag] = useState('');

  const tagOptions = useMemo(() => {
    if (isCn) {
      return Array.from(new Set(images.map(img => img.tag_cn).filter(Boolean)));
    } else {
      return Array.from(new Set(images.map(img => img.tag_en).filter(Boolean)));
    }
  }, [images, isCn]);

  const filteredImages = useMemo(() => {
    if (selectedTag) {
      if (isCn) {
        return images.filter(img => img.tag_cn === selectedTag);
      } else {
        return images.filter(img => img.tag_en === selectedTag);
      }
    }
    return images;
  }, [images, selectedTag, isCn]);

  // Reset tag selection on reload or language switch
  useEffect(() => {
    setSelectedTag('');
  }, [images.length, isCn]);

  return {
    selectedTag,
    setSelectedTag,
    tagOptions,
    filteredImages
  };
};

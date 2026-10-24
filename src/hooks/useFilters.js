"use client";

import { useState, useMemo } from "react";
import getUniqueFilterOptions from '@/utils/getUniqueFilterOptions';
import fuzzySearch from '@/utils/fuzzySearch';
import { hasMarkValue } from "@/utils/mediaMarks";

// Reusable Filter Hook
const useFilters = (data, isCn, options = {}) => {
  // options: { selectedTab, selectedYear, selectedSeries, selectedArtist, typeKey, language, searchTerm, setSearchTerm, markFilter }
  const selectedType = options.selectedTab || 'all';
  const selectedYear = options.selectedYear || 'all';
  const selectedSeries = options.selectedSeries || 'all';
  const selectedArtist = options.selectedArtist || 'all';
  const [selectedTag, setSelectedTag] = useState('');
  // Use parent-provided searchTerm/setSearchTerm if available
  const searchTerm = options.searchTerm !== undefined ? options.searchTerm : useState("")[0];
  const setSearchTerm = options.setSearchTerm !== undefined ? options.setSearchTerm : useState("")[1];
  const typeKey = options.typeKey || 'type';
  const language = options.language || null;
  const markFilter = options.markFilter || null;

  const hasTypeField = useMemo(() =>
    data.length > 0 && data.some(item => Object.prototype.hasOwnProperty.call(item, typeKey)),
    [data, typeKey]
  );

  const typeOptions = useMemo(() =>
    getUniqueFilterOptions(data, typeKey, isCn ? '全部类型' : 'All Types'),
    [data, isCn, typeKey]
  );

  const tagOptions = useMemo(() => {
    if (typeKey === 'artist') {
      // Unique artist names for artist selector
      return Array.from(new Set(data.map(item => item.artist).filter(Boolean)));
    }
    const tags = isCn
      ? Array.from(new Set(data.map(img => img.tag_cn).filter(Boolean)))
      : Array.from(new Set(data.map(img => img.tag_en).filter(Boolean)));
    if (!isCn) {
      tags.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
    }
    return tags;
  }, [data, isCn, typeKey]);

  const filteredData = useMemo(() => {
    let filtered = [...data];
    // Filter by type/tab if provided
    if (hasTypeField && selectedType !== 'all') {
      filtered = filtered.filter(item => item[typeKey] === selectedType);
    }
    // Filter by year if provided
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === selectedYear);
    }
    // Filter by series if provided
    if (selectedSeries !== 'all') {
      filtered = filtered.filter(item => item.series === selectedSeries);
    }
    // Filter by artist if provided
    if (selectedArtist !== 'all') {
      filtered = filtered.filter(item => item.artist === selectedArtist);
    }
    // Filter by language if provided
    if (language) {
      filtered = filtered.filter(item => {
        if (!item.language) return true;
        return item.language === language;
      });
    }
    // Filter by mark if provided (e.g., "Feature" for featured artworks)
    if (markFilter) {
      filtered = filtered.filter((item) => hasMarkValue(item, markFilter));
    }
    // Filter by tag if selected
    if (selectedTag) {
      filtered = filtered.filter(item =>
        isCn ? item.tag_cn === selectedTag : item.tag_en === selectedTag
      );
    }
    // Use fuzzy search for better matching
    if (searchTerm && searchTerm.trim()) {
      try {
        // `mark` is a JSON object now ({ value, hide, marks }) — not searchable
        // text, so it is left out of the fuzzy keys (Image/Video/Artwork).
        const searchKeys = data.length > 0 && data[0].tag_en !== undefined 
          ? ['tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn'] // Image/Video model
          : ['title', 'artist', 'type', 'year', 'series', 'caption', 'material', 'work_value']; // Artwork model
        
        filtered = fuzzySearch(filtered, searchTerm, {
          keys: searchKeys,
          threshold: 0.3,
          ignoreLocation: true,
          minMatchCharLength: 1,
        });
      } catch (error) {
        console.warn('Fuzzy search failed, falling back to simple search:', error);
        // Fallback to simple search
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
          Object.values(item).some(
            value => value && String(value).toLowerCase().includes(term)
          )
        );
      }
    }
    // Default sort by title if present
    filtered = filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    return filtered;
  }, [data, hasTypeField, selectedType, selectedYear, selectedSeries, selectedArtist, selectedTag, searchTerm, isCn, typeKey, language, markFilter]);

  return {
    // selectedType, // no longer needed
    // setSelectedType, // no longer needed
    selectedTag,
    setSelectedTag,
    searchTerm,
    setSearchTerm,
    hasTypeField,
    typeOptions,
    tagOptions,
    filteredData
  };
};

export default useFilters;
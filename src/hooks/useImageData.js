"use client";

import { useMemo } from 'react';
import { getMarkValue, hasMarkValue } from "@/utils/mediaMarks";
import { safelyProcessData } from '@/utils/exportUtils';
import fuzzySearch from '@/utils/fuzzySearch';

const useImageData = (images, artworks, events, isCn, search) => {
  const allImages = useMemo(() => {
    try {
      return safelyProcessData(images || []);
    } catch (error) {
      console.warn('Error processing images:', error);
      return [];
    }
  }, [images]);

  const allArtworks = useMemo(() => {
    try {
      return safelyProcessData(artworks || []);
    } catch (error) {
      console.warn('Error processing artworks:', error);
      return [];
    }
  }, [artworks]);

  const allEvents = useMemo(() => {
    try {
      return safelyProcessData(events || []);
    } catch (error) {
      console.warn('Error processing events:', error);
      return [];
    }
  }, [events]);

  // Filter images by language and apply search
  const filteredImages = useMemo(() => {
    try {
      let result = allImages;

      // Apply search filter if provided
      if (search && typeof search === 'string' && search.trim()) {
        try {
          // `mark`/`order` are JSON objects on the Image model — not searchable text.
          const searchKeys = ['tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn'];
          result = fuzzySearch(result, search, {
            keys: searchKeys,
            threshold: 0.3,
            ignoreLocation: true,
            minMatchCharLength: 1,
          });
        } catch (error) {
          console.warn('Search failed, falling back to simple search:', error);
          const term = String(search).toLowerCase();
          result = result.filter(item =>
            Object.values(item).some(
              value => value && String(value).toLowerCase().includes(term)
            )
          );
        }
      }

      return result;
    } catch (error) {
      console.warn('Error filtering images:', error);
      return [];
    }
  }, [allImages, search]);

  // Extract unique types from filtered images
  const allTypes = useMemo(() => {
    try {
      return Array.from(new Set((filteredImages || []).map(img => img?.type).filter(Boolean)));
    } catch (error) {
      console.warn('Error processing types:', error);
      return [];
    }
  }, [filteredImages]);

  // Extract unique artwork titles for filtering
  const allArtworkTitles = useMemo(() => {
    try {
      const filteredArtworks = allArtworks.filter(artwork => 
        artwork.language === (isCn ? 'CN' : 'EN') || !artwork.language
      );
      return filteredArtworks.map(artwork => ({
        id: artwork._id || artwork.id,
        title: artwork.title || `Artwork ${artwork._id || artwork.id}`
      }));
    } catch (error) {
      console.warn('Error processing artwork titles:', error);
      return [];
    }
  }, [allArtworks, isCn]);

  // Extract unique event titles for filtering
  const allEventTitles = useMemo(() => {
    try {
      const filteredEvents = allEvents.filter(event => 
        event.language === (isCn ? 'CN' : 'EN') || !event.language
      );
      return filteredEvents.map(event => ({
        id: event._id || event.id,
        title: event.title || `Event ${event._id || event.id}`
      }));
    } catch (error) {
      console.warn('Error processing event titles:', error);
      return [];
    }
  }, [allEvents, isCn]);

  // Get slider images
  const sliderImages = useMemo(() => {
    try {
      return allImages.filter(img => hasMarkValue(img, 'Slider'));
    } catch (error) {
      console.warn('Error processing slider images:', error);
      return [];
    }
  }, [allImages]);

  return {
    allImages,
    allArtworks,
    allEvents,
    filteredImages,
    allTypes,
    allArtworkTitles,
    allEventTitles,
    sliderImages
  };
};

export default useImageData; 
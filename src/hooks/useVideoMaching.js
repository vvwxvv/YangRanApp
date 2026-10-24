import { useMemo } from 'react';

export const useVideoMaching = (allVideos, artwork, isCn) => {
  return useMemo(() => {
    if (!allVideos?.length || !artwork) return [];

    return allVideos
      .filter(video => {
        // Primary match: by artworkId (most reliable)
        if (video.artworkId && (video.artworkId === (artwork._id || artwork.id))) {
          return true;
        }
        
        // Secondary match: by title in BOTH languages (more robust)
        const tagEn = video.tag_en || '';
        const tagCn = video.tag_cn || '';
        const artworkTitle = artwork.title || '';
        
        // Check if title matches in either language
        return (tagEn && tagEn.toLowerCase() === artworkTitle.toLowerCase()) ||
               (tagCn && tagCn.toLowerCase() === artworkTitle.toLowerCase());
      })
      .map(video => ({
        ...video, // Preserve all original fields including captions
        id: video.id || video._id,
        video_url: video.video_url,
        caption_en: video.caption_en || '',
        caption_cn: video.caption_cn || '',
        tag_en: video.tag_en || '',
        tag_cn: video.tag_cn || '',
        order: video.order || 0
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [allVideos, artwork]); // Removed isCn dependency
};
import { useMemo } from 'react';

export const useWebMatching = (allWebs, artwork, isCn) => {
  return useMemo(() => {
    if (!allWebs?.length || !artwork) return [];

    return allWebs
      .filter(web => {
        // Primary match: by artworkId (most reliable)
        if (web.artworkId && (web.artworkId === (artwork._id || artwork.id))) {
          return true;
        }
        
        // Secondary match: by title in BOTH languages (more robust)
        const tagEn = web.tag_en || '';
        const tagCn = web.tag_cn || '';
        const artworkTitle = artwork.title || '';
        
        // Check if title matches in either language
        return (tagEn && tagEn.toLowerCase() === artworkTitle.toLowerCase()) ||
               (tagCn && tagCn.toLowerCase() === artworkTitle.toLowerCase());
      })
      .map(web => ({
        ...web, // Preserve all original fields including captions
        id: web.id || web._id,
        web_url: web.web_url,
        caption_en: web.caption_en || '',
        caption_cn: web.caption_cn || '',
        tag_en: web.tag_en || '',
        tag_cn: web.tag_cn || '',
        order: web.order || 0
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [allWebs, artwork]); // Removed isCn dependency
};

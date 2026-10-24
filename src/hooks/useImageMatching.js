/**
 * Configuration for different entity types
 */
export const ENTITY_CONFIG = {
  artwork: {
    idField: 'id',
    titleField: 'title',
    coverField: 'cover_img_url',
    imageIdField: 'artworkId'
  },
  series: {
    idField: 'id',
    titleField: 'title',
    coverField: 'cover_img_url',
    imageIdField: 'seriesId'
  },
  event: {
    idField: 'id',
    titleField: 'title',
    coverField: 'cover_img_url',
    imageIdField: 'eventId'
  }
};

/**
 * Normalize image object with default values
 */
export const normalizeImage = (img) => ({
  ...img,
  id: img.id || img._id,
  img_url: img.img_url,
  caption_en: img.caption_en || '',
  caption_cn: img.caption_cn || '',
  tag_en: img.tag_en || '',
  tag_cn: img.tag_cn || '',
  order: img.order || 0
});

/**
 * Filter images matching an entity by ID or title
 * @param {Array} allImages - All available images
 * @param {string} entityId - Entity ID to match
 * @param {string} entityTitle - Entity title to match
 * @param {string} imageIdField - Field name for entity ID in image (e.g., 'artworkId', 'eventId')
 */
export const filterImagesByEntity = (allImages, entityId, entityTitle, imageIdField = 'artworkId') => {
  return allImages.filter(img => {
    // Primary match: by entity ID field
    if (img[imageIdField] && img[imageIdField] === entityId) return true;
    if (img.entityId && img.entityId === entityId) return true;
    
    // Secondary match: by title in both languages
    const tagEn = img.tag_en || '';
    const tagCn = img.tag_cn || '';
    
    return (tagEn && tagEn.toLowerCase() === entityTitle.toLowerCase()) ||
           (tagCn && tagCn.toLowerCase() === entityTitle.toLowerCase());
  });
};

/**
 * Sort images by order field
 */
export const sortImagesByOrder = (images) => 
  [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
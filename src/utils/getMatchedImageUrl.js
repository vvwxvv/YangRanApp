/**
 * Generic utility to find a matching image URL for any schema item.
 * 
 * @param {Object} item - The data item (event, artwork, article, etc.)
 * @param {Object} options - Configuration options
 * @param {Array}  options.allImages - Array of all available images
 * @param {string|string[]} options.imageFields - Direct image URL field(s) on the item (e.g. 'cover_img_url', 'poster_image_url')
 * @param {string} options.matchField - Field on the item to match against image tags (default: 'title')
 * @param {string[]} options.tagFields - Fields on image objects to match against (default: ['tag_en', 'tag_cn'])
 * @param {string} options.imageUrlField - Field on image objects that holds the URL (default: 'img_url')
 * @returns {string|null} The matched image URL or null
 */
export const getMatchedImageUrl = (item, options = {}) => {
    if (!item) return null;
  
    const {
      allImages = [],
      imageFields = ['cover_img_url', 'poster_image_url'],
      matchField = 'title',
      tagFields = ['tag_en', 'tag_cn'],
      imageUrlField = 'img_url',
    } = options;
  
    // Normalize imageFields to an array
    const directFields = Array.isArray(imageFields) ? imageFields : [imageFields];
  
    // 1. Try to get image directly from the item
    for (const field of directFields) {
      const url = item[field];
      if (url && typeof url === 'string' && url.trim() !== '') {
        return url;
      }
    }
  
    // 2. Try to find a matching image from the image collection
    const matchValue = item[matchField];
    if (matchValue && allImages && allImages.length > 0) {
      const matchingImage = allImages.find(img => {
        if (!img) return false;
        return tagFields.some(tagField => {
          const tagValue = img[tagField] || '';
          return tagValue === matchValue;
        });
      });
  
      if (matchingImage) {
        const url = matchingImage[imageUrlField];
        if (url && typeof url === 'string' && url.trim() !== '') {
          return url;
        }
      }
    }
  
    return null;
  };
  
  /**
   * Get all matched images for an item (for galleries, detail views, etc.)
   * 
   * @param {Object} item - The data item
   * @param {Object} options - Same options as getMatchedImageUrl, plus:
   * @param {string[]} options.captionFields - Fields on image objects for alt text (default: ['caption_en', 'caption_cn'])
   * @returns {Array} Array of matched image objects with url, src, and alt properties
   */
  export const getMatchedImages = (item, options = {}) => {
    if (!item) return [];
  
    const {
      allImages = [],
      matchField = 'title',
      tagFields = ['tag_en', 'tag_cn'],
      imageUrlField = 'img_url',
      captionFields = ['caption_en', 'caption_cn'],
    } = options;
  
    const matchValue = item[matchField];
    if (!matchValue || !allImages || allImages.length === 0) return [];
  
    return allImages
      .filter(img => {
        if (!img) return false;
        return tagFields.some(tagField => {
          const tagValue = img[tagField] || '';
          return tagValue === matchValue;
        });
      })
      .map(img => {
        const url = img[imageUrlField] || '';
        // Build alt text from the first non-empty caption field
        const alt = captionFields.reduce((acc, field) => acc || img[field], '') 
          || matchValue 
          || 'Image';
  
        return {
          ...img,
          url,
          src: url,
          alt,
        };
      });
  };
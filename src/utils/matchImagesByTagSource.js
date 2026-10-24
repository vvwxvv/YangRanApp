
  
  /**
   * Match images to a parent item by tag_source.
   * @param {Array} images - Array of image objects with `tag_source`.
   * @param {Object} item - Parent item with `title`, `id`, `_id`.
   * @returns {Array} Matched images.
   */
  export function matchImagesByTagSource(images, item) {
    if (!Array.isArray(images) || !item) return [];
    return images.filter((img) => {
      if (!img) return false;
      const tagSource = (img.tag_source || "").trim();
      return (
        tagSource === item.title ||
        tagSource === item.id ||
        tagSource === item._id
      );
    });
  }
  

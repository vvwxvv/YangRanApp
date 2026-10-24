import { matchImagesByTagSource } from "@/utils/matchImagesByTagSource";
import { orderValue } from "@/utils/mediaOrder";
  /**
   * Attach matched images to each item and sort by `order`.
   * @param {Array} items - Array of parent items.
   * @param {Array} images - Array of image objects.
   * @returns {Array} Items with `matchedImages`, sorted by `order`.
   */
  export function attachImagesAndSort(items, images) {
    if (!Array.isArray(items) || !items.length) return [];
    const withImages = items.map((item) => ({
      ...item,
      matchedImages: matchImagesByTagSource(images, item),
    }));
    return withImages.slice().sort((a, b) => {
      // `order` is a JSON object on Artwork/Image — orderValue is JSON-aware
      // (legacy plain-string order still works).
      const ao = orderValue(a, "artist_page_order");
      const bo = orderValue(b, "artist_page_order");
      return ao - bo;
    });
  }
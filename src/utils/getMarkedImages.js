import { getMarkValue } from "@/utils/mediaMarks";

/**
 * Get images filtered by mark field.
 *
 * `mark` is JSON now ({ value, hide }); this compares against the scalar
 * `value` (legacy plain-string marks still work through getMarkValue).
 *
 * @param {Array} filteredImages - Pre-filtered image list
 * @param {string|string[]} mark - Mark value(s) to match (e.g. 'slider', 'featured', ['slider', 'banner'])
 * @param {number} max - Maximum number of images to return
 * @returns {Array} matched images
 */
export const getMarkedImages = (filteredImages, mark = "slider", max = 20) => {
  const marks = (Array.isArray(mark) ? mark : [mark]).map((m) =>
    String(m ?? "").toLowerCase()
  );

  return (Array.isArray(filteredImages) ? filteredImages : [])
    .filter((img) => marks.includes(getMarkValue(img).toLowerCase()))
    .slice(0, max);
};

// Convenience alias for backward compatibility
export const getSliderImages = (filteredImages, max) =>
  getMarkedImages(filteredImages, "slider", max);

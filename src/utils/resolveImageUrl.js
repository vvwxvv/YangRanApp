/**
 * Returns a valid image URL or a placeholder fallback.
 *
 * @param {Object} item
 * @param {string} imageKey
 * @param {string} fallback
 * @returns {{ imageUrl: string, hasImage: boolean }}
 */
export default function resolveImageUrl(item, imageKey = "cover_img_url", fallback = "/placeholder.png") {
    const url = item?.[imageKey];
    return {
      imageUrl: url || fallback,
      hasImage: Boolean(url),
    };
  }
import { useMemo } from "react";

const DEFAULTS = {
  placeholder: "/placeholder.png",
  altText: "Untitled",
};

/**
 * Derives display metadata for any image card — artworks, exhibitions, profiles, etc.
 *
 * @param {object} item - data object (any schema)
 * @param {object} [options]
 * @param {string}           [options.imageKey="cover_img_url"] - key to read image URL
 * @param {string}           [options.altKey="title"]           - key to read alt text
 * @param {string|undefined} [options.videoUrl]                 - optional video URL
 * @param {string}           [options.placeholder]              - fallback image path
 * @param {string}           [options.fallbackAlt]              - fallback alt text
 * @returns {{ imageUrl: string, hasImage: boolean, hasVideo: boolean, altText: string }}
 *
 * @example
 * // Artwork card
 * const info = useImageInfo(item);
 *
 * @example
 * // Exhibition banner — different image key
 * const info = useImageInfo(item, { imageKey: "banner_url", altKey: "name" });
 *
 * @example
 * // Profile avatar
 * const info = useImageInfo(user, { imageKey: "avatar", altKey: "username" });
 */
export default function useImageInfo(
  item,
  {
    imageKey = "cover_img_url",
    altKey = "title",
    videoUrl,
    placeholder = DEFAULTS.placeholder,
    fallbackAlt = DEFAULTS.altText,
  } = {},
) {
  return useMemo(() => {
    const rawUrl = item?.[imageKey];
    const hasImage = Boolean(rawUrl);

    return {
      imageUrl: rawUrl || placeholder,
      hasImage,
      hasVideo: Boolean(videoUrl?.trim()),
      altText: item?.[altKey] || fallbackAlt,
    };
  }, [item, imageKey, altKey, videoUrl, placeholder, fallbackAlt]);
}
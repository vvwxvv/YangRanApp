import { useMemo } from "react";

/**
 * Generic hook to compute image sizing props.
 *
 * Works for any schema — artworks, exhibitions, profiles, etc.
 *
 * @param {object} options
 * @param {number|string|null} options.width      - custom width override
 * @param {number|string|null} options.height     - custom height override
 * @param {boolean}            options.original   - use original aspect ratio (width:100%, height:auto)
 * @param {number|string|null} options.maxHeight  - max-height constraint
 * @param {number|string|null} options.minHeight  - min-height constraint
 * @param {number|string|null} options.maxWidth   - max-width constraint
 * @param {number|string|null} options.minWidth   - min-width constraint
 * @param {number|string}      options.fallbackWidth  - fallback when no custom width
 * @param {number|string}      options.fallbackHeight - fallback when no custom height
 *
 * @returns {{ width, height, style?: object }}
 *
 * @example
 * // Artwork card — original size with mobile limits
 * const size = useImageSize({ original: true, maxHeight: 600, minHeight: 500 });
 *
 * @example
 * // Exhibition thumbnail — fixed dimensions
 * const size = useImageSize({ width: 320, height: 240 });
 *
 * @example
 * // Profile avatar — square with fallback
 * const size = useImageSize({ fallbackWidth: 120, fallbackHeight: 120 });
 */
export default function useImageSize({
  width = null,
  height = null,
  original = false,
  maxHeight = null,
  minHeight = null,
  maxWidth = null,
  minWidth = null,
  fallbackWidth = "100%",
  fallbackHeight = 300,
} = {}) {
  return useMemo(() => {
    // Explicit width + height → use them directly
    if (width && height) {
      return { width, height };
    }

    // Original aspect ratio mode
    if (original) {
      const style = {};
      if (maxHeight != null) style.maxHeight = maxHeight;
      if (minHeight != null) style.minHeight = minHeight;
      if (maxWidth != null) style.maxWidth = maxWidth;
      if (minWidth != null) style.minWidth = minWidth;

      return {
        width: width ?? "100%",
        height: height ?? "auto",
        ...(Object.keys(style).length > 0 ? { style } : {}),
      };
    }

    // Fallback mode
    return {
      width: width ?? fallbackWidth,
      height: height ?? fallbackHeight,
    };
  }, [
    width,
    height,
    original,
    maxHeight,
    minHeight,
    maxWidth,
    minWidth,
    fallbackWidth,
    fallbackHeight,
  ]);
}
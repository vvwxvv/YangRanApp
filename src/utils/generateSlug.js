/**
 * Converts a title string into a URL-safe slug.
 * Supports Unicode (CJK, accented chars, etc.).
 */
export const generateSlug = (text) => {
    if (!text) return "";
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\p{L}\p{N}_-]/gu, "");
  };
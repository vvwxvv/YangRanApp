/**
 * artworkUtils.js — utility functions for Artwork model.
 * Matches Prisma Artwork model fields.
 */

/**
 * Filter artworks by language.
 * @param {Array} artworks
 * @param {boolean} isCn — true for Chinese, false for English
 * @returns {Array}
 */
export const filterArtworksByLanguage = (artworks, isCn) => {
  if (!Array.isArray(artworks)) return [];
  const lang = isCn ? "CN" : "EN";
  return artworks.filter(
    (item) => !item?.language || item.language === lang
  );
};

/** Resolve a possibly-dotted path (e.g. "order.artist_page_order"). */
const getByPath = (obj, path) =>
  String(path)
    .split(".")
    .reduce((acc, key) => (acc === null || acc === undefined ? undefined : acc[key]), obj);

/**
 * Sort artworks by a given field.
 * @param {Array} artworks
 * @param {string} field — field name (e.g. "year", "order.artist_page_order", "title")
 * @param {"asc"|"desc"} direction
 * @returns {Array}
 */
export const sortArtworks = (artworks, field = "order.artist_page_order", direction = "asc") => {
  if (!Array.isArray(artworks)) return [];
  return [...artworks].sort((a, b) => {
    const valA = getByPath(a, field) ?? "";
    const valB = getByPath(b, field) ?? "";
    const cmp = String(valA).localeCompare(String(valB));
    return direction === "asc" ? cmp : -cmp;
  });
};

/**
 * Group artworks by a field (e.g., "series", "type", "year").
 * @param {Array} artworks
 * @param {string} field — field to group by
 * @returns {Object} — { [groupKey]: [artworks] }
 */
export const groupArtworksBy = (artworks, field = "series") => {
  if (!Array.isArray(artworks)) return {};
  return artworks.reduce((groups, item) => {
    const key = item?.[field] || "__UNGROUPED__";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
};

/**
 * Get unique values for a field across all artworks.
 * @param {Array} artworks
 * @param {string} field
 * @returns {Array}
 */
export const getUniqueValues = (artworks, field) => {
  if (!Array.isArray(artworks)) return [];
  return [...new Set(artworks.map((item) => item?.[field]).filter(Boolean))];
};

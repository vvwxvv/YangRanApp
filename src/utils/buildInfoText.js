/**
 * Joins non-empty item fields into a dash-separated string.
 * Reused by SeriesCard, ArtworkCard, etc.
 *
 * @param {Object} item
 * @param {string[]} fields - field names to extract
 * @param {string} separator
 * @returns {string|null}
 */
export default function buildInfoText(item, fields = ["type", "medium", "size", "year"], separator = " – ") {
    if (!item) return null;
    const parts = fields.map((f) => item[f]).filter(Boolean);
    return parts.length > 0 ? parts.join(separator) : null;
  }
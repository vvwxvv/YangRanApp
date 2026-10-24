/**
 * Filter items by language.
 * @param {Array} items - Array of data items with a `language` field.
 * @param {boolean} isCn - Whether to filter for Chinese.
 * @returns {Array} Filtered items.
 */
export function filterByLanguage(items, isCn) {
    if (!Array.isArray(items)) return [];
    const targetLang = isCn ? "CN" : "EN";
    return items.filter((item) => {
      if (!item) return false;
      return (item.language || "").toUpperCase() === targetLang;
    });
  }
  

// ============================================
// BILINGUAL UTILITY FUNCTIONS
// Reusable across the entire application
// ============================================

/**
 * Get bilingual label from object or string
 * @param {object|string} label - Label config { cn, en } or string
 * @returns {string} Formatted label "中文 / English" or original string
 */
export const getBilingualLabel = (label) => {
  if (typeof label === 'object' && label !== null && label.cn && label.en) {
    return `${label.cn} / ${label.en}`;
  }
  return label || '';
};

/**
 * Get single language label from bilingual object
 * @param {object|string} label - Label config { cn, en } or string
 * @param {string} lang - Language code ('cn' or 'en')
 * @returns {string} Single language label
 */
export const getSingleLangLabel = (label, lang = 'cn') => {
  if (typeof label === 'object' && label !== null) {
    return label[lang] || label.cn || label.en || '';
  }
  return label || '';
};

/**
 * Resolve a label to the CURRENT language, whatever shape it arrives in.
 *
 * The manager schema configs still ship COMBINED labels ("Artist / 艺术家"),
 * while newer configs pass bilingual objects ({cn, en} / {CN, EN}). Both are
 * handled here so a filter box, card field or dropdown never renders
 * "Artist / 艺术家" when the app is in one language.
 *
 * @param {object|string} label
 * @param {boolean} isCn
 * @returns {string}
 */
export const resolveLocalizedLabel = (label, isCn = false) => {
  if (label === null || label === undefined) return '';

  // {cn, en} / {CN, EN}
  if (typeof label === 'object') {
    return isCn
      ? (label.cn ?? label.CN ?? label.en ?? label.EN ?? '')
      : (label.en ?? label.EN ?? label.cn ?? label.CN ?? '');
  }

  const text = String(label);
  const parts = text.split(/\s*\/\s*/);
  if (parts.length < 2) return text;

  const hasCjk = (s) => /[\u3400-\u9fff]/.test(s);
  const [first, second] = parts;

  // "Artist / 艺术家" → en first, cn second
  if (!hasCjk(first) && hasCjk(second)) return isCn ? second : first;
  // "艺术家 / Artist" → cn first, en second
  if (hasCjk(first) && !hasCjk(second)) return isCn ? first : second;

  // Both halves the same script (e.g. "PDF URL / PDF链接") — keep the whole
  // label rather than guessing.
  return text;
};

/**
 * Create bilingual label object
 * @param {string} cn - Chinese label
 * @param {string} en - English label
 * @returns {object} Bilingual label object
 */
export const createBilingualLabel = (cn, en) => ({ cn, en });

/**
 * Check if value is a bilingual object
 * @param {any} value - Value to check
 * @returns {boolean} True if bilingual object
 */
export const isBilingualObject = (value) => {
  return typeof value === 'object' && value !== null && ('cn' in value || 'en' in value);
};
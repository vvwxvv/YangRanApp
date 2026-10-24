import formatText from '@/utils/formatText';

/**
 * Build bilingual field string from CN and EN values
 * @param {string} cnValue - Chinese value
 * @param {string} enValue - English value
 * @param {string} separator - Separator between values (default: ' / ')
 * @param {boolean} applyFormatText - Apply formatText to values (default: true)
 * @returns {string} - Combined bilingual string or single value
 */
const buildBilingualField = (cnValue, enValue, separator = ' / ', applyFormatText = true) => {
  const cn = applyFormatText ? formatText(cnValue || '') : (cnValue || '').trim();
  const en = applyFormatText ? formatText(enValue || '') : (enValue || '').trim();
  
  if (cn && en) return `${cn}${separator}${en}`;
  return cn || en || '';
};

export default buildBilingualField;
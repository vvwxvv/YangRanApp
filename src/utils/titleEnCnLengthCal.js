/**
 * titleLayoutUtils.js
 *
 * Utilities for measuring the visual "weight" of mixed Chinese/English title strings
 * and deciding whether a two-part (CN + EN) title should stack onto two lines.
 *
 * Chinese characters are full-width (~2× an ASCII char), so we give them a
 * configurable weight when computing display length.
 */

// ─── character classification ────────────────────────────────────────────────

/** Returns true for any CJK unified ideograph or common punctuation. */
export const isChinese = (char) => {
    const cp = char.codePointAt(0);
    return (
      (cp >= 0x4e00 && cp <= 0x9fff) ||   // CJK Unified Ideographs (core block)
      (cp >= 0x3400 && cp <= 0x4dbf) ||   // CJK Extension A
      (cp >= 0x20000 && cp <= 0x2a6df) || // CJK Extension B
      (cp >= 0x3000 && cp <= 0x303f) ||   // CJK Symbols & Punctuation
      (cp >= 0xff00 && cp <= 0xffef)      // Fullwidth Latin / Halfwidth Katakana
    );
  };
  
  // ─── core measurement ────────────────────────────────────────────────────────
  
  /**
   * Counts raw Chinese characters and non-Chinese characters separately.
   *
   * @param {string} text
   * @returns {{ cnCount: number, enCount: number, total: number }}
   */
  export const countCharTypes = (text = '') => {
    let cnCount = 0;
    let enCount = 0;
  
    for (const char of text) {
      if (char.trim() === '') continue; // skip whitespace
      if (isChinese(char)) cnCount++;
      else enCount++;
    }
  
    return { cnCount, enCount, total: cnCount + enCount };
  };
  
  /**
   * Computes a single weighted "display length" for a string.
   * Chinese chars count as `cnWeight`, everything else as 1.
   *
   * @param {string}  text
   * @param {number}  cnWeight  – how many "units" a Chinese char counts as (default 2)
   * @returns {number}
   */
  export const getDisplayLength = (text = '', cnWeight = 2) => {
    const { cnCount, enCount } = countCharTypes(text);
    return cnCount * cnWeight + enCount;
  };
  
  // ─── stacking decision ───────────────────────────────────────────────────────
  
  /**
   * Configuration for when a CN + EN title pair should stack onto two lines.
   *
   * You can trigger stacking via either (or both) conditions — whichever fires
   * first wins.  Set a value to `Infinity` to disable that condition entirely.
   *
   * @typedef {Object} StackConfig
   * @property {number} cnCharLimit
   *   Raw Chinese character count threshold.
   *   e.g. 6 → stack when CN text has more than 6 Chinese characters.
   *
   * @property {number} enCharLimit
   *   Raw English (non-CN) character count threshold.
   *   e.g. 20 → stack when EN text has more than 20 non-CN characters.
   *
   * @property {number} cnDisplayLimit
   *   Weighted display-length threshold applied to the CN string.
   *   e.g. 12 → stack when CN display-length exceeds 12 units.
   *
   * @property {number} enDisplayLimit
   *   Weighted display-length threshold applied to the EN string.
   *   e.g. 30 → stack when EN display-length exceeds 30 units.
   *
   * @property {number} combinedDisplayLimit
   *   Threshold on the *combined* display length of CN + EN.
   *   Useful for catching cases where neither string alone is long but together
   *   they overflow a single line.
   *
   * @property {number} cnWeight
   *   How many display units a Chinese character counts as (default 2).
   */
  
  /** @type {StackConfig} */
  export const DEFAULT_STACK_CONFIG = {
    cnCharLimit: 6,           // > 6 raw CN chars → stack
    enCharLimit: Infinity,    // disabled by default
    cnDisplayLimit: Infinity, // disabled by default
    enDisplayLimit: Infinity, // disabled by default
    combinedDisplayLimit: Infinity, // disabled by default
    cnWeight: 2,
  };
  
  /**
   * Decides whether a title pair (cnText + enText) should render stacked
   * (CN on line 1, EN on line 2) instead of inline.
   *
   * @param {string}      cnText
   * @param {string}      enText
   * @param {Partial<StackConfig>} config  – merged with DEFAULT_STACK_CONFIG
   * @returns {boolean}
   *
   * @example
   * // Default: stack when CN has > 6 characters
   * shouldStackTitle('被歌颂的日常-阿丽的遐想', 'Everyday Objects…')
   * // → true (9 CN chars > 6)
   *
   * @example
   * // Custom: stack when combined display length > 24
   * shouldStackTitle('黑沙滩', 'Black Beach', { combinedDisplayLimit: 24 })
   * // → false  (3×2 + 11 = 17 ≤ 24)
   *
   * @example
   * // Custom: stack when EN alone is long
   * shouldStackTitle('伊甸园', 'Eden', { enCharLimit: 3 })
   * // → true  (4 EN chars > 3)
   */
  export const shouldStackTitle = (cnText = '', enText = '', config = {}) => {
    const cfg = { ...DEFAULT_STACK_CONFIG, ...config };
    const { cnCharLimit, enCharLimit, cnDisplayLimit, enDisplayLimit, combinedDisplayLimit, cnWeight } = cfg;
  
    const { cnCount: cnChars }  = countCharTypes(cnText);
    const { enCount: enChars }  = countCharTypes(enText);
    const cnDisplay             = getDisplayLength(cnText, cnWeight);
    const enDisplay             = getDisplayLength(enText, cnWeight);
    const combinedDisplay       = cnDisplay + enDisplay;
  
    return (
      cnChars        > cnCharLimit        ||
      enChars        > enCharLimit        ||
      cnDisplay      > cnDisplayLimit     ||
      enDisplay      > enDisplayLimit     ||
      combinedDisplay > combinedDisplayLimit
    );
  };
// utils/filterSchemaItems.js

import { getMarkValue } from '@/utils/mediaMarks';

/**
 * Matches a single field on an item against an expected value.
 *
 * Rules:
 *   expected === undefined  → skip filter entirely (always passes)
 *   expected === null       → item field must be falsy (null / undefined / "")
 *   any other value         → strict equality match
 *
 * `mark` is JSON now ({ value, hide }), so it is compared on its scalar
 * `value` (legacy plain-string marks still work).
 *
 * @param {object} item
 * @param {string} field
 * @param {*}      expected
 * @returns {boolean}
 */
export function matchField(item, field, expected) {
    if (expected === undefined) return true;
    const value = field === 'mark' ? getMarkValue(item) : item?.[field];
    if (expected === null) return !value;
    return value === expected;
  }
  
  /**
   * Matches the language field on an item.
   * If the item has no language field at all it passes (graceful fallback).
   *
   * @param {object}  item
   * @param {boolean} isCn
   * @param {string}  [field="language"]
   * @returns {boolean}
   */
  export function matchLanguage(item, isCn, field = "language") {
    if (!item?.[field]) return true;
    return item[field] === (isCn ? "CN" : "EN");
  }
  
  /**
   * Filters an array of schema items by language and any number of additional
   * field/value pairs.
   *
   * @param {Array}   items
   * @param {object}  options
   * @param {boolean} [options.isCn]            - language filter; omit to skip
   * @param {string}  [options.languageField]   - defaults to "language"
   * @param {object}  [options.fields]          - { fieldName: expectedValue, … }
   * @returns {Array}
   *
   * @example
   * // Series page – CN, only items with no mark
   * filterSchemaItems(series, { isCn: true, fields: { mark: null } });
   *
   * // Artworks – EN, specific category
   * filterSchemaItems(artworks, { isCn: false, fields: { category: "painting" } });
   *
   * // No language filter, only published items
   * filterSchemaItems(posts, { fields: { status: "published" } });
   *
   * // Multiple field filters
   * filterSchemaItems(items, { isCn, fields: { mark: "featured", visible: true } });
   */
  export function filterSchemaItems(items, { isCn, languageField = "language", fields = {} } = {}) {
    return (items ?? []).filter((item) => {
      if (isCn !== undefined && !matchLanguage(item, isCn, languageField)) return false;
      return Object.entries(fields).every(([field, expected]) =>
        matchField(item, field, expected)
      );
    });
  }
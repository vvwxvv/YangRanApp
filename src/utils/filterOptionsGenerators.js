/**
 * filterOptionsGenerators.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates dropdown option arrays consumed by FilterBarDropdown.
 *
 * Option shape:
 *   { value, label }                           – simple fields
 *   { value, valueCn, valueEn, label }         – bilingual fields
 *
 * Dependencies: schemaFilterConstants, filterUtils
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NO_SUFFIX_FIELDS } from '@/components/pages/manager/utils/schemaFilterConstants';
import { getLocalizedAllLabel } from '@/utils/fieldUtils';

// ─── Internal generators ──────────────────────────────────────────────────────

/**
 * Builds options for fields stored without a language suffix.
 * Example: `year`, `price`, `id`.
 *
 * @param {string}     field
 * @param {object[]}   data
 * @param {Function?}  sortFunction  (a, b) => number
 * @returns {{ value: *, label: string }[]}
 */
const generateSimpleFieldOptions = (field, data, sortFunction) => {
  const unique = Array.from(
    new Set(data.map(item => item?.[field]).filter(val => val != null))
  );

  const sorted = sortFunction ? [...unique].sort(sortFunction) : unique;

  return sorted.map(value => ({ value, label: String(value) }));
};

/**
 * Builds options for fields that exist as `field_cn` / `field_en` pairs.
 * Deduplicates by the Chinese value (falls back to English when CN is absent).
 *
 * @param {string}     field
 * @param {object[]}   data
 * @param {Function?}  sortFunction  (keyA, keyB) => number
 * @returns {{ value, valueCn, valueEn, label }[]}
 */
const generateBilingualFieldOptions = (field, data, sortFunction) => {
  const fieldCn = `${field}_cn`;
  const fieldEn = `${field}_en`;
  const valueMap = new Map();

  data.forEach(item => {
    const cn = item?.[fieldCn];
    const en = item?.[fieldEn];
    if (!cn && !en) return;

    const key = cn || en; // primary dedup key
    if (!valueMap.has(key)) {
      valueMap.set(key, { cn: cn ?? '', en: en ?? '' });
    }
  });

  let entries = Array.from(valueMap.entries());
  if (sortFunction) {
    entries = entries.sort(([a], [b]) => sortFunction(a, b));
  }

  return entries.map(([key, { cn, en }]) => ({
    value:   key,
    valueCn: cn,
    valueEn: en,
    label:   cn && en ? `${cn} / ${en}` : cn || en,
  }));
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Master option generator — selects the correct strategy based on field type,
 * prepends a localised "All" option, and returns the final list.
 *
 * @param {object}   filterConfig          Must contain `field` and optional `sortFunction`
 * @param {object[]} data                  Source data rows
 * @param {object}   filterValues          Must contain an `ALL` sentinel value
 * @returns {object[]}                     Options ready for FilterBarDropdown
 */
export const generateFilterOptions = (filterConfig, data, filterValues) => {
  const { field, sortFunction } = filterConfig;

  const allOption = {
    value: filterValues.ALL,
    label: getLocalizedAllLabel(field),
  };

  const isSimple   = NO_SUFFIX_FIELDS.includes(field);
  const bodyOptions = isSimple
    ? generateSimpleFieldOptions(field, data, sortFunction)
    : generateBilingualFieldOptions(field, data, sortFunction);

  return [allOption, ...bodyOptions];
};
// utils/filterAndSortItems.js
/**
 * Universal filter and sort utility for any schema.
 * @param {Object} params
 * @param {Array} params.items - The array of items to filter/sort.
 * @param {boolean} params.isCn - Whether to filter for Chinese language.
 * @param {string} params.search - Search string for title.
 * @param {string} params.languageField - Field name for language (e.g., 'language').
 * @param {string} params.titleField - Field name for title (e.g., 'title').
 * @param {string} params.yearField - Field name for year (e.g., 'year').
 * @param {Object} params.langValues - Object with cn and en values (e.g., { cn: 'CN', en: 'EN' }).
 * @param {string|Array} params.sortField - Field name(s) to sort by (e.g., 'year' or ['year', 'type']).
 * @param {string|Array} params.sortType - 'asc' or 'desc' or ['asc', 'desc'] for multi-field sorting.
 * @returns {Array}
 */
export function filterAndSortItems({
  items,
  isCn,
  search,
  languageField = 'language',
  titleField = 'title',
  yearField = 'year',
  langValues = { cn: 'CN', en: 'EN' },
  sortField = 'year',
  sortType = 'desc',
}) {
  if (!items || !Array.isArray(items)) return [];
  
  const filteredItems = items.filter(item => {
    if (!item) return false;
    const itemLang = (item[languageField] || '').toUpperCase();
    const matchesLang = isCn ? itemLang === langValues.cn : itemLang === langValues.en;
    const matchesSearch = !search || (item[titleField] || '').toLowerCase().includes(search.toLowerCase());
    return matchesLang && matchesSearch;
  });
  
  // Handle multi-field sorting
  const sortFields = Array.isArray(sortField) ? sortField : [sortField];
  const sortTypes = Array.isArray(sortType) ? sortType : [sortType];
  
  return filteredItems.sort((a, b) => {
    for (let i = 0; i < sortFields.length; i++) {
      const field = sortFields[i];
      const type = sortTypes[i] || sortTypes[0] || 'desc';
      
      let aVal = a[field];
      let bVal = b[field];
      
      // Try to parse as int for year, fallback to string compare
      if (field === yearField) {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      }
      
      if (type === 'desc') {
        const diff = bVal - aVal;
        if (diff !== 0) return diff;
      } else {
        const diff = aVal - bVal;
        if (diff !== 0) return diff;
      }
    }
    return 0;
  });
}

/**
 * Group items by a specified field, with optional sorting of each group.
 * @param {Object} params
 * @param {Array} params.items - The array of items to group.
 * @param {string} params.groupField - The field name to group by (e.g., 'series').
 * @param {string} params.sortField - The field name to sort each group by (e.g., 'year').
 * @param {string} params.sortType - 'asc' or 'desc'.
 * @param {string} [params.otherLabel='Other'] - Label for items with empty groupField.
 * @param {string} [params.locale='en'] - Locale for group label sorting.
 * @returns {Array<{label: string, items: Array}>}
 */
export function groupItemsByField({
  items,
  groupField,
  sortField,
  sortType = 'desc',
  otherLabel = 'Other',
  locale = 'en',
}) {
  if (!items || !Array.isArray(items)) return [];
  const groups = {};
  items.forEach(item => {
    const key = item[groupField] && item[groupField].trim() !== '' ? item[groupField] : '__other__';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  // Sort each group
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string' && !isNaN(parseInt(aVal))) aVal = parseInt(aVal);
      if (typeof bVal === 'string' && !isNaN(parseInt(bVal))) bVal = parseInt(bVal);
      if (sortType === 'desc') return bVal - aVal;
      if (sortType === 'asc') return aVal - bVal;
      return 0;
    });
  });
  // Build result array
  const result = Object.entries(groups)
    .filter(([k]) => k !== '__other__')
    .map(([label, items]) => ({ label, items }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
  if (groups.__other__) {
    result.push({ label: otherLabel, items: groups.__other__ });
  }
  return result;
}

/**
 * Generate filter options for any field, with an 'All' option and optional dependency on another field.
 * @param {Object} params
 * @param {Array<string>} params.allValues - All possible values for the field.
 * @param {string} params.allLabel - Label for the 'All' option.
 * @param {Array} [params.filteredItems] - Optionally filter values based on these items.
 * @param {string} [params.fieldName] - The field name to filter by (for dependent filtering).
 * @param {string} [params.dependentField] - The field name to match for dependency.
 * @param {string} [params.dependentValue] - The value to match in the dependent field.
 * @returns {Array<{value: string, label: string}>}
 */
export function getFilteredFieldOptions({
  allValues,
  allLabel,
  filteredItems,
  fieldName,
  dependentField,
  dependentValue,
}) {
  const base = [{ value: 'all', label: allLabel }];
  let values = allValues;
  if (filteredItems && fieldName && dependentField && dependentValue) {
    values = allValues.filter(v =>
      filteredItems.some(item => item[fieldName] === v && item[dependentField] === dependentValue)
    );
  }
  
  // Sort values alphabetically
  const sortedValues = values.sort((a, b) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return a.toString().localeCompare(b.toString(), 'en', { sensitivity: 'base' });
  });
  
  return base.concat(sortedValues.map(v => ({ value: v, label: v })));
} 
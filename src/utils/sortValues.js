
/**
 * Sort values based on sort type configuration
 * @param {Array} values - Array of values to sort
 * @param {string} sortType - Type of sorting ('alphabetic', 'numeric_asc', 'numeric_desc')
 * @returns {Array} - Sorted array
 */
export const sortValues = (values, sortType) => {
  switch (sortType) {
    case 'numeric_desc':
      // Sort numerically in descending order (for years, etc.)
      return values.sort((a, b) => {
        const aNum = Number(a);
        const bNum = Number(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return bNum - aNum;
        }
        return 0;
      });

    case 'numeric_asc':
      // Sort numerically in ascending order
      return values.sort((a, b) => {
        const aNum = Number(a);
        const bNum = Number(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return 0;
      });

    case 'alphabetic':
    default:
      // Sort alphabetically (case-insensitive)
      return values.sort((a, b) => {
        const aStr = a.toString().toLowerCase();
        const bStr = b.toString().toLowerCase();
        return aStr.localeCompare(bStr, 'en', { sensitivity: 'base' });
      });
  }
};

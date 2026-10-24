// utils/dateFormatter.js

/**
 * USAGE EXAMPLES:
 * 
 * import { formatUpdatedAt } from '@/utils/dateFormatter';
 * 
 * // Format updatedAt field from database
 * const formattedDate = formatUpdatedAt("2025-08-16T04:30:50.382Z");
 * // Result: "2025-08-16_04-30-50"
 * 
 * // Format current date
 * const currentFormatted = getCurrentUpdatedAtFormat();
 * // Result: "2025-01-27_15-45-30" (current date/time)
 */

export const formatDate = (isoDate, format = 'default') => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const day = date.getDate();
  
  switch (format) {
    case 'monthYear':
      return `${month} ${year}`;
    case 'monthOnly':
      return month;
    case 'yearOnly':
      return year.toString();
    case 'fullDate':
      return `${month} ${day}, ${year}`;
    case 'shortDate':
      return `${month.substring(0, 3)} ${day}, ${year}`;
    case 'default':
      return `${month} ${year}`;
    default:
      return `${month} ${year}`;
  }
};

// Add this function for Chinese date format if needed
export const formatDateCn = (isoDate, format = 'default') => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  switch (format) {
    case 'monthYear':
      return `${year}年${month}月`;
    case 'monthOnly':
      return `${month}月`;
    case 'yearOnly':
      return `${year}年`;
    case 'fullDate':
      return `${year}年${month}月${day}日`;
    case 'shortDate':
      return `${year}.${month}.${day}`;
    case 'default':
      return `${year}年${month}月`;
    default:
      return `${year}年${month}月`;
  }
};

/**
 * Formats a date in month-day-year-hour-min-second format
 * @param {Date} date - The date to format (defaults to current date)
 * @returns {string} Formatted date string
 */
export function formatDateForAPI(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  
  return `${month}-${day}-${year}-${hour}-${minute}-${second}`;
}

/**
 * Gets current date in the required format for API
 * @returns {string} Current date in month-day-year-hour-min-second format
 */
export function getCurrentFormattedDate() {
  return formatDateForAPI(new Date());
}

/**
 * Converts ISO string to formatted date
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date string
 */
export function isoToFormattedDate(isoString) {
  return formatDateForAPI(new Date(isoString));
}

/**
 * Formats ISO date string to year-month-day_hour-min-second format
 * @param {string} isoString - ISO date string like "2025-08-16T04:30:50.382Z"
 * @returns {string} Formatted date string like "2025-08-16_04-30-50"
 */
export function formatUpdatedAt(isoString) {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

/**
 * Formats current date to year-month-day_hour-min-second format
 * @returns {string} Current date in year-month-day_hour-min-second format
 */
export function getCurrentUpdatedAtFormat() {
  return formatUpdatedAt(new Date().toISOString());
}
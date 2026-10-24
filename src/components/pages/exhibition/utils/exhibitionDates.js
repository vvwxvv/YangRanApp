/**
 * exhibitionDates.js
 * Pure utility functions for classifying exhibitions as current/past.
 * Uses Exhibition model fields: date_start, date_end, status, year.
 *
 * Date parsing + the current/past rule live in `@/utils/looseDate` (EN + CN
 * aware) so exhibitions and fairs behave identically.
 */

import { parseLooseDate, isCurrentEntry } from "@/utils/looseDate";

const MS_PER_DAY = 86400000;

/**
 * Parse an exhibition date string (EN or CN: "2023-12-24", "24 December 2023",
 * "2023年12月24日", "Dec 2023", …). Returns a Date or null.
 */
export function parseExhibitionDate(dateStr) {
  return parseLooseDate(dateStr);
}

/**
 * Check if an exhibition is currently active.
 *
 * Smart rule (see isCurrentEntry):
 *  - status "current"/"ongoing" → current, "past" → past
 *  - has end date → current while it hasn't ended
 *  - start only → not past once started (past if it began in an earlier year)
 *  - no dates → falls back to `year`: current when it is this year or later
 *
 * So anything dated in the CURRENT year (EN or CN format) that hasn't passed is
 * treated as Current — no longer mis-filed as Past when the date string was a
 * CN one like "2023年12月24日".
 */
export function isCurrentExhibition(exhibition) {
  return isCurrentEntry(exhibition);
}

/**
 * Check if an exhibition is past.
 */
export function isPastExhibition(exhibition) {
  return !isCurrentExhibition(exhibition);
}

/**
 * Classify an array of exhibitions into { current, past }.
 * Each group is sorted by order field ascending.
 */
export function classifyExhibitions(exhibitions) {
  const current = [];
  const past = [];

  for (const ex of exhibitions || []) {
    if (isCurrentExhibition(ex)) {
      current.push(ex);
    } else {
      past.push(ex);
    }
  }

  const sortByOrder = (a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0);

  return {
    current: current.sort(sortByOrder),
    past: past.sort(sortByOrder),
  };
}

/**
 * Format a date string for display.
 * @param {string} dateStr - date string
 * @param {boolean} isCn - Chinese format
 * @returns {string} formatted date
 */
export function formatExhibitionDate(dateStr, isCn = false) {
  const d = parseExhibitionDate(dateStr);
  if (!d) return dateStr || "";

  const months = isCn
    ? ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return isCn ? `${year}年${month}${day}日` : `${day} ${month} ${year}`;
}

/**
 * Get a sortable timestamp for an exhibition.
 * Prefers date_start, falls back to date_end, then 0 (unknown dates sink to the bottom).
 */
function getExhibitionTime(exhibition) {
  const start = parseExhibitionDate(exhibition?.date_start);
  if (start) return start.getTime();

  const end = parseExhibitionDate(exhibition?.date_end);
  if (end) return end.getTime();

  return 0;
}

/**
 * Sort an array of exhibitions by year/date.
 * @param {Array} exhibitions
 * @param {"desc"|"asc"} direction - "desc" (default) = newest first, "asc" = oldest first
 * @returns {Array} a new sorted array (does not mutate the input)
 */
export function sortExhibitionsByDate(exhibitions, direction = "desc") {
  const sorted = [...(exhibitions || [])].sort(
    (a, b) => getExhibitionTime(b) - getExhibitionTime(a)
  );
  return direction === "asc" ? sorted.reverse() : sorted;
}

/**
 * Build a date range string from start/end dates.
 */
export function formatDateRange(exhibition, isCn = false) {
  const start = formatExhibitionDate(exhibition?.date_start, isCn);
  const end = formatExhibitionDate(exhibition?.date_end, isCn);

  if (start && end) return isCn ? `${start} – ${end}` : `${start} – ${end}`;
  if (start) return start;
  if (end) return isCn ? `至 ${end}` : `Until ${end}`;
  return "";
}
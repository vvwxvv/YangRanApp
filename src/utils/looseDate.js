/**
 * looseDate.js — tolerant date parsing + current/past classification.
 *
 * The gallery stores dates as free-ish strings coming from CSV imports, so a
 * single record can look like any of:
 *
 *   "2023-12-24"            ISO
 *   "2023/12/24" "2023.12.24"
 *   "24 December 2023"      EN (day-first)
 *   "December 24, 2023"     EN (month-first)
 *   "Dec 2023"  "December 2023"
 *   "2023"                  year only
 *   "2023年12月24日"         CN (year月day日)
 *   "2023年12月"  "2023年"
 *   "12月24日"               CN, no year
 *   "24/12/2023"            DD/MM/YYYY  (native `new Date` rejects this)
 *
 * `new Date(...)` only handles a few of these (and silently fails on the CN
 * ones), which made exhibitions/fairs mis-classify as "past". `parseLooseDate`
 * normalises them all (EN + CN) into a real Date.
 */

const MONTH_NAMES = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

const clampInt = (v, min, max, fallback) => {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};

/** Build a Date from y/m/d, clamped; returns null when the year is missing. */
const makeDate = (y, m, d) => {
  const year = parseInt(y, 10);
  if (!Number.isFinite(year) || year < 1000 || year > 9999) return null;
  const month = clampInt(m, 1, 12, 1);
  const day = clampInt(d, 1, 31, 1);
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
};

/** Normalise full-width digits and common separators. */
const normalise = (input) =>
  String(input)
    .trim()
    .replace(/[０-９]/g, (c) => String("０１２３４５６７８９".indexOf(c)))
    .replace(/[．。]/g, ".")
    .replace(/[／]/g, "/")
    .replace(/[－—–]/g, "-");

/** Parse an English month-name string ("24 December 2023"). */
const parseEnglish = (s) => {
  const tokens = s
    .replace(/[,\u3002]/g, " ")
    .replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, "$1")
    .split(/\s+/)
    .filter(Boolean);

  let month = null;
  let day = null;
  let year = null;

  for (const token of tokens) {
    const low = token.toLowerCase();
    const key = low.replace(/\.$/, "").slice(0, 3);
    if (MONTH_NAMES[low.replace(/\.$/, "")]) {
      month = MONTH_NAMES[low.replace(/\.$/, "")];
    } else if (MONTH_NAMES[key]) {
      month = MONTH_NAMES[key];
    } else if (/^\d{4}$/.test(token)) {
      year = token;
    } else if (/^\d{1,2}$/.test(token)) {
      day = token;
    } else if (/\d{1,2}:\d{2}/.test(token)) {
      // time component — ignore
    }
  }

  if (month && year) return makeDate(year, month, day || 1);
  return null;
};

/**
 * Parse almost any date string (EN or CN) into a Date, or null.
 * @param {string|Date|number} input
 * @returns {Date|null}
 */
export function parseLooseDate(input) {
  if (input === null || input === undefined || input === "") return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  if (typeof input === "number") {
    // Excel serial or a plain year.
    if (input > 1900 && input < 3000) return makeDate(input, 1, 1);
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  const s = normalise(input);
  if (!s) return null;

  // CN with 年 / 月 / 日 (year optional)
  if (/[年月日]/.test(s)) {
    const cnYmd = s.match(/(\d{4})\s*年\s*(?:(\d{1,2})\s*月)?\s*(?:(\d{1,2})\s*日?)?/);
    if (cnYmd && cnYmd[1]) return makeDate(cnYmd[1], cnYmd[2] || 1, cnYmd[3] || 1);
    const cnMd = s.match(/(\d{1,2})\s*月\s*(?:(\d{1,2})\s*日?)?/);
    if (cnMd) return makeDate(new Date().getFullYear(), cnMd[1], cnMd[2] || 1);
  }

  // YYYY-MM-DD / YYYY/MM/DD / YYYY.MM.DD / YYYY-MM
  const ymd = s.match(/^(\d{4})[-/.](\d{1,2})(?:[-/.](\d{1,2}))?/);
  if (ymd) return makeDate(ymd[1], ymd[2], ymd[3] || 1);

  // DD/MM/YYYY or MM/DD/YYYY — prefer DD/MM unless the first number is <=12
  // and the second > 12 (then it's clearly MM/DD).
  const dmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmy) {
    const a = parseInt(dmy[1], 10);
    const b = parseInt(dmy[2], 10);
    const y = dmy[3];
    if (a > 12) return makeDate(y, b, a);          // day > 12 → DD/MM/YYYY
    if (b > 12) return makeDate(y, a, b);          // 2nd > 12 → MM/DD/YYYY
    return makeDate(y, b, a);                      // ambiguous → DD/MM/YYYY
  }

  // English month name
  const en = parseEnglish(s);
  if (en) return en;

  // Bare year
  if (/^\d{4}$/.test(s)) return makeDate(s, 1, 1);

  // Last resort: native Date
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/** Parse just a 4-digit year from a value (or null). */
export function parseLooseYear(input) {
  if (input === null || input === undefined) return null;
  const direct = String(input).match(/(19|20)\d{2}/);
  if (direct) return parseInt(direct[0], 10);
  const d = parseLooseDate(input);
  return d ? d.getFullYear() : null;
}

/**
 * Is an exhibition/fair entry CURRENT (not yet past)?
 *
 * The DATE is authoritative whenever the record has usable dates — a stale
 * `status` (e.g. an old "Current" left on a show that ended last month) must
 * NOT keep it under Current. Status is only consulted when there are no usable
 * dates at all.
 *
 * Rules, in order:
 *   1. End date present → current iff it hasn't ended yet (end >= now).
 *   2. Start only → not past once started; past when it began in an earlier year.
 *   3. No usable dates → `status` ("current"/"ongoing"/"进行中" → current;
 *      "past"/"已结束" → past), then the `year` (this year or later → current).
 */
export function isCurrentEntry(entry) {
  const now = new Date();
  const start = parseLooseDate(entry?.date_start);
  const end = parseLooseDate(entry?.date_end);
  const currentYear = now.getFullYear();

  // 1 & 2 — real dates decide.
  if (end) return end.getTime() >= now.getTime();
  if (start) return start.getFullYear() >= currentYear;

  // 3 — no usable dates → status, then year.
  const status = String(entry?.status || "").toLowerCase().trim();
  if (status === "current" || status === "ongoing" || status === "进行中" || status === "正在展出") {
    return true;
  }
  if (status === "past" || status === "upcoming" || status === "已结束" || status === "已過期") {
    return false;
  }

  const year = parseLooseYear(entry?.year);
  if (year !== null) return year >= currentYear;

  return false;
}

export default parseLooseDate;

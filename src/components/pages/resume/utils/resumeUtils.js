// utils/resumeUtils.js
// Helpers for the public Resume page (Prisma Resume model).

/** Pick the CN/EN variant. */
export const pick = (isCn, pair) => (isCn ? pair.cn : pair.en);

/**
 * "start – end" when both are present and differ, otherwise whichever exists.
 * Dates are free-text strings (e.g. "08/2026"), so they're shown as-is.
 */
export const formatDateRange = (start, end) => {
  const s = String(start ?? "").trim();
  const e = String(end ?? "").trim();
  if (!s && !e) return "";
  if (s && e && s !== e) return `${s} – ${e}`;
  return s || e;
};

/**
 * Split a description into { role, org } on the FIRST comma.
 * "Exhibited Artist, Singapore International Photography Festival (SIPF)"
 *   → { role: "Exhibited Artist", org: "Singapore International Photography Festival (SIPF)" }
 * No comma → the whole string is the role.
 */
export const splitRoleOrg = (description) => {
  const d = String(description ?? "").trim();
  if (!d) return { role: "", org: "" };
  const i = d.indexOf(",");
  if (i === -1) return { role: d, org: "" };
  return { role: d.slice(0, i).trim(), org: d.slice(i + 1).trim() };
};

/**
 * Group entries by `type` (the section heading), keeping first-seen order.
 * Empty type → an ungrouped bucket (rendered without a heading).
 */
export const groupByType = (items = []) => {
  const order = [];
  const map = new Map();
  for (const item of items || []) {
    if (!item) continue;
    const key = String(item.type ?? "").trim() || "__ungrouped__";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key).push(item);
  }
  return order.map((key) => ({
    key,
    label: key === "__ungrouped__" ? "" : key,
    items: map.get(key),
  }));
};

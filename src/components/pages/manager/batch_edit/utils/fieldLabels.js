/**
 * fieldLabels.js — human labels for batch-edit fields.
 *
 * Schema field names are sometimes raw keys (`order.artist_page_order`,
 * `cover_img_url`). When a column has no real label we prettify the key so the
 * card rows and the "double-click to edit" tooltips read like words instead of
 * database columns.
 *
 *   prettifyFieldLabel("order.artist_page_order") → "Order · Artist Page Order"
 *   prettifyFieldLabel("cover_img_url")           → "Cover Img Url"
 */

const TITLE = /(^|[\s·])([a-z])/g;

export function prettifyFieldLabel(key = "") {
  const pretty = (part = "") =>
    String(part)
      .replace(/_+/g, " ")
      .trim()
      .replace(TITLE, (m, sep, ch) => `${sep}${ch.toUpperCase()}`);

  const dotted = String(key).split(".").filter(Boolean);
  const last = pretty(dotted.pop() || "");
  const parents = dotted.map(pretty).filter(Boolean);
  return [...parents, last].filter(Boolean).join(" · ");
}

/** True when the string looks like a raw field key rather than a label. */
export const looksLikeFieldKey = (value, field) => {
  if (!value) return true;
  if (field && value === field) return true;
  return /[._]/.test(value) && value === value.toLowerCase();
};

/**
 * Best available label for a column: explicit label → header → prettified key.
 * Pass `getSystemLabel` to resolve `labelKey` first.
 */
export function resolveFieldLabel(column = {}, { getSystemLabel, isCn = false } = {}) {
  // 1. language-aware system label (labelKey / field name)
  if (typeof getSystemLabel === "function") {
    const key = column.labelKey || column.field;
    if (key) {
      const fromKey = getSystemLabel(key, isCn);
      if (fromKey && fromKey !== key && !looksLikeFieldKey(fromKey, key)) return fromKey;
    }
  }

  // 2. the schema's own label / an explicit header
  const explicit = column.headerName || column.label;
  if (explicit && !looksLikeFieldKey(explicit, column.field)) return explicit;

  const prettified = prettifyFieldLabel(column.field || explicit || "");
  if (prettified) return prettified;
  return isCn ? "此字段" : "this field";
}

export default resolveFieldLabel;

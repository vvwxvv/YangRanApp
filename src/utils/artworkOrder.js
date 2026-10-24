/**
 * artworkOrder.js — helpers for the Artwork `order` JSON field.
 *
 * Thin wrapper over the generic helpers in `mediaOrder.js`, keeping the
 * artwork-specific export names used across the app.
 *
 * Artwork.order = { artist_page_order, exhibition_page_order, art_fair_page_order }
 * Legacy rows still have a plain string `order`; every helper tolerates it.
 */

import {
  ORDER_KEYS,
  emptyOrder,
  isOrderObject,
  normalizeOrder,
  getOrder,
  orderValue,
  compareOrder,
} from "./mediaOrder";

export const ARTWORK_ORDER_KEYS = ORDER_KEYS.artwork;

export const EMPTY_ARTWORK_ORDER = Object.freeze(emptyOrder(ARTWORK_ORDER_KEYS));

/** True when `order` is the new JSON shape. */
export const isArtworkOrderObject = isOrderObject;

/** Coerce any stored `order` into a full artwork order object. */
export const normalizeArtworkOrder = (order) =>
  normalizeOrder(order, ARTWORK_ORDER_KEYS);

/**
 * Read the order value for one page.
 * @param {object} artwork
 * @param {string} pageKey — one of ARTWORK_ORDER_KEYS (default artist page)
 */
export const getArtworkOrder = (artwork, pageKey = "artist_page_order") =>
  getOrder(artwork, pageKey);

/** Numeric sort value; missing / non-numeric → 0 (same as the old sorter). */
export const artworkOrderValue = (artwork, pageKey = "artist_page_order") =>
  orderValue(artwork, pageKey);

/** Comparator for arrays of artworks, by page-specific order. */
export const compareArtworkOrder = (pageKey = "artist_page_order") =>
  compareOrder(pageKey);

/** Numeric `year` of a record (missing / non-numeric → 0). */
export const artworkYear = (record) => {
  const n = Number(String(record?.year ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * THE fallback order for related artworks that carry no position: newest year
 * first, then the artwork title A→Z (numeric-aware).
 *
 * So a page where nothing is ordered and nothing is hidden still reads
 * sensibly instead of inheriting an arbitrary API order.
 */
export const compareByYearThenTitle = (a, b) => {
  const d = artworkYear(b) - artworkYear(a);
  if (d) return d;
  return String(a?.title || "").localeCompare(String(b?.title || ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

/**
 * True when the artwork carries a usable numeric position for `pageKey`.
 * Empty strings, null, undefined and non-numeric values count as "not set".
 */
export const hasArtworkOrder = (artwork, pageKey = "artist_page_order") => {
  const v = getArtworkOrder(artwork, pageKey);
  if (v === undefined || v === null || String(v).trim() === "") return false;
  return Number.isFinite(Number(v));
};

/** Numeric position for one page key, or `null` when the artwork has none. */
export const artworkOrderNumber = (artwork, pageKey = "artist_page_order") =>
  hasArtworkOrder(artwork, pageKey)
    ? Number(getArtworkOrder(artwork, pageKey))
    : null;

/**
 * THE shared related-artwork ordering rule for the detail pages.
 *
 *   • artworks WITH a position for this page → first, ascending
 *   • artworks WITHOUT a position           → after them, by newest year
 *     then title A→Z (`unorderedComparator` can override)
 *
 * Used by:
 *   artist detail page      → "artist_page_order"
 *   exhibition detail page  → "exhibition_page_order"
 *   art fair detail page    → "art_fair_page_order"
 *
 * Non-mutating (returns a new array); the sort is stable in modern engines,
 * so equal positions keep their previous relative order.
 */
export const sortArtworksByPageOrder = (
  list,
  pageKey = "artist_page_order",
  { unorderedComparator = compareByYearThenTitle } = {}
) => {
  const ordered = [];
  const unordered = [];

  for (const item of list || []) {
    (artworkOrderNumber(item, pageKey) === null ? unordered : ordered).push(
      item
    );
  }

  ordered.sort(
    (a, b) => artworkOrderNumber(a, pageKey) - artworkOrderNumber(b, pageKey)
  );

  if (unorderedComparator) unordered.sort(unorderedComparator);

  return [...ordered, ...unordered];
};

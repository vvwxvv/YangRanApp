/**
 * mediaOrder.js — generic helpers for JSON `order` fields.
 *
 * TWO SEPARATE SYSTEMS. Both are "a position for a page", but on different
 * records, so never mix them up:
 *
 *   Artwork.order  → where an ARTWORK sits on a page
 *     { artist_page_order, exhibition_page_order, art_fair_page_order }
 *     Driver: artist page "Related Artworks" (artist_page_order), the
 *     exhibition page's artwork list (exhibition_page_order), the fair page's
 *     artwork list (art_fair_page_order). Ordered in Manager → Artwork → Order.
 *
 *   Image.order    → where an IMAGE sits on a page
 *     { rolling_img_order, artist_detail_rolling_img_order,
 *       exhibition_page_order, art_fair_page_order,
 *       artist_page_order (LEGACY — no longer offered, kept so old rows keep
 *       their value) }
 *     Driver: the artist page's rolling slideshow (rolling_img_order), the
 *     artist DETAIL page's rolling slideshow
 *     (artist_detail_rolling_img_order), the exhibition page's image gallery,
 *     the fair page's image gallery.
 *     Ordered in Manager → Image → Order.
 *
 * Two rolling sequences on purpose: the artists index / artist page preview and
 * the artist detail page's slideshow are separate surfaces, so each keeps its
 * own per-artist order (and its own hide flag — see utils/markRegistry).
 *
 * The artist page shows images ONLY as the rolling sequence, which is why the
 * image side has no separate "artist page order" tab any more: its legacy
 * `artist_page_order` values are read last as a fallback (see useImageGallery)
 * and are never written by the manager.
 *
 * Legacy rows still have a plain string `order`; every helper tolerates that
 * (a string is treated as the value for whatever key is asked).
 */

// Human labels for each sub-order key (en/cn), shared by forms + manager.
export const ORDER_KEY_LABELS = Object.freeze({
  artist_page_order: { en: "Artist Page Order", cn: "艺术家页排序" },
  exhibition_page_order: { en: "Exhibition Page Order", cn: "展览页排序" },
  art_fair_page_order: { en: "Art Fair Page Order", cn: "艺博会页排序" },
  // For IMAGES this key IS the artist page (the rolling slideshow), so the
  // label spells that out — no second "Artist Page Order" on the image side.
  rolling_img_order: {
    en: "Artist Page Order (Rolling Images)",
    cn: "艺术家页排序（轮播图）",
  },
  // The SECOND rolling sequence: the artist DETAIL page's own slideshow.
  artist_detail_rolling_img_order: {
    en: "Artist Detail Page Order (Rolling Images)",
    cn: "艺术家详情页排序（轮播图）",
  },
});

/**
 * Which sub-keys each collection STORES (normalisation / form defaults).
 * `image` keeps the legacy `artist_page_order` so a save can never drop it.
 */
export const ORDER_KEYS = Object.freeze({
  artwork: ["artist_page_order", "exhibition_page_order", "art_fair_page_order"],
  image: [
    "rolling_img_order",
    "artist_detail_rolling_img_order",
    "exhibition_page_order",
    "art_fair_page_order",
    "artist_page_order",
  ],
});

/**
 * Which page orders an IMAGE can actually be MANAGED for — the image order
 * manager's tabs, in display order. Both artist rolling sequences are offered
 * (artist page + artist detail page), then the show / fair galleries.
 */
export const IMAGE_PAGE_ORDER_KEYS = Object.freeze([
  "rolling_img_order",
  "artist_detail_rolling_img_order",
  "exhibition_page_order",
  "art_fair_page_order",
]);

/** Image sub-keys that are legacy: readable, never written by the manager. */
export const IMAGE_LEGACY_ORDER_KEYS = Object.freeze(["artist_page_order"]);

/**
 * Rolling-image sequence keys (the artist PAGE sequence + the artist DETAIL
 * page sequence). Re-exported here so non-artist modules — e.g. the image
 * order manager — don't have to import from components/pages/artists.
 */
export const ARTIST_ROLLING_ORDER_KEY = "rolling_img_order";
export const ARTIST_DETAIL_ROLLING_ORDER_KEY = "artist_detail_rolling_img_order";

/**
 * The keys a UI should OFFER for a collection.
 * Same as ORDER_KEYS except for images, where only the pages an image can be
 * ordered for are offered (the legacy key is storage-only).
 */
export const managedOrderKeys = (entity) =>
  entity === "image" ? IMAGE_PAGE_ORDER_KEYS : ORDER_KEYS[entity] || [];

/** True when `order` is the JSON object shape (not the legacy string). */
export const isOrderObject = (order) =>
  !!order && typeof order === "object" && !Array.isArray(order);

/** Empty { key: "" } object for a given key list. */
export const emptyOrder = (keys) =>
  keys.reduce((acc, k) => ({ ...acc, [k]: "" }), {});

/**
 * Coerce a stored/submitted order value into a plain position string.
 * Objects (including a nested order object) and the "[object Object]" launder
 * are dropped to "" — an object must never become a stored position.
 */
export const orderValueToString = (v) => {
  if (v === undefined || v === null) return "";
  if (typeof v === "object") return "";
  const s = String(v).trim();
  return s === "[object Object]" ? "" : s;
};

/**
 * Coerce any stored `order` into a full object for the given keys.
 * - object → filled with the known keys (missing keys become "")
 * - string  → legacy value, copied to every key (keeps old behaviour)
 * - empty   → all keys ""
 */
export const normalizeOrder = (order, keys) => {
  const out = emptyOrder(keys);
  if (isOrderObject(order)) {
    for (const k of keys) {
      out[k] = orderValueToString(order[k]);
    }
    return out;
  }
  if (typeof order === "string" && order.trim() !== "") {
    const v = orderValueToString(order);
    for (const k of keys) out[k] = v;
    return out;
  }
  return out;
};

/** Read the order value for one page key. */
export const getOrder = (record, key) => {
  const order = record?.order;
  if (isOrderObject(order)) {
    return orderValueToString(order[key]);
  }
  return typeof order === "string" ? orderValueToString(order) : ""; // legacy string
};

/** Numeric sort value; missing / non-numeric → 0. */
export const orderValue = (record, key) => Number(getOrder(record, key)) || 0;

/** Comparator for arrays of records, by a specific order key (ascending). */
export const compareOrder = (key) => (a, b) => orderValue(a, key) - orderValue(b, key);

// ── Image convenience wrappers ──────────────────────────────────────────────
export const IMAGE_ORDER_KEYS = ORDER_KEYS.image;
export const EMPTY_IMAGE_ORDER = Object.freeze(emptyOrder(IMAGE_ORDER_KEYS));
export const normalizeImageOrder = (order) => normalizeOrder(order, IMAGE_ORDER_KEYS);
export const getImageOrder = (record, key = "rolling_img_order") => getOrder(record, key);

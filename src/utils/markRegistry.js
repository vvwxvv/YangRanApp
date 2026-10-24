/**
 * markRegistry.js — THE single source of truth for every mark a record can carry.
 * ============================================================================
 *
 * A record's `mark` is a JSON object:
 *
 *   mark = {
 *     value: "Slider",                        // classic scalar mark (optional)
 *     hide:  ["artist_page", "exhibition_page"], // pages the record is hidden on
 *     marks: ["artist_hover_image"],           // named flags the record carries
 *   }
 *
 * Two kinds of marks:
 *   • HIDE  — "don't show this record on page X"         → `mark.hide[]`
 *   • FLAG  — "use this record for behaviour X"          → `mark.marks[]`
 *
 * Every consumer goes through `utils/mediaMarks` (helpers), never the raw
 * object. This registry is what makes that possible: tokens, labels, the
 * matching `order` sub-key, legacy aliases and the UI affordances (which page
 * toggles it) all live HERE, once.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOW TO ADD A NEW MARK (the whole procedure)
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Add ONE entry to MARK_REGISTRY below:
 *
 *       {
 *         token: "home_featured",              // stable id stored in the DB
 *         kind: MARK_KIND.FLAG,                 // HIDE or FLAG
 *         label: { en: "Home featured", cn: "首页推荐" },
 *         entities: ["artwork", "image"],       // where it applies (advisory)
 *         orderKey: null,                       // HIDE only, when it pairs with an order page
 *         toggledOn: "/manager/home/featured",  // where the manager flips it (advisory)
 *         legacy: ["featured_on_home"],          // old scalar values to migrate
 *       }
 *
 *  2. Read / write it generically (no new helper needed):
 *
 *       import { isMarkApplied, applyMark } from "@/utils/mediaMarks";
 *
 *       isMarkApplied(record, "home_featured");        // boolean
 *       applyMark(record.mark, "home_featured", true); // → new stored mark
 *
 *  3. Filter a list:
 *       filterByMark(list, "home_featured", { on: true });
 *
 *  4. Build UI from the registry instead of hardcoding tokens:
 *       listMarks({ kind: "flag", entity: "artwork" }); // → definitions
 *       markLabel("home_featured", isCn);
 *
 *  Nothing else needs touching: the API already stores `mark` as JSON, the Meta
 *  page and the manager use the registry helpers, and legacy string values are
 *  migrated through `legacy` / LEGACY_TOLERANT_RULES automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The two kinds of mark. */
export const MARK_KIND = Object.freeze({ HIDE: "hide", FLAG: "flag" });

/**
 * Every mark the app knows about. ORDER MATTERS for the tolerant legacy
 * matcher (see LEGACY_TOLERANT_RULES) — most specific first.
 */
export const MARK_REGISTRY = Object.freeze([
  // ── HIDE marks (paired with the per-page order keys) ─────────────────────
  {
    token: "artist_page",
    kind: MARK_KIND.HIDE,
    label: { en: "Hidden on Artist Page", cn: "在艺术家页隐藏" },
    entities: ["artwork"],
    orderKey: "artist_page_order",
    toggledOn: "/manager/artwork/order",
    legacy: ["hide_in_artist_page"],
  },
  {
    token: "exhibition_page",
    kind: MARK_KIND.HIDE,
    label: { en: "Hidden on Exhibition Page", cn: "在展览页隐藏" },
    // Both collections can be hidden from a show page: artworks (Works grid) and
    // images (the show's gallery — the eye on the manager's Exhibition tab).
    entities: ["artwork", "image"],
    orderKey: "exhibition_page_order",
    // Two places flip it, entity-dependent: /manager/artwork/order (Works grid)
    // and /manager/image/order (Exhibition Page Order tab).
    toggledOn: "/manager/artwork/order",
    legacy: ["hide_in_exhibition_page"],
  },
  {
    token: "art_fair_page",
    kind: MARK_KIND.HIDE,
    label: { en: "Hidden on Art Fair Page", cn: "在艺博会页隐藏" },
    entities: ["artwork", "image"],
    orderKey: "art_fair_page_order",
    toggledOn: "/manager/artwork/order",
    legacy: ["hide_in_art_fair_page"],
  },
  {
    token: "artist_rolling_image",
    kind: MARK_KIND.HIDE,
    label: { en: "Hidden in Artist Rolling Image", cn: "在艺术家轮播图隐藏" },
    entities: ["image"],
    orderKey: "rolling_img_order",
    toggledOn: "/manager/image/order",
    legacy: ["hide_in_artist_page_rolling_image"],
  },
  {
    // The artist DETAIL page has its OWN rolling sequence, so it needs its own
    // hide flag: the eye button on the "Artist Detail Page Order" tab writes
    // this token, and only that page's slideshow reads it.
    token: "artist_detail_rolling_image",
    kind: MARK_KIND.HIDE,
    label: {
      en: "Hidden in Artist Detail Rolling Image",
      cn: "在艺术家详情页轮播图隐藏",
    },
    entities: ["image"],
    orderKey: "artist_detail_rolling_img_order",
    toggledOn: "/manager/image/order",
    legacy: [],
  },

  // ── FLAG marks (opt a record into a behaviour) ───────────────────────────
  {
    token: "artist_hover_image",
    kind: MARK_KIND.FLAG,
    label: { en: "Artist Name Hover Image", cn: "艺术家名称悬停图" },
    entities: ["image"],
    orderKey: null,
    toggledOn: "/manager/image/hover",
    legacy: [],
  },
]);

// ── Derived lookups (never hand-maintained) ──────────────────────────────────
export const MARK_TOKENS = Object.freeze(MARK_REGISTRY.map((d) => d.token));
export const HIDE_TOKENS = Object.freeze(
  MARK_REGISTRY.filter((d) => d.kind === MARK_KIND.HIDE).map((d) => d.token)
);
export const FLAG_TOKENS = Object.freeze(
  MARK_REGISTRY.filter((d) => d.kind === MARK_KIND.FLAG).map((d) => d.token)
);

/** Definition for a token (null when unknown). */
export const getMarkDef = (token) =>
  MARK_REGISTRY.find((d) => d.token === token) || null;

/** Is this a token the app knows about? (typo guard) */
export const isKnownMark = (token) => Boolean(getMarkDef(token));

/** Kind of a token ("hide" | "flag" | "" when unknown). */
export const markKind = (token) => getMarkDef(token)?.kind || "";

/** { en, cn } label for a token (falls back to the token itself). */
export const markLabelPair = (token) => getMarkDef(token)?.label || { en: token, cn: token };

/** Localised label for a token. */
export const markLabel = (token, isCn = false) => {
  const pair = markLabelPair(token);
  return isCn ? pair.cn : pair.en;
};

/**
 * Token constants — import these instead of raw strings so a typo can never
 * silently no-op (and editors get autocomplete):
 *
 *   MARK.ARTIST_PAGE · MARK.EXHIBITION_PAGE · MARK.ART_FAIR_PAGE
 *   MARK.ARTIST_ROLLING_IMAGE · MARK.ARTIST_HOVER_IMAGE
 */
export const MARK = Object.freeze(
  MARK_REGISTRY.reduce((acc, d) => ({ ...acc, [d.token.toUpperCase()]: d.token }), {})
);

/** The `order` sub-key a HIDE mark is paired with ("" when none). */
export const orderKeyForMark = (token) => getMarkDef(token)?.orderKey || "";

/** The HIDE mark paired with an `order` sub-key ("" when none). */
export const markForOrderKey = (orderKey) =>
  MARK_REGISTRY.find((d) => d.orderKey && d.orderKey === orderKey)?.token || "";

/**
 * Registry slice for building UI.
 * @param {object} [opts]
 * @param {"hide"|"flag"} [opts.kind]
 * @param {string}        [opts.entity]  e.g. "artwork" | "image"
 */
export const marksFor = ({ kind, entity } = {}) =>
  MARK_REGISTRY.filter(
    (d) =>
      (!kind || d.kind === kind) &&
      (!entity || !Array.isArray(d.entities) || d.entities.includes(entity))
  );

// ── Legacy (pre-JSON) scalar values ──────────────────────────────────────────
const norm = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/** Exact legacy value → token(s). Built from each definition's `legacy` list. */
export const LEGACY_TOKEN_MAP = Object.freeze(
  MARK_REGISTRY.reduce((acc, def) => {
    for (const alias of def.legacy || []) {
      const key = norm(alias);
      acc[key] = [...(acc[key] || []), def.token];
    }
    return acc;
  }, {})
);

/**
 * Tolerant fallback for hand-written legacy variants that never made it into
 * `legacy` (e.g. "hide in artist page"). Registry-driven, most specific first.
 */
export const LEGACY_TOLERANT_RULES = Object.freeze([
  {
    token: "artist_rolling_image",
    test: (k) =>
      k.includes("artist") && (k.includes("roll") || k.includes("img") || k.includes("image")),
  },
  { token: "artist_page", test: (k) => k.includes("artist") && k.includes("page") },
  { token: "exhibition_page", test: (k) => k.includes("exhibition") },
  { token: "art_fair_page", test: (k) => k.includes("artfair") || k.includes("fair") },
]);

/**
 * Resolve any legacy scalar mark string into hide tokens.
 * @returns {string[]} tokens ([] when the value is a normal scalar value)
 */
export const tokensForLegacyValue = (raw) => {
  const key = norm(raw);
  if (!key) return [];
  if (LEGACY_TOKEN_MAP[key]) return [...LEGACY_TOKEN_MAP[key]];
  if (!key.startsWith("hide")) return [];
  const rule = LEGACY_TOLERANT_RULES.find((r) => r.test(key));
  return rule ? [rule.token] : [];
};

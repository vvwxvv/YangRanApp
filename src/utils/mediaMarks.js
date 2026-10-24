/**
 * mediaMarks.js — the ONLY module app code should use to read or write a
 * record's `mark`.
 *
 * The mark shape and the token registry live in `utils/markRegistry` — this
 * file is the ergonomic API on top of it. Every token, label, order-key
 * pairing and legacy alias is derived from the registry, so adding a mark is a
 * one-entry change there (see the header of `markRegistry.js`).
 *
 *   mark = {
 *     value: "Slider",                     // classic scalar mark (optional)
 *     hide:  ["artist_page"],              // pages the record is hidden on
 *     marks: ["artist_hover_image"],       // named flags
 *   }
 *
 * ── Two ways to use it ──────────────────────────────────────────────────────
 * Generic (preferred — works for ANY mark, including ones added later):
 *
 *   isMarkApplied(record, "artist_page");          // hidden? flagged?
 *   applyMark(record.mark, "artist_page", true);   // → new stored mark
 *   filterByMark(list, "artist_hover_image");      // → matching records
 *   listMarks({ kind: "hide", entity: "artwork" });// → definitions (for UI)
 *
 * Named shorthand (kept for readability at call sites):
 *
 *   isHiddenInArtistPage(record) / isArtistHoverImage(record) / …
 *
 * Backward compatibility: legacy scalar marks ("hide_in_artist_page",
 * "hide_in_artist_page_rolling_image", …) are still understood everywhere.
 */

import {
  MARK,
  MARK_KIND,
  MARK_REGISTRY,
  getMarkDef,
  isKnownMark,
  markKind,
  markLabel,
  marksFor,
  orderKeyForMark,
  markForOrderKey,
  tokensForLegacyValue,
} from "./markRegistry";

// Single import point for UI code that wants the registry surface.
export {
  MARK,
  MARK_KIND,
  MARK_REGISTRY,
  getMarkDef,
  isKnownMark,
  markKind,
  markLabel,
  marksFor,
  orderKeyForMark,
  markForOrderKey,
};

// ── Token constants (derived — do not hand-edit) ─────────────────────────────
export const HIDE_ARTIST_PAGE = "artist_page";
export const HIDE_EXHIBITION_PAGE = "exhibition_page";
export const HIDE_ART_FAIR_PAGE = "art_fair_page";
export const HIDE_ARTIST_ROLLING_IMAGE = "artist_rolling_image";

export const MARK_FLAG_ARTIST_HOVER_IMAGE = "artist_hover_image";

/** { [token]: { en, cn } } for every HIDE mark. */
export const HIDE_TOKEN_LABELS = Object.freeze(
  MARK_REGISTRY.filter((d) => d.kind === MARK_KIND.HIDE).reduce(
    (acc, d) => ({ ...acc, [d.token]: d.label }),
    {}
  )
);

/** { [token]: { en, cn } } for every FLAG mark. */
export const MARK_FLAG_LABELS = Object.freeze(
  MARK_REGISTRY.filter((d) => d.kind === MARK_KIND.FLAG).reduce(
    (acc, d) => ({ ...acc, [d.token]: d.label }),
    {}
  )
);

/** `order` sub-key → hide token (e.g. rolling_img_order → artist_rolling_image). */
export const HIDE_TOKEN_BY_ORDER_KEY = Object.freeze(
  MARK_REGISTRY.reduce(
    (acc, d) => (d.orderKey ? { ...acc, [d.orderKey]: d.token } : acc),
    {}
  )
);

/** Hide token for an `order` page key (or "" when unknown). */
export const hideTokenForOrderKey = (orderKey) => markForOrderKey(orderKey);

/** { en, cn } label for an order page key's hide token (or null). */
export const hideLabelForOrderKey = (orderKey) => {
  const token = hideTokenForOrderKey(orderKey);
  return token ? getMarkDef(token)?.label || null : null;
};

// ── Legacy constants (kept so old imports keep working) ──────────────────────
export const IMAGE_MARK_HIDE_ARTIST_ROLLING = "hide_in_artist_page_rolling_image";
export const IMAGE_MARK_HIDE_ARTIST_ROLLING_LABEL = {
  en: "Hide in Artist Page Rolling Image",
  cn: "艺术家页轮播图隐藏",
};

// ── Internals ────────────────────────────────────────────────────────────────
const DEV = process.env.NODE_ENV !== "production";

/** List of tokens from a stored `hide` / `marks` value (array or map). */
const readFlagList = (raw) => {
  if (Array.isArray(raw)) return raw.filter((t) => typeof t === "string" && t.trim());
  if (raw && typeof raw === "object") return Object.keys(raw).filter((k) => raw[k]);
  return [];
};

const unique = (list) => [...new Set(list)];

/** Dev-only nudge: unknown tokens are almost always typos. */
const warnUnknown = (kind, tokens) => {
  if (!DEV) return;
  for (const token of unique(tokens)) {
    if (!isKnownMark(token)) {
      console.warn(
        `[marks] unknown ${kind} token "${token}" — add it to utils/markRegistry.js ` +
          `(known: ${MARK_REGISTRY.map((d) => d.token).join(", ")})`
      );
    }
  }
};

const readMarkSource = (recordOrMark) =>
  recordOrMark && typeof recordOrMark === "object" && "mark" in recordOrMark
    ? recordOrMark.mark
    : recordOrMark;

// ── Core normalisation ───────────────────────────────────────────────────────

/** Coerce ANY stored mark into `{ value, hide[], marks[] }`. */
export const normalizeMark = (mark) => {
  if (mark === null || mark === undefined) return { value: "", hide: [], marks: [] };

  if (typeof mark === "string") {
    const tokens = tokensForLegacyValue(mark);
    if (tokens.length) return { value: "", hide: tokens, marks: [] };
    return { value: mark, hide: [], marks: [] };
  }

  if (typeof mark === "object") {
    const value = typeof mark.value === "string" ? mark.value : "";
    // A token belongs in exactly ONE list. Rows written by older code paths
    // stored HIDE tokens inside `marks` (e.g. marks: ["artist_rolling_image"])
    // — that made a hidden row look like it carried a flag. Route by kind so
    // the stored shape is always canonical and the stale entry disappears on
    // the next write.
    const isHideToken = (t) => isKnownMark(t) && markKind(t) === MARK_KIND.HIDE;
    const hideRaw = readFlagList(mark.hide);
    const marksRaw = readFlagList(mark.marks);
    const hide = unique([...hideRaw, ...marksRaw.filter(isHideToken)]);
    const marks = marksRaw.filter((t) => !isHideToken(t));
    // A legacy value-string hiding under `value` (e.g. {value:"hide_in_..."}).
    if (!hide.length) {
      const tokens = tokensForLegacyValue(value);
      if (tokens.length) return { value: "", hide: tokens, marks: unique(marks) };
    }
    return { value, hide: unique(hide), marks: unique(marks) };
  }

  return { value: String(mark), hide: [], marks: [] };
};

/** The normalised mark of a record (or of a bare mark value). */
export const readMark = (recordOrMark) => normalizeMark(readMarkSource(recordOrMark));

/** A fresh empty mark. */
export const emptyMark = () => ({ value: "", hide: [], marks: [] });

/** Is the normalised mark effectively empty (no value, no hides, no flags)? */
export const markIsEmpty = (mark) => {
  const n = normalizeMark(mark);
  return !n.value && n.hide.length === 0 && n.marks.length === 0;
};

/**
 * Collapse a mark to the minimal stored shape — or null when empty.
 */
export const toStoredMark = (mark) => {
  const n = normalizeMark(mark);
  if (!n.value && !n.hide.length && !n.marks.length) return null;
  if (DEV) {
    warnUnknown("hide", n.hide);
    warnUnknown("flag", n.marks);
  }
  const out = {};
  if (n.value) out.value = n.value;
  if (n.hide.length) out.hide = unique(n.hide);
  if (n.marks.length) out.marks = unique(n.marks);
  return out;
};

/**
 * TRANSPORT form of a mark for the API — always carries `value`, `hide` AND
 * `marks`, even when the lists are empty.
 *
 * Why this exists: `toStoredMark` omits empty keys (the compact DB shape), but
 * the API's `cleanMarkForStore` reads a MISSING `hide` / `marks` key as
 * "keep the existing value". So a client that sent the compact shape when
 * CLEARING a flag (or un-hiding a row) would silently no-op — the write went
 * through but the flag stayed. Send this shape over the wire instead.
 */
export const toWireMark = (mark) => {
  const n = normalizeMark(mark);
  return { value: n.value || "", hide: [...n.hide], marks: [...n.marks] };
};

/**
 * Sanity report for a mark (used by tests/tools; safe to call anywhere).
 * @returns {{ ok:boolean, value:string, hide:string[], marks:string[],
 *             unknownHide:string[], unknownFlags:string[] }}
 */
export const validateMark = (mark) => {
  const n = normalizeMark(mark);
  const unknownHide = n.hide.filter((t) => !isKnownMark(t));
  const unknownFlags = n.marks.filter((t) => !isKnownMark(t));
  return {
    ok: unknownHide.length === 0 && unknownFlags.length === 0,
    value: n.value,
    hide: n.hide,
    marks: n.marks,
    unknownHide,
    unknownFlags,
  };
};

// ── Readers ──────────────────────────────────────────────────────────────────
/** The classic scalar mark value ("" when none). */
export const getMarkValue = (recordOrMark) => readMark(recordOrMark).value;

/** The page tokens this record is hidden on. */
export const getMarkHide = (recordOrMark) => readMark(recordOrMark).hide;

/** The named flags this record carries. */
export const getMarkFlags = (recordOrMark) => readMark(recordOrMark).marks;

/** Is the record hidden on the given page token? */
export const isMarkHidden = (recordOrMark, token) => getMarkHide(recordOrMark).includes(token);

/** Does the record carry the given named flag? */
export const isMarkFlagged = (recordOrMark, flag) => getMarkFlags(recordOrMark).includes(flag);

/**
 * Generic reader — hides AND flags behind one call (preferred in new code).
 * Unknown tokens return false (and warn in dev).
 */
export const isMarkApplied = (recordOrMark, token) => {
  if (!isKnownMark(token)) {
    if (DEV) warnUnknown("", [token]);
    return false;
  }
  return markKind(token) === MARK_KIND.HIDE
    ? isMarkHidden(recordOrMark, token)
    : isMarkFlagged(recordOrMark, token);
};

/** Everything a record carries, already decomposed (handy for UI/debug). */
export const marksSummary = (recordOrMark) => {
  const n = readMark(recordOrMark);
  return { value: n.value, hides: n.hide, flags: n.marks, isEmpty: markIsEmpty(n) };
};

// ── Writers ──────────────────────────────────────────────────────────────────
/** Return a mark with a new scalar `value` (keeps hides + flags). */
export const withMarkValue = (mark, value) => {
  const n = normalizeMark(mark);
  return toStoredMark({ value: value || "", hide: n.hide, marks: n.marks });
};

/** Return a mark with `token` hidden / shown (keeps value + flags). */
export const withMarkHide = (mark, token, hidden) => {
  const n = normalizeMark(mark);
  const set = new Set(n.hide);
  if (hidden) set.add(token);
  else set.delete(token);
  return toStoredMark({ value: n.value, hide: [...set], marks: n.marks });
};

/** Return a mark with `flag` set / cleared (keeps value + other flags). */
export const withMarkFlag = (mark, flag, on) => {
  const n = normalizeMark(mark);
  const set = new Set(n.marks);
  if (on) set.add(flag);
  else set.delete(flag);
  return toStoredMark({ value: n.value, hide: n.hide, marks: [...set] });
};

/**
 * Generic writer — flips ANY known mark (hide or flag) behind one call.
 * Unknown tokens are ignored (dev warning). Returns the stored mark (or null).
 */
export const applyMark = (mark, token, on = true) => {
  if (!isKnownMark(token)) {
    if (DEV) warnUnknown("", [token]);
    return toStoredMark(mark);
  }
  return markKind(token) === MARK_KIND.HIDE
    ? withMarkHide(mark, token, on)
    : withMarkFlag(mark, token, on);
};

/**
 * API-side sanitiser. `submitted` may be a scalar string (from a form) or a
 * full JSON mark (from an order / mark page). When it is a scalar, the record's
 * existing `hide` list + flags are PRESERVED so a form edit never wipes them.
 * Returns the JSON mark to store, or null.
 */
export const cleanMarkForStore = (submitted, existingMark = null) => {
  if (submitted === undefined) return undefined;

  if (typeof submitted === "string") {
    const tokens = tokensForLegacyValue(submitted);
    if (tokens.length) {
      // A legacy hide-string was submitted directly — fold it into hide.
      return toStoredMark({
        value: getMarkValue(existingMark),
        hide: [...new Set([...getMarkHide(existingMark), ...tokens])],
        marks: getMarkFlags(existingMark),
      });
    }
    return toStoredMark({
      value: submitted,
      hide: getMarkHide(existingMark),
      marks: getMarkFlags(existingMark),
    });
  }

  if (submitted === null) {
    return toStoredMark({
      value: "",
      hide: getMarkHide(existingMark),
      marks: getMarkFlags(existingMark),
    });
  }

  if (typeof submitted === "object") {
    // Full JSON mark → trust it (missing keys = keep the existing values).
    const n = normalizeMark(submitted);
    const hide = "hide" in submitted ? n.hide : getMarkHide(existingMark);
    const marks = "marks" in submitted ? n.marks : getMarkFlags(existingMark);
    return toStoredMark({ value: n.value, hide, marks });
  }

  return null;
};

// ── List helpers (one code path for hides AND flags) ─────────────────────────
/**
 * Keep only the records carrying (or not carrying) a mark.
 * Works for both kinds — `on:true` = "has the mark", `on:false` = "doesn't".
 *
 *   filterByMark(artworks, "artist_page", { on: false })   // not hidden there
 *   filterByMark(images,   "artist_hover_image")           // only flagged ones
 */
export const filterByMark = (list, token, { on = true } = {}) =>
  (Array.isArray(list) ? list : []).filter((item) => isMarkApplied(item, token) === on);

/** Keeps only records NOT hidden on the given page token. */
export const filterByHideToken = (list, token) => filterByMark(list, token, { on: false });

/** Is this record hidden for the given `order` page key? */
export const isArtworkHiddenForPage = (record, pageKey) => {
  const token = hideTokenForOrderKey(pageKey);
  return token ? isMarkHidden(record, token) : false;
};

/** Keeps only records NOT hidden for the given `order` page key. */
export const filterArtworksHiddenForPage = (list, pageKey) =>
  (Array.isArray(list) ? list : []).filter((item) => !isArtworkHiddenForPage(item, pageKey));

// ── Named shorthand (readability at call sites) ──────────────────────────────
export const isArtistHoverImage = (record) =>
  isMarkFlagged(record, MARK_FLAG_ARTIST_HOVER_IMAGE);

export const isHiddenInArtistPage = (record) => isMarkHidden(record, HIDE_ARTIST_PAGE);
export const isHiddenInExhibitionPage = (record) => isMarkHidden(record, HIDE_EXHIBITION_PAGE);
export const isHiddenInArtFairPage = (record) => isMarkHidden(record, HIDE_ART_FAIR_PAGE);
export const isHiddenInArtistRollingImage = (record) =>
  isMarkHidden(record, HIDE_ARTIST_ROLLING_IMAGE);

// ── Back-compat shorthands ───────────────────────────────────────────────────
export const hasHideArtistRollingMark = (value) => isHiddenInArtistRollingImage(value);
export const hasMarkValue = (record, value) =>
  getMarkValue(record).toLowerCase() === String(value ?? "").toLowerCase();
export const markValueIn = (record, values) =>
  (Array.isArray(values) ? values : [values]).some((v) => hasMarkValue(record, v));

/**
 * Registry slice for building UI (alias of `marksFor`, kept for symmetry).
 *   listMarks({ kind: "flag", entity: "image" })
 */
export const listMarks = (opts) => marksFor(opts);

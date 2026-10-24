// lib/typography.js
// ════════════════════════════════════════════════════════════════════════
//  FONT FAMILY — the single source of truth for the site's typefaces.
//
//  There is ONE concept here: a FONT FAMILY. Everything is two plain maps:
//
//    FONT_FAMILIES  →  every face the site owns   (key → family)
//    TYPE_SCALE     →  every layout role          (role → family key)
//
//  A role just points at a family key, per language. That's the whole model.
//  No weights, no variants, no sizes, no fallback chains to juggle.
//
//  A family that is unknown or not yet shipped (see `missing`) resolves to
//  the language DEFAULT — the browser never gets a dead font name, and you
//  never have to reference a font file or URL here. File URLs live only in
//  globals.css @font-face blocks (the `name` below must match them exactly).
//
//  Read through  useFont(role)        → hooks/useFont.js  (React, language-aware)
//          or    resolveFontFamily()  → this file         (pure, no React)
//
//  TO CHANGE A FONT
//    • Add / rename a face   → one line in FONT_FAMILIES.
//    • Point a role at it    → one line in TYPE_SCALE.
//    • Role now renders a different language default → edit DEFAULT_FAMILY.
// ════════════════════════════════════════════════════════════════════════

// ── 1. FONT FAMILIES ────────────────────────────────────────────────────
// The complete palette. Every key is a family you can assign to a role.
//
//   name     the real @font-face family (must match globals.css exactly)
//   generic  CSS tail, defaults to 'sans-serif'
//   cjk      true → Chinese glyphs (absent from Latin-only display faces)
//            fall back to CJK_FALLBACK instead of a system font
//   missing  true → file not shipped yet; roles using it fall back to the
//            language DEFAULT automatically (no dead name emitted)
export const FONT_FAMILIES = {
  // — Language-default faces —
  pingFangThin:     { name: 'PingFang-Thin' },
  pingFangLight:    { name: 'PingFang-Light' },
  pingFangRegular:  { name: 'PingFang-Regular' },
  avenirUltraLight: { name: 'AvenirNext-UltraLight', missing: true }, // no .ttf yet
  avenirRegular:    { name: 'AvenirNext-Regular' },
  avenirMedium:     { name: 'AvenirNext-Medium' },

  // — Display faces (Latin-only → append the CJK fallback) —
  palatino:   { name: 'Palatino',             cjk: true, generic: 'serif' },
  bigCaslon:  { name: 'BigCaslon-Medium',     cjk: true, generic: 'serif' },
  jost:       { name: 'Jost-Medium',          cjk: true, generic: 'sans-serif' },
  iowanRoman: { name: 'IowanOldStyle-Roman',  cjk: true, generic: 'serif' },
};

// The face a language uses when nothing else applies (and for any missing
// family). Changing this changes the site-wide default in that language.
export const DEFAULT_FAMILY = {
  zh: 'pingFangRegular',
  en: 'avenirRegular',
};

// CJK glyph fallback appended to Latin-only display faces.
export const CJK_FALLBACK = 'PingFang-Regular';

// Generic CSS family tailing every stack that doesn't override it.
export const GENERIC_FALLBACK = 'sans-serif';

// ── 2. ROLES ────────────────────────────────────────────────────────────
// One line per layout role → the family key it uses, per language.
// That's all a role is. Sizes / line-heights / tracking live with the
// component that renders the role — never here.
export const TYPE_SCALE = {
  // Index / section headings
  sectionTitle:            { zh: 'bigCaslon',       en: 'bigCaslon' },
  artistListItem:          { zh: 'palatino',        en: 'palatino' },
  artistName:              { zh: 'bigCaslon',       en: 'bigCaslon' },
  // Home archive / writing drawer display face (condensed-feeling sans).
  archiveDisplay:          { zh: 'pingFangRegular', en: 'avenirMedium' },

  // Navigation
  navLink:                 { zh: 'pingFangRegular', en: 'jost' },
  managerNavLink:          { zh: 'pingFangRegular', en: 'avenirRegular' },

  // Language switcher
  languageSwitcher:        { zh: 'pingFangRegular', en: 'avenirRegular' },

  // Exhibitions list page
  exhibitionCaption:       { zh: 'pingFangRegular', en: 'avenirRegular' },
  exhibitionSectionHeading:{ zh: 'pingFangRegular', en: 'avenirRegular' },
  yearDropdownLabel:       { zh: 'pingFangRegular', en: 'avenirRegular' },
  exhibitionCardLabel:     { zh: 'pingFangRegular', en: 'avenirRegular' },

  // Artworks page
  artworkSectionTitle:     { zh: 'pingFangRegular', en: 'avenirRegular' },
  artworkCardArtist:       { zh: 'pingFangRegular', en: 'avenirRegular' },
  artworkCardCaption:      { zh: 'pingFangLight',   en: 'avenirUltraLight' },
  artworkCardMeta:         { zh: 'pingFangLight',   en: 'avenirUltraLight' },
  artworkCardEnquire:      { zh: 'pingFangRegular', en: 'avenirRegular' },
  artworkCardFallback:     { zh: 'pingFangRegular', en: 'avenirRegular' },

  // Artist pages
  artistListMeta:          { zh: 'pingFangLight',   en: 'avenirRegular' },
  artistBio:               { zh: 'iowanRoman',      en: 'iowanRoman' },
  artistWorksHeading:      { zh: 'pingFangRegular', en: 'avenirRegular' },

  // About page
  aboutBody:               { zh: 'palatino',        en: 'palatino' },

  // Exhibition & Fair detail pages (shared)
  detailTitle:             { zh: 'pingFangRegular', en: 'avenirRegular' },
  detailSubtitle:          { zh: 'iowanRoman',      en: 'iowanRoman' },
  detailDate:              { zh: 'pingFangRegular', en: 'avenirRegular' },
  detailCaption:           { zh: 'iowanRoman',      en: 'iowanRoman' },
  detailBody:              { zh: 'iowanRoman',      en: 'iowanRoman' },
  detailSectionHeading:    { zh: 'pingFangRegular', en: 'avenirRegular' },
  detailLink:              { zh: 'iowanRoman',      en: 'iowanRoman' },
  detailMetaLabel:         { zh: 'pingFangRegular', en: 'avenirRegular' },
  detailMetaValue:         { zh: 'iowanRoman',      en: 'iowanRoman' },

  // Generic / shared
  bodyText:                { zh: 'pingFangRegular', en: 'avenirRegular' },
  body:                    { zh: 'pingFangRegular', en: 'avenirRegular' },
  input:                   { zh: 'pingFangRegular', en: 'avenirRegular' },
  button:                  { zh: 'pingFangRegular', en: 'avenirRegular' },
  label:                   { zh: 'pingFangRegular', en: 'avenirRegular' },
};

// ── 3. RESOLVER ─────────────────────────────────────────────────────────
// Pure functions — no React, no context. Safe to call anywhere.

const quote = (name) => `'${name}'`;

// Build the CSS stack for a family key, falling back to the language default
// (exactly once) when the key is unknown or its file isn't shipped.
function familyStack(key, lang, isFallback = false) {
  const family = FONT_FAMILIES[key];

  if (!family || family.missing) {
    // Unknown / not-yet-shipped → the language default. Guarded so a bad
    // DEFAULT_FAMILY can never recurse.
    if (isFallback) return GENERIC_FALLBACK;
    return familyStack(DEFAULT_FAMILY[lang] || DEFAULT_FAMILY.en, lang, true);
  }

  const { name, generic = GENERIC_FALLBACK, cjk } = family;
  return cjk
    ? `${quote(name)}, ${quote(CJK_FALLBACK)}, ${generic}`
    : `${quote(name)}, ${generic}`;
}

/**
 * resolveFontFamily(role, lang) → CSS font-family stack
 *
 * @param {string} role  a key in TYPE_SCALE (unknown → 'body')
 * @param {'zh'|'en'} lang
 * @returns {string} e.g. "'BigCaslon-Medium', 'PingFang-Regular', serif"
 *
 * Total function: never throws, never returns an empty string. An unknown
 * role degrades to `body`; a `body` role is always defined.
 */
export function resolveFontFamily(role, lang = 'en') {
  const l = lang === 'zh' ? 'zh' : 'en';
  const spec = TYPE_SCALE[role] || TYPE_SCALE.body;
  const key = spec[l] ?? spec.en ?? DEFAULT_FAMILY[l];
  return familyStack(key, l);
}

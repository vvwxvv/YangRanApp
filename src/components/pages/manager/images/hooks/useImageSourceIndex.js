"use client";

/**
 * useImageSourceIndex / buildImageSourceIndex
 * ─────────────────────────────────────────────────────────────────────────────
 * "Group by artist" for the image manager used to rely on the Artwork schema
 * alone: an image's `tag_en` / `tag_cn` was matched against `artwork.title`
 * (or `artwork.artist`). Everything else — the ~150 images whose tag is an
 * *exhibition* name, or a fair / biography tag — fell into "Ungrouped".
 *
 * This index resolves a tag against every place an artist can hide, following
 * the Prisma relations (there is no Artist model; artists live as strings on
 * `Artwork.artist`, `Exhibition.related_artist` /
 * `Exhibition.participating_artists`, `Fair.*`, `About.artist`,
 * `Event.related_artist`, `Bibliography.related_artist`):
 *
 *   1. tag === artwork.title       → artwork.artist            (kind: artwork)
 *   2. tag === artist name         → that artist               (kind: artwork)
 *   3. tag === exhibition.title    → the exhibition's artists  (kind: exhibition)
 *   4. tag === fair.title          → the fair's artists        (kind: fair)
 *   5. tag === event.title         → event.related_artist      (kind: event)
 *   6. tag === bibliography.title  → related_artist            (kind: bibliography)
 *   7. tag === about.artist        → that artist's biography   (kind: about)
 *   8. loose / quoted title match  → same as 3–6 ("“见山”：汪一舟个展" ← "见山")
 *
 * Artist names are pushed through `buildArtistNameIndex`, so the language-split
 * rows merge into one artist ("Wang Yizhou / 汪一舟"), plus a "flip the two ASCII
 * words" fallback ("Manwen Liu" → "Liu Manwen").
 *
 * An *exhibition* image belongs to every artist in that show, so `resolve`
 * returns a list of artists and the manager shows the image under each of them
 * ("Chen Hongzhi / 陈鸿志 · Exhibition: One, and Many …").
 */

import { useMemo } from "react";
import {
  buildArtistNameIndex,
  normalizeArtistName,
  isCjkName,
} from "./useArtistNameIndex";

/** What an image's tag points at. */
export const IMAGE_SOURCE = Object.freeze({
  ARTWORK: "artwork",
  EXHIBITION: "exhibition",
  FAIR: "fair",
  EVENT: "event",
  BIBLIOGRAPHY: "bibliography",
  SERIES: "series",
  ABOUT: "about",
});

/** Source groups are ordered inside each artist: works → shows → fairs → … */
export const SOURCE_ORDER = Object.freeze({
  artwork: 0,
  exhibition: 1,
  fair: 2,
  event: 3,
  bibliography: 4,
  series: 5,
  about: 6,
});

/** Group-key separator (unit separator — cannot appear in real titles). */
export const KEY_SEP = "\u001f";
/** Prefix for groups that have a source but no artist (rare, still useful). */
export const SOURCE_ONLY_PREFIX = "\u001e";
export const UNGROUPED_KEY = "__UNGROUPED__";

export const normalizeKey = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

/** Looser form for fuzzy title matching: drop quotes/punctuation. */
const loose = (value) =>
  normalizeKey(value)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/** A loose tag is only used for fuzzy matching when it is specific enough. */
const fuzzyOk = (tag) => (isCjkName(tag) ? tag.length >= 2 : tag.length >= 5);

const STOPWORD = /^(and|or|others?|etc\.?|等|其他|以及|及|和|与)$/i;

/**
 * Split a free-text artist field ("刘曼文、戴牟雨、周松",
 * "Liu Manwen, Zhou Song and others") into individual names.
 */
export function splitArtistList(value) {
  const raw = Array.isArray(value) ? value : [value];
  const out = [];
  for (const entry of raw) {
    const pieces = String(entry ?? "").split(/[,，、;；/|]+|\s+and\s+|\s*&\s*/gi);
    for (const piece of pieces) {
      const name = normalizeArtistName(piece);
      if (!name || STOPWORD.test(name)) continue;
      out.push(name);
    }
  }
  return out;
}

/** "Manwen Liu" → "Liu Manwen" (ASCII two-word names only). */
const flipName = (name) => {
  const parts = String(name || "").trim().split(/\s+/);
  if (parts.length !== 2) return "";
  if (parts.some((p) => isCjkName(p))) return "";
  return `${parts[1]} ${parts[0]}`;
};

const unique = (list) => [...new Set((list || []).filter(Boolean))];

/**
 * Build the lookup index.
 *
 * @param {object} data
 * @param {Array} data.artworks
 * @param {Array} data.exhibitions
 * @param {Array} data.fairs
 * @param {Array} data.events
 * @param {Array} data.bibliographies
 * @param {Array} data.abouts
 * @param {Array} data.images          (used to vote on EN↔CN artist pairs)
 * @param {number}[data.minVotes=2]
 */
export function buildImageSourceIndex({
  artworks = [],
  exhibitions = [],
  fairs = [],
  events = [],
  bibliographies = [],
  series = [],
  abouts = [],
  images = [],
  minVotes = 2,
} = {}) {
  const nameIndex = buildArtistNameIndex(artworks, images, { minVotes });

  // ── pass 1: the *primary* artist spellings ──────────────────────────────
  // Only the artwork / About rows define a canonical spelling (those are the
  // artist names the rest of the site links on). Free-text fields such as
  // Fair.participating_artists ("Manwen Liu") must NOT be allowed to define a
  // new primary — they are aliases resolved below.
  const primaryArtists = new Map(); // lowercased name → canonical spelling
  const registerPrimary = (name) => {
    const clean = normalizeArtistName(name);
    if (!clean) return "";
    const key = clean.toLowerCase();
    if (!primaryArtists.has(key)) primaryArtists.set(key, clean);
    return primaryArtists.get(key);
  };

  // ── maps ────────────────────────────────────────────────────────────────
  const titleToArtwork = new Map();
  const titleToExhibition = new Map();
  const titleToFair = new Map();
  const titleToEvent = new Map();
  const titleToBib = new Map();
  const titleToSeries = new Map();
  const aboutByArtist = new Map();

  const artworkByTitle = new Map();
  for (const artwork of Array.isArray(artworks) ? artworks : []) {
    const title = normalizeKey(artwork?.title);
    if (!title) continue;
    if (!artworkByTitle.has(title)) artworkByTitle.set(title, artwork);
    registerPrimary(artwork?.artist);
  }
  for (const [title, artwork] of artworkByTitle) {
    titleToArtwork.set(title, artwork);
  }

  const put = (map, record) => {
    const title = normalizeKey(record?.title);
    if (title && !map.has(title)) map.set(title, record);
  };
  for (const ex of Array.isArray(exhibitions) ? exhibitions : []) put(titleToExhibition, ex);
  for (const fair of Array.isArray(fairs) ? fairs : []) put(titleToFair, fair);
  for (const ev of Array.isArray(events) ? events : []) put(titleToEvent, ev);
  for (const bib of Array.isArray(bibliographies) ? bibliographies : []) put(titleToBib, bib);
  for (const ser of Array.isArray(series) ? series : []) put(titleToSeries, ser);

  for (const about of Array.isArray(abouts) ? abouts : []) {
    const artist = registerPrimary(about?.artist);
    if (artist && !aboutByArtist.has(artist.toLowerCase())) {
      aboutByArtist.set(artist.toLowerCase(), about);
    }
  }

  // ── pass 2: canonicalise ────────────────────────────────────────────────
  // EN/CN pairing → exact primary spelling → "flip the two ASCII words".
  // Results are cached, so every spelling seen anywhere collapses onto the
  // same artist (`aliasKeys` = "this string is an artist name").
  const aliasCache = new Map(); // lowercased alias → canonical name
  const aliasKeys = new Set();

  const canonicalArtist = (name) => {
    const clean = normalizeArtistName(name);
    if (!clean) return "";
    const lower = normalizeKey(clean);
    if (aliasCache.has(lower)) return aliasCache.get(lower);

    let canonical = clean;
    const paired = nameIndex.keyOf(clean);
    if (paired && normalizeKey(paired) !== lower) {
      canonical = paired;
    } else if (primaryArtists.has(lower)) {
      canonical = primaryArtists.get(lower);
    } else {
      const flipped = flipName(clean);
      if (flipped) {
        const flippedLower = normalizeKey(flipped);
        const pairedFlipped = nameIndex.keyOf(flipped);
        if (pairedFlipped && normalizeKey(pairedFlipped) !== flippedLower) {
          canonical = pairedFlipped;
        } else if (primaryArtists.has(flippedLower)) {
          canonical = primaryArtists.get(flippedLower);
        }
      }
    }

    aliasCache.set(lower, canonical);
    return canonical;
  };

  /** Remember a spelling as an artist name (and warm the canonical cache). */
  const learnArtist = (name) => {
    const canonical = canonicalArtist(name);
    if (canonical) aliasKeys.add(normalizeKey(normalizeArtistName(name)));
    return canonical;
  };
  for (const key of primaryArtists.keys()) aliasKeys.add(key);

  for (const record of [
    ...(exhibitions || []),
    ...(fairs || []),
    ...(events || []),
    ...(bibliographies || []),
    ...(series || []),
  ]) {
    for (const name of [
      ...(Array.isArray(record?.related_artist)
        ? record.related_artist
        : []),
      ...splitArtistList(record?.participating_artists),
      ...(Array.isArray(record?.related_artist) ? record.related_artist : []),
    ]) {
      learnArtist(name);
    }
  }

  /** Is this string a known artist name? */
  const isArtistName = (value) => aliasKeys.has(normalizeKey(value));

  /** Artists of the artworks referenced by an exhibition's related_artwork. */
  const artistsFromRelatedArtworks = (record) =>
    unique(
      (Array.isArray(record?.related_artwork) ? record.related_artwork : [])
        .map((entry) => {
          const title =
            entry && typeof entry === "object" ? entry.title : entry;
          const artwork = titleToArtwork.get(normalizeKey(title));
          return artwork ? normalizeArtistName(artwork.artist) : "";
        })
        .filter(Boolean)
    );

  /**
   * Artists for an exhibition / fair / event / bibliography record.
   * `related_artist` (the clean gallery rows) wins over the free-text
   * `participating_artists`; when neither exists we fall back to the artists of
   * the works pinned in the exhibition.
   */
  const artistsOfRecord = (record, kind) => {
    // Series carries a single `artist` string instead of a `related_artist` list.
    if (kind === IMAGE_SOURCE.SERIES) {
      return unique([record?.artist].map(canonicalArtist));
    }

    const rel = Array.isArray(record?.related_artist)
      ? record.related_artist.filter(Boolean)
      : [];
    const inline = Array.isArray(record?.related_artist)
      ? record.related_artist.filter(Boolean)
      : [];

    let names = rel.length ? rel : inline;
    if (!names.length) names = splitArtistList(record?.participating_artists);
    if (!names.length && kind === IMAGE_SOURCE.EXHIBITION) {
      names = artistsFromRelatedArtworks(record);
    }
    return unique(names.map(canonicalArtist));
  };

  // Fuzzy candidates — titles that may carry quotes / decoration, e.g. the tag
  // 见山 vs the exhibition "“见山”：汪一舟个展". Works are matched exactly above.
  const fuzzyCandidates = [];
  const addFuzzy = (map, kind) => {
    for (const [title, record] of map) {
      fuzzyCandidates.push({ kind, record, title, loose: loose(title) });
    }
  };
  // Only shows and fairs: image tags name exhibitions/fairs, so a loose hit on
  // an event / bibliography title is almost always a coincidence.
  addFuzzy(titleToExhibition, IMAGE_SOURCE.EXHIBITION);
  addFuzzy(titleToFair, IMAGE_SOURCE.FAIR);

  const buildExact = (kind, record, title) => ({
    kind,
    title: record?.title || title,
    artists: artistsOfRecord(record, kind),
  });

  /**
   * Resolve one image to the thing its tag points at.
   * @returns {{kind:string,title:string,artists:string[]}|null}
   */
  const resolveImageSource = (image) => {
    const tags = unique(
      [normalizeKey(image?.tag_en), normalizeKey(image?.tag_cn)].filter(Boolean)
    );
    if (!tags.length) return null;

    // 1) tag === artwork title (falls back to the artwork's exhibition when the
    //    artwork row itself has no artist on it)
    for (const tag of tags) {
      const artwork = titleToArtwork.get(tag);
      if (artwork) {
        const artist = normalizeArtistName(artwork.artist);
        if (artist) {
          return {
            kind: IMAGE_SOURCE.ARTWORK,
            title: artwork.title || "",
            artists: [canonicalArtist(artist)],
          };
        }
        const viaShows = unique(
          (Array.isArray(artwork.related_exhibition)
            ? artwork.related_exhibition
            : []
          )
            .map((t) => titleToExhibition.get(normalizeKey(t)))
            .filter(Boolean)
            .flatMap((ex) => artistsOfRecord(ex, IMAGE_SOURCE.EXHIBITION))
        );
        if (viaShows.length) {
          return {
            kind: IMAGE_SOURCE.ARTWORK,
            title: artwork.title || "",
            artists: viaShows,
          };
        }
      }
    }

    // 2) tag === artist name
    for (const tag of tags) {
      if (isArtistName(tag)) {
        return {
          kind: IMAGE_SOURCE.ARTWORK,
          title: "",
          artists: [canonicalArtist(tag)],
        };
      }
    }

    // 3–7) exact show / fair / event / bibliography / biography
    for (const tag of tags) {
      const ex = titleToExhibition.get(tag);
      if (ex) return buildExact(IMAGE_SOURCE.EXHIBITION, ex, tag);
      const fair = titleToFair.get(tag);
      if (fair) return buildExact(IMAGE_SOURCE.FAIR, fair, tag);
      const ev = titleToEvent.get(tag);
      if (ev) return buildExact(IMAGE_SOURCE.EVENT, ev, tag);
      const bib = titleToBib.get(tag);
      if (bib) return buildExact(IMAGE_SOURCE.BIBLIOGRAPHY, bib, tag);
      const ser = titleToSeries.get(tag);
      if (ser) return buildExact(IMAGE_SOURCE.SERIES, ser, tag);
      const about = aboutByArtist.get(tag);
      if (about) return buildExact(IMAGE_SOURCE.ABOUT, about, tag);
    }

    // 8) loose / quoted match — catches tags like 见山 for "“见山”：汪一舟个展"
    const looseTags = tags.map(loose).filter((t) => t && fuzzyOk(t));
    let best = null;
    for (const tag of looseTags) {
      for (const candidate of fuzzyCandidates) {
        if (!candidate.loose || !candidate.loose.includes(tag)) continue;
        if (!best || tag.length > best.score) {
          best = { ...candidate, score: tag.length };
        }
      }
    }
    if (best) {
      return buildExact(best.kind, best.record, best.title);
    }

    return null;
  };

  return {
    resolveImageSource,
    canonicalArtist,
    isArtistName,
    artistsOfRecord,
    nameIndex,
    /** "Wang Yizhou / 汪一舟" (or the plain name when it has no twin). */
    labelFor: (name, options) => nameIndex.labelFor(name, options),
    counts: {
      artworks: artworkByTitle.size,
      exhibitions: titleToExhibition.size,
      fairs: titleToFair.size,
      events: titleToEvent.size,
      bibliographies: titleToBib.size,
      series: titleToSeries.size,
      abouts: aboutByArtist.size,
    },
  };
}

/** Human label for one source sub-group. */
export function sourceLabel(kind, title, isCn) {
  const t = String(title || "").trim();
  switch (kind) {
    case IMAGE_SOURCE.EXHIBITION:
      return t ? (isCn ? `展览：${t}` : `Exhibition: ${t}`) : isCn ? "展览" : "Exhibition";
    case IMAGE_SOURCE.FAIR:
      return t ? (isCn ? `艺博会：${t}` : `Art Fair: ${t}`) : isCn ? "艺博会" : "Art Fair";
    case IMAGE_SOURCE.EVENT:
      return t ? (isCn ? `活动：${t}` : `Event: ${t}`) : isCn ? "活动" : "Event";
    case IMAGE_SOURCE.BIBLIOGRAPHY:
      return t ? (isCn ? `文献：${t}` : `Bibliography: ${t}`) : isCn ? "文献" : "Bibliography";
    case IMAGE_SOURCE.SERIES:
      return t ? (isCn ? `系列：${t}` : `Series: ${t}`) : isCn ? "系列" : "Series";
    case IMAGE_SOURCE.ABOUT:
      return isCn ? "艺术家简介" : "Biography";
    case IMAGE_SOURCE.ARTWORK:
    default:
      return isCn ? "作品" : "Works";
  }
}

/** Encode one group membership: artist + source. */
export const makeGroupKey = (artist, source) =>
  [
    artist || "",
    source?.kind || IMAGE_SOURCE.ARTWORK,
    // The works bucket is one group per artist — the artwork title is not part
    // of the key (only shows/fairs/… split into their own sub-groups).
    source?.kind === IMAGE_SOURCE.ARTWORK ? "" : source?.title || "",
  ].join(KEY_SEP);

/** Decode a group key back into its parts. */
export const parseGroupKey = (key) => {
  if (!key || key === UNGROUPED_KEY) {
    return { ungrouped: true, sourceOnly: false, artist: "", kind: "", title: "" };
  }
  const sourceOnly = String(key).startsWith(SOURCE_ONLY_PREFIX);
  const body = sourceOnly ? String(key).slice(1) : String(key);
  const [artist = "", kind = "", title = ""] = body.split(KEY_SEP);
  return { ungrouped: false, sourceOnly, artist, kind, title };
};

/**
 * The group keys an image belongs to (one per artist of its source).
 * Returns `["__UNGROUPED__"]` when nothing could be resolved.
 */
export function imageGroupKeys(image, index) {
  const source = index?.resolveImageSource(image);
  if (!source) return [UNGROUPED_KEY];
  if (!source.artists?.length) {
    // Source found, artist unknown — keep it in its own labelled bucket rather
    // than burying it in "Ungrouped".
    return [SOURCE_ONLY_PREFIX + makeGroupKey("", source)];
  }
  return source.artists.map((artist) => makeGroupKey(artist, source));
}

/** Group header label from a group key. */
export function groupLabelFromKey(key, { isCn = false, labelFor } = {}) {
  const parts = parseGroupKey(key);
  if (parts.ungrouped) return isCn ? "未分组" : "Ungrouped";
  const sub = sourceLabel(parts.kind, parts.title, isCn);
  if (parts.sourceOnly || !parts.artist) return sub;
  const artistLabel = labelFor ? labelFor(parts.artist, { lang: isCn ? "cn" : "en" }) : parts.artist;
  return sub ? `${artistLabel} · ${sub}` : artistLabel;
}

/**
 * Just the source part ("Works", "Exhibition: …") — used when the artist name
 * already lives on the parent box of a nested (artist → source) accordion.
 */
export function groupSourceLabel(key, { isCn = false } = {}) {
  const parts = parseGroupKey(key);
  if (parts.ungrouped) return isCn ? "未分组" : "Ungrouped";
  return sourceLabel(parts.kind, parts.title, isCn);
}

/** Parent-box id for a group key (artist id) — `null` for ungrouped. */
export const ARTIST_PARENT_PREFIX = "artist\u001f";

export const groupParentId = (key) => {
  const parts = parseGroupKey(key);
  if (parts.ungrouped || parts.sourceOnly || !parts.artist) return null;
  return ARTIST_PARENT_PREFIX + parts.artist;
};

export const parentArtist = (parentId) =>
  String(parentId || "").startsWith(ARTIST_PARENT_PREFIX)
    ? String(parentId).slice(ARTIST_PARENT_PREFIX.length)
    : "";

/**
 * Group ordering: artist A→Z (with the ungrouped bucket last); inside an artist
 * the buckets follow works → exhibitions → fairs → events → bibliography →
 * biography, then by title.
 */
export const compareGroupKeys = (a, b) => {
  const A = parseGroupKey(a);
  const B = parseGroupKey(b);

  if (A.ungrouped || B.ungrouped) {
    if (A.ungrouped && B.ungrouped) return 0;
    return A.ungrouped ? 1 : -1;
  }

  if (A.sourceOnly !== B.sourceOnly) return A.sourceOnly ? 1 : -1;

  if (A.artist !== B.artist) {
    return String(A.artist).localeCompare(String(B.artist), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  const ka = SOURCE_ORDER[A.kind] ?? 9;
  const kb = SOURCE_ORDER[B.kind] ?? 9;
  if (ka !== kb) return ka - kb;

  return String(A.title).localeCompare(String(B.title), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

/** React wrapper — memoised on the collections. */
export default function useImageSourceIndex(data, options = {}) {
  const {
    artworks = [],
    exhibitions = [],
    fairs = [],
    events = [],
    bibliographies = [],
    series = [],
    abouts = [],
    images = [],
  } = data || {};

  return useMemo(
    () =>
      buildImageSourceIndex({
        artworks,
        exhibitions,
        fairs,
        events,
        bibliographies,
        series,
        abouts,
        images,
        ...options,
      }),
    [
      artworks,
      exhibitions,
      fairs,
      events,
      bibliographies,
      series,
      abouts,
      images,
      options?.minVotes,
    ]
  );
}

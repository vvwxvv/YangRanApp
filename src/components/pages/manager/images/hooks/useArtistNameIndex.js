"use client";

/**
 * useArtistNameIndex / buildArtistNameIndex
 * ─────────────────────────────────────────────────────────────────────────────
 * Artworks are **split by language**: one row holds the Chinese artist + title
 * (`language: "CN"`), another holds the English pair (`language: "EN"`). Images
 * are the opposite — a single row carries both `tag_en` and `tag_cn`.
 *
 * That mismatch makes artist grouping split each artist in two (e.g. "Wang
 * Yizhou" and "汪一舟" become separate groups). This helper re-links the two
 * language rows into one artist so groups (and labels) can show both names
 * together: `"Wang Yizhou / 汪一舟"`.
 *
 * How the pairing is derived (there is no shared id or Artist model):
 *   image.tag_en  → artwork.title (EN row) → artist
 *   image.tag_cn  → artwork.title (CN row) → artist
 * When those two resolve to *different* artists, the image itself proves the
 * two names are the same person. Votes are counted across all images and the
 * strongest 1-to-1 pairs (≥ `minVotes`) are accepted.
 *
 * API:
 *   const index = buildArtistNameIndex(artworks, images)
 *   index.keyOf("汪一舟")        // "Wang Yizhou"      canonical group key
 *   index.labelFor("Wang Yizhou") // "Wang Yizhou / 汪一舟"
 *   index.keyOf("Nobody")        // "Nobody"           unknown names pass through
 */

import { useMemo } from "react";

const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

/** Trim + collapse inner whitespace ("Mary  Cai" → "Mary Cai"). */
export const normalizeArtistName = (value) =>
  String(value ?? "").replace(/\s+/g, " ").trim();

/** Does the name contain CJK characters? */
export const isCjkName = (value) => CJK_RE.test(String(value ?? ""));

/**
 * @param {Array} artworks
 * @param {Array} images
 * @param {object} [options]
 * @param {number} [options.minVotes=2] how many images must agree on a pair
 * @param {boolean}[options.includeSingle=true] keep unpaired names as-is
 */
export function buildArtistNameIndex(artworks = [], images = [], options = {}) {
  const { minVotes = 2, includeSingle = true } = options;

  // ── 1. artwork title → artist (both language rows) ─────────────────────────
  const titleToArtist = new Map();
  for (const artwork of Array.isArray(artworks) ? artworks : []) {
    const artist = normalizeArtistName(artwork?.artist);
    const title = normalizeArtistName(artwork?.title).toLowerCase();
    if (artist && title && !titleToArtist.has(title)) {
      titleToArtist.set(title, artist);
    }
  }

  // ── 2. vote on EN↔CN artist pairs using the images ─────────────────────────
  const votes = new Map(); // "a\u0000b" -> count
  for (const image of Array.isArray(images) ? images : []) {
    const fromEn = titleToArtist.get(
      normalizeArtistName(image?.tag_en).toLowerCase()
    );
    const fromCn = titleToArtist.get(
      normalizeArtistName(image?.tag_cn).toLowerCase()
    );
    if (!fromEn || !fromCn || fromEn === fromCn) continue;

    const voteKey = [fromEn, fromCn].sort().join("\u0000");
    votes.set(voteKey, (votes.get(voteKey) || 0) + 1);
  }

  // ── 3. accept the strongest 1-to-1 pairs (greedy) ─────────────────────────
  const candidates = [...votes.entries()]
    .filter(([, count]) => count >= minVotes)
    .map(([key, count]) => {
      const [a, b] = key.split("\u0000");
      return { a, b, count };
    })
    .sort((x, y) => y.count - x.count);

  const paired = new Set();
  const pairs = [];
  for (const candidate of candidates) {
    const { a, b, count } = candidate;
    if (paired.has(a) || paired.has(b)) continue;

    const aIsCjk = isCjkName(a);
    const bIsCjk = isCjkName(b);
    // Canonical key = the English (non-CJK) name when there is one.
    const en = aIsCjk && !bIsCjk ? b : a;
    const cn = aIsCjk && !bIsCjk ? a : b;

    paired.add(a);
    paired.add(b);
    pairs.push({ en, cn, count, names: [a, b] });
  }

  // ── 4. lookups ────────────────────────────────────────────────────────────
  const keyAlias = new Map(); // lowercased name -> canonical key
  const labelByKey = new Map(); // canonical key -> "EN / CN"

  for (const { en, cn, names } of pairs) {
    const label = en === cn ? en : `${en} / ${cn}`;
    labelByKey.set(en, label);
    if (includeSingle) {
      keyAlias.set(en.toLowerCase(), en);
      keyAlias.set(cn.toLowerCase(), en);
      for (const name of names) keyAlias.set(name.toLowerCase(), en);
    }
  }

  const keyOf = (name) => {
    const clean = normalizeArtistName(name);
    if (!clean) return "";
    return keyAlias.get(clean.toLowerCase()) || clean;
  };

  const labelFor = (nameOrKey, options = {}) => {
    const clean = normalizeArtistName(nameOrKey);
    if (!clean) return "";
    const key = keyAlias.get(clean.toLowerCase()) || clean;
    const label = labelByKey.get(key) || key;

    // `lang: "cn"` flips "EN / CN" → "CN / EN" for the Chinese UI.
    if (options.lang === "cn") {
      const parts = label.split(" / ");
      if (parts.length === 2) return `${parts[1]} / ${parts[0]}`;
    }

    return label;
  };

  return {
    /** canonical group key for any variant of an artist name */
    keyOf,
    /** "EN / CN" label (falls back to the given name); `{lang:"cn"}` → "CN / EN" */
    labelFor,
    /** accepted pairs: [{ en, cn, count, names }] */
    pairs,
    /** whether a name was linked to its other-language twin */
    isLinked: (name) => keyAlias.has(normalizeArtistName(name).toLowerCase()),
  };
}

/** React wrapper — memoised on the artwork/image lists. */
export default function useArtistNameIndex(artworks, images, options = {}) {
  const { minVotes = 2, includeSingle = true } = options;
  return useMemo(
    () => buildArtistNameIndex(artworks, images, { minVotes, includeSingle }),
    [artworks, images, minVotes, includeSingle]
  );
}

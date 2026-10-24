"use client";

/**
 * useImageArtistGroups
 * ─────────────────────────────────────────────────────────────────────────────
 * Groups images by the artist they belong to, for the rolling-image ordering
 * UI.
 *
 * An image has no direct artist reference — it carries `tag_en` / `tag_cn`,
 * which (for `type: "artwork"` rows) is the artwork's title. So we resolve the
 * artist by matching the image tag against the artworks:
 *
 *   1. tag_en / tag_cn  ===  artwork.title   → that artwork's `artist`
 *   2. tag_en / tag_cn  ===  artwork.artist  (tag is the artist's own name)
 *   3. otherwise                            → "Ungrouped" (unmatched)
 *
 * Images are then grouped by artist name (groups sorted A→Z, ungrouped last)
 * and ordered inside each group by the given order key (default
 * `rolling_img_order`), falling back to tag_en.
 *
 * Returns: [{ artist, label, matched, items: [...] }, …]
 */

import { useMemo } from "react";
import { getOrder } from "@/utils/mediaOrder";
import { buildArtistNameIndex, isCjkName } from "./useArtistNameIndex";

const norm = (value) => String(value ?? "").trim().toLowerCase();

/**
 * Build lookup maps from the artwork list.
 * @param {Array} artworks
 * @returns {{ titleToArtist: Map<string,string>, artistByNorm: Map<string,string> }}
 */
export function buildArtistMatchers(artworks = []) {
  const titleToArtist = new Map();
  const artistByNorm = new Map();

  for (const artwork of Array.isArray(artworks) ? artworks : []) {
    const artist = String(artwork?.artist ?? "").trim();
    if (!artist) continue;

    const artistKey = norm(artist);
    if (!artistByNorm.has(artistKey)) artistByNorm.set(artistKey, artist);

    const titleKey = norm(artwork?.title);
    if (titleKey && !titleToArtist.has(titleKey)) {
      titleToArtist.set(titleKey, artist);
    }
  }

  return { titleToArtist, artistByNorm };
}

/**
 * Resolve the artist name for one image.
 * @returns {string} artist name, or "" when it can't be matched
 */
export function matchImageArtist(image, matchers) {
  if (!image || !matchers) return "";

  const { titleToArtist, artistByNorm } = matchers;
  const tags = [image.tag_en, image.tag_cn].map(norm).filter(Boolean);

  // 1) tag === artwork title
  for (const tag of tags) {
    const artist = titleToArtist.get(tag);
    if (artist) return artist;
  }

  // 2) tag === artist name
  for (const tag of tags) {
    const artist = artistByNorm.get(tag);
    if (artist) return artist;
  }

  return "";
}

const orderFor = (item, orderKey) => {
  const value = Number(getOrder(item, orderKey));
  return Number.isFinite(value) && value > 0 ? value : Infinity;
};

/**
 * @param {Array}  images
 * @param {Array}  artworks
 * @param {object} [options]
 * @param {string} [options.orderKey="rolling_img_order"] order sub-key
 * @param {string} [options.ungroupedLabel="Ungrouped"]
 * @param {boolean}[options.includeUnmatched=true]
 * @param {object} [options.nameIndex] prebuilt buildArtistNameIndex() result
 * @returns {Array<{ artist:string, key:string, label:string, artistEn:string,
 *                  artistCn:string, matched:boolean, items:Array }>}
 */
export default function useImageArtistGroups(images, artworks, options = {}) {
  const {
    orderKey = "rolling_img_order",
    ungroupedLabel = "Ungrouped",
    includeUnmatched = true,
    nameIndex,
  } = options;

  return useMemo(() => {
    const matchers = buildArtistMatchers(artworks);
    // Merge the language-split artwork rows so an artist shows both names
    // ("Wang Yizhou / 汪一舟") instead of two half-empty groups.
    const index = nameIndex || buildArtistNameIndex(artworks, images);

    const buckets = new Map(); // canonical key -> { artist, items }
    for (const image of Array.isArray(images) ? images : []) {
      const artist = matchImageArtist(image, matchers);
      if (!artist && !includeUnmatched) continue;

      const key = artist ? index.keyOf(artist) : "__ungrouped__";
      if (!buckets.has(key)) buckets.set(key, { artist, items: [] });
      buckets.get(key).items.push(image);
    }

    const splitNames = (label) => {
      const parts = String(label || "").split(" / ");
      if (parts.length < 2) {
        return isCjkName(parts[0]) ? ["", parts[0]] : [parts[0] || "", ""];
      }
      return [parts[0], parts[1]];
    };

    const groups = [...buckets.values()].map(({ artist, items }) => {
      const label = artist ? index.labelFor(artist) : ungroupedLabel;
      const [artistEn, artistCn] = artist ? splitNames(label) : ["", ""];

      return {
        artist: artist || "",
        key: artist ? index.keyOf(artist) : "__ungrouped__",
        label,
        artistEn,
        artistCn,
        matched: Boolean(artist),
        items: [...items].sort((a, b) => {
          const av = orderFor(a, orderKey);
          const bv = orderFor(b, orderKey);
          if (av !== bv) return av - bv;
          return String(a?.tag_en || "").localeCompare(String(b?.tag_en || ""));
        }),
      };
    });

    // Matched groups first (by canonical key, A→Z); ungrouped bucket last.
    groups.sort((a, b) => {
      if (a.matched !== b.matched) return a.matched ? -1 : 1;
      return String(a.key).localeCompare(String(b.key), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

    return groups;
  }, [images, artworks, orderKey, ungroupedLabel, includeUnmatched, nameIndex]);
}

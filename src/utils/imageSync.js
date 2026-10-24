/**
 * imageSync.js — keep the `Image` collection in step with the images that live
 * on the other collections.
 *
 * Covers have a way of being uploaded on an Artwork / Exhibition / Fair / Event
 * / Writing / Bibliography row (or as an About portrait) without ever being
 * added as an Image row. This module finds those cover URLs and prepares the
 * missing Image records, filling `tag_en` / `tag_cn` from the *language-split*
 * sibling record (the EN row and the CN row of the same item share one cover
 * URL — that is how the two titles are matched).
 *
 * Pure helpers only — no React, no fetch — so they can be unit-tested and
 * reused by the API route as well.
 */

/** Collections that carry an image URL, and how to describe the resulting row. */
export const IMAGE_SOURCE_ENTITIES = Object.freeze([
  {
    key: "artwork",
    collection: "artwork",
    urlField: "cover_img_url",
    titleField: "title",
    type: "artwork",
  },
  {
    key: "exhibition",
    collection: "exhibition",
    urlField: "cover_img_url",
    titleField: "title",
    type: "exhibition",
  },
  {
    key: "fair",
    collection: "fair",
    urlField: "cover_img_url",
    titleField: "title",
    type: "fair",
  },
  {
    key: "event",
    collection: "event",
    urlField: "cover_img_url",
    titleField: "title",
    type: "event",
  },
  {
    key: "writing",
    collection: "writing",
    urlField: "cover_img_url",
    titleField: "title",
    type: "writing",
  },
  {
    key: "bibliography",
    collection: "bibliography",
    urlField: "cover_img_url",
    titleField: "title",
    type: "bibliography",
  },
  {
    key: "series",
    collection: "series",
    urlField: "cover_img_url",
    titleField: "title",
    type: "series",
  },
  {
    key: "about",
    collection: "about",
    urlField: "portrait_image_url",
    titleField: "artist",
    type: "photo",
  },
]);

/** Trim + lowercase — the comparison key for "is this the same image?". */
export const normalizeImageUrl = (url) =>
  String(url ?? "")
    .trim()
    .toLowerCase();

/** True when a recorded value looks like a usable image URL. */
export const isUsableImageUrl = (url) => {
  const v = String(url ?? "").trim();
  if (!v) return false;
  // Ignore placeholders / non-http values some rows carry.
  if (v === "null" || v === "undefined") return false;
  // A host is required — `https:///imgs/x.jpg` (broken rows) is not a valid URL.
  if (/^https?:\/\/[^/\s]+/i.test(v)) return true;
  return v.startsWith("/") && !v.startsWith("//") && v.length > 1;
};

/** Normalise a `language` value to "EN" | "CN" (defaults to ""). */
const langOf = (record) => {
  const v = String(record?.language ?? "").trim().toUpperCase();
  if (v.startsWith("CN") || v.startsWith("ZH")) return "CN";
  if (v.startsWith("EN")) return "EN";
  return "";
};

/**
 * Build the "already exists" index from the current Image rows.
 * @returns {Set<string>} normalised img_urls
 */
export function buildImageUrlIndex(images = []) {
  const set = new Set();
  for (const image of Array.isArray(images) ? images : []) {
    const key = normalizeImageUrl(image?.img_url);
    if (key) set.add(key);
  }
  return set;
}

/**
 * Collect every cover URL used by the other collections, grouped by URL so the
 * EN/CN titles of the same item can be merged into tag_en / tag_cn.
 *
 * @param {object} data — { artwork: [...], exhibition: [...], … } keyed by entity
 * @returns {Map<string, {img_url:string, tag_en:string, tag_cn:string,
 *                        type:string, sources:string[]}>}
 */
export function collectImageCandidates(data = {}) {
  const byUrl = new Map();

  for (const entity of IMAGE_SOURCE_ENTITIES) {
    const records = data[entity.key] ?? data[entity.collection] ?? [];
    for (const record of Array.isArray(records) ? records : []) {
      const url = record?.[entity.urlField];
      if (!isUsableImageUrl(url)) continue;

      const key = normalizeImageUrl(url);
      const title = String(record?.[entity.titleField] ?? "").trim();
      const lang = langOf(record);

      if (!byUrl.has(key)) {
        byUrl.set(key, {
          img_url: String(url).trim(),
          tag_en: "",
          tag_cn: "",
          type: entity.type,
          sources: [],
        });
      }

      const entry = byUrl.get(key);
      if (!entry.sources.includes(entity.key)) entry.sources.push(entity.key);
      if (!title) continue;

      if (lang === "EN") {
        if (!entry.tag_en) entry.tag_en = title;
      } else if (lang === "CN") {
        if (!entry.tag_cn) entry.tag_cn = title;
      } else if (!entry.tag_en) {
        // Records without a language can't be split — use them for both.
        entry.tag_en = title;
        if (!entry.tag_cn) entry.tag_cn = title;
      } else if (!entry.tag_cn) {
        entry.tag_cn = title;
      }
    }
  }

  return byUrl;
}

/**
 * Which cover URLs are still missing from the Image collection?
 * (Only URLs that are not already there — never a duplicate.)
 */
export function findMissingImageCandidates(data = {}, images = []) {
  const existing = buildImageUrlIndex(images);
  const candidates = collectImageCandidates(data);
  const missing = [];
  for (const [key, entry] of candidates) {
    if (existing.has(key)) continue;
    missing.push(entry);
  }
  return missing;
}

/**
 * Which URL does this record already have as an Image? (handy for badges)
 */
export function imageUrlExists(url, imagesOrIndex) {
  const index =
    imagesOrIndex instanceof Set ? imagesOrIndex : buildImageUrlIndex(imagesOrIndex);
  const key = normalizeImageUrl(url);
  return Boolean(key && index.has(key));
}

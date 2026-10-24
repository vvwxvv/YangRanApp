/**
 * mediaMatching.js — the ONE place that answers two questions both the public
 * pages and the manager order pages must answer identically:
 *
 *   1. "does this IMAGE belong to this page entity (exhibition / fair)?"
 *      → `imageMatchesEntity` / `findEntityForImage`
 *
 *   2. "in what order do the ENTITIES themselves appear on their pages?"
 *      → `entityTimeMs` / `sortEntitiesByTime`  (newest first, like the
 *        exhibition / fair list pages)
 *
 * Why it lives here: the manager's "Exhibition Page Order" tab now groups images
 * BY EXHIBITION. If the manager grouped them with a different rule than the
 * page uses to collect them, the page would ignore whatever the manager saved
 * (or show images the manager never listed) — the exact class of bug that made
 * the artist-page order diverge. One shared matcher means "what you order is
 * what the page shows".
 *
 * Matching rule (identical for every collection):
 *   • the image carries the entity id in `artworkId` / `eventId` / `entityId`, OR
 *   • `tag_en` / `tag_cn` equals the entity title, compared case-insensitively
 *     with surrounding whitespace trimmed and inner runs collapsed (a title
 *     stored as "形立章成 " must not orphan its "形立章成" images).
 */

import { parseLooseDate, parseLooseYear } from "./looseDate";

/** entity type → the `Image.order` sub-key that orders it. */
export const ENTITY_ORDER_KEY = Object.freeze({
  exhibition: "exhibition_page_order",
  fair: "art_fair_page_order",
});

/** The order sub-key a page entity type uses (null when unknown). */
export const entityOrderKey = (entityType) => ENTITY_ORDER_KEY[entityType] || null;

/** Entity type for an order sub-key (null when it is not an entity page key). */
export const entityTypeForOrderKey = (orderKey) => {
  const hit = Object.entries(ENTITY_ORDER_KEY).find(([, key]) => key === orderKey);
  return hit ? hit[0] : null;
};

/**
 * Normalise a title/tag for matching: trim, lowercase, collapse inner
 * whitespace. Deliberately NOT punctuation-insensitive — a punctuation-insensitive
 * match would collide unrelated shows ("One, and Many" vs "One and Many…").
 */
export const normalizeEntityTitle = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

/** Stable string id of an entity (API responses expose `_id` → `id`). */
export const entityIdOf = (entity) => {
  if (!entity || typeof entity !== "object") return null;
  const value = entity._id ?? entity.id;
  return value === undefined || value === null ? null : String(value);
};

/** Fields an image may use to point at an entity by id. */
const ENTITY_ID_FIELDS = ["artworkId", "eventId", "entityId"];

/**
 * Does this image belong to this entity's page?
 * @param {object} image  Image record (or gallery-shaped copy).
 * @param {object} entity Exhibition / Fair record.
 */
export const imageMatchesEntity = (image, entity) => {
  if (!image || !entity) return false;

  const id = entityIdOf(entity);
  if (id) {
    for (const field of ENTITY_ID_FIELDS) {
      const value = image[field];
      if (value && String(value) === id) return true;
    }
  }

  const title = normalizeEntityTitle(entity.title);
  if (!title) return false;
  return (
    normalizeEntityTitle(image.tag_en) === title ||
    normalizeEntityTitle(image.tag_cn) === title
  );
};

/**
 * Timestamp an entity should be ordered by: start date, else end date, else 0
 * (unknown dates sink to the bottom). Dates are free-form strings ("2026.1.10",
 * "24 December 2023", "2023年12月24日"), so parsing goes through parseLooseDate.
 */
export const entityTimeMs = (entity) => {
  const start = parseLooseDate(entity?.date_start);
  if (start) return start.getTime();
  const end = parseLooseDate(entity?.date_end);
  if (end) return end.getTime();
  return 0;
};

/**
 * Sort entities the way their list pages do — newest first by default.
 * A title compare breaks date ties so the order is stable between renders.
 */
export const sortEntitiesByTime = (entities, direction = "desc") => {
  const sign = direction === "asc" ? -1 : 1;
  return [...(Array.isArray(entities) ? entities : [])].sort((a, b) => {
    const d = entityTimeMs(b) - entityTimeMs(a);
    if (d !== 0) return sign * d;
    return String(a?.title || "").localeCompare(String(b?.title || ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
};

/**
 * Normalised title → year, built from the records an image tag can name.
 * Works for artworks (`year`) and for shows / fairs / events / bibliography
 * entries whose own year may be missing but whose date carries one
 * ("2026.1.10", "24 December 2023", "2023年12月24日" → that year).
 */
export const buildYearByTitleIndex = ({
  artworks = [],
  exhibitions = [],
  fairs = [],
  events = [],
  bibliographies = [],
  series = [],
} = {}) => {
  const map = new Map();
  const add = (title, year) => {
    const key = normalizeEntityTitle(title);
    const value = year === undefined || year === null ? "" : String(year).trim();
    if (!key || !value) return;
    if (!map.has(key)) map.set(key, value);
  };

  for (const artwork of artworks) add(artwork?.title, artwork?.year);
  for (const exhibition of exhibitions) {
    add(exhibition?.title, exhibition?.year || parseLooseYear(exhibition?.date_start));
  }
  for (const fair of fairs) add(fair?.title, fair?.year || parseLooseYear(fair?.date_start));
  for (const event of events) add(event?.title, parseLooseYear(event?.date_time));
  for (const bibliography of bibliographies) {
    add(bibliography?.title, parseLooseYear(bibliography?.date));
  }
  for (const seriesItem of series) {
    add(seriesItem?.title, seriesItem?.year);
  }

  return map;
};

/**
 * Resolver for one image: the year of the record its tag names ("" when the
 * tag is an artist name, or the record has no year at all).
 *
 *   const yearFor = createImageYearResolver({ artworks, exhibitions, fairs });
 *   yearFor({ tag_en: "I Am Here", tag_cn: "我在这里" })   // "2026"
 */
export const createImageYearResolver = (collections = {}) => {
  const map = buildYearByTitleIndex(collections);
  return (image) => {
    for (const tag of [image?.tag_en, image?.tag_cn]) {
      const key = normalizeEntityTitle(tag);
      if (key && map.has(key)) return map.get(key);
    }
    return "";
  };
};

/**
 * Build a title/id lookup for one entity type.
 *
 * @param {Array} entities          exhibitions or fairs
 * @param {"exhibition"|"fair"} entityType
 * @returns {{
 *   entities: Array,                                   // time-sorted copy
 *   findEntityForImage: (image) => object|null,        // first (newest) match
 *   byId: (id) => object|null,
 * }}
 */
export const buildEntityIndex = (entities, entityType) => {
  const sorted = sortEntitiesByTime(entities);
  const byTitle = new Map();
  const byId = new Map();

  for (const entity of sorted) {
    const id = entityIdOf(entity);
    if (id && !byId.has(id)) byId.set(id, entity);
    const title = normalizeEntityTitle(entity?.title);
    // First (newest) row wins for a duplicated title.
    if (title && !byTitle.has(title)) byTitle.set(title, entity);
  }

  const findEntityForImage = (image) => {
    if (!image) return null;
    const id = image.artworkId || image.eventId || image.entityId;
    if (id && byId.has(String(id))) return byId.get(String(id));
    const tagEn = normalizeEntityTitle(image.tag_en);
    if (tagEn && byTitle.has(tagEn)) return byTitle.get(tagEn);
    const tagCn = normalizeEntityTitle(image.tag_cn);
    if (tagCn && byTitle.has(tagCn)) return byTitle.get(tagCn);
    return null;
  };

  return {
    entityType,
    entities: sorted,
    findEntityForImage,
    byId: (id) => (id === undefined || id === null ? null : byId.get(String(id)) || null),
    count: sorted.length,
  };
};

export default buildEntityIndex;

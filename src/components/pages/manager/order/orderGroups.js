/**
 * orderGroups.js — pure builders for the groups an order page shows.
 *
 * The image order page has THREE tabs and they group DIFFERENTLY, because each
 * one orders a different kind of page:
 *
 *   rolling_img_order       → group by ARTIST      (one sequence per artist;
 *                             source sub-boxes: Works / Exhibition: … / Fair: …)
 *   exhibition_page_order   → group by EXHIBITION  (one sequence per show,
 *                             shows ordered by date, newest first)
 *   art_fair_page_order     → group by FAIR        (same, for art fairs)
 *
 * All three return the same group shape, so `OrderGroupBox` / `OrderCard` and
 * the drag + hide plumbing are shared:
 *
 *   { key, label, meta?, artist?, matched, sources: [{key,label,kind,title,items}], items }
 *
 * `items` is the flat list of every image in the group (the blocks number it),
 * `sources` the sub-boxes (one per source, or a single box for entity groups).
 *
 * Grouping by the entity (not by artist) is what makes the position numbers
 * meaningful: the page shows ONE ordered gallery, so it must be ONE numbered
 * sequence — grouping by artist would number a sequence the page never shows.
 */

import { buildEntityIndex, entityTypeForOrderKey } from "@/utils/mediaMatching";
import { getImageOrder } from "@/utils/mediaOrder";
import {
  UNGROUPED_KEY,
  SOURCE_ORDER,
  groupSourceLabel,
  imageGroupKeys,
  parseGroupKey,
} from "@/components/pages/manager/images/hooks/useImageSourceIndex";

/** Sub-group id for one source inside an artist box: artist␟kind␟title */
export const SOURCE_UNGROUPED = "__ungrouped__";

/** Group key of the trailing "no matching page entity" bucket. */
export const NO_ENTITY_KEY = "__no_entity__";

export const GROUP_MODE = Object.freeze({
  ARTIST: "artist",
  EXHIBITION: "exhibition",
  FAIR: "fair",
});

/** Which grouping a given order sub-key needs. */
export const groupModeForOrderKey = (orderKey) =>
  entityTypeForOrderKey(orderKey) || GROUP_MODE.ARTIST;

/** Rank of an item for the active order key (Infinity = no position yet).
 *  Goes through `getImageOrder`, so both the JSON `{key: "3"}` shape and a
 *  legacy plain-string `order` are understood. */
export const orderRankOf = (item, orderKey) => {
  const value = Number(getImageOrder(item, orderKey));
  return Number.isFinite(value) && value > 0 ? value : Infinity;
};

/** Tag compare used to keep unordered items stable + readable. */
const byTag = (a, b) =>
  String(a?.tag_en || "").localeCompare(String(b?.tag_en || ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });

/** Ranked first (ascending), then A→Z by tag — stable + deterministic. */
export const sortItemsByOrder = (items, orderKey) =>
  [...items].sort((a, b) => {
    const av = orderRankOf(a, orderKey);
    const bv = orderRankOf(b, orderKey);
    if (av !== bv) return av - bv;
    return byTag(a, b);
  });

// ─────────────────────────────────────────────────────────────────────────────
//  Artist mode (the Rolling Image Order tab)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Artist → source sub-boxes (Works / Exhibition: … / Art Fair: …).
 * Kept exactly as the page always behaved: an image belongs to every artist of
 * its source, the artist's sequence numbers run across its sub-boxes, and the
 * sub-boxes follow works → shows → fairs → … then title.
 *
 * @param {object} p
 * @param {Array}  p.images       images (already normalised, with `id`)
 * @param {object} p.sourceIndex  buildImageSourceIndex(...)
 * @param {string} p.orderKey     active order sub-key (ranking only)
 * @param {boolean}p.isCn
 * @param {object} p.labels       { ungrouped }
 */
export function buildImageArtistGroups({ images, sourceIndex, orderKey, isCn, labels }) {
  const ungroupedLabel = isCn ? "未分组" : "Ungrouped";
  const artists = new Map();

  for (const image of images) {
    const keys = imageGroupKeys(image, sourceIndex);

    for (const rawKey of keys) {
      const parts = parseGroupKey(rawKey);

      let artistKey;
      let artistLabel;
      let matched = true;

      if (parts.ungrouped) {
        artistKey = UNGROUPED_KEY;
        artistLabel = ungroupedLabel;
        matched = false;
      } else if (parts.sourceOnly) {
        artistKey = rawKey;
        artistLabel = groupSourceLabel(rawKey, { isCn });
        matched = false;
      } else {
        artistKey = parts.artist;
        artistLabel = sourceIndex.labelFor(parts.artist, { lang: isCn ? "cn" : "en" });
      }

      if (!artists.has(artistKey)) {
        artists.set(artistKey, {
          key: artistKey,
          label: artistLabel,
          artist: parts.artist || "",
          matched,
          mode: GROUP_MODE.ARTIST,
          sources: new Map(),
          items: [],
        });
      }

      const bucket = artists.get(artistKey);
      const sourceKey = parts.ungrouped ? SOURCE_UNGROUPED : rawKey;

      if (!bucket.sources.has(sourceKey)) {
        bucket.sources.set(sourceKey, {
          key: sourceKey,
          label: parts.ungrouped
            ? ungroupedLabel
            : groupSourceLabel(rawKey, { isCn }),
          kind: parts.kind || "artwork",
          title: parts.title || "",
          items: [],
        });
      }

      // One copy per artist box (an image can belong to several artists), each
      // remembering which sub-box it came from.
      bucket.sources.get(sourceKey).items.push({ ...image, __sourceKey: sourceKey });
    }
  }

  const groups = [...artists.values()];

  for (const group of groups) {
    const sources = [...group.sources.values()];
    sources.sort((a, b) => {
      const ka = SOURCE_ORDER[a.kind] ?? 9;
      const kb = SOURCE_ORDER[b.kind] ?? 9;
      if (ka !== kb) return ka - kb;
      return String(a.title).localeCompare(String(b.title), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
    for (const source of sources) {
      source.items = sortItemsByOrder(source.items, orderKey);
    }
    group.sources = sources;
    group.items = sources.flatMap((source) => source.items);
  }

  groups.sort(compareArtistGroupKeys);
  return groups;
}

/** Artist A→Z (ungrouped last); inside an artist works → shows → fairs → … */
const compareArtistGroupKeys = (a, b) => {
  if (a.key === UNGROUPED_KEY || b.key === UNGROUPED_KEY) {
    if (a.key === b.key) return 0;
    return a.key === UNGROUPED_KEY ? 1 : -1;
  }
  if (Boolean(a.artist) !== Boolean(b.artist)) return a.artist ? -1 : 1;
  if (a.artist !== b.artist) {
    return String(a.artist).localeCompare(String(b.artist), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }
  return String(a.label).localeCompare(String(b.label), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
//  Entity mode (Exhibition / Art Fair page order tabs)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * One group per page entity (exhibition / fair), in the same order those
 * pages are listed in (date, newest first), each holding exactly the images
 * that entity's page shows — sorted by this tab's position, so #1 is the first
 * image on the page.
 *
 * Images that match NO entity are not silently dropped: those carrying a
 * position for this tab end up in a trailing, collapsed "unmatched" group, so a
 * stale position is visible instead of being invisible-but-stored.
 *
 * @param {object} p
 * @param {Array}  p.images      images
 * @param {Array}  p.entities    exhibitions / fairs
 * @param {string} p.entityType  "exhibition" | "fair"
 * @param {string} p.orderKey    active order sub-key
 * @param {boolean}p.isCn
 * @param {Function} [p.metaOf]  (entity) => string   (e.g. "10 Jan – 24 Mar 2024")
 * @param {Array}  [p.hideTokens] hide tokens that make an image invisible on
 *                                that page (kept OUT of the group's numbering)
 */
export function buildImageEntityGroups({
  images,
  entities,
  entityType,
  orderKey,
  isCn,
  metaOf,
  alwaysShow = false,
}) {
  const index = buildEntityIndex(entities, entityType);
  const buckets = new Map();
  const unmatched = [];

  for (const image of images) {
    const entity = index.findEntityForImage(image);
    if (!entity) {
      unmatched.push(image);
      continue;
    }
    const key = `entity${"\u001f"}${entityType}${"\u001f"}${entity._id ?? entity.id}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        label: entity.title || (isCn ? "未命名" : "Untitled"),
        meta: metaOf ? metaOf(entity) : "",
        entity,
        mode: entityType,
        artist: "",
        matched: true,
        sources: [],
        items: [],
      });
    }
    buckets.get(key).items.push({ ...image, __sourceKey: key });
  }

  // Keep the entity order (time-sorted) — not the image order.
  const groups = [];
  for (const entity of index.entities) {
    const key = `entity${"\u001f"}${entityType}${"\u001f"}${entity._id ?? entity.id}`;
    let bucket = buckets.get(key);
    if (!bucket) {
      if (!alwaysShow) continue;
      bucket = {
        key,
        label: entity.title || "",
        meta: metaOf ? metaOf(entity) : "",
        entity,
        mode: entityType,
        artist: "",
        matched: true,
        sources: [],
        items: [],
      };
      buckets.set(key, bucket);
    }
    bucket.items = sortItemsByOrder(bucket.items, orderKey);
    bucket.sources = [
      { key: bucket.key, label: "", kind: entityType, title: entity.title || "", items: bucket.items },
    ];
    groups.push(bucket);
  }

  // Trailing bucket: positions saved for a page entity that no longer matches
  // any record (renamed show, deleted show, tag typo).
  const dangling = unmatched.filter((image) => Number.isFinite(orderRankOf(image, orderKey)));
  if (dangling.length) {
    const sorted = sortItemsByOrder(dangling, orderKey);
    const key = NO_ENTITY_KEY;
    groups.push({
      key,
      label:
        entityType === "fair"
          ? isCn
            ? "未匹配到艺博会页的图片"
            : "Not matched to an art fair page"
          : isCn
          ? "未匹配到展览页的图片"
          : "Not matched to an exhibition page",
      meta: isCn
        ? `保存了排序，但没有对应的${entityType === "fair" ? "艺博会" : "展览"}页`
        : `Position saved, but no matching ${entityType === "fair" ? "fair" : "exhibition"} page`,
      entity: null,
      mode: entityType,
      artist: "",
      matched: false,
      dangling: true,
      sources: [{ key, label: "", kind: entityType, title: "", items: sorted }],
      items: sorted,
    });
  }

  return groups;
}

/**
 * One entry point for the image order page: picks the right builder, so the
 * component never branches on the order key itself.
 */
export function buildImageOrderGroups({
  images,
  orderKey,
  sourceIndex,
  exhibitions = [],
  fairs = [],
  isCn,
  metaOf,
}) {
  const mode = groupModeForOrderKey(orderKey);

  if (mode === GROUP_MODE.ARTIST) {
    return buildImageArtistGroups({ images, sourceIndex, orderKey, isCn });
  }

  return buildImageEntityGroups({
    images,
    entities: mode === GROUP_MODE.FAIR ? fairs : exhibitions,
    entityType: mode,
    orderKey,
    isCn,
    metaOf,
  });
}

export default buildImageOrderGroups;

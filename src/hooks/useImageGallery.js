/**
 * useImageGallery — the image gallery of ONE entity page (exhibition / fair).
 *
 * Images are matched to the entity by `utils/mediaMatching` (tag or explicit id
 * field — the SAME rule the manager's order page groups by, so the manager can
 * never order images the page doesn't show) and ordered by the entity's OWN
 * `Image.order` sub-key:
 *
 *   exhibition page → image.exhibition_page_order
 *   fair page       → image.art_fair_page_order
 *
 * then by the rolling order (the artist-page sequence). Anything with neither
 * keeps the incoming API order, which is already sorted by rolling_img_order.
 *
 * Images the manager hid for THIS page (`exhibition_page` / `art_fair_page`
 * hide token — the eye button on the matching order tab) are left out, exactly
 * like artworks hidden from the exhibition page's Works grid.
 *
 * The legacy `artist_page_order` an old image row may still carry is NOT read
 * here — for images it was a duplicate of the artist-page rolling order.
 *
 * NOT used by the artist page: its images are the rolling slideshow
 * (rolling_img_order — see useArtistRollingImages).
 */

import { useMemo } from "react";
import { getImageOrder } from "@/utils/mediaOrder";
import { isMarkHidden } from "@/utils/mediaMarks";
import { imageMatchesEntity } from "@/utils/mediaMatching";

const DEFAULT_ID_FIELD = "_id";
const DEFAULT_TITLE_FIELD = "title";
const DEFAULT_COVER_FIELD = "cover_img_url";

/** The entity's OWN key first. An unknown entity has no key of its own. */
const ORDER_KEY_BY_ENTITY = {
  exhibition: "exhibition_page_order",
  fair: "art_fair_page_order",
};

/** The hide token closed by the eye button of that same order tab. */
const HIDE_TOKEN_BY_ENTITY = {
  exhibition: "exhibition_page",
  fair: "art_fair_page",
};

/** Read second: the image's position in the artist-page rolling sequence. */
const ROLLING_ORDER_KEY = "rolling_img_order";

/** Position for one image on this page: own key first, then rolling. */
const rankOf = (img, orderKeys) => {
  for (const key of orderKeys) {
    const v = Number(getImageOrder(img, key));
    if (Number.isFinite(v) && v > 0) return v;
  }
  return Infinity;
};

/**
 * Comparator that is safe when both sides are unranked — `Infinity - Infinity`
 * is NaN and would make the sort order engine-dependent.
 */
const byRank = (orderKeys) => (a, b) => {
  const ra = rankOf(a, orderKeys);
  const rb = rankOf(b, orderKeys);
  if (ra === rb) return 0; // both unranked → keep the incoming order
  return ra - rb;
};

/**
 * Match images to a single entity. Safe against null/undefined inputs.
 */
export const useSingleEntityImagesMaching = (allImages, entity, entityType, isCn) => {
  return useMemo(() => {
    if (!Array.isArray(allImages) || !allImages.length || !entity) {
      return { matchedImages: [], coverImage: null };
    }

    const idField = DEFAULT_ID_FIELD;
    const coverField = DEFAULT_COVER_FIELD;

    // This entity's own order key first, then the artist-page rolling order.
    // Nothing else: one page → one key (+ the artist sequence as a tie-break).
    const primaryKey = ORDER_KEY_BY_ENTITY[entityType] || null;
    const hideToken = HIDE_TOKEN_BY_ENTITY[entityType] || null;
    const orderKeys = [...(primaryKey ? [primaryKey] : []), ROLLING_ORDER_KEY];

    // Sort the RAW images — the mapped copies below replace `order` with the
    // resolved scalar, which would hide the rolling fallback from `rankOf`.
    const matched = allImages.filter((img) => {
      if (!img) return false;
      if (!imageMatchesEntity(img, entity)) return false;
      // Hidden for this page (manager eye button) → not on the page at all.
      if (hideToken && isMarkHidden(img, hideToken)) return false;
      return true;
    });

    matched.sort(byRank(orderKeys));

    const matchedImages = matched.map((img) => ({
      ...img,
      id: img.id || img._id,
      img_url: img.img_url,
      caption_en: img.caption_en || "",
      caption_cn: img.caption_cn || "",
      tag_en: img.tag_en || "",
      tag_cn: img.tag_cn || "",
      // `order` is a JSON object on Image — expose the resolved position as a
      // plain string so nothing downstream can render "[object Object]".
      order: primaryKey ? getImageOrder(img, primaryKey) : "",
    }));

    const coverImage =
      entity[coverField] || (matchedImages.length > 0 ? matchedImages[0].img_url : null);

    return { matchedImages, coverImage };
  }, [allImages, entity, entityType]);
};

const FALLBACK_IMAGE = "/no-image.png";

const useImageGallery = (images, item, isCn, options = {}) => {
  const {
    imageUrlField = "img_url",
    coverImageField = "cover_img_url",
    fallbackImage = FALLBACK_IMAGE,
    // "exhibition" | "fair" — required for the entity's own order key to apply.
    entityType = null,
  } = options;

  const { matchedImages } = useSingleEntityImagesMaching(images, item, entityType, isCn);

  const uniqueImages = useMemo(() => {
    if (!Array.isArray(matchedImages) || matchedImages.length === 0) return [];
    const seen = new Set();
    return matchedImages.filter((image) => {
      if (!image?.[imageUrlField]?.trim()) return false;
      if (seen.has(image[imageUrlField])) return false;
      seen.add(image[imageUrlField]);
      return true;
    });
  }, [matchedImages, imageUrlField]);

  const mainImageUrl = useMemo(() => {
    if (uniqueImages.length > 0) return uniqueImages[0][imageUrlField];
    if (item?.[coverImageField]?.trim()) return item[coverImageField];
    return fallbackImage;
  }, [uniqueImages, item, coverImageField, imageUrlField, fallbackImage]);

  const galleryImages = useMemo(() => uniqueImages.slice(1), [uniqueImages]);

  return { mainImageUrl, galleryImages, uniqueImages };
};

export default useImageGallery;

import { useMemo } from "react";
import useData from "@/hooks/useData";
import { getArtworkOrder, hasArtworkOrder, compareByYearThenTitle } from "@/utils/artworkOrder";
import { filterArtworksHiddenForPage } from "@/utils/mediaMarks";
import useImageGallery from "@/hooks/useImageGallery";
import useWebGallery from "@/hooks/useWebGallery";
import { useWebMatching } from "@/hooks/useWebMatching";
import useExhibitionSlugData from "@/components/pages/exhibition/hooks/useExhibitionSlugData";
import useZoomControl from "@/hooks/useZoomControl";
import useImageModal from "@/hooks/useImageModal";

import { imageConfig } from "@/components/configs/imageConfig";
import { webConfig } from "@/components/configs/webConfig";
import { videoConfig } from "@/components/configs/videoConfig";

const FALLBACK_IMAGE = "/no-image.png";
const ZOOM_CONFIG = {
  STEP: 0.1,
  MIN: 1,
  MAX: 3,
};

// Normalize a title for cross-collection matching — trim, lowercase, and
// collapse internal whitespace so minor formatting differences
// ("Mountain " vs "mountain") don't cause a missed match.
const normalizeTitle = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// Parse a string order into a sortable number; missing / non-numeric
// values become Infinity so they sort AFTER any explicitly-ordered item.
const orderValue = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : Infinity;
};

// Locale-ish collator for the alphabetical fallback. numeric:true means
// "Work 2" sorts before "Work 10" instead of pure string order.
const titleCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export default function useExhibitionDetailData(slug, isCn) {
  // Resolve slug to exhibition record
  const { exhibition, loading, error: exhibitionError } = useExhibitionSlugData(slug, isCn);

  // Fetch images data
  const { data: images, isLoading: imagesLoading, error: imagesError } = useData(
    imageConfig.api.endpoints.list,
    null,
    isCn
  );

  // Fetch web data
  const { data: webs, isLoading: websLoading, error: websError } = useData(
    webConfig.api.endpoints.list,
    null,
    isCn
  );

  // Fetch videos data
  const { data: videos, isLoading: videosLoading, error: videosError } = useData(
    videoConfig.api.endpoints.list,
    null,
    isCn
  );

  // Fetch all artworks — needed to build the "Works" grid at the bottom
  // of the exhibition page.
  const { data: artworks, isLoading: artworksLoading, error: artworksError } = useData(
    "/api/artwork",
    null,
    isCn
  );

  // Image matching
  const { mainImageUrl, galleryImages } = useImageGallery(images, exhibition, isCn, {
    entityType: "exhibition",
    imageUrlField: "img_url",
    coverImageField: "cover_img_url",
    fallbackImage: FALLBACK_IMAGE,
  });

  // Web matching
  const { galleryWebs } = useWebGallery(webs, exhibition, isCn, {
    webUrlField: "web_url",
  });

  const matchedWebs = useWebMatching(webs, exhibition, isCn);

  // ------------------------------------------------------------------
  // Artwork matching — BIDIRECTIONAL, so an artwork shows up in this
  // exhibition's "Works" grid if EITHER side references the other:
  //
  //   1) Exhibition → Artwork: exhibition.related_artwork contains an
  //      entry ({ title, order, mark }) whose title matches the artwork.
  //      The per-entry order / mark drive custom ordering and marking in
  //      the grid.
  //   2) Artwork → Exhibition: artwork.related_exhibition
  //      contains this exhibition's title.
  //
  // Relying on only one direction used to mean an artwork got missed if
  // only one side of the relationship was filled in when the record was
  // created — checking both directions means nothing falls through the
  // cracks.
  //
  // Legacy fallback: if related_artwork is empty, the old
  // related_artwork_title string array is used so un-migrated records
  // still resolve (those entries carry no order / mark).
  //
  // Ordering: the artwork's own `order.exhibition_page_order` wins (that is
  // what the artwork order page writes for this page); artworks without it
  // fall back to the per-entry order in related_artwork[], then to
  // alphabetical by title.
  // ------------------------------------------------------------------
  const matchedArtworks = useMemo(() => {
    if (!exhibition || !Array.isArray(artworks) || !artworks.length) return [];

    const exhibitionTitleKey = normalizeTitle(exhibition.title);

    // Prefer the new object-array field; fall back to the legacy string array.
    const relatedSource =
      Array.isArray(exhibition.related_artwork) && exhibition.related_artwork.length
        ? exhibition.related_artwork
        : toArray(exhibition.related_artwork_title);

    // Map: normalized title → { order }
    const relatedMap = new Map();
    for (const entry of toArray(relatedSource)) {
      const isObj = entry && typeof entry === "object";
      const title = isObj ? entry.title : entry;
      const key = normalizeTitle(title);
      if (!key || relatedMap.has(key)) continue;
      relatedMap.set(key, {
        order: isObj ? entry.order : undefined,
      });
    }

    const seen = new Set();
    const result = [];

    // Works the manager marked as hidden from the exhibition page are excluded
    // here (mark = "hide_in_exhibition_page").
    const visibleArtworks = filterArtworksHiddenForPage(artworks, "exhibition_page_order");

    for (const aw of visibleArtworks) {
      if (!aw) continue;
      const id = aw.id || aw._id;
      if (id && seen.has(id)) continue;

      const artworkTitleKey = normalizeTitle(aw.title);

      // Direction 1: exhibition lists this artwork's title
      const relatedMeta =
        artworkTitleKey && relatedMap.has(artworkTitleKey)
          ? relatedMap.get(artworkTitleKey)
          : null;
      const matchesFromExhibitionSide = !!relatedMeta;

      // Direction 2: artwork lists this exhibition's title
      const matchesFromArtworkSide =
        !!exhibitionTitleKey &&
        toArray(aw.related_exhibition).some(
          (t) => normalizeTitle(t) === exhibitionTitleKey
        );

      if (matchesFromExhibitionSide || matchesFromArtworkSide) {
        if (id) seen.add(id);
        result.push({
          ...aw,
          // Per-exhibition custom order pulled from related_artwork.
          // Namespaced so it doesn't overwrite the artwork's own order.
          related_order: relatedMeta?.order,
        });
      }
    }

    // Sort:
    //   1) the artwork's OWN `order.exhibition_page_order` (what the artwork
    //      order page writes for the exhibition page) → first, ascending;
    //   2) ties / artworks without it fall back to the exhibition's per-entry
    //      related order from related_artwork[];
    //   3) then alphabetical by title.
    // (orderValue maps missing/non-numeric to Infinity; the oa !== ob guard
    //  avoids Infinity - Infinity = NaN and hands those to the collator.)
    result.sort((a, b) => {
      const aPage = hasArtworkOrder(a, "exhibition_page_order");
      const bPage = hasArtworkOrder(b, "exhibition_page_order");

      if (aPage && bPage) {
        const d =
          Number(getArtworkOrder(a, "exhibition_page_order")) -
          Number(getArtworkOrder(b, "exhibition_page_order"));
        if (d) return d;
      } else if (aPage !== bPage) {
        // An explicitly positioned artwork always beats an unpositioned one.
        return aPage ? -1 : 1;
      }

      const oa = orderValue(a.related_order);
      const ob = orderValue(b.related_order);
      if (oa !== ob) return oa - ob;
      // Nothing positioned → newest year first, then title A→Z.
      return compareByYearThenTitle(a, b);
    });

    return result;
  }, [exhibition, artworks]);

  // Zoom & modal
  const { zoomLevel, handleImageWheel } = useZoomControl(mainImageUrl, ZOOM_CONFIG);
  const { enlargedImage, modalOpen, handleImageClick, handleModalClose } = useImageModal(FALLBACK_IMAGE);

  // Aggregate loading & errors
  const isLoading = loading || imagesLoading || websLoading || videosLoading || artworksLoading;
  const errors = [exhibitionError, imagesError, websError, videosError, artworksError].filter(Boolean);
  const hasError = errors.length > 0;
  const firstError = errors[0] || null;

  return {
    exhibition,
    isLoading,
    hasError,
    firstError,
    errors,
    mainImageUrl,
    galleryImages,
    videos,
    galleryWebs,
    matchedWebs,
    matchedArtworks,
    zoomLevel,
    handleImageWheel,
    enlargedImage,
    modalOpen,
    handleImageClick,
    handleModalClose,
  };
}
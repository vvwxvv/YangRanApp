"use client";

import { useCallback, useMemo, useState } from "react";
import {
  buildImageUrlIndex,
  findMissingImageCandidates,
  imageUrlExists,
} from "@/utils/imageSync";

/**
 * useImageSync
 * ─────────────────────────────────────────────────────────────────────────────
 * "Refresh images" for the image manager: every other collection that carries
 * an image (Artwork / Exhibition / Fair / Event / Writing / Bibliography / Series
 * covers + About portrait) is scanned and any cover URL that is **not yet** an Image
 * row is created as one — with `tag_en` / `tag_cn` filled from the
 * language-split sibling records (the EN and CN rows of the same item share a
 * cover URL).
 *
 * @param {object} data    { artwork, exhibition, fair, event, writing, bibliography, series, about }
 * @param {Array}  images  current Image rows (used to skip duplicates)
 * @returns {{
 *   imageUrlIndex: Set<string>,
 *   hasImageUrl: (url: string) => boolean,
 *   missing: Array<{img_url:string,tag_en:string,tag_cn:string,type:string,sources:string[]}>,
 *   missingCount: number,
 *   syncing: boolean,
 *   lastResult: object|null,
 *   error: any,
 *   syncImages: () => Promise<object|null>,
 * }}
 */
export default function useImageSync(data = {}, images = []) {
  const [syncing, setSyncing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);

  const imageUrlIndex = useMemo(() => buildImageUrlIndex(images), [images]);

  const missing = useMemo(
    () => findMissingImageCandidates(data, images),
    [data, images]
  );

  const hasImageUrl = useCallback(
    (url) => imageUrlExists(url, imageUrlIndex),
    [imageUrlIndex]
  );

  const syncImages = useCallback(async () => {
    if (!missing.length) {
      const empty = { added: 0, skipped: 0, total: 0 };
      setLastResult(empty);
      return empty;
    }

    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/image/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: missing }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      setLastResult(result);
      return result;
    } catch (err) {
      console.log("[useImageSync] sync failed:", err);
      setError(err);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [missing]);

  return {
    imageUrlIndex,
    hasImageUrl,
    missing,
    missingCount: missing.length,
    syncing,
    lastResult,
    error,
    syncImages,
  };
}

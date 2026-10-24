"use client";

import { useContext, useMemo, useCallback } from "react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useData from "@/hooks/useData";
import useFont from '@/hooks/useFont';
import { useReverseTheme } from "@/hooks/useReverseTheme";
import { filterByLanguage } from "@/utils/filterByLanguage";

/**
 * useAboutData
 *
 * Fetches About data and separates gallery from artist entries.
 *
 * ── Logic ───────────────────────────────────────────────────
 *   About.artist === "" or null  →  galleryAbout (public page)
 *   About.artist !== ""          →  artistAbouts (profiles)
 *
 * Returns:
 *   galleryAbout   – single About entry for gallery (artist empty)
 *   artistAbouts   – array of artist-profile About entries
 *   isLoading / error / refetch
 */
export default function useAboutData() {
  const { isCn } = useContext(LanguageContext);
  const { fontFamily } = useFont();
  const { colors } = useReverseTheme();

  const {
    data: raw = [],
    isLoading,
    error,
    refetch,
  } = useData("/api/about");

  // Language filter
  const filtered = useMemo(() => filterByLanguage(raw, isCn), [raw, isCn]);

  // Split: gallery (artist empty) vs artist profiles
  const galleryAbout = useMemo(
    () => filtered.find((a) => !a?.artist || a.artist.trim() === "") || null,
    [filtered]
  );

  const artistAbouts = useMemo(
    () => filtered.filter((a) => a?.artist && a.artist.trim() !== ""),
    [filtered]
  );

  const handleRetry = useCallback(() => refetch?.(), [refetch]);

  return {
    isCn,
    fontFamily,
    colors,
    galleryAbout,
    artistAbouts,
    data: filtered,
    isLoading,
    error,
    handleRetry,
    refetch: handleRetry,
  };
}

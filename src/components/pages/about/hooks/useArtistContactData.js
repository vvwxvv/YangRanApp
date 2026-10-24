"use client";

import { useContext, useMemo, useCallback } from "react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useData from "@/hooks/useData";
import useFont from '@/hooks/useFont';
import { useReverseTheme } from "@/hooks/useReverseTheme";
import { filterByLanguage } from "@/utils/filterByLanguage";

/**
 * useArtistContactData
 *
 * Fetches Artist Contact data and filters by the current language.
 * Mirrors useAboutData's fetch + resolve pattern so getting the data
 * behaves the same way.
 *
 * Returns:
 *   contacts        – array of ArtistContact entries (language‑filtered)
 *   ArtistContact  – the first resolved contact entry (parallel to galleryAbout)
 *   isLoading / error / handleRetry / refetch
 *   isCn, fontFamily, colors
 */
export default function useArtistContactData() {
  const { isCn } = useContext(LanguageContext);
  const { fontFamily } = useFont();
  const { colors } = useReverseTheme();

  const {
    data: raw = [],
    isLoading,
    error,
    refetch,
  } = useData("/api/artist-contact"); // confirm this matches your route

  // Normalize + language filter — same logic as useAboutData, but resilient:
  //   1. Coerce to an array (in case the API returns a single object).
  //   2. Filter by language.
  //   3. If the language filter empties everything (e.g. the record was
  //      saved without a `language` value), fall back to the raw list so
  //      the data still renders instead of silently disappearing.
  const contacts = useMemo(() => {
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const byLang = filterByLanguage(list, isCn);
    return byLang.length > 0 ? byLang : list;
  }, [raw, isCn]);

  // Single resolved entry — parallel to galleryAbout in useAboutData.
  const ArtistContact = useMemo(() => contacts[0] || null, [contacts]);

  const handleRetry = useCallback(() => refetch?.(), [refetch]);

  return {
    isCn,
    fontFamily,
    colors,
    contacts,
    ArtistContact,
    isLoading,
    error,
    handleRetry,
    refetch: handleRetry,
  };
}
"use client";

import { useMemo, useCallback, useState } from "react";
import useData from "@/hooks/useData";
import { filterByLanguage } from "@/utils/filterByLanguage";
import {
  classifyExhibitions,
  sortExhibitionsByDate,
} from "@/components/pages/exhibition/utils/exhibitionDates";

/**
 * useExhibitionListData
 *
 * Fetches exhibitions from /api/exhibition and classifies them
 * into current / past, filtered by language.
 *
 * Returns:
 *   exhibitions        – all language-filtered exhibitions (newest first)
 *   current            – REALLY current exhibitions (newest first)
 *   past               – past exhibitions (newest first)
 *   currentDisplay     – `current`, or — when nothing is current — the single
 *                        newest exhibition, so the Current slot never blanks
 *   pastDisplay        – `past` without that fallback entry (no duplicates)
 *   usingCurrentFallback – true when `currentDisplay` is the fallback
 *   activeTab          – "current" | "past"
 *   setActiveTab       – tab setter
 *   isLoading          – boolean
 *   hasError           – boolean
 *   refetch            – function
 */
export default function useExhibitionListData(isCn) {
  const {
    data: rawData = [],
    isLoading,
    error,
    refetch,
  } = useData("/api/exhibition");

  const [activeTab, setActiveTab] = useState("current");

  // 1. Language filter
  const filtered = useMemo(
    () => filterByLanguage(rawData, isCn),
    [rawData, isCn]
  );

  // 2. Classify into current/past
  const { current: currentByOrder, past: pastByOrder } = useMemo(
    () => classifyExhibitions(filtered),
    [filtered]
  );

  // Both lists re-sorted by year/date (newest first) instead of the `order` field
  const current = useMemo(() => sortExhibitionsByDate(currentByOrder, "desc"), [currentByOrder]);
  const past = useMemo(() => sortExhibitionsByDate(pastByOrder, "desc"), [pastByOrder]);

  // 3. All exhibitions, ordered by year/date — newest first
  const exhibitions = useMemo(() => sortExhibitionsByDate(filtered, "desc"), [filtered]);

  // 4. Current-slot fallback.
  //    When nothing is actually current, the NEWEST exhibition takes the
  //    Current slot so the section (and the home page hero) never go blank.
  //    A real current exhibition always wins. The fallback entry is removed
  //    from Past so the same exhibition never renders twice on one page.
  const newestPast = past[0] || null;
  const usingCurrentFallback = current.length === 0 && Boolean(newestPast);

  const currentDisplay = useMemo(
    () => (usingCurrentFallback ? [newestPast] : current),
    [usingCurrentFallback, newestPast, current]
  );
  const pastDisplay = useMemo(
    () => (usingCurrentFallback ? past.slice(1) : past),
    [usingCurrentFallback, past]
  );

  const handleRetry = useCallback(() => {
    refetch?.();
  }, [refetch]);

  return {
    exhibitions,
    current,
    past,
    currentDisplay,
    pastDisplay,
    usingCurrentFallback,
    activeTab,
    setActiveTab,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message || null,
    refetch: handleRetry,
  };
}
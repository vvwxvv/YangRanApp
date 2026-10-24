// hooks/useResumeData.js
"use client";

import { useContext, useMemo, useCallback } from "react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useData from "@/hooks/useData";
import { filterByLanguage } from "@/utils/filterByLanguage";
import { groupByType } from "@/components/pages/resume/utils/resumeUtils";

/**
 * useResumeData
 * Fetches /api/resume, filters by the current language, and groups the entries
 * by `type` (the section heading) in first-seen order.
 */export default function useResumeData() {
  const { isCn } = useContext(LanguageContext);

  const { data: raw = [], isLoading, error, refetch } = useData("/api/resume");

  const data = useMemo(() => filterByLanguage(raw, isCn), [raw, isCn]);
  const groups = useMemo(() => groupByType(data), [data]);

  const handleRetry = useCallback(() => refetch?.(), [refetch]);

  return {
    isCn,
    data,
    groups,
    isLoading,
    error,
    handleRetry,
    refetch: handleRetry,
  };
}

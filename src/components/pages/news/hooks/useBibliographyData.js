// hooks/useBibliographyData.js
"use client";

import { useContext, useMemo, useCallback } from "react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useData from "@/hooks/useData";
import useFont from '@/hooks/useFont';
import { useReverseTheme } from "@/hooks/useReverseTheme";
import { filterByLanguage } from "@/utils/filterByLanguage";

export default function useBibliographyData() {
  const { isCn } = useContext(LanguageContext);
  const { fontFamily } = useFont();
  const { colors } = useReverseTheme();

  const {
    data: raw = [],
    isLoading,
    error,
    refetch,
  } = useData("/api/bibliography");

  // 按语言过滤
  const filtered = useMemo(() => filterByLanguage(raw, isCn), [raw, isCn]);

  // 按 type 分组
  const groupedByType = useMemo(() => {
    const groups = {};
    for (const item of filtered) {
      const type = item.type?.trim() || "uncategorized";
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    }
    return groups;
  }, [filtered]);

  // 快捷访问常用类型
  const books = useMemo(() => groupedByType["book"] || [], [groupedByType]);
  const articles = useMemo(() => groupedByType["article"] || [], [groupedByType]);
  const videos = useMemo(() => groupedByType["video"] || [], [groupedByType]);

  const handleRetry = useCallback(() => refetch?.(), [refetch]);

  return {
    isCn,
    fontFamily,
    colors,
    data: filtered,
    groupedByType,
    books,
    articles,
    videos,
    isLoading,
    error,
    handleRetry,
    refetch: handleRetry,
  };
}
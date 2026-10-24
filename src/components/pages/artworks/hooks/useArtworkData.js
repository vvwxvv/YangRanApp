"use client";

import { useMemo } from "react";
import useData from "@/hooks/useData";

/** 基于 id 或 _id 去重 */
function uniqueById(arr) {
  const seen = new Set();
  return arr.filter((item) => {
    const id = item?.id ?? item?._id;
    if (!id) return true; // 无 id 则保留（防意外）
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/**
 * useArtworkData — fetches artwork data from API.
 * Matches Prisma Artwork model fields.
 */
const useArtworkData = () => {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useData("/api/artwork/list");

  const artworks = useMemo(() => {
    try {
      if (!Array.isArray(data)) return [];
      // 去重后再返回
      return uniqueById(data);
    } catch (err) {
      console.warn("Error processing artwork data:", err);
      return [];
    }
  }, [data]);

  return {
    artworks,
    isLoading,
    error,
    handleRetry: refetch,
  };
};

export default useArtworkData;
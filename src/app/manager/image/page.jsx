"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { imageManagerConfig } from "@/components/pages/manager/config/collections/imageManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";
import useImageSync from "@/hooks/useImageSync";
import useData from "@/hooks/useData";

/**
 * /manager/image — shared editorial manager layout (Cards + List).
 *
 * The page only owns the “Sync images” action: it scans the other collections
 * for covers that are not yet Image rows, adds them (tag_en / tag_cn filled
 * from the language-split siblings), then refreshes. Everything else — modes,
 * grouping, filters, order / hover shortcuts — comes from the config.
 */
export default function ImageManagerPage() {
  const { isCn } = useContext(LanguageContext);

  const { data: rawImages = [], refetch: refetchImages } = useData("/api/image");
  const { data: rawArtworks = [] } = useData("/api/artwork");
  const { data: rawExhibitions = [] } = useData("/api/exhibition");
  const { data: rawEvents = [] } = useData("/api/event");
  const { data: rawBibliographies = [] } = useData("/api/bibliography");
  const { data: rawSeries = [] } = useData("/api/series");
  const { data: rawAbouts = [] } = useData("/api/about");
  const { data: rawWritings = [] } = useData("/api/writing");

  const syncData = useMemo(
    () => ({
      artwork: Array.isArray(rawArtworks) ? rawArtworks : [],
      exhibition: Array.isArray(rawExhibitions) ? rawExhibitions : [],
      event: Array.isArray(rawEvents) ? rawEvents : [],
      writing: Array.isArray(rawWritings) ? rawWritings : [],
      bibliography: Array.isArray(rawBibliographies) ? rawBibliographies : [],
      series: Array.isArray(rawSeries) ? rawSeries : [],
      about: Array.isArray(rawAbouts) ? rawAbouts : [],
    }),
    [
      rawArtworks,
      rawExhibitions,
      rawEvents,
      rawWritings,
      rawBibliographies,
      rawSeries,
      rawAbouts,
    ]
  );

  const { missingCount, syncing, syncImages } = useImageSync(
    syncData,
    Array.isArray(rawImages) ? rawImages : []
  );

  const handleRefreshImages = useCallback(async () => {
    await syncImages();
    refetchImages?.();
  }, [syncImages, refetchImages]);

  const config = useMemo(
    () => ({
      ...imageManagerConfig,
      // Rendered in the header, next to the Cards / List switch.
      headerActions: [
        {
          key: "syncImages",
          icon: syncing ? Loader2 : missingCount ? RefreshCw : CheckCircle2,
          label: syncing
            ? isCn
              ? "同步中…"
              : "Syncing…"
            : missingCount
            ? isCn
              ? `同步图片 (${missingCount})`
              : `Sync Images (${missingCount})`
            : isCn
            ? "图片已同步"
            : "Images Up To Date",
          notice: syncing
            ? null
            : missingCount === 1
            ? isCn
              ? "有 1 张图片需要同步"
              : "1 image needs syncing"
            : missingCount
            ? isCn
              ? `有 ${missingCount} 张图片需要同步`
              : `${missingCount} images need syncing`
            : null,
          tooltip: missingCount
            ? isCn
              ? "从作品 / 展览 / 艺博会等封面补全缺失的图片并自动填充中英文标签"
              : "Add covers from artwork / exhibition / fair … that are missing in Images, with tag_en / tag_cn filled in"
            : isCn
            ? "所有封面都已在图片库中"
            : "Every cover is already in the Image collection",
          disabled: syncing || missingCount === 0,
          onClick: handleRefreshImages,
        },
      ],
    }),
    [isCn, syncing, missingCount, handleRefreshImages]
  );

  return <EditorialManagerList config={config} />;
}

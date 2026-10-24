"use client";

import React, { useCallback, useMemo } from "react";
import ImageForm from "@/components/forms/ImageForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import useData from "@/hooks/useData";
import { artworkConfig } from "@/components/configs/artworkConfig";
import { eventConfig   } from "@/components/configs/eventConfig";

export default function ImageCreatePage() {
  const { data: artworks = [], isLoading: l1, error: e1, refetch: r1 } =
    useData(artworkConfig?.api?.endpoints?.list);

  const { data: events = [], isLoading: l2, error: e2, refetch: r2 } =
    useData(eventConfig?.api?.endpoints?.list);

  const isLoading = l1 || l2 ;
  const hasError  = !!(e1 || e2 );

  // Build the keyed object that TAG_SOURCE_REGISTRY.dataKey values map to.
  // Keys must exactly match the `dataKey` entries in TAG_SOURCE_REGISTRY.
  const relatedData = useMemo(() => ({
    artwork: artworks,
    event:   events,
  }), [artworks, events]);

  const handleRetry = useCallback(() => {
    r1(); r2();
  }, [r1, r2,]);

  if (isLoading) return <LoadingLayer isLoading={true} />;

  if (hasError) return (
    <AlertInfo
      message="连接失败 | connection failed"
      subMessage="系统不可用 | system unavailable"
      buttonText="重试 | try again"
      onBack={handleRetry}
      isCn={true}
    />
  );

  return <ImageForm relatedData={relatedData} />;
}
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImageEditForm from "@/components/forms/ImageEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import useData from "@/hooks/useData";
import { artworkConfig } from "@/components/configs/artworkConfig";
import { eventConfig }   from "@/components/configs/eventConfig";

export default function EditImagePage({ params }) {
  const router = useRouter();

  const [image,     setImage]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  // ── Fetch the image record ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/image/${id}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setImage(data);
    } catch (err) {
      console.log("Error fetching image:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Fetch relational data for tag picker ────────────────────────────────
  const { data: artworks = [], isLoading: l1, error: e1, refetch: r1 } =
    useData(artworkConfig?.api?.endpoints?.list);

  const { data: events   = [], isLoading: l2, error: e2, refetch: r2 } =
    useData(eventConfig?.api?.endpoints?.list);

  const relatedLoading = l1 || l2;
  const relatedError   = !!(e1 || e2);

  // Keys must exactly match the `dataKey` entries in TAG_SOURCE_REGISTRY
  const relatedData = useMemo(() => ({
    artwork: artworks,
    event:   events,
  }), [artworks,events]);

  const handleRelatedRetry = useCallback(() => {
    r1(); r2();
  }, [r1, r2]);

  // ── Guards ──────────────────────────────────────────────────────────────
  if (isLoading || relatedLoading) {
    return <LoadingLayer isLoading={true} />;
  }

  if (relatedError) {
    return (
      <AlertInfo
        message="连接失败 | connection failed"
        subMessage="系统不可用 | system unavailable"
        buttonText="重试 | try again"
        onBack={handleRelatedRetry}
        isCn={true}
      />
    );
  }

  if (error) {
    return (
      <AlertInfo
        message={error}
        subMessage=""
        buttonText="Back to Images"
        onBack={() => router.push("/manager/image")}
      />
    );
  }

  if (!image) {
    return (
      <AlertInfo
        message="Image not found."
        subMessage=""
        buttonText="Back to Images"
        onBack={() => router.push("/manager/image")}
      />
    );
  }

  return (
    <ImageEditForm
      item={image}
      relatedData={relatedData}
    />
  );
}
"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import VideoPlayer from "@/components/videos/VideoPlayer";
import useFont from '@/hooks/useFont';

// ========================================
// CONSTANTS
// ========================================
const FALLBACK_IMAGE = "/no-image.png";
const ERROR_IMAGE = "/error.png";

const CardMediaPreview = ({
  hasVideo,
  hasImage,
  videoUrl,
  imageUrl,
  altText,
  onPreview,
  isCn,
  // --- Sizing props ---
  useOriginalSize = false,
  customHeight = null,
  customWidth = null,
  maxHeight = 800,
  minHeight = 0,
  objectFit = "cover",
  // Uniform media box — e.g. "4 / 3". When set, the media area keeps a fixed
  // aspect ratio (with `objectFit`) so all cards match regardless of the image.
  aspectRatio = null,
 // When true: disables click, touch, cursor pointer, and hover overlay
  disablePreview = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const { contentFontFamily } = useFont();

  const handleImageError = useCallback(() => {
    setImgError(true);
    setImgLoaded(true);
  }, []);

  const handleImageLoad = useCallback((e) => {
    setImgLoaded(true);
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      setNaturalSize({ width: naturalWidth, height: naturalHeight });
    }
  }, []);

 // Guard: do nothing when preview is disabled
  const handleClick = useCallback(
    (e) => {
      if (disablePreview) return;
      onPreview?.(e);
    },
    [disablePreview, onPreview]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (disablePreview) return;
      e.preventDefault();
      onPreview?.(e);
    },
    [disablePreview, onPreview]
  );

  // ─────────────────────────────────────────────
  // Effective image source
  // ─────────────────────────────────────────────
  const effectiveImageUrl =
    !hasImage || !imageUrl
      ? FALLBACK_IMAGE
      : imgError
        ? ERROR_IMAGE
        : imageUrl;

  const isPlaceholder =
    effectiveImageUrl === FALLBACK_IMAGE || effectiveImageUrl === ERROR_IMAGE;

  // ─────────────────────────────────────────────
  // Container style
  // ─────────────────────────────────────────────
  const computeContainerStyle = () => {
 // cursor: default when preview is disabled, pointer when enabled
    const cursor = disablePreview ? "default" : "pointer";

    if (hasVideo) {
      return { height: "300px", width: "100%", position: "relative", cursor };
    }

    if (useOriginalSize) {
      return {
        width: customWidth || "100%",
        minHeight: minHeight ? `${minHeight}px` : "50px",
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor,
      };
    }

    if (customHeight) {
      return {
        width: customWidth || "100%",
        height: typeof customHeight === "number" ? `${customHeight}px` : customHeight,
        minHeight: minHeight ? `${minHeight}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        position: "relative",
        cursor,
      };
    }

    // Uniform aspect-ratio box (keeps every card the same shape)
    if (aspectRatio) {
      return {
        width: customWidth || "100%",
        aspectRatio,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        position: "relative",
        cursor,
      };
    }

    // Default fixed 300px
    return {
      width: customWidth || "100%",
      height: "300px",
      position: "relative",
      cursor,
    };
  };

  // ─────────────────────────────────────────────
  // Object fit
  // ─────────────────────────────────────────────
  const effectiveObjectFit = isPlaceholder
    ? "contain"
    : useOriginalSize
      ? "contain"
      : objectFit;

  // ─────────────────────────────────────────────
  // Loading skeleton (shared between both modes)
  // ─────────────────────────────────────────────
  const loadingSkeleton = !imgLoaded && (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        zIndex: 1,
      }}
    >
      <span style={{ fontSize: "12px", opacity: 0.4, fontFamily: contentFontFamily }}>
        {isCn ? "加载中…" : "Loading…"}
      </span>
    </div>
  );

  // ─────────────────────────────────────────────
  // Media content
  // ─────────────────────────────────────────────
  const mediaContent = hasVideo ? (
    <VideoPlayer
      url={videoUrl}
      coverImage={hasImage && imageUrl ? imageUrl : ERROR_IMAGE}
    />
  ) : useOriginalSize ? (
    // ── Original-size mode: plain <img> respects natural dimensions ──
    <>
      {loadingSkeleton}
      <img
        src={effectiveImageUrl}
        alt={altText || (isCn ? "图片" : "Image")}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          maxHeight: maxHeight ? `${maxHeight}px` : undefined,
          minHeight: minHeight ? `${minHeight}px` : undefined,
          objectFit: effectiveObjectFit,
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        loading="lazy"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </>
  ) : aspectRatio ? (
    // ── Uniform aspect-ratio box: plain <img> fills the box ──
    <>
      {loadingSkeleton}
      <img
        src={effectiveImageUrl}
        alt={altText || (isCn ? "图片" : "Image")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: effectiveObjectFit,
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        loading="lazy"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </>
  ) : (
    // ── Fixed-size mode: Next.js <Image fill> ──
    <>
      {loadingSkeleton}
      <Image
        src={effectiveImageUrl}
        alt={altText || (isCn ? "图片" : "Image")}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: effectiveObjectFit,
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        loading="lazy"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </>
  );

  return (
    <div
      className="relative overflow-hidden group"
      style={computeContainerStyle()}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    >
      {mediaContent}

      {/*  Hover overlay only rendered when preview is enabled and not a video */}
      {!hasVideo && !disablePreview && (
        <motion.div
          className="absolute inset-0 bg-white/0 group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors duration-200"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        />
      )}
    </div>
  );
};

export default CardMediaPreview;
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Import useRouter
import ImageZoomModal from "../images/ImageZoomModal";
import DividerLine from "@/components/others/DividerLine";
import useAppType from "@/hooks/useAppType";
import useFont from '@/hooks/useFont';
import CardMediaPreview from "@/components/images/CardMediaPreview";
import CardTitleUnderlineAnimation from "@/components/animations/CardTitleUnderlineAnimation";
import ExpandButton from "@/components/buttons/ExpandButton";
import MoreButton from "@/components/buttons/MoreButton";

const ANIMATION_VARIANTS = {
  underline: {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    transition: { type: "spring", stiffness: 300, damping: 20, duration: 0.3 },
  },
  card: {
    hover: { y: -2, transition: { duration: 0.2 } },
  },
  button: {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  },
  fadeIn: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
    transition: { duration: 0.25 },
  },
  expand: {
    initial: { height: 0, opacity: 0 },
    animate: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.25, delay: 0.1 },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  },
};

const DEFAULT_CONFIG = {
  ui: {
    borderStyle: "border-2 border-black dark:border-white",
    shadowStyle: "shadow-md hover:shadow-xl",
    backgroundColor: "bg-white dark:bg-black",
    hoverTransition: "transition-all duration-300 ease-out",
    roundedCorners: "rounded-lg",
    cardHeight: "min-h-[480px] h-auto",
    spacing: { cardPadding: "p-4", cardMargin: "mb-4" },
  },
  typography: {
    title: {
      className: "font-bold text-black dark:text-white",
      style: { fontSize: "18px", lineHeight: "1.4" },
    },
    sub: {
      className: "text-black dark:text-white",
      style: { fontSize: "13px", lineHeight: "1.3" },
    },
  },
  buttons: {
    expand: "p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200",
  },
};

// ============================================================
// Helper function to format field values
// ============================================================
const formatFieldValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (Array.isArray(value)) {
    const filtered = value.filter((item) => item !== null && item !== undefined && item !== "");
    if (filtered.length === 0) return null;

    return filtered.map((item, index) => (
      <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
        <div
          style={{
            width: "3px",
            backgroundColor: "var(--text-primary, #000000)",
            flexShrink: 0,
            minHeight: "1em",
          }}
        />
        <div style={{ flex: 1 }}>{String(item)}</div>
      </div>
    ));
  }

  return String(value);
};

const ExpandInfoCard = ({
  item = {},
  more_url = null,
  fields = [],
  titleField,
  imageKey = "img_url",
  summaryFieldCount = 2,
  isCn = false,
  style = {},
  config = DEFAULT_CONFIG,
  onImageClick,
  onMoreClick, //  Accept parent callback
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isArtistweb = useAppType();
  const { contentFontFamily } = useFont();

  const merged = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
      ui: { ...DEFAULT_CONFIG.ui, ...config.ui },
      typography: { ...DEFAULT_CONFIG.typography, ...config.typography },
    }),
    [config]
  );

  const imageUrl = item[imageKey];
  const hasImage = !!imageUrl;
  const validImageUrl = hasImage ? imageUrl : "/placeholder.png";

  const titleValue = useMemo(() => {
    if (titleField && item[titleField]) return item[titleField];
    const first = fields.find((f) => item[f.key]);
    return first ? item[f.key] : "Untitled";
  }, [titleField, item, fields]);

  const titleFieldKey = useMemo(() => {
    if (titleField) return titleField;
    const firstFieldWithValue = fields.find((f) => item[f.key]);
    return firstFieldWithValue?.key || null;
  }, [titleField, fields, item]);

  const displayFields = useMemo(() => {
    return fields.filter((f) => {
      if (f.key === titleFieldKey) return false;

      const value = item[f.key];

      if (Array.isArray(value)) {
        const filtered = value.filter((item) => item !== null && item !== undefined && item !== "");
        return filtered.length > 0;
      }

      return value !== null && value !== undefined && value !== "";
    });
  }, [fields, titleFieldKey, item]);

  const handlePreview = useCallback(
    (e) => {
      e.stopPropagation();
      if (onImageClick) onImageClick(validImageUrl);
      else setShowPreview(true);
    },
    [validImageUrl, onImageClick]
  );

  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleMoreClick = useCallback((e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    
 // Use parent callback if provided, otherwise fallback to router
    if (onMoreClick) {
      onMoreClick(e);
    } else if (more_url) {
      router.push(more_url);
    }
  }, [more_url, router, onMoreClick]);

  return (
    <>
      <motion.div
        className={` 
          ${merged.ui.backgroundColor}
          ${merged.ui.borderStyle}
          ${merged.ui.shadowStyle}
          ${merged.ui.hoverTransition}
          ${merged.ui.roundedCorners}
          ${merged.ui.cardHeight}
          ${merged.ui.spacing.cardMargin}
          overflow-hidden relative cursor-pointer flex flex-col
        `}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={ANIMATION_VARIANTS.card.hover}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Media - Image */}
        <CardMediaPreview
          hasVideo={false}
          hasImage={hasImage}
          videoUrl={null}
          imageUrl={validImageUrl}
          altText={titleValue}
          onPreview={handlePreview}
          isCn={isCn}
        />

        <div className={`${merged.ui.spacing.cardPadding} flex flex-col flex-grow relative`}>
          {/* Title with underline animation */}
          <div
            className="relative mb-3 inline-block w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CardTitleUnderlineAnimation
              title={titleValue}
              isHovered={isHovered}
            />
          </div>

          {/* Summary Row */}
          <div
            className="flex items-center gap-2 flex-wrap mb-3 text-black dark:text-white"
            style={{ ...merged.typography.sub.style, fontFamily: contentFontFamily }}
          >
            {displayFields.slice(0, summaryFieldCount).map((f, index, arr) => {
              const value = formatFieldValue(item[f.key]);
              if (!value) return null;

              return (
                <React.Fragment key={f.key}>
                  <span>{value}</span>
                  {index < arr.length - 1 && index < summaryFieldCount - 1 && (
                    <span className="text-gray-400"> / </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Expanded Section */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                variants={ANIMATION_VARIANTS.expand}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mb-4"
              >
                <DividerLine />
                <div className="max-h-64 overflow-y-auto pr-2">
                  {displayFields.slice(summaryFieldCount).map((f) => {
                    const value = formatFieldValue(item[f.key]);
                    if (!value) return null;

                    return (
                      <motion.div
                        key={f.key}
                        className="text-black dark:text-white mb-2"
                        style={{ fontSize: "12px", fontFamily: contentFontFamily }}
                        variants={ANIMATION_VARIANTS.fadeIn}
                      >
                        <div>{value}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand Button - Centered */}
          {displayFields.length > summaryFieldCount && (
            <div className="flex justify-center mb-2" onClick={(e) => e.stopPropagation()}>
              <ExpandButton expanded={expanded} isCn={isCn} onToggle={handleToggleExpand} />
            </div>
          )}
        </div>

        {/*  Enhanced +More Button with Touch Optimization */}
        {more_url && (
          <div
            onClick={handleMoreClick}
            onTouchEnd={handleMoreClick}
            style={{
              position: "absolute",
              right: "8px",
              bottom: "8px",
 // Expanded touch target (minimum 44x44px for accessibility)
              minWidth: "44px",
              minHeight: "44px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
 // Touch optimization
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              cursor: "pointer",
              userSelect: "none",
 // Ensure button is above other elements
              zIndex: 10,
            }}
            role="button"
            tabIndex={0}
            aria-label={isCn ? "查看更多" : "View more"}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMoreClick(e);
              }
            }}
          >
            <MoreButton url={more_url} />
          </div>
        )}
      </motion.div>

      {/* Image Modal */}
      <ImageZoomModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        imageUrl={validImageUrl}
        title={titleValue}
        enableGifRestart
      />
    </>
  );
};

export default React.memo(ExpandInfoCard);
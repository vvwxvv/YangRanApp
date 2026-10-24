"use client";

import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Box, Container, Typography, Stack, Divider } from "@mui/material";
import { motion } from "framer-motion";

import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from "@/hooks/useFont";
import useData from "@/hooks/useData";

import AlertInfo from "@/components/alerts/AlertInfo";
import LoadingAnimation from "@/components/animations/LoadingAnimation";
import CoverImage from "@/components/images/CoverImage";
import ImageZoomModal from "@/components/images/ImageZoomModal";

import useArtworkSlugData from "@/components/pages/artworks/hooks/useArtworkSlugData";
import { filterByLanguage } from "@/utils/filterByLanguage";
import { artworkYear, compareByYearThenTitle } from "@/utils/artworkOrder";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// Single source of truth for typography / spacing / colour of the whole page.
// Layout is ported from the YingXinXun artwork-detail page (single centred
// column: series label → cover → text metadata → gallery → related works),
// fed by HuJiemingApp's Prisma models (Artwork / Image).
// ─────────────────────────────────────────────────────────────────────────────
const TOKENS = {
  fontSize: {
    title: { mobile: "18px", desktop: "22px" },
    body: { mobile: "12px", desktop: "13px" },
    label: { mobile: "11px", desktop: "11px" },
    meta: { mobile: "11px", desktop: "12px" },
  },
  fontWeight: {
    title: 400,
    body: 400,
    bodyBold: 500,
    label: 500,
  },
  lineHeight: {
    title: 1.35,
    body: 1.7,
  },
  letterSpacing: {
    cn: "0.01em",
    en: "0.02em",
  },
  opacity: {
    body: 0.85,
    caption: 0.8,
    label: 0.5,
    sectionLabel: 0.4,
  },
  gap: {
    innerPair: "3px",
    rowMobile: "10px",
    rowDesktop: "14px",
    sectionMobile: "14px",
    sectionDesktop: "20px",
    textBlock: "8px",
  },
  divider: {
    myMobile: "14px",
    myDesktop: "18px",
  },
  gallery: {
    topGap: "50px",
    columns: { xs: 2, sm: 3, md: 3 },
    gap: { xs: "10px", sm: "14px", md: "18px" },
  },
  related: {
    topGap: "60px",
    columns: { xs: 2, sm: 3, md: 4 },
    gap: { xs: "16px", md: "24px" },
  },
};

const FALLBACK_IMAGE = "/no-image.png";
const RELATED_PAGE_SIZE = 8;
const ZOOM_CONFIG = { STEP: 0.1, MIN: 1, MAX: 3 };

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Slug generator — MUST match the one the listing pages build links from. */
const makeArtworkSlug = (text = "") =>
  String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

/** An Image belongs to an Artwork when its tag matches the artwork title. */
const imageMatchesArtwork = (image, artwork) => {
  if (!image || !artwork) return false;
  const title = normalizeText(artwork.title);
  if (!title) return false;
  return (
    normalizeText(image.tag_en) === title ||
    normalizeText(image.tag_cn) === title
  );
};

/** De-duplicate images by URL, keeping first occurrence + input order. */
const uniqueByUrl = (list = []) => {
  const seen = new Set();
  return (Array.isArray(list) ? list : []).filter((item) => {
    const url = item?.img_url || item?.url;
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
};

const sameArtwork = (a, b) => {
  if (!a || !b) return false;
  const aId = a.id || a._id;
  const bId = b.id || b._id;
  if (aId && bId) return String(aId) === String(bId);
  return (
    normalizeText(a.title) === normalizeText(b.title) &&
    String(a.year || "") === String(b.year || "")
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 0 ── Series label (above the cover), matching the YXX layout
// ─────────────────────────────────────────────────────────────────────────────
const SeriesLabel = ({ artwork, contentFontFamily, color }) => {
  const { isCn } = useContext(LanguageContext);
  const series = artwork?.series;
  if (!series) return null;

  return (
    <Box
      sx={{
        mb: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "2px",
      }}
    >
      {/* Thin decorative rule */}
      <Box
        sx={{
          width: "28px",
          height: "1px",
          background: color,
          opacity: 0.25,
          mb: "8px",
        }}
      />
      <Typography
        sx={{
          fontFamily: contentFontFamily,
          fontSize: "11px",
          fontWeight: TOKENS.fontWeight.label,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color,
          opacity: 0.5,
          lineHeight: 1.4,
        }}
      >
        &ldquo;{series}&rdquo;&nbsp;{isCn ? "系列" : "SERIES"}
      </Typography>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 1 ── Text metadata block (title / meta rows / caption / introduction)
// ─────────────────────────────────────────────────────────────────────────────
const ArtworkMeta = ({ artwork, titleFontFamily, contentFontFamily, color, isMobile, dividerColor }) => {
  const { isCn } = useContext(LanguageContext);
  const T = TOKENS;
  const bp = isMobile ? "mobile" : "desktop";

  const rowGap = isMobile ? T.gap.rowMobile : T.gap.rowDesktop;
  const sectionGap = isMobile ? T.gap.sectionMobile : T.gap.sectionDesktop;

  const baseText = {
    fontFamily: contentFontFamily,
    fontSize: T.fontSize.body[bp],
    lineHeight: T.lineHeight.body,
    letterSpacing: isCn ? T.letterSpacing.cn : T.letterSpacing.en,
    color,
    fontWeight: T.fontWeight.body,
    opacity: T.opacity.body,
    margin: 0,
  };

  const labelText = {
    ...baseText,
    fontSize: T.fontSize.label[bp],
    opacity: T.opacity.label,
  };

  // Rows shown as an unlabeled stack (values only) — same as the YXX detail.
  const metaRows = [artwork.type, artwork.medium, artwork.size, artwork.duration, artwork.year].filter(
    Boolean
  );

  // Labeled details — HuJieming-only Prisma fields.
  const detailRows = [
    { label: isCn ? "致谢" : "Credits", value: artwork.credits },
    { label: isCn ? "特别感谢" : "Special Thanks", value: artwork.special_thanks },
    { label: isCn ? "作品价值" : "Work Value", value: artwork.work_value },
    { label: isCn ? "状态" : "Status", value: artwork.sold },
  ].filter((row) => row.value);

  const introParas = Array.isArray(artwork.introduction)
    ? artwork.introduction.filter(Boolean)
    : artwork.introduction
    ? [artwork.introduction]
    : [];

  const hasCaption = !!artwork.caption;
  const hasIntro = introParas.length > 0;

  const withBreaks = (value) =>
    typeof value === "string" ? value.replace(/\\n/g, "\n") : value;

  return (
    <Box sx={{ mt: "20px", px: 0, background: "transparent" }}>
      {/* ── Title ── */}
      <Box sx={{ mb: sectionGap }}>
        <Typography
          sx={{
            fontFamily: titleFontFamily,
            fontSize: T.fontSize.title[bp],
            fontWeight: T.fontWeight.title,
            lineHeight: T.lineHeight.title,
            letterSpacing: isCn ? T.letterSpacing.cn : T.letterSpacing.en,
            color,
            fontStyle: "italic",
          }}
        >
          {artwork.title || (isCn ? "无题" : "Untitled")}
        </Typography>
      </Box>

      {/* ── Metadata rows ── */}
      {metaRows.length > 0 && (
        <>
          <Stack spacing={rowGap}>
            {metaRows.map((value, i) => (
              <Typography key={i} sx={baseText}>
                {withBreaks(value)}
              </Typography>
            ))}
          </Stack>

          {(hasCaption || hasIntro || detailRows.length > 0) && (
            <Divider
              sx={{
                my: isMobile ? T.divider.myMobile : T.divider.myDesktop,
                borderColor: dividerColor,
              }}
            />
          )}
        </>
      )}

      {/* ── Caption ── */}
      {hasCaption && (
        <Box sx={{ mb: hasIntro || detailRows.length > 0 ? sectionGap : 0 }}>
          <Typography sx={{ ...baseText, whiteSpace: "pre-line", opacity: T.opacity.caption }}>
            {withBreaks(artwork.caption)}
          </Typography>
        </Box>
      )}

      {/* ── Introduction paragraphs ── */}
      {hasIntro && (
        <Stack spacing={T.gap.textBlock}>
          {introParas.map((para, i) => (
            <Typography key={i} sx={{ ...baseText, whiteSpace: "pre-line" }}>
              {withBreaks(para)}
            </Typography>
          ))}
        </Stack>
      )}

      {/* ── Labeled details (credits / special thanks / value / status) ── */}
      {detailRows.length > 0 && (
        <Box sx={{ mt: hasCaption || hasIntro ? sectionGap : 0, display: "flex", flexDirection: "column", gap: "6px" }}>
          {detailRows.map((row, i) => (
            <Box key={i} sx={{ display: "flex", gap: "12px" }}>
              <Typography sx={{ ...labelText, minWidth: isMobile ? "70px" : "90px", flexShrink: 0 }}>
                {row.label}
              </Typography>
              <Typography sx={{ ...baseText, whiteSpace: "pre-line" }}>
                {withBreaks(row.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* ── External links ── */}
      {(artwork.video_url || artwork.web_url) && (
        <Box sx={{ display: "flex", gap: "16px", mt: `${sectionGap}` }}>
          {artwork.video_url && (
            <Link
              href={artwork.video_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: contentFontFamily,
                fontSize: T.fontSize.label[bp],
                color: "#999999",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999999")}
            >
              {isCn ? "视频" : "Video"}
            </Link>
          )}
          {artwork.web_url && (
            <Link
              href={artwork.web_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: contentFontFamily,
                fontSize: T.fontSize.label[bp],
                color: "#999999",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999999")}
            >
              {isCn ? "网站" : "Website"}
            </Link>
          )}
        </Box>
      )}
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2 ── Gallery (this artwork's matched Image rows, natural-height masonry)
// ─────────────────────────────────────────────────────────────────────────────
const ArtworkGallery = ({ images = [], title = "", onImageClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  if (!images.length) return null;
  const G = TOKENS.gallery;

  return (
    <Box sx={{ mt: G.topGap }}>
      <Box sx={{ columnCount: G.columns, columnGap: G.gap }}>
        {images.map((image, index) => {
          const url = image?.img_url || image?.url;
          if (!url) return null;
          return (
            <Box
              key={image?.id || image?._id || url || index}
              onClick={() => onImageClick?.(image)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              sx={{ breakInside: "avoid", mb: G.gap, cursor: "pointer", display: "block" }}
            >
              <Box
                component="img"
                src={url}
                alt={title ? `${title} – ${index + 1}` : `Image ${index + 1}`}
                loading="lazy"
                sx={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  opacity: hoveredIndex === index ? 0.8 : 1,
                  transition: "opacity 0.28s ease",
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3 ── Other artworks (same year first, then newest → oldest)
// ─────────────────────────────────────────────────────────────────────────────
const RelatedWorkCard = ({ artwork, isMobile, contentFontFamily, color }) => {
  const [hovered, setHovered] = useState(false);
  const slug = makeArtworkSlug(artwork.title);
  const href = slug ? `/artworks/${slug}` : "#";

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <Box
        sx={{
          width: "100%",
          aspectRatio: "4 / 3",
          overflow: "hidden",
          backgroundColor: "rgba(0,0,0,0.03)",
        }}
      >
        {artwork.cover_image_url || artwork.cover_img_url ? (
          <Box
            component="img"
            src={artwork.cover_image_url || artwork.cover_img_url}
            alt={artwork.title || ""}
            loading="lazy"
            decoding="async"
            sx={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: hovered ? 0.82 : 1,
              transition: "opacity 0.3s ease",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontFamily: contentFontFamily, fontSize: "11px", color, opacity: 0.3, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              No Image
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          mt: "10px",
          px: "2px",
          textAlign: "center",
          color,
          opacity: hovered ? 1 : 0.72,
          transition: "opacity 0.2s ease",
        }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: contentFontFamily,
            fontSize: isMobile ? "11px" : "12px",
            color: "inherit",
            lineHeight: 1.45,
            display: "inline",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-2px",
              left: 0,
              width: hovered ? "100%" : "0%",
              height: "1px",
              backgroundColor: "currentColor",
              transition: "width 0.3s ease-in-out",
            },
          }}
        >
          {artwork.title || "Untitled"}
          {artwork.year ? ` (${artwork.year})` : ""}
        </Typography>
      </Box>
    </Link>
  );
};

const RelatedWorks = ({
  items = [],
  isMobile,
  contentFontFamily,
  color,
  dividerColor,
  page = 0,
  totalPages = 1,
  onPrev,
  onNext,
}) => {
  const { isCn } = useContext(LanguageContext);
  if (!items.length) return null;
  const R = TOKENS.related;
  const navButtonStyle = {
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    fontFamily: contentFontFamily,
    fontSize: "13px",
    color,
    cursor: "pointer",
    opacity: 0.9,
    transition: "opacity 0.2s ease",
  };

  return (
    <Box sx={{ mt: R.topGap }}>
      <Divider sx={{ mb: "18px", borderColor: dividerColor }} />

      {/* Same header language as the reference: back link left, prev/next right. */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          mb: "28px",
          color,
          fontFamily: contentFontFamily,
          fontSize: "12px",
        }}
      >
        <Link
          href="/artworks"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {isCn ? "返回作品" : "Back to Artworks"}
        </Link>

        <Box sx={{ display: "flex", alignItems: "center", gap: "24px", opacity: 0.95 }}>
          <button
            type="button"
            onClick={onPrev}
            disabled={page <= 0}
            aria-label={isCn ? "上一页" : "Previous artworks"}
            style={{ ...navButtonStyle, opacity: page <= 0 ? 0.25 : 0.9 }}
          >
            &lt;&lt;&lt;
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={page >= totalPages - 1}
            aria-label={isCn ? "下一页" : "Next artworks"}
            style={{ ...navButtonStyle, opacity: page >= totalPages - 1 ? 0.25 : 0.9 }}
          >
            &gt;&gt;&gt;
          </button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
          columnGap: R.gap,
          rowGap: isMobile ? "26px" : "34px",
        }}
      >
        {items.map((item, i) => (
          <RelatedWorkCard
            key={item.id || item._id || i}
            artwork={item}
            isMobile={isMobile}
            contentFontFamily={contentFontFamily}
            color={color}
          />
        ))}
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Loading — full-screen loading animation (never a blank screen)
// ─────────────────────────────────────────────────────────────────────────────
function ArtworkDetailLoading({ bg }) {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: bg || "#ffffff",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingAnimation isLoading />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function ArtworkDetailPageComponent({
  // An already-resolved artwork can be passed in (back-compat) …
  artwork: artworkProp = null,
  // … otherwise the page resolves it from a slug itself.
  slug = "",
  artworkSlug = "",
  loading = false,
  error = null,
  onRetry,
}) {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { contentTitleFontFamily: titleFontFamily, contentFontFamily } = useFont();
  const { colors, isDark } = useReverseTheme();

  const text = colors.text;
  const bg = colors.background;
  const dividerColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.10)";

  const targetSlug = slug || artworkSlug;

  // ── Resolve the artwork (fetch only when nothing was passed in) ──
  const {
    artwork: fetchedArtwork,
    loading: fetchingArtwork,
    error: fetchError,
    notFound,
  } = useArtworkSlugData(targetSlug, isCn);

  const artwork = artworkProp || fetchedArtwork;

  // ── Supporting collections (gallery images + related works) ──
  const { data: allImages = [] } = useData("/api/image");
  const { data: allArtworks = [] } = useData("/api/artwork");

  const galleryImages = useMemo(() => {
    if (!artwork) return [];
    const matched = (Array.isArray(allImages) ? allImages : []).filter((img) =>
      imageMatchesArtwork(img, artwork)
    );
    return uniqueByUrl(matched);
  }, [allImages, artwork]);

  const relatedWorks = useMemo(() => {
    if (!artwork) return [];
    const currentYear = artworkYear(artwork);
    const list = filterByLanguage(allArtworks, isCn).filter(
      (item) => !sameArtwork(item, artwork)
    );

    // Other works are year-led: same year first, then newest → oldest.
    list.sort((a, b) => {
      const aSame = currentYear && artworkYear(a) === currentYear ? 0 : 1;
      const bSame = currentYear && artworkYear(b) === currentYear ? 0 : 1;
      if (aSame !== bSame) return aSame - bSame;
      return compareByYearThenTitle(a, b);
    });

    return list;
  }, [allArtworks, artwork, isCn]);

  const [relatedPage, setRelatedPage] = useState(0);

  useEffect(() => {
    setRelatedPage(0);
  }, [artwork?.id, artwork?._id]);

  const relatedTotalPages = Math.max(
    1,
    Math.ceil(relatedWorks.length / RELATED_PAGE_SIZE)
  );
  const pagedRelatedWorks = useMemo(
    () =>
      relatedWorks.slice(
        relatedPage * RELATED_PAGE_SIZE,
        relatedPage * RELATED_PAGE_SIZE + RELATED_PAGE_SIZE
      ),
    [relatedWorks, relatedPage]
  );

  // ── Zoom modal state ──
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleImageClick = useCallback((imageOrUrl) => {
    let url;
    if (typeof imageOrUrl === "string") url = imageOrUrl;
    else if (imageOrUrl?.url || imageOrUrl?.img_url) url = imageOrUrl.url || imageOrUrl.img_url;
    else return;
    setSelectedImage(url);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedImage(null);
    setZoomLevel(1);
  }, []);

  const handleImageWheel = useCallback((event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -ZOOM_CONFIG.STEP : ZOOM_CONFIG.STEP;
    setZoomLevel((prev) => Math.max(ZOOM_CONFIG.MIN, Math.min(ZOOM_CONFIG.MAX, prev + delta)));
  }, []);

  // ── Guards ──
  const isLoading = loading || (!artworkProp && targetSlug ? fetchingArtwork : false);
  const activeError = error || (!artworkProp && targetSlug ? fetchError : null);
  const isMissing = !artworkProp && targetSlug && notFound;

  if (isLoading) return <ArtworkDetailLoading bg={bg} />;

  if (activeError) {
    return (
      <AlertInfo
        message={isCn ? "加载失败" : "Loading Failed"}
        subMessage={isCn ? "请重试" : "Please retry"}
        buttonText={isCn ? "重试" : "Retry"}
        onBack={onRetry || (() => window.location.reload())}
        isCn={isCn}
      />
    );
  }

  if (!artwork || isMissing) {
    return (
      <Box sx={{ backgroundColor: bg, color: text, minHeight: "100vh", py: 8, textAlign: "center" }}>
        <Typography sx={{ fontFamily: contentFontFamily, fontSize: "14px", opacity: 0.4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {isCn ? "未找到作品" : "Artwork not found"}
        </Typography>
      </Box>
    );
  }

  const coverImageUrl = artwork.cover_image_url || artwork.cover_img_url || galleryImages[0]?.img_url || galleryImages[0]?.url || FALLBACK_IMAGE;
  const artworkTitle = artwork.title || (isCn ? "无题" : "Untitled");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: bg,
        color: text,
        pt: 0,
        pb: 6,
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ px: "20px", mt: 0 }} style={{ paddingLeft: 20, paddingRight: 20 }}>
        {/* 0 ── Series label */}
        <SeriesLabel artwork={artwork} contentFontFamily={contentFontFamily} color={text} />

        {/* 1 ── Cover image */}
        <CoverImage
          coverImageUrl={coverImageUrl}
          alt={artworkTitle}
          title={artworkTitle}
          zoomLevel={zoomLevel}
          onImageClick={() => handleImageClick(coverImageUrl)}
          onWheel={handleImageWheel}
          isSmallScreen={isMobile}
        />

        {/* 2 ── Text metadata */}
        <ArtworkMeta
          artwork={artwork}
          titleFontFamily={titleFontFamily}
          contentFontFamily={contentFontFamily}
          color={text}
          isMobile={isMobile}
          dividerColor={dividerColor}
        />

        {/* 3 ── Gallery of matched images */}
        <ArtworkGallery
          images={galleryImages}
          title={artworkTitle}
          onImageClick={handleImageClick}
        />

        {/* 4 ── Related works (same series) */}
        <RelatedWorks
          items={pagedRelatedWorks}
          isMobile={isMobile}
          contentFontFamily={contentFontFamily}
          color={text}
          dividerColor={dividerColor}
          page={relatedPage}
          totalPages={relatedTotalPages}
          onPrev={() => setRelatedPage((p) => Math.max(0, p - 1))}
          onNext={() => setRelatedPage((p) => Math.min(relatedTotalPages - 1, p + 1))}
        />

        {/* Zoom modal */}
        <ImageZoomModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          imageUrl={selectedImage || ""}
          title={artworkTitle}
          enableGifRestart={true}
        />
      </Container>
    </Box>
  );
}

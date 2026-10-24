"use client";

import React, { useContext, useMemo, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

// Context & Hooks
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import useFont from '@/hooks/useFont';
import useImageZoom from "@/hooks/useImageZoom";
import useExhibitionDetailData from "@/components/pages/exhibition/hooks/useExhibitionDetailData";
import { useReverseTheme } from "@/hooks/useReverseTheme";

// Alerts / states
import ErrorState from "@/components/alerts/ErrorState";
import FormAlert from "@/components/alerts/FormAlert";
import NoDataInfo from "@/components/alerts/NoDataInfo";
import LoadingAnimation from "@/components/animations/LoadingAnimation";

// Images
import ImageZoomModal from "@/components/images/ImageZoomModal";

// ============================================================
// SHARED SIZE
//   Body-family text size — matches the About page body (12px).
//   Intro / description / caption / artists / preface / metadata
//   values all route through this. Change here, they all follow.
//   (Title / Subtitle / Date keep their own larger sizes on purpose,
//    so the page still has a visual hierarchy.)
// ============================================================
const BODY_TEXT_SIZE = "12px";

// ============================================================
// TEXT / TYPOGRAPHY CONFIG — tune every piece of text here
// ------------------------------------------------------------
//  QUICK MAP:
//    • Big page title            → TITLE            (26/22, unchanged)
//    • Subtitle / Date           → SUBTITLE / DATE  (kept for hierarchy)
//    • Section labels            → SECTION_HEADING  ▸ News font family,
//        15px, light weight (see note below)
//    • Body copy / caption       → BODY_TEXT_SIZE (12px, About body)
//    • Nav tabs                  → NAV_TAB          (small anchors, unchanged)
//    • Metadata field labels     → METADATA_LABEL   (micro-label, unchanged)
//
//  color: null falls back to BASE_COLOR → theme text.
// ============================================================
const TEXT_CONFIG = {
  BASE_COLOR: null,

  NAV_TAB: {
    role: "detailMetaLabel",
    fontSizeDesktop: "13px",
    fontSizeMobile: "12px",
    fontWeight: 500,
    color: null,
    opacity: 0.55,
    activeOpacity: 1,
    letterSpacing: "0.02em",
    lineHeight: 1.4,
  },

  TITLE: {
    role: "detailTitle",
    fontSizeDesktop: "26px",
    fontSizeMobile: "22px",
    fontWeight: 500,
    color: null,
    opacity: 1,
    letterSpacing: "0.01em",
    lineHeight: 1.3,
    marginBottom: 16,
    italicizeBeforeColon: true,
  },

  ARTISTS_LINE: {
    role: "detailMetaValue",
    fontSizeDesktop: BODY_TEXT_SIZE, // → 12px (was 14/13)
    fontSizeMobile: BODY_TEXT_SIZE,
    fontWeight: 400,
    color: null,
    opacity: 0.85,
    letterSpacing: "0em",
    lineHeight: 1.6,
    marginBottom: 4,
  },

  PREFACE_LINE: {
    role: "detailMetaValue",
    fontSizeDesktop: BODY_TEXT_SIZE, // → 12px (was 14/13)
    fontSizeMobile: BODY_TEXT_SIZE,
    fontWeight: 400,
    color: null,
    opacity: 0.85,
    letterSpacing: "0em",
    lineHeight: 1.6,
    marginBottom: 0,
  },

  SUBTITLE: {
    role: "detailSubtitle",
    fontSizeDesktop: "16px", // kept — hierarchy
    fontSizeMobile: "15px",
    fontWeight: 400,
    color: null,
    opacity: 0.7,
    letterSpacing: "0em",
    lineHeight: 1.5,
    marginBottom: 8,
  },

  DATE: {
    role: "detailDate",
    fontSizeDesktop: "14px", // kept — hierarchy
    fontSizeMobile: "13px",
    fontWeight: 600,
    color: null,
    opacity: 0.9,
    letterSpacing: "0.02em",
    lineHeight: 1.5,
    marginBottom: 0,
  },

  COVER_CAPTION: {
    role: "detailCaption",
    fontSizeDesktop: BODY_TEXT_SIZE, // → 12px (was 13/12)
    fontSizeMobile: BODY_TEXT_SIZE,
    fontWeight: 400,
    color: null,
    opacity: 0.5,
    letterSpacing: "0em",
    lineHeight: 1.5,
    italic: true,
    marginBottom: 0,
  },

  INTRO: {
    role: "detailBody",
    fontSizeDesktop: BODY_TEXT_SIZE, // → 12px (was 14)
    fontSizeMobile: BODY_TEXT_SIZE,
    fontWeight: 400,
    color: null,
    opacity: 0.85,
    letterSpacing: "0em",
    lineHeight: 1.8,
    textAlign: "justify",
    marginBottom: 16,
  },

  DESCRIPTION: {
    role: "detailBody",
    fontSizeDesktop: BODY_TEXT_SIZE, // → 12px (was 14)
    fontSizeMobile: BODY_TEXT_SIZE,
    fontWeight: 400,
    color: null,
    opacity: 0.85,
    letterSpacing: "0em",
    lineHeight: 1.8,
    textAlign: "justify",
    marginBottom: 16,
  },

  // ▸▸ SECTION LABELS ("Works" / "Related Artists") ◂◂
  //   Font family comes from `labelFont` (useFont() no-role) in the
  //   component, overriding `role` below — same family as the News
  //   page heading.
  //   Size is intentionally smaller than the News heading (15px, not
  //   25px) and light-weight (300) rather than bold, so these read as
  //   quiet section dividers rather than competing with the page title.
  //   ↩ To restore the old micro-divider look: fontSize 11/11, fontWeight
  //     700, letterSpacing "0.15em", opacity 0.6, textTransform "uppercase".
  SECTION_HEADING: {
    fontSizeDesktop: "15px",
    fontSizeMobile: "15px",
    fontWeight: 300,          // thin/light — not bold
    lineHeight: "normal",
    letterSpacing: "0.01em",
    color: "theme",
    opacity: 1,
  },

  ARTIST_LINK: {
    role: "detailLink",
    fontSizeDesktop: "15px",
    fontSizeMobile: "13px",
    fontWeight: 400,
    color: null,
    idleOpacity: 0.75,
    hoverOpacity: 1,
    lineHeight: 1.5,
  },

  METADATA_LABEL: {
    role: "detailMetaLabel",
    fontSizeDesktop: "12px",
    fontSizeMobile: "12px",
    fontWeight: 500,
    color: null,
    opacity: 0.45,
    letterSpacing: "0.12em",
    lineHeight: 1.5,
    textTransform: "uppercase",
  },

  METADATA_VALUE: {
    role: "detailMetaValue",
    fontSizeDesktop: BODY_TEXT_SIZE, // → 12px (was 15)
    fontSizeMobile: BODY_TEXT_SIZE,
    fontWeight: 400,
    color: null,
    opacity: 0.9,
    letterSpacing: "0em",
    lineHeight: 1.6,
  },
};

// ============================================================
// LAYOUT / SPACING CONFIG — all gaps between sections (px)
// ============================================================
const LAYOUT_CONFIG = {
  NAV_MB_DESKTOP: 40,
  NAV_MB_MOBILE: 28,

  INSTALLATION_MB_DESKTOP: 56,
  INSTALLATION_MB_MOBILE: 32,

  HEADER_MB_DESKTOP: 40,
  HEADER_MB_MOBILE: 28,

  COVER_MB_DESKTOP: 64,
  COVER_MB_MOBILE: 40,

  BODY_MT: 8,
  BODY_BLOCK_GAP: 32,
  PARA_TO_IMAGE_GAP: 8,

  DOWNLOAD_BUTTON_MT: 24,

  VIDEO_MT: 48,
  VIDEO_MB: 48,

  WORKS_MT_DESKTOP: 72,
  WORKS_MT_MOBILE: 56,
  RELATED_ARTISTS_MT: 56,

  METADATA_MT_DESKTOP: 80,
  METADATA_MT_MOBILE: 64,
  METADATA_PT_DESKTOP: 40,
  METADATA_PT_MOBILE: 32,
  METADATA_ROW_PY_DESKTOP: 20,
  METADATA_ROW_PY_MOBILE: 16,
  METADATA_LABEL_MINWIDTH: 200,
};

// ============================================================
// INSTALLATION VIEWS ROW — up to 3 images shown at the very
// top of the page (randomly picked from the gallery images each
// time the exhibition's image set changes).
// ============================================================
const INSTALLATION_CONFIG = {
  MAX_IMAGES: 3,
  GAP_DESKTOP: 16,
  GAP_MOBILE: 8,
  ASPECT_RATIO: "4/3",
  COLUMNS_MOBILE: 1,
};

// ============================================================
// WORKS GRID — full matched-artwork grid at the bottom,
// styled to match the "Related Artworks" grid on the artist
// detail page: image, then artist name / italic title, year.
// ============================================================
const WORKS_GRID_CONFIG = {
  GRID_MODE_DESKTOP: "fixed",
  GRID_COLUMNS_DESKTOP: 4,
  GRID_MIN_COLUMN_WIDTH_DESKTOP: 250,

  GRID_MODE_MOBILE: "fixed",
  GRID_COLUMNS_MOBILE: 2,
  GRID_MIN_COLUMN_WIDTH_MOBILE: 150,

  GRID_GAP: 14,
  GRID_ROW_GAP: null,
  GRID_COLUMN_GAP: null,

  IMAGE_TO_TEXT_GAP: "12px",
  CARD_FONT_SIZE_DESKTOP: "12px",
  CARD_FONT_SIZE_MOBILE: "11px",
  CARD_LETTER_SPACING: "0.02em",
  CARD_LINE_HEIGHT: 1.5,
  CARD_META_OPACITY: 0.5,
  HOVER_SCALE: 1.03,
  UNDERLINE_DURATION: 0.25,
};

// ============================================================
// LOADING SCREEN CONFIG — while data is in flight we render a
// completely blank white screen. Deliberately hardcoded (not
// theme-derived) so the loading state never accidentally renders
// black/dark regardless of what useReverseTheme() resolves to.
// ============================================================
const LOADING_CONFIG = {
  BG_COLOR: "#ffffff",
};

// ============================================================
// CONSTANTS & HELPERS
// ============================================================
const FALLBACK_IMAGE = "/no-image.png";

function formatSimpleDateRange(start, end) {
  if (!start && !end) return "";
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

function extractParagraphs(content) {
  if (!content) return [];

  const splitLines = (str) =>
    str
      .split(/\r?\n+/)
      .map((s) => s.trim())
      .filter(Boolean);

  if (Array.isArray(content)) {
    return content.flatMap((item) =>
      typeof item === "string" ? splitLines(item) : []
    );
  }

  if (typeof content === "string") {
    return splitLines(content);
  }

  return [];
}

function pickResponsive(cfg, isMobile, key = "fontSize") {
  const d = cfg[`${key}Desktop`];
  const m = cfg[`${key}Mobile`];
  if (d != null || m != null) {
    return isMobile ? m ?? d : d ?? m;
  }
  return cfg[key];
}

function resolveColor(cfg, themeText) {
  return cfg.color || TEXT_CONFIG.BASE_COLOR || themeText;
}

function resolveFont(cfg, fonts) {
  return (cfg.role && fonts[cfg.role]) || fonts.detailBody;
}

function textSx(cfg, ctx) {
  const sx = {
    fontFamily: resolveFont(cfg, ctx.fonts),
    fontSize: pickResponsive(cfg, ctx.isMobile, "fontSize"),
    fontWeight: cfg.fontWeight,
    color: resolveColor(cfg, ctx.themeText),
    opacity: cfg.opacity,
    lineHeight: cfg.lineHeight,
  };
  if (cfg.letterSpacing) sx.letterSpacing = cfg.letterSpacing;
  if (cfg.textAlign) sx.textAlign = cfg.textAlign;
  if (cfg.textTransform) sx.textTransform = cfg.textTransform;
  if (cfg.italic) sx.fontStyle = "italic";
  return sx;
}

// Deterministic-per-render random sample (Fisher–Yates), capped at `n`.
// Callers memoize this against a stable dependency (e.g. the image id
// list) so the picked set doesn't reshuffle on every re-render.
function sampleRandom(arr, n) {
  const pool = [...arr];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

const makeSlug = (t = "") =>
  t
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");

const METADATA_LABELS = {
  venue: { en: "Venue", cn: "场馆" },
  location: { en: "Location", cn: "地点" },
  organiser: { en: "Organiser", cn: "主办方" },
  language: { en: "Language", cn: "语言" },
};

// Curator & participating_artists are surfaced up in the header block
// (Artists: … / Preface by Curator …), so they're intentionally left
// out of this bottom metadata table to avoid repeating them.
const METADATA_ORDER = ["venue", "location", "organiser"];

// ============================================================
// Top nav tabs — "Installation Views / Press release / Works"
// Pure in-page anchors; sections only appear in the nav when
// they actually have content.
// ============================================================
function SectionNav({ sections, ctx }) {
  if (!sections.length) return null;
  const C = TEXT_CONFIG.NAV_TAB;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: { xs: "16px", md: "28px" },
        mb: {
          xs: `${LAYOUT_CONFIG.NAV_MB_MOBILE}px`,
          md: `${LAYOUT_CONFIG.NAV_MB_DESKTOP}px`,
        },
      }}
    >
      {sections.map((s) => (
        <Typography
          key={s.id}
          component="a"
          href={`#${s.id}`}
          sx={{
            ...textSx(C, ctx),
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": { opacity: C.activeOpacity },
          }}
        >
          {s.label}
        </Typography>
      ))}
    </Box>
  );
}

// ============================================================
// Installation Views — top row of up to 3 randomly-picked images
// ============================================================
function InstallationViewsRow({ images, onImageClick, isMobile }) {
  if (!images.length) return null;
  const C = INSTALLATION_CONFIG;
  const gap = isMobile ? C.GAP_MOBILE : C.GAP_DESKTOP;
  const columns = isMobile ? C.COLUMNS_MOBILE : images.length;

  return (
    <Box
      sx={{
        mb: {
          xs: `${LAYOUT_CONFIG.INSTALLATION_MB_MOBILE}px`,
          md: `${LAYOUT_CONFIG.INSTALLATION_MB_DESKTOP}px`,
        },
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((img, idx) => (
        <motion.div
          key={img.id || img._id || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06, duration: 0.5 }}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: C.ASPECT_RATIO,
              cursor: "zoom-in",
              backgroundColor: "rgba(0,0,0,0.02)",
              overflow: "hidden",
            }}
            onClick={() => onImageClick(img.img_url)}
          >
            <img
              src={img.img_url}
              alt={img.caption_en || img.caption_cn || "Installation view"}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
          </Box>
        </motion.div>
      ))}
    </Box>
  );
}

// ============================================================
// Artist name link with underline hover animation
// ============================================================
function ArtistNameLink({ name, slug, index, isMobile, fontFamily, textColor }) {
  const [isHovered, setIsHovered] = useState(false);
  const C = TEXT_CONFIG.ARTIST_LINK;
  const fontSize = pickResponsive(C, isMobile, "fontSize");

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: isMobile ? 0 : index * 0.04, duration: 0.3 }}
    >
      <Link
        href={`/artists/${slug}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          textDecoration: "none",
          color: isHovered ? textColor : "#999999", // grey → black on hover
          display: "inline-block",
          position: "relative",
          fontFamily,
          fontSize,
          fontWeight: C.fontWeight,
          lineHeight: C.lineHeight,
          opacity: 1,
          padding: "2px 0 4px",
          transition: "color 0.2s ease",
          outline: "none",
        }}
      >
        {name}
      </Link>
    </motion.div>
  );
}

// ============================================================
// Works card — image + artist name + italic title, year
// (same visual language as the artist page's Related Artworks card)
// ============================================================
function WorkCard({ artwork, index, textColor, captionFont, metaFont, isCn, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  const R = WORKS_GRID_CONFIG;
  const cardFontSize = isMobile ? R.CARD_FONT_SIZE_MOBILE : R.CARD_FONT_SIZE_DESKTOP;

  const href = `/artworks/${makeSlug(artwork.title)}?artist=${encodeURIComponent(
    (artwork.artist || "").replace(/\s+/g, "-")
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: isMobile ? 0 : (index % 10) * 0.05, duration: 0.5 }}
      style={{ width: "100%" }}
    >
      <Link
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            mb: R.IMAGE_TO_TEXT_GAP,
            backgroundColor: "rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}
        >
          {artwork.cover_img_url ? (
            <img
              src={artwork.cover_img_url}
              alt={artwork.title || ""}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                transform: isHovered ? `scale(${R.HOVER_SCALE})` : "scale(1)",
                transition: "transform 0.4s ease-in-out",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                aspectRatio: "3/2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: metaFont,
                  fontSize: "11px",
                  color: textColor,
                  opacity: 0.3,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {isCn ? "无图" : "No Image"}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            fontSize: cardFontSize,
            color: isHovered ? textColor : "#999999", // grey → black on hover
            lineHeight: R.CARD_LINE_HEIGHT,
            letterSpacing: R.CARD_LETTER_SPACING,
            transition: "color 0.2s ease",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <Typography component="span" sx={{ color: "inherit", fontFamily: captionFont, opacity: 0.9, fontSize: "inherit" }}>
            {artwork.artist || ""}
          </Typography>

          <Box sx={{ color: "inherit", display: "inline-block", position: "relative", width: "fit-content" }}>
            <Typography component="span" sx={{ color: "inherit", fontFamily: captionFont, fontStyle: "italic", opacity: 0.85, fontSize: "inherit" }}>
              {artwork.title || (isCn ? "无题" : "Untitled")}
              {artwork.year && <span style={{ color: "inherit", fontStyle: "normal" }}>, {artwork.year}</span>}
            </Typography>
          </Box>

          {(artwork.medium || artwork.size) && (
            <Typography component="span" sx={{ color: "inherit", fontFamily: metaFont, opacity: R.CARD_META_OPACITY, mt: "2px", fontSize: "inherit" }}>
              {[artwork.medium, artwork.size].filter(Boolean).join(" · ")}
            </Typography>
          )}
        </Box>
      </Link>
    </motion.div>
  );
}

// Works grid — renders every matched artwork (no cap).
function WorksGrid({ artworks, textColor, captionFont, metaFont, isCn, isMobile }) {
  const R = WORKS_GRID_CONFIG;
  const mode = isMobile ? R.GRID_MODE_MOBILE : R.GRID_MODE_DESKTOP;
  const columns = isMobile ? R.GRID_COLUMNS_MOBILE : R.GRID_COLUMNS_DESKTOP;
  const minColumnWidth = isMobile ? R.GRID_MIN_COLUMN_WIDTH_MOBILE : R.GRID_MIN_COLUMN_WIDTH_DESKTOP;
  const rowGap = R.GRID_ROW_GAP ?? R.GRID_GAP;
  const columnGap = R.GRID_COLUMN_GAP ?? R.GRID_GAP;

  const gridTemplateColumns =
    mode === "auto"
      ? `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`
      : `repeat(${Math.max(1, Math.floor(columns) || 1)}, 1fr)`;

  return (
    <Box sx={{ display: "grid", gridTemplateColumns, columnGap: `${columnGap}px`, rowGap: `${rowGap}px` }}>
      {artworks.map((aw, i) => (
        <WorkCard
          key={aw.id || aw._id || i}
          artwork={aw}
          index={i}
          textColor={textColor}
          captionFont={captionFont}
          metaFont={metaFont}
          isCn={isCn}
          isMobile={isMobile}
        />
      ))}
    </Box>
  );
}

// ============================================================
// PAGE COMPONENT
// ============================================================

export default function ExhibitionDetailPageComponent() {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { slug } = useParams();

  const fonts = {
    detailTitle: useFont("detailTitle").fontFamily,
    detailSubtitle: useFont("detailSubtitle").fontFamily,
    detailDate: useFont("detailDate").fontFamily,
    detailCaption: useFont("detailCaption").fontFamily,
    detailBody: useFont("detailBody").fontFamily,
    detailSectionHeading: useFont("detailSectionHeading").fontFamily,
    detailLink: useFont("detailLink").fontFamily,
    detailMetaLabel: useFont("detailMetaLabel").fontFamily,
    detailMetaValue: useFont("detailMetaValue").fontFamily,
  };

  // ▸ Section-label font family — no role, so it MATCHES the News heading. ◂
  const labelFont = useFont().fontFamily;

  const { colors } = useReverseTheme() || { colors: { text: "#000", background: "#fff" } };
  const { modalOpen, selectedImage, handleImageClick, handleModalClose } = useImageZoom();

  const ctx = { isMobile, fonts, themeText: colors.text };

  // All matching (images, webs, and now artworks — bidirectionally) is
  // resolved inside the hook, so the page component just renders
  // whatever comes back.
  const {
    exhibition,
    isLoading,
    hasError,
    firstError,
    galleryImages = [],
    matchedArtworks = [],
  } = useExhibitionDetailData(slug, isCn);

  const artistSlug = (name) =>
    String(name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\p{L}\p{N}_-]/gu, "");

  const exhibitionTitle = exhibition?.title || (isCn ? "无题" : "Untitled");
  const dateRange =
    formatSimpleDateRange(exhibition?.date_start, exhibition?.date_end) ||
    exhibition?.opening_date;

  const finalCoverImageUrl = useMemo(
    () =>
      exhibition?.cover_img_url && exhibition.cover_img_url !== FALLBACK_IMAGE
        ? exhibition.cover_img_url
        : null,
    [exhibition]
  );

  const introductionParas = useMemo(
    () => extractParagraphs(exhibition?.introduction),
    [exhibition]
  );
  const descriptionParas = useMemo(
    () => extractParagraphs(exhibition?.description),
    [exhibition]
  );

  const primaryParas = introductionParas.length ? introductionParas : descriptionParas;
  const trailingParas = introductionParas.length ? descriptionParas : [];

  const relatedArtists = useMemo(() => {
    if (!exhibition?.related_artist) return [];
    const raw = Array.isArray(exhibition.related_artist)
      ? exhibition.related_artist
      : [exhibition.related_artist];
    return raw.filter((name) => String(name || "").trim());
  }, [exhibition]);

  // Random subset (max 3) for the top "Installation Views" row.
  // Reshuffles only when the underlying image id list actually changes.
  const galleryImageIdsKey = useMemo(
    () => galleryImages.map((img) => img.id || img._id || img.img_url).join("|"),
    [galleryImages]
  );
  const installationImages = useMemo(
    () => sampleRandom(galleryImages, INSTALLATION_CONFIG.MAX_IMAGES),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [galleryImageIdsKey]
  );

  const isDataLoading = isLoading;

  const navSections = useMemo(() => {
    const list = [];
    if (installationImages.length) {
      list.push({ id: "installation-views", label: isCn ? "现场图" : "Installation Views" });
    }
    if (primaryParas.length || trailingParas.length) {
      list.push({ id: "press-release", label: isCn ? "新闻稿" : "Press release" });
    }
    if (matchedArtworks.length) {
      list.push({ id: "works", label: isCn ? "作品" : "Works" });
    }
    return list;
  }, [installationImages.length, primaryParas.length, trailingParas.length, matchedArtworks.length, isCn]);

  // A download / full-version link — uses whatever the record provides
  // (web_url today; wire up a dedicated pdf_url field on Exhibition if
  // you want a true file download instead of an external link).
  const downloadHref = exhibition?.web_url || null;

  // ------------------------------------------------------------
  // Loading state — completely blank white screen, nothing else.
  // ------------------------------------------------------------
  if (isDataLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: LOADING_CONFIG.BG_COLOR,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <LoadingAnimation isLoading />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box sx={{ mt: 3, px: 2 }}>
        <ErrorState error={firstError} isCn={isCn} />
        <FormAlert
          severity="error"
          message={
            isCn
              ? "加载展览数据时出错，请稍后重试。"
              : "An error occurred while loading exhibition data."
          }
        />
      </Box>
    );
  }

  if (!exhibition) {
    return (
      <Box sx={{ mt: 3 }}>
        <NoDataInfo schemaName="exhibition" isCn={isCn} />
      </Box>
    );
  }

  // Section-label style — News font family (labelFont), 15px, light weight.
  const sectionHeadingSx = {
    ...textSx(TEXT_CONFIG.SECTION_HEADING, ctx),
    fontFamily: labelFont, // override role font → News-heading family
    mb: `${TEXT_CONFIG.SECTION_HEADING.marginBottom || 0}px`,
    pb: "8px",
    borderBottom: `1px solid ${colors.text}`,
    display: "inline-block",
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: colors.background, color: colors.text }}>
      <Container maxWidth="md" sx={{ px: { xs: 3, md: 4 }, py: { xs: 6, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 0. Top nav — Installation Views / Press release / Works */}
          <SectionNav sections={navSections} ctx={ctx} />

          {/* 1. Installation Views — up to 3 random gallery images */}
          <Box id="installation-views">
            <InstallationViewsRow
              images={installationImages}
              onImageClick={handleImageClick}
              isMobile={isMobile}
            />
          </Box>

          {/* 2. Header (Title, Artists, Preface / Curator, Subtitle & Date) */}
          <Box
            id="press-release"
            sx={{
              mb: {
                xs: `${LAYOUT_CONFIG.HEADER_MB_MOBILE}px`,
                md: `${LAYOUT_CONFIG.HEADER_MB_DESKTOP}px`,
              },
            }}
          >
            <Typography
              component="h1"
              sx={{
                ...textSx(TEXT_CONFIG.TITLE, ctx),
                m: 0,
                mb: `${TEXT_CONFIG.TITLE.marginBottom}px`,
              }}
            >
              {TEXT_CONFIG.TITLE.italicizeBeforeColon && exhibitionTitle.includes(":") ? (
                <>
                  <span style={{ fontStyle: "italic" }}>
                    {exhibitionTitle.split(":")[0]}
                  </span>
                  :{exhibitionTitle.split(":").slice(1).join(":")}
                </>
              ) : (
                exhibitionTitle
              )}
            </Typography>

            {/* Artists line */}
            {(exhibition.participating_artists || relatedArtists.length > 0) && (
              <Typography
                sx={{
                  ...textSx(TEXT_CONFIG.ARTISTS_LINE, ctx),
                  m: 0,
                  mb: `${TEXT_CONFIG.ARTISTS_LINE.marginBottom}px`,
                }}
              >
                {isCn ? "参展艺术家：" : "Artists: "}
                {exhibition.participating_artists || relatedArtists.join(", ")}
              </Typography>
            )}

            {/* Preface / Curator line */}
            {exhibition.curator && (
              <Typography
                sx={{
                  ...textSx(TEXT_CONFIG.PREFACE_LINE, ctx),
                  m: 0,
                  mb: `${TEXT_CONFIG.PREFACE_LINE.marginBottom}px`,
                }}
              >
                {isCn ? `策展前言：${exhibition.curator}` : `Preface by Curator ${exhibition.curator}`}
              </Typography>
            )}

            {/* Subtitle */}
            {exhibition.subtitle && (
              <Typography
                sx={{
                  ...textSx(TEXT_CONFIG.SUBTITLE, ctx),
                  m: 0,
                  mt: 1,
                  mb: `${TEXT_CONFIG.SUBTITLE.marginBottom}px`,
                }}
              >
                {exhibition.subtitle}
              </Typography>
            )}

            {/* Date */}
            {dateRange && (
              <Typography
                sx={{
                  ...textSx(TEXT_CONFIG.DATE, ctx),
                  m: 0,
                  mt: 1,
                  mb: `${TEXT_CONFIG.DATE.marginBottom}px`,
                }}
              >
                {dateRange}
              </Typography>
            )}

            {/* Body — introduction / description paragraphs, plain text.
                Installation photos already ran in the row above, so the
                body here is text-only (no interleaved images). */}
            {primaryParas.length > 0 && (
              <Box sx={{ mt: `${LAYOUT_CONFIG.BODY_MT}px` }}>
                {primaryParas.map((para, idx) => (
                  <Typography
                    key={idx}
                    sx={{
                      ...textSx(TEXT_CONFIG.INTRO, ctx),
                      whiteSpace: "pre-line",
                      mb: `${TEXT_CONFIG.INTRO.marginBottom}px`,
                      "&:last-of-type": { mb: 0 },
                    }}
                  >
                    {para.replace(/\\n/g, "\n")}
                  </Typography>
                ))}
              </Box>
            )}

            {trailingParas.length > 0 && (
              <Box sx={{ mt: primaryParas.length ? `${LAYOUT_CONFIG.BODY_BLOCK_GAP}px` : `${LAYOUT_CONFIG.BODY_MT}px` }}>
                {trailingParas.map((para, idx) => (
                  <Typography
                    key={idx}
                    sx={{
                      ...textSx(TEXT_CONFIG.DESCRIPTION, ctx),
                      whiteSpace: "pre-line",
                      mb: `${TEXT_CONFIG.DESCRIPTION.marginBottom}px`,
                      "&:last-of-type": { mb: 0 },
                    }}
                  >
                    {para.replace(/\\n/g, "\n")}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Download / full version button */}
            {downloadHref && (
              <Box sx={{ mt: `${LAYOUT_CONFIG.DOWNLOAD_BUTTON_MT}px` }}>
                <Typography
                  component="a"
                  href={downloadHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-block",
                    fontFamily: fonts.detailMetaLabel,
                    fontSize: "13px",
                    letterSpacing: "0.02em",
                    color: colors.text,
                    textDecoration: "none",
                    border: `1px solid ${colors.text}`,
                    px: 2,
                    py: 1,
                    transition: "opacity 0.2s ease",
                    "&:hover": { opacity: 0.6 },
                  }}
                >
                  {isCn ? "下载完整版" : "Download Full version"}
                </Typography>
              </Box>
            )}
          </Box>

          {/* 2b. Cover Image & Caption (kept for records that lead with a
              dedicated cover image rather than relying on the gallery row) */}
          {finalCoverImageUrl && (
            <Box
              sx={{
                mb: {
                  xs: `${LAYOUT_CONFIG.COVER_MB_MOBILE}px`,
                  md: `${LAYOUT_CONFIG.COVER_MB_DESKTOP}px`,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  cursor: "zoom-in",
                  backgroundColor: "rgba(0,0,0,0.02)",
                  mb: exhibition.caption ? 1.5 : 0,
                }}
                onClick={() => handleImageClick(finalCoverImageUrl)}
              >
                <img
                  src={finalCoverImageUrl}
                  alt={exhibitionTitle}
                  style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                />
              </Box>
              {exhibition.caption && (
                <Typography
                  sx={{ ...textSx(TEXT_CONFIG.COVER_CAPTION, ctx), whiteSpace: "pre-line", px: 0.5 }}
                >
                  {exhibition.caption.replace(/\\n/g, "\n")}
                </Typography>
              )}
            </Box>
          )}

          {/* 3. Video Player */}
          {exhibition.video_url && (
            <Box
              sx={{
                mt: `${LAYOUT_CONFIG.VIDEO_MT}px`,
                mb: `${LAYOUT_CONFIG.VIDEO_MB}px`,
                position: "relative",
                paddingTop: "56.25%",
                width: "100%",
                backgroundColor: "#000",
              }}
            >
              <iframe
                src={exhibition.video_url}
                title="Exhibition Video"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          )}

          {/* 4. Works — ALL matched artworks (bidirectional match, resolved
              in useExhibitionDetailData), artist-page grid style */}
          {matchedArtworks.length > 0 && (
            <Box
              id="works"
              sx={{
                mt: exhibition.video_url
                  ? 2
                  : {
                      xs: `${LAYOUT_CONFIG.WORKS_MT_MOBILE}px`,
                      md: `${LAYOUT_CONFIG.WORKS_MT_DESKTOP}px`,
                    },
              }}
            >
              <Typography sx={sectionHeadingSx}>{isCn ? "作品" : "Works"}</Typography>
              <WorksGrid
                artworks={matchedArtworks}
                textColor={colors.text}
                captionFont={fonts.detailCaption}
                metaFont={fonts.detailMetaLabel}
                isCn={isCn}
                isMobile={isMobile}
              />
            </Box>
          )}

          {/* 5. Related Artists — underline hover animation */}
          {relatedArtists.length > 0 && (
            <Box sx={{ mt: `${LAYOUT_CONFIG.RELATED_ARTISTS_MT}px` }}>
              <Typography sx={sectionHeadingSx}>
                {isCn ? "相关艺术家" : "Related Artists"}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {relatedArtists.map((artist, idx) => (
                  <ArtistNameLink
                    key={`artist-${idx}`}
                    name={artist}
                    slug={artistSlug(artist)}
                    index={idx}
                    isMobile={isMobile}
                    fontFamily={ctx.fonts.detailLink}
                    textColor={colors.text}
                  />
                ))}
              </Box>
            </Box>
          )}

        </motion.div>
      </Container>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        imageUrl={selectedImage || ""}
        title={exhibitionTitle}
        enableGifRestart={true}
      />
    </Box>
  );
}
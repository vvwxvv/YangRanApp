"use client";

import React, {
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import useFont from '@/hooks/useFont';
import { useReverseTheme } from "@/hooks/useReverseTheme";
import AlertInfo from "@/components/alerts/AlertInfo";
import LoadingAnimation from "@/components/animations/LoadingAnimation";
import useExhibitionListData from "@/components/pages/exhibition/hooks/useExhibitionListData";
import { formatDateRange } from "@/components/pages/exhibition/utils/exhibitionDates";
import useAppTitle from "@/hooks/useAppTitle";

// ═════════════════════════════════════════════════════════════════════
// TEXT / LABEL DICTIONARY (i18n)
// ═════════════════════════════════════════════════════════════════════
const EXHIBITIONS_TEXT = {
  dropdown: {
    selectYearPlaceholder: { en: "Select Year", cn: "选择年份" },
    allYears: { en: "All Years", cn: "所有年份" },
    noYearsAvailable: { en: "No years available", cn: "暂无年份" },
  },
  card: {
    untitled: { en: "Untitled", cn: "未命名" },
  },
  page: {
    currentHeading: { en: "Current", cn: "当前展览" },
    pastHeading: { en: "Past", cn: "过往展览" },
    noCurrentExhibitions: { en: "No current exhibitions", cn: "暂无当前展览" },
    noPastExhibitions: { en: "No past exhibitions", cn: "暂无过往展览" },
    noExhibitionsForYear: { en: "No exhibitions for this year", cn: "该年份暂无展览" },
    // Unified list heading (all exhibitions, current → past)
    allHeading: { en: "Exhibitions", cn: "展览" },
    noExhibitions: { en: "No exhibitions", cn: "暂无展览" },
    loadingFailedTitle: { en: "Loading Failed", cn: "加载失败" },
    loadingFailedSubtitle: { en: "Check connection and retry", cn: "请检查网络连接后重试" },
    retryButton: { en: "Retry", cn: "重试" },
  },
};

// ═════════════════════════════════════════════════════════════════════
// CONFIG — single source of truth for every visual on this page.
// ─────────────────────────────────────────────────────────────────────
//  QUICK EDIT — the values you touch most:
//    • Section heading (Current/Past/Year)  → TYPOGRAPHY.SECTION_HEADING
//        ↳ synced to the News page heading (font family via useFont() in
//          the component, size 28/18, weight 500). Change both if retuned.
//    • Card "type" tag                       → TYPOGRAPHY.CARD_TYPE
//        ↳ synced to News meta text (12px).
//    • Card title / date sizes               → TYPOGRAPHY.CARD_TITLE / CARD_DATE
//    • Page padding / grid gaps              → LAYOUT
//    • Cover image ratio + reveal            → CARD
//    • Year-filter dropdown                  → DROPDOWN
//
//  color: "theme" means "use the current text color"; any other string is
//  taken literally. Sizes are px strings unless noted.
// ═════════════════════════════════════════════════════════════════════
const EXHIBITIONS_CONFIG = {
  TYPOGRAPHY: {
    // ▸▸ SYNCED WITH NEWS HEADING ◂◂
    //    Font family comes from useFont() (no role) in the component, so it
    //    matches the News "News" heading exactly. Size is responsive.
    SECTION_HEADING: {
      fontSize: "28px",        // desktop  (News heading − 2px)
      fontSizeMobile: "18px",  // mobile   (News heading − 2px)
      fontWeight: 500,         // matches News heading weight
      lineHeight: "normal",
      letterSpacing: "0.01em", // matches News heading
      color: "theme",
      opacity: 1,
    },

    CARD_TITLE: {
      fontSize: "22px",
      fontWeight: 500,
      lineHeight: "34px",
      letterSpacing: "0px",
      color: "#999999",    // grey by default
      colorHover: "theme", // black on hover
      opacity: 1,
    },
    CARD_DATE: {
      fontSize: "15px",
      fontWeight: 500,
      lineHeight: "20px",
      letterSpacing: "0px",
      color: "theme",
      opacity: 0.6,
    },
    // ▸▸ SYNCED WITH NEWS META TEXT ◂◂  (the small "· type" line)
    CARD_TYPE: {
      fontSize: "12px",        // was 14px → now matches News meta / About body
      fontWeight: 500,
      lineHeight: "20px",
      letterSpacing: "0px",
      color: "theme",
      opacity: 0.6,
    },
    CARD_FALLBACK_LABEL: {
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "16px",
      letterSpacing: "0.15em",
      color: "theme",
      opacity: 0.2,
    },
    BODY: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
      letterSpacing: "0px",
      color: "theme",
      opacity: 1,
    },
    EMPTY_STATE: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
      letterSpacing: "0px",
      color: "theme",
      opacity: 0.5,
    },
    DROPDOWN_LABEL: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "19px",
      letterSpacing: "0px",
      color: "theme",
      opacity: 1,
    },
    DROPDOWN_ITEM: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "19px",
      letterSpacing: "0px",
      color: "#000000",
      opacity: 1,
    },
    DROPDOWN_EMPTY: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "19px",
      letterSpacing: "0px",
      color: "#999999",
      opacity: 1,
    },
  },

  // ── Cover image + card layout ──
  CARD: {
    IMAGE_ASPECT_RATIO: "3 / 2",
    // The veil supplies the loading surface; keep this transparent so it only
    // shows for the instant before the veil mounts.
    IMAGE_PLACEHOLDER_BG: "transparent",
    IMAGE_HOVER_SCALE: 1.02,
    IMAGE_HOVER_TRANSITION: "transform 0.5s ease",
    // Reveal-on-load: a page-colored veil lifts off the photo as it decodes.
    IMAGE_LOAD_FADE_DURATION: "0.8s",
    IMAGE_LOAD_FADE_EASE: "cubic-bezier(0.22, 1, 0.36, 1)",
    IMAGE_LOAD_INITIAL_SCALE: 1.03,
    IMAGE_TO_CAPTION_GAP: "12px",
    TITLE_TO_DATE_GAP: "2px",
    HALF_WIDTH_MAX: "48%",
    TYPE_VERTICAL_ALIGN: "center",
    TYPE_GAP_FROM_TITLE: "16px",
  },

  // ── Entrance / page transitions ──
  ANIMATION: {
    CARD_INITIAL: { opacity: 0, y: 20 },
    CARD_IN_VIEW: { opacity: 1, y: 0 },
    CARD_VIEWPORT: { once: true, margin: "-50px" },
    CARD_DURATION: 0.5,
    PAGE_FADE_DURATION: 0.35,
  },

  // ── Year-filter dropdown ──
  DROPDOWN: {
    MENU_PLACEMENT: "bottom-end",
    MENU_OFFSET_DISTANCE: 0,
    MENU_OFFSET_SKID: 0,
    MENU_WIDTH: "match-trigger",
    TRIGGER: {
      WIDTH: "150px",
      PADDING: "8px 8px",
      MARGIN: "10px 0",
      BORDER_WIDTH: "1px",
      ARROW_SIZE: "9px",
      ARROW_GAP: "8px",
      ARROW_ROTATE_TRANSITION: "transform 0.3s ease",
      OFFSET_TOP: "-50px",
      OFFSET_RIGHT: "20px",
    },
    PANEL: {
      BG_COLOR: "#ffffff",
      BORDER_WIDTH: "1px",
      BOX_SHADOW: "0px 4px 12px rgba(0, 0, 0, 0.05)",
      ITEM_PADDING: "8px 8px",
      ITEM_UNDERLINE_OFFSET: "4px",
      ITEM_HOVER_TRANSITION: "background-color 0.2s",
      FADE_DURATION: 150,
      Z_INDEX: 50,
    },
  },

  // ── Page frame + grid ──
  LAYOUT: {
    MAX_WIDTH: "1440px",
    PADDING_MOBILE: "40px 20px",
    PADDING_DESKTOP: "80px 64px",
    HEADING_MARGIN_BOTTOM: "32px",
    CURRENT_SECTION_MARGIN_BOTTOM: "64px",
    DIVIDER_MARGIN_BOTTOM: "64px",
    DIVIDER_OPACITY: 0.8,
    GRID_GAP_MOBILE: "48px",
    GRID_GAP_DESKTOP: "40px 64px",
  },

  // ── Loading: no skeleton. Just a solid white surface. ──
  LOADING: {
    BG_COLOR: "#ffffff",
  },
};

// ═════════════════════════════════════════════════════════════════════
// STYLE / DATA HELPERS
// ═════════════════════════════════════════════════════════════════════
const pickText = (entry, isCn) => (isCn ? entry.cn : entry.en);

const resolveColor = (configColor, themeColor) =>
  configColor === "theme" ? themeColor : configColor;

const buildTextStyle = (typo, fontFamily, themeColor) => ({
  fontFamily,
  fontSize: typo.fontSize,
  fontWeight: typo.fontWeight,
  lineHeight: typo.lineHeight,
  letterSpacing: typo.letterSpacing,
  color: resolveColor(typo.color, themeColor),
  opacity: typo.opacity,
});

function getExhibitionYear(exhibition) {
  const raw =
    exhibition?.year ??
    exhibition?.date_start ??
    exhibition?.start_date ??
    exhibition?.startDate ??
    exhibition?.date ??
    exhibition?.opening_date ??
    exhibition?.begin_date;

  if (!raw) return null;
  if (typeof raw === "number") return String(raw);

  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) return String(parsed.getFullYear());

  const match = String(raw).match(/\d{4}/);
  return match ? match[0] : null;
}

function getExhibitionSlug(exhibition) {
  return String(exhibition?.title || exhibition?._id || exhibition?.id || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");
}

const getExhibitionKey = (exhibition, index) =>
  exhibition?._id || exhibition?.id || `exhibition-${index}`;

// ═════════════════════════════════════════════════════════════════════
// CUSTOM ELEGANT DROPDOWN
// ═════════════════════════════════════════════════════════════════════
function CustomYearDropdown({ isCn, textColor, bgColor, years, selectedYear, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [triggerWidth, setTriggerWidth] = useState(undefined);
  const anchorRef = useRef(null);
  const t = useCallback((entry) => pickText(entry, isCn), [isCn]);
  const { fontFamily } = useFont("yearDropdownLabel");

  const { MENU_PLACEMENT, MENU_OFFSET_DISTANCE, MENU_OFFSET_SKID, MENU_WIDTH, TRIGGER, PANEL } =
    EXHIBITIONS_CONFIG.DROPDOWN;

  const labelStyle = useMemo(
    () => buildTextStyle(EXHIBITIONS_CONFIG.TYPOGRAPHY.DROPDOWN_LABEL, fontFamily, textColor),
    [fontFamily, textColor]
  );
  const itemStyle = useMemo(
    () => buildTextStyle(EXHIBITIONS_CONFIG.TYPOGRAPHY.DROPDOWN_ITEM, fontFamily, textColor),
    [fontFamily, textColor]
  );
  const emptyStyle = useMemo(
    () => buildTextStyle(EXHIBITIONS_CONFIG.TYPOGRAPHY.DROPDOWN_EMPTY, fontFamily, textColor),
    [fontFamily, textColor]
  );

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      setTriggerWidth(anchorRef.current.offsetWidth);
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (year) => {
      setIsOpen(false);
      setHoveredItem(null);
      onSelect(year);
    },
    [onSelect]
  );

  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const panelWidth = MENU_WIDTH === "match-trigger" ? triggerWidth : MENU_WIDTH;

  const renderItem = (key, label, onClick) => (
    <Box
      key={key}
      onClick={onClick}
      onMouseEnter={() => setHoveredItem(key)}
      onMouseLeave={() => setHoveredItem(null)}
      role="option"
      aria-selected={key === selectedYear}
      sx={{
        ...itemStyle,
        padding: PANEL.ITEM_PADDING,
        cursor: "pointer",
        textDecoration: hoveredItem === key ? "underline" : "none",
        textUnderlineOffset: PANEL.ITEM_UNDERLINE_OFFSET,
        transition: PANEL.ITEM_HOVER_TRANSITION,
      }}
    >
      {label}
    </Box>
  );

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <button
        ref={anchorRef}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          ...labelStyle,
          padding: TRIGGER.PADDING,
          border: `${TRIGGER.BORDER_WIDTH} solid ${textColor}`,
          backgroundColor: bgColor,
          outline: "none",
          minWidth: TRIGGER.WIDTH,
          margin: TRIGGER.MARGIN,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{selectedYear || t(EXHIBITIONS_TEXT.dropdown.selectYearPlaceholder)}</span>
        <span
          aria-hidden="true"
          style={{
            fontSize: TRIGGER.ARROW_SIZE,
            marginLeft: TRIGGER.ARROW_GAP,
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: TRIGGER.ARROW_ROTATE_TRANSITION,
          }}
        >
          ▼
        </span>
      </button>

      <Popper
        open={isOpen}
        anchorEl={anchorRef.current}
        placement={MENU_PLACEMENT}
        transition
        style={{ zIndex: PANEL.Z_INDEX }}
        modifiers={[
          { name: "offset", options: { offset: [MENU_OFFSET_SKID, MENU_OFFSET_DISTANCE] } },
          { name: "preventOverflow", options: { padding: 8 } },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={PANEL.FADE_DURATION}>
            <Box>
              <ClickAwayListener onClickAway={handleClose}>
                <Stack
                  direction="column"
                  role="listbox"
                  sx={{
                    width: panelWidth,
                    bgcolor: PANEL.BG_COLOR,
                    border: `${PANEL.BORDER_WIDTH} solid ${textColor}`,
                    boxShadow: PANEL.BOX_SHADOW,
                  }}
                >
                  {renderItem("all", t(EXHIBITIONS_TEXT.dropdown.allYears), () => handleSelect(""))}

                  {years.length === 0 ? (
                    <Box sx={{ ...emptyStyle, padding: PANEL.ITEM_PADDING }}>
                      {t(EXHIBITIONS_TEXT.dropdown.noYearsAvailable)}
                    </Box>
                  ) : (
                    years.map((year) => renderItem(year, year, () => handleSelect(year)))
                  )}
                </Stack>
              </ClickAwayListener>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════
// EXHIBITION CARD — image reveals from a page-colored veil, no blur
// ═════════════════════════════════════════════════════════════════════
function ExhibitionCard({ exhibition, textColor, bgColor, isCn, isHalfWidth = false }) {
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const dateRange = formatDateRange(exhibition, isCn);
  const slug = getExhibitionSlug(exhibition);
  const href = `/exhibitions/${slug}`;
  const t = useCallback((entry) => pickText(entry, isCn), [isCn]);
  const { displayName: galleryFallbackName } = useAppTitle(isCn ? "cn" : "en");
  const { fontFamily: captionFontFamily } = useFont("exhibitionCaption");
  const { fontFamily: fallbackLabelFontFamily } = useFont("exhibitionCardLabel");

  const { TYPOGRAPHY, CARD, ANIMATION } = EXHIBITIONS_CONFIG;

  const titleStyle = useMemo(
    () => ({
      ...buildTextStyle(TYPOGRAPHY.CARD_TITLE, captionFontFamily, textColor),
      // grey by default → black on hover (no underline)
      color: resolveColor(
        isTextHovered ? TYPOGRAPHY.CARD_TITLE.colorHover : TYPOGRAPHY.CARD_TITLE.color,
        textColor
      ),
      transition: "color 0.2s ease",
    }),
    [TYPOGRAPHY.CARD_TITLE, captionFontFamily, textColor, isTextHovered]
  );
  const dateStyle = useMemo(
    () => buildTextStyle(TYPOGRAPHY.CARD_DATE, captionFontFamily, textColor),
    [TYPOGRAPHY.CARD_DATE, captionFontFamily, textColor]
  );
  const typeStyle = useMemo(
    () => buildTextStyle(TYPOGRAPHY.CARD_TYPE, captionFontFamily, textColor),
    [TYPOGRAPHY.CARD_TYPE, captionFontFamily, textColor]
  );
  const fallbackLabelStyle = useMemo(
    () => buildTextStyle(TYPOGRAPHY.CARD_FALLBACK_LABEL, fallbackLabelFontFamily, textColor),
    [TYPOGRAPHY.CARD_FALLBACK_LABEL, fallbackLabelFontFamily, textColor]
  );

  const exhibitionType = exhibition?.type ? String(exhibition.type).trim() : "";
  const title = exhibition?.title || t(EXHIBITIONS_TEXT.card.untitled);

  return (
    <motion.div
      initial={ANIMATION.CARD_INITIAL}
      whileInView={ANIMATION.CARD_IN_VIEW}
      viewport={ANIMATION.CARD_VIEWPORT}
      transition={{ duration: ANIMATION.CARD_DURATION }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD.IMAGE_TO_CAPTION_GAP,
        width: "100%",
        maxWidth: isHalfWidth ? CARD.HALF_WIDTH_MAX : "100%",
      }}
    >
      {/* ── Cover image ── */}
      <Link href={href} style={{ display: "block", textDecoration: "none" }}>
        <div
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          style={{
            width: "100%",
            aspectRatio: CARD.IMAGE_ASPECT_RATIO,
            position: "relative",
            overflow: "hidden",
            backgroundColor: bgColor,
            isolation: "isolate",
          }}
        >
          {exhibition?.cover_img_url ? (
            <>
              <img
                src={exhibition.cover_img_url}
                alt={title}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: imgLoaded ? 1 : 0,
                  transform: imgLoaded
                    ? isImageHovered
                      ? `scale(${CARD.IMAGE_HOVER_SCALE})`
                      : "scale(1)"
                    : `scale(${CARD.IMAGE_LOAD_INITIAL_SCALE})`,
                  transition: [
                    `opacity ${CARD.IMAGE_LOAD_FADE_DURATION} ${CARD.IMAGE_LOAD_FADE_EASE}`,
                    CARD.IMAGE_HOVER_TRANSITION,
                  ].join(", "),
                }}
              />
              {/* Veil matches the page background — the image seems to emerge
                  from the page itself, never grey, never blurred. */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: bgColor,
                  opacity: imgLoaded ? 0 : 1,
                  transition: `opacity ${CARD.IMAGE_LOAD_FADE_DURATION} ${CARD.IMAGE_LOAD_FADE_EASE}`,
                  pointerEvents: "none",
                }}
              />
            </>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "uppercase",
                opacity: 1,
                transition: "opacity 0.4s ease",
                ...fallbackLabelStyle,
              }}
            >
              {galleryFallbackName}
            </div>
          )}
        </div>
      </Link>

      {/* ── Caption row: title + date left, type pinned right ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: CARD.TYPE_VERTICAL_ALIGN,
          width: "100%",
          gap: CARD.TYPE_GAP_FROM_TITLE,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: CARD.TITLE_TO_DATE_GAP,
            alignItems: "flex-start",
            minWidth: 0,
          }}
        >
          <Link
            href={href}
            style={{
              textDecoration: "none",
              color: "inherit",
              position: "relative",
              display: "inline-block",
            }}
            onMouseEnter={() => setIsTextHovered(true)}
            onMouseLeave={() => setIsTextHovered(false)}
          >
            <p style={{ ...titleStyle, margin: 0, display: "inline-block" }}>{title}</p>
          </Link>

          {dateRange && <p style={{ ...dateStyle, margin: 0 }}>{dateRange}</p>}
        </div>

        {exhibitionType && (
          <p
            style={{
              ...typeStyle,
              margin: 0,
              flexShrink: 0,
              whiteSpace: "nowrap",
              textAlign: "right",
            }}
          >
            {exhibitionType}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// LOADING SCREEN — plain white surface, nothing else rendered.
// ═════════════════════════════════════════════════════════════════════
function ExhibitionLoadingScreen() {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: EXHIBITIONS_CONFIG.LOADING.BG_COLOR,
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

// ═════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════
export default function ExhibitionPage() {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);

  // ▸ Section heading font family — no role, so it MATCHES the News heading. ◂
  const { fontFamily: headingFontFamily } = useFont();
  const { fontFamily: bodyFontFamily } = useFont("bodyText");
  const { colors } = useReverseTheme();
  const t = useCallback((entry) => pickText(entry, isCn), [isCn]);

  const textColor = colors.text;
  const bgColor = colors.background;

  const { TYPOGRAPHY, LAYOUT, DROPDOWN, ANIMATION } = EXHIBITIONS_CONFIG;

  // Responsive heading size — mirrors the News heading (desktop / mobile).
  const headingStyle = useMemo(() => {
    const base = buildTextStyle(TYPOGRAPHY.SECTION_HEADING, headingFontFamily, textColor);
    return {
      ...base,
      fontSize: isMobile
        ? TYPOGRAPHY.SECTION_HEADING.fontSizeMobile
        : TYPOGRAPHY.SECTION_HEADING.fontSize,
    };
  }, [TYPOGRAPHY.SECTION_HEADING, headingFontFamily, textColor, isMobile]);

  const emptyStateStyle = useMemo(
    () => buildTextStyle(TYPOGRAPHY.EMPTY_STATE, bodyFontFamily, textColor),
    [TYPOGRAPHY.EMPTY_STATE, bodyFontFamily, textColor]
  );

  // Current slot: the REAL current exhibitions, or — when none are current —
  // the newest exhibition, so this section never shows an empty state while
  // the gallery has any exhibition at all. Aliased back to `current`/`past`
  // so the rest of the component is unchanged.
  const {
    currentDisplay: current,
    pastDisplay: past,
    isLoading,
    hasError,
    refetch,
  } = useExhibitionListData(isCn);

  const [selectedYear, setSelectedYear] = useState("");
  const isFiltering = Boolean(selectedYear);

  const allExhibitions = useMemo(
    () => [...(current || []), ...(past || [])],
    [current, past]
  );

  const years = useMemo(() => {
    const set = new Set(allExhibitions.map(getExhibitionYear).filter(Boolean));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [allExhibitions]);

  const yearResults = useMemo(() => {
    if (!isFiltering) return [];
    return allExhibitions
      .filter((ex) => getExhibitionYear(ex) === selectedYear)
      .sort((a, b) => {
        const getTime = (ex) => {
          const d = new Date(ex?.date_start || ex?.date_end || 0);
          return isNaN(d.getTime()) ? 0 : d.getTime();
        };
        return getTime(b) - getTime(a);
      });
  }, [allExhibitions, selectedYear, isFiltering]);

  // Current section shows first (above Past); a year filter narrows the Past list.
  const pastSectionResults = isFiltering ? yearResults : past;

  const dropdownTriggerOffsetStyle = useMemo(
    () => ({
      transform: `translate(${DROPDOWN.TRIGGER.OFFSET_RIGHT}, ${DROPDOWN.TRIGGER.OFFSET_TOP})`,
    }),
    [DROPDOWN.TRIGGER.OFFSET_RIGHT, DROPDOWN.TRIGGER.OFFSET_TOP]
  );

  const renderDropdown = () => (
    <div style={dropdownTriggerOffsetStyle}>
      <CustomYearDropdown
        isCn={isCn}
        textColor={textColor}
        bgColor={bgColor}
        years={years}
        selectedYear={selectedYear}
        onSelect={setSelectedYear}
      />
    </div>
  );

  if (hasError) {
    return (
      <AlertInfo
        message={t(EXHIBITIONS_TEXT.page.loadingFailedTitle)}
        subMessage={t(EXHIBITIONS_TEXT.page.loadingFailedSubtitle)}
        buttonText={t(EXHIBITIONS_TEXT.page.retryButton)}
        onBack={refetch}
        isCn={isCn}
      />
    );
  }

  // While loading: render nothing but a plain white page.
  if (isLoading) {
    return <ExhibitionLoadingScreen />;
  }

  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: ANIMATION.PAGE_FADE_DURATION }}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minHeight: "100vh",
        padding: isMobile ? LAYOUT.PADDING_MOBILE : LAYOUT.PADDING_DESKTOP,
        maxWidth: LAYOUT.MAX_WIDTH,
        margin: "0 auto",
      }}
    >
      {/* Current — shown first, above Past */}
      {!isFiltering && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: LAYOUT.HEADING_MARGIN_BOTTOM,
            }}
          >
            <h2 style={{ ...headingStyle, margin: 0 }}>
              {t(EXHIBITIONS_TEXT.page.currentHeading)}
            </h2>
            {renderDropdown()}
          </div>

          <div style={{ marginBottom: LAYOUT.CURRENT_SECTION_MARGIN_BOTTOM }}>
            {current && current.length > 0 ? (
              current.map((ex, i) => (
                <ExhibitionCard
                  key={getExhibitionKey(ex, i)}
                  exhibition={ex}
                  textColor={textColor}
                  bgColor={bgColor}
                  isCn={isCn}
                  isHalfWidth={!isMobile}
                />
              ))
            ) : (
              <p style={emptyStateStyle}>{t(EXHIBITIONS_TEXT.page.noCurrentExhibitions)}</p>
            )}
          </div>

          <hr
            style={{
              borderTop: `1px solid ${textColor}`,
              margin: `0 0 ${LAYOUT.DIVIDER_MARGIN_BOTTOM} 0`,
              opacity: LAYOUT.DIVIDER_OPACITY,
            }}
          />
        </>
      )}

      {/* Past — below Current */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: LAYOUT.HEADING_MARGIN_BOTTOM,
          }}
        >
          <h2 style={{ ...headingStyle, margin: 0 }}>
            {isFiltering ? selectedYear : t(EXHIBITIONS_TEXT.page.pastHeading)}
          </h2>
          {isFiltering && renderDropdown()}
        </div>

        {pastSectionResults && pastSectionResults.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(300px, 1fr))",
              gap: isMobile ? LAYOUT.GRID_GAP_MOBILE : LAYOUT.GRID_GAP_DESKTOP,
            }}
          >
            {pastSectionResults.map((ex, i) => (
              <ExhibitionCard
                key={getExhibitionKey(ex, i)}
                exhibition={ex}
                textColor={textColor}
                bgColor={bgColor}
                isCn={isCn}
              />
            ))}
          </div>
        ) : (
          <p style={emptyStateStyle}>
            {isFiltering
              ? t(EXHIBITIONS_TEXT.page.noExhibitionsForYear)
              : t(EXHIBITIONS_TEXT.page.noPastExhibitions)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
"use client";

import React, { useCallback, useContext, useState } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "../contexts/LanguageContext";
import useFont from '@/hooks/useFont';

// ============================================================================
// LANGUAGE SWITCHER DESIGN CONFIGURATION
// Core visual parameters are now at the top level for quick tuning.
// ============================================================================
const SWITCHER_CONFIG = {
  POSITION: {
    TOP: "20px",
    RIGHT: "55px",
    Z_INDEX: 12000,
  },

  GAP: "6px",

  // --- Top-level style knobs (easily accessible) ---
  FONT_SIZE: "12px",
  COLOR_ACTIVE: "var(--text-active, #000)",
  COLOR_INACTIVE: "var(--text-muted, #999)",
  COLOR_DEFAULT: "var(--text-primary, #666)", // applied to the container

  ENTRANCE_ANIMATION: {
    INITIAL_OPACITY: 0,
    INITIAL_Y: -5,
    DURATION: 0.4,
    EASING: "easeOut",
  },

  LABEL: {
    LINE_HEIGHT: "12px",
    LETTER_SPACING: "0px",
    FONT_WEIGHT_ACTIVE: 600,
    FONT_WEIGHT_INACTIVE: 400,
    TRANSITION: "color 0.2s ease",
  },
};

type LangOption = "cn" | "en";

const LABELS: Record<LangOption, string> = {
  cn: "中文",
  en: "English",
};

const LanguageSwitcherInMenu: React.FC<{
  sx?: React.CSSProperties;
  /** Optional font-weight overrides — e.g. to match nav links when inlined into the nav row. */
  fontWeightActive?: number;
  fontWeightInactive?: number;
  /** Weight applied while hovered — lets the switcher copy the nav's hover boldness. */
  hoverFontWeight?: number;
  /** Extra stroke applied while hovered/active, e.g. "0.4px" (matches the nav's hover). */
  hoverTextStroke?: string;
}> = ({ sx, fontWeightActive, fontWeightInactive, hoverFontWeight, hoverTextStroke }) => {
  const { isCn, toggleLanguage } = useContext(LanguageContext);
  const { fontFamily } = useFont("languageSwitcher");

  const [hoveredLang, setHoveredLang] = useState<LangOption | null>(null);

  const activeLang: LangOption = isCn ? "cn" : "en";

  const selectLanguage = useCallback(
    (lang: LangOption) => {
      if (lang !== activeLang) toggleLanguage();
    },
    [activeLang, toggleLanguage]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>, lang: LangOption) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectLanguage(lang);
      }
    },
    [selectLanguage]
  );

  const labelStyle = (isActive: boolean): React.CSSProperties => ({
    cursor: "pointer",
    background: "none",
    border: "none",
    // Generous hit area without moving the text: padding is cancelled by margin.
    padding: "9px 5px",
    margin: "-9px -5px",
    font: "inherit",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    fontWeight: isActive
      ? (fontWeightActive ?? SWITCHER_CONFIG.LABEL.FONT_WEIGHT_ACTIVE)
      : (fontWeightInactive ?? SWITCHER_CONFIG.LABEL.FONT_WEIGHT_INACTIVE),
    color: isActive ? SWITCHER_CONFIG.COLOR_ACTIVE : SWITCHER_CONFIG.COLOR_INACTIVE,
    transition: SWITCHER_CONFIG.LABEL.TRANSITION,
  });

  const renderOption = (lang: LangOption) => {
    const isActive = lang === activeLang;
    const isHovered = hoveredLang === lang;

    // 悬停时使用 ACTIVATE 色（即使非激活态也变亮，可按需调整）
    const color =
      isActive || isHovered
        ? SWITCHER_CONFIG.COLOR_ACTIVE
        : SWITCHER_CONFIG.COLOR_INACTIVE;

    const activeWeight =
      fontWeightActive ?? SWITCHER_CONFIG.LABEL.FONT_WEIGHT_ACTIVE;
    const inactiveWeight =
      fontWeightInactive ?? SWITCHER_CONFIG.LABEL.FONT_WEIGHT_INACTIVE;
    const baseWeight = isActive ? activeWeight : inactiveWeight;
    // Hover weight (nav passes its FONT_WEIGHT_HOVER) — same jump the nav links do.
    const weight = isHovered ? hoverFontWeight ?? baseWeight : baseWeight;
    const stroke = hoverTextStroke
      ? `${isHovered || isActive ? hoverTextStroke : "0px"} currentColor`
      : undefined;

    const transition = [
      SWITCHER_CONFIG.LABEL.TRANSITION,
      hoverFontWeight ? "font-weight 0.15s ease" : null,
      hoverTextStroke ? "-webkit-text-stroke 0.15s ease" : null,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      // Rendered as a span (not <button>): globals.css has a blanket
      // `[data-theme] button { color: … !important }` rule that would force
      // this control black. As a span, the grey-by-default / black-on-hover
      // colours below apply (matches the nav + reference).
      <span
        key={lang}
        role="button"
        tabIndex={0}
        onClick={() => selectLanguage(lang)}
        onKeyDown={(e) => handleKeyDown(e, lang)}
        onMouseEnter={() => setHoveredLang(lang)}
        onMouseLeave={() => setHoveredLang(null)}
        aria-pressed={isActive}
        aria-label={`Switch to ${lang === "cn" ? "Chinese" : "English"}`}
        style={{
          ...labelStyle(isActive),
          display: "inline-block",
          color, // grey when idle, black on hover
          fontWeight: weight,
          ...(stroke ? { WebkitTextStroke: stroke } : {}),
          transition,
        }}
      >
        {LABELS[lang]}
      </span>
    );
  };

  return (
    <motion.div
      initial={{
        opacity: SWITCHER_CONFIG.ENTRANCE_ANIMATION.INITIAL_OPACITY,
        y: SWITCHER_CONFIG.ENTRANCE_ANIMATION.INITIAL_Y,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: SWITCHER_CONFIG.ENTRANCE_ANIMATION.DURATION,
        ease: SWITCHER_CONFIG.ENTRANCE_ANIMATION.EASING,
      }}
      role="group"
      aria-label="Language switcher"
      style={{
        position: "fixed",
        top: SWITCHER_CONFIG.POSITION.TOP,
        right: SWITCHER_CONFIG.POSITION.RIGHT,
        zIndex: SWITCHER_CONFIG.POSITION.Z_INDEX,
        display: "flex",
        alignItems: "center",
        gap: SWITCHER_CONFIG.GAP,
        color: SWITCHER_CONFIG.COLOR_DEFAULT,
        fontFamily,
        fontSize: SWITCHER_CONFIG.FONT_SIZE,
        lineHeight: SWITCHER_CONFIG.LABEL.LINE_HEIGHT,
        letterSpacing: SWITCHER_CONFIG.LABEL.LETTER_SPACING,
        userSelect: "none",
        // Positioning overrides from the layout (see LayoutMainContent) — the
        // switcher sits in the top-right corner so it never collides with the
        // page title.
        ...(sx || {}),
      }}
    >
      {/*
        Single-button switcher: show ONLY the OTHER language, and clicking it
        switches to that language.
          • page is EN → show "中文"
          • page is CN → show "EN"
        (No divider, no active/inactive pair — mirrors the reference.)
      */}
      {renderOption(isCn ? "en" : "cn")}
    </motion.div>
  );
};

export default LanguageSwitcherInMenu;
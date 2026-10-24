"use client";

import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  memo,
} from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { ManagerContext } from "@/components/contexts/ManagerContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import { DEFAULT_MENUS } from "@/utils/siteMetaDefaults";
import { withSystemManagerEntries } from "@/lib/menu";
import useSiteMeta from "@/hooks/useSiteMeta";
import useFont from '@/hooks/useFont';
import { getBrandName } from "@/utils/artistUtils";
import ActionButton from "@/components/buttons/ActionButton";
import { useAsyncAction } from "@/hooks/useAsyncAction";

// ═════════════════════════════════════════════════════════════════════
// 🎨 NAVIGATION CONFIGURATION — single source of truth for ALL visuals
// ═════════════════════════════════════════════════════════════════════
//
// Everything the nav renders — font, spacing, color, timing, shadows —
// is set here. Nothing visual should be hardcoded further down; if you
// need to tweak how the nav looks, this is the only block to touch.
//
// FONT FAMILY specifically: this component never hardcodes a font.
// It reads `FONT.ROLE` below and hands it to useFont(), which looks the
// role up in lib/typography.js (see TYPE_SCALE → FONT_FAMILIES there).
// To change which typography role this nav uses, edit FONT.ROLE. To change
// what family that role resolves to, edit lib/typography.js — not this file.
//
// Current resolution for ROLE "bodyText": zh → pingFangRegular;
// en → avenirRegular (TYPE_SCALE.bodyText in lib/typography.js).
//
const NAV_CONFIG = {
  // ── Font ─────────────────────────────────────────────────────────
  FONT: {
    // Lighter face for the nav. (Was "navLink" → Jost-Medium, a MEDIUM face
    // that read bold at any weight.) "bodyText" = pingFangRegular (zh) /
    // avenirRegular (en) — thin at rest.
    ROLE: "bodyText", // must match a key in TYPE_SCALE (lib/typography.js)
    FALLBACK_FAMILY: "sans-serif", // used only if the role/hook ever fails to resolve
  },

  // ── Top bar ──────────────────────────────────────────────────────
  BAR: {
    HEIGHT: 70,
    PADDING_HORIZONTAL_DESKTOP: 50,
    PADDING_HORIZONTAL_MOBILE: 16,
    Z_INDEX: 1300,
    SHOW_BORDER: false,
    BORDER_WIDTH: "1px",
    BORDER_COLOR: null, // null → falls back to theme border color
    BACKGROUND_TRANSITION: "background-color 0.3s ease, border-color 0.3s ease",
    // Slide animation when the bar hides / reappears on scroll.
    HIDE_TRANSITION: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease",
  },

  // ── Smart show / hide on scroll ──────────────────────────────────
  // The bar slides away while you scroll DOWN, and slides back the moment
  // you (a) scroll UP, (b) return near the top, or (c) reach a NEW section
  // (any element marked [data-nav-section] whose top hits the bar line).
  SCROLL: {
    SHOW_AT_TOP: 80,        // always visible within this many px of the top
    BOUNDARY_HOLD: 140,     // stay visible for this many px after a new section is reached
    SECTION_SELECTOR: "[data-nav-section]",
    SCROLLED_AT: 20,        // past this y, the bar gets its solid background (readable over content)
  },

  // ── Brand wordmark (text — replaces the old logo image) ───────
  // Text = the person/artist name from env (see utils/artistUtils.js
  // → getBrandName). Font family resolves via useFont(FONT_ROLE) →
  // lib/typography.js; the "artistName" role maps to bigCaslon (both langs).
  BRAND: {
    FONT_ROLE: "artistName", // must match a key in TYPE_SCALE (lib/typography.js)
    FONT_SIZE_DESKTOP: "25px",
    FONT_SIZE_MOBILE: "25px",
    FONT_WEIGHT: 400,
    LETTER_SPACING: "0.04em",
    LINE_HEIGHT: "1",
    COLOR: null, // null → LINK.COLOR (black)
    TEXT_TRANSFORM: "none",
  },

  // ── Menu links ───────────────────────────────────────────────────
  // Still the typographic source of truth for the (now drawer-only)
  // menu: same font size / weight / family / spacing as before.
  LINK: {
    FONT_SIZE: "17px",
    FONT_WEIGHT: 300, // idle → thin (all nav is thin until hover)
    // Hover / active page → bold.
    FONT_WEIGHT_HOVER: 700,
    HOVER_TEXT_STROKE: "0px",
    LINE_HEIGHT: "15px",
    LETTER_SPACING: "0.03em",
    TEXT_TRANSFORM: "none",
    COLOR: null, // null → theme text colour (black in light / white in dark)
    COLOR_ACTIVE: null, // null → theme text colour (hover / active page)
    OPACITY_DEFAULT: 1,
    OPACITY_ACTIVE: 1,
    HOVER_TRANSITION: "opacity 0.2s ease, color 0.2s ease, font-weight 0.15s ease, -webkit-text-stroke 0.15s ease",
  },

  // ── Right-side action cluster (e-flux-style) ─────────────────────
  // The bar's right side is now a fixed cluster, left → right:
  //     [ Archive button ] [ search ] [ menu ]
  // It shows at EVERY breakpoint — the text menu moved into the drawer,
  // opened by the menu (hamburger) icon. See DRAWER below.
  ACTIONS: {
    // Solid, square black button that inverts with the theme
    // (light → black box / white label, dark → white box / black label).
    ARCHIVE: {
      LABEL_EN: "Archive",
      LABEL_CN: "档案",
      HREF: "/artworks/archive", // the public artwork archive page
      FONT_SIZE: "15px",
      FONT_WEIGHT: 500,
      LETTER_SPACING: "0.01em",
      TEXT_TRANSFORM: "none",
      PADDING: "9px 20px",
      PADDING_MOBILE: "9px 16px",
      FONT_SIZE_MOBILE: "14px",
      MIN_HEIGHT_MOBILE: 40,
      BORDER_RADIUS: 0, // square, same as HuJiemingApp
      BACKGROUND: null, // null → theme TEXT colour (black in light)
      COLOR: null, // null → theme BACKGROUND (white in light)
      BORDER: "none",
      HOVER_OPACITY: 0.78,
      TRANSITION: "opacity 0.2s ease",
    },

    // Compact language switch — EN on Chinese pages, CN on English pages.
    // It sits after the search icon (with a thin | separator) and underlines
    // on hover/focus instead of only fading.
    LANGUAGE: {
      FONT_SIZE_DESKTOP: 12,
      FONT_SIZE_MOBILE: 11,
      FONT_WEIGHT: 600,
      LETTER_SPACING: "0.08em",
      UNDERLINE_OFFSET: "3px",
      UNDERLINE_THICKNESS: "1px",
      SEPARATOR_OPACITY: 0.35,
    },

    // Icon buttons (search + menu) — thin-line SVGs drawn in currentColor.
    ICON: {
      SIZE: 21, // svg box, px
      STROKE: 1.6, // line weight — keep thin like e-flux
      GAP: "16px", // gap inside the cluster (button ↔ button)
      GAP_MOBILE: "12px",
      HIT_PADDING: "4px", // clickable padding around the glyph
      HIT_PADDING_MOBILE: "9px", // bigger tap targets on touch screens
      COLOR: null, // null → LINK colour (theme text)
      HOVER_OPACITY: 0.55,
      TRANSITION: "opacity 0.2s ease",
    },
  },

  // ── Search overlay ───────────────────────────────────────────────
  // Clicking the magnifier opens a minimal overlay that searches the
  // artwork list client-side (same endpoint the archive page uses) and
  // navigates to /artworks/<slug> on pick.
  SEARCH: {
    API: "/api/artwork", // list endpoint searched client-side
    BASE_HREF: "/artworks", // result → `${BASE_HREF}/${slug(title)}`
    PLACEHOLDER_EN: "Search",
    PLACEHOLDER_CN: "搜索",
    NO_RESULTS_EN: "No results",
    NO_RESULTS_CN: "无结果",
    LOADING_EN: "Loading…",
    LOADING_CN: "加载中…",
    INPUT_FONT_SIZE: "20px",
    INPUT_LETTER_SPACING: "0.02em",
    MAX_RESULTS: 8,
    PANEL_PADDING: "22px 24px 24px",
    PANEL_MAX_WIDTH: 720,
    PANEL_SHADOW: "0 6px 18px rgba(0,0,0,0.10)",
    // Bauhaus touch: a solid vertical rule leads the field, and the whole
    // row sits on a thin baseline rule. Colour null → theme text colour.
    ACCENT: { WIDTH: 2, HEIGHT: 28, GAP: 12, COLOR: null },
    RULE_WIDTH: "1px",
    RULE_COLOR: null, // null → theme border colour
    ICON_SIZE: 20,
    ICON_GAP: 14,
    RESULT_PADDING: "11px 0",
    RESULT_FONT_SIZE: "15px",
    ANIM_DURATION: 0.2,
  },

  // ── Full-screen editorial drawer ─────────────────────────────────
  // The menu is the page: oversized type, quiet metadata, no list chrome.
  // It slides in from the left over the whole viewport.
  DRAWER: {
    Z_INDEX: 1500,
    BACKGROUND_LIGHT: "#efede7",
    BACKGROUND_DARK: "#0b0b0b",
    TEXT_LIGHT: "#111111",
    TEXT_DARK: "#f4f0e8",
    MUTED_LIGHT: "rgba(17, 17, 17, 0.45)",
    MUTED_DARK: "rgba(244, 240, 232, 0.45)",
    LINE_LIGHT: "rgba(17, 17, 17, 0.14)",
    LINE_DARK: "rgba(244, 240, 232, 0.16)",

    HEADER_HEIGHT: 64,
    HEADER_HEIGHT_MOBILE: 56,
    HEADER_TITLE_SIZE: "15px",
    HEADER_TITLE_WEIGHT: 600,
    HEADER_TITLE_LETTER_SPACING: "0.24em",

    PADDING_X: "clamp(24px, 4vw, 56px)",
    PADDING_X_MOBILE: "22px",
    CONTENT_MAX_WIDTH: 1120,
    MENU_TOP_GAP: "clamp(12px, 1.8vh, 24px)",
    MENU_BOTTOM_GAP: "clamp(28px, 6vh, 64px)",
    MENU_FONT_SIZE: "25px",
    MENU_FONT_SIZE_MOBILE: "20px",
    MENU_LINE_HEIGHT: 1.02,
    MENU_WEIGHT: 500,
    MENU_LETTER_SPACING: "-0.025em",
    MENU_ITEM_PADDING: "clamp(6px, 1.1vh, 12px) 0",

    ICON_SIZE: 24,
    ICON_STROKE: 1.6,
    ICON_HIT_PADDING: 4,
    MORPH_DURATION: 0.42,

    FOOTER_LINK_SIZE: "10px",
    FOOTER_LINK_LETTER_SPACING: "0.14em",
    FOOTER_PADDING_BOTTOM: "clamp(24px, 4vh, 40px)",

    ANIM_DURATION: 0.55,
    ANIM_EASING: [0.76, 0, 0.24, 1],
    STAGGER_DELAY: 0.045,
  },
};

// ----------------------------------------------------------------------------
// Pure helpers — read from NAV_CONFIG, never hardcode a visual value here
// ----------------------------------------------------------------------------

// Title → URL slug. Unicode-aware (keeps CJK) so it matches the artwork
// detail route (see components/pages/artworks/hooks/useArtworkSlugData.js).
function slugifyTitle(text) {
  if (!text) return "";
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");
}

// ----------------------------------------------------------------------------
// Icons — thin-line SVGs drawn in currentColor so the theme drives them
// ----------------------------------------------------------------------------

function ThinSearchIcon({ size, stroke, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <circle cx="10.5" cy="10.5" r="7" />
      <line x1="15.8" y1="15.8" x2="21" y2="21" />
    </svg>
  );
}

// Three lines collapse into an ✕. Used in the nav and in the drawer header
// so opening the menu reads as the same icon changing state, not a swap.
function MorphMenuIcon({ open, size = 24, stroke = 1.6, color = "currentColor", duration = 0.42 }) {
  const lineStyle = {
    transformBox: "view-box",
    transformOrigin: "12px 12px",
    transition: `transform ${duration}s cubic-bezier(0.76, 0, 0.24, 1), opacity ${duration * 0.65}s ease`,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", overflow: "visible" }}
    >
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        style={{
          ...lineStyle,
          transform: open ? "translateY(0) rotate(45deg)" : "translateY(-6px) rotate(0deg)",
        }}
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        style={{
          ...lineStyle,
          opacity: open ? 0 : 1,
          transform: open ? "scaleX(0.2)" : "scaleX(1)",
        }}
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        style={{
          ...lineStyle,
          transform: open ? "translateY(0) rotate(-45deg)" : "translateY(6px) rotate(0deg)",
        }}
      />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Subcomponents
// ----------------------------------------------------------------------------

// Brand wordmark — plain text (person name), never an image.
// The name comes from env via getBrandName(isCn) (utils/artistUtils.js).
// Compact language switch for the nav row: EN when the page is Chinese, CN
// when it is English. Rendered as a span because the global button colour
// rule would otherwise force it to the theme colour.
function NavLanguageButton({ isCn, onToggle, color, fontFamily, isMobile }) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const { LANGUAGE } = NAV_CONFIG.ACTIONS;
  const underlined = hover || focused;
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label={isCn ? "Switch to English" : "切换到中文"}
      title={isCn ? "English" : "中文"}
      style={{
        color,
        fontFamily,
        fontSize: isMobile ? LANGUAGE.FONT_SIZE_MOBILE : LANGUAGE.FONT_SIZE_DESKTOP,
        fontWeight: LANGUAGE.FONT_WEIGHT,
        letterSpacing: LANGUAGE.LETTER_SPACING,
        lineHeight: 1,
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        textDecorationLine: underlined ? "underline" : "none",
        textDecorationThickness: LANGUAGE.UNDERLINE_THICKNESS,
        textUnderlineOffset: LANGUAGE.UNDERLINE_OFFSET,
        textDecorationColor: color,
        transition: "opacity 0.2s ease, text-decoration-color 0.2s ease",
      }}
    >
      {isCn ? "EN" : "CN"}
    </span>
  );
}

// Thin vertical bar between the search icon and the language switch.
function NavSeparator({ color, fontFamily, isMobile }) {
  const { LANGUAGE } = NAV_CONFIG.ACTIONS;
  return (
    <span
      aria-hidden="true"
      style={{
        color,
        opacity: LANGUAGE.SEPARATOR_OPACITY,
        fontFamily,
        fontSize: isMobile ? LANGUAGE.FONT_SIZE_MOBILE : LANGUAGE.FONT_SIZE_DESKTOP,
        fontWeight: 400,
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      |
    </span>
  );
}

const Brand = memo(function Brand({ isMobile, name, fontFamily, color }) {
  const { BRAND } = NAV_CONFIG;
  return (
    <Link
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        flexShrink: 0,
        fontFamily,
        fontSize: isMobile ? BRAND.FONT_SIZE_MOBILE : BRAND.FONT_SIZE_DESKTOP,
        fontWeight: BRAND.FONT_WEIGHT,
        letterSpacing: BRAND.LETTER_SPACING,
        lineHeight: BRAND.LINE_HEIGHT,
        textTransform: BRAND.TEXT_TRANSFORM,
        whiteSpace: "nowrap",
        color,
      }}
    >
      {name}
    </Link>
  );
});



const DrawerLink = memo(function DrawerLink({
  item,
  isActive,
  onClick,
  isMobile,
  fontFamily,
  fg,
}) {
  const { DRAWER } = NAV_CONFIG;
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hover || focused || isActive;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-current={isActive ? "page" : undefined}
      style={{
        display: "flex",
        alignItems: "baseline",
        width: "100%",
        padding: DRAWER.MENU_ITEM_PADDING,
        textDecoration: "none",
        color: fg,
        transform: active ? "translateX(10px)" : "translateX(0)",
        transition: "transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily,
          fontSize: isMobile ? DRAWER.MENU_FONT_SIZE_MOBILE : DRAWER.MENU_FONT_SIZE,
          fontWeight: DRAWER.MENU_WEIGHT,
          lineHeight: DRAWER.MENU_LINE_HEIGHT,
          letterSpacing: DRAWER.MENU_LETTER_SPACING,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {item.label}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -6,
            height: 2,
            backgroundColor: fg,
            transformOrigin: "left",
            pointerEvents: "none",
          }}
        />
      </span>
    </Link>
  );
});

const DrawerFooterLink = memo(function DrawerFooterLink({ href, children, color, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color,
        opacity: hover ? 1 : 0.55,
        textDecoration: hover ? "underline" : "none",
        textUnderlineOffset: "3px",
        transition: "opacity 0.2s ease",
      }}
    >
      {children}
    </Link>
  );
});

function MobileDrawer({
  menuList,
  isOpen,
  onClose,
  isCn,
  isMobile,
  isDark,
  pathname,
  navFontFamily,
  brandFontFamily,
  onLinkClick,
  title,
  onSearch,
  onToggleLanguage,
}) {
  const { DRAWER } = NAV_CONFIG;
  const [iconOpen, setIconOpen] = useState(false);

  const bg = isDark ? DRAWER.BACKGROUND_DARK : DRAWER.BACKGROUND_LIGHT;
  const fg = isDark ? DRAWER.TEXT_DARK : DRAWER.TEXT_LIGHT;
  const muted = isDark ? DRAWER.MUTED_DARK : DRAWER.MUTED_LIGHT;
  const line = isDark ? DRAWER.LINE_DARK : DRAWER.LINE_LIGHT;
  const padX = isMobile ? DRAWER.PADDING_X_MOBILE : DRAWER.PADDING_X;
  const headerHeight = isMobile ? DRAWER.HEADER_HEIGHT_MOBILE : DRAWER.HEADER_HEIGHT;

  // Let the menu icon morph from ☰ to ✕ on the first painted frame.
  useEffect(() => {
    if (!isOpen) {
      setIconOpen(false);
      return undefined;
    }
    const frame = requestAnimationFrame(() => setIconOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  // Full-screen overlays must not scroll the page underneath.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const panelTransition = {
    duration: DRAWER.ANIM_DURATION,
    ease: DRAWER.ANIM_EASING,
  };

  const headerButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    margin: 0,
    padding: DRAWER.ICON_HIT_PADDING,
    cursor: "pointer",
    color: fg,
    lineHeight: 0,
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
  };

  const drawer = (
    <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="drawer"
          data-drawer="menu"
          role="dialog"
          aria-modal="true"
          aria-label={isCn ? "主菜单" : "Main menu"}
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={panelTransition}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: DRAWER.Z_INDEX,
            display: "flex",
            flexDirection: "column",
            backgroundColor: bg,
            color: fg,
            overflow: "hidden",
          }}
        >
          <header
            style={{
              flexShrink: 0,
              paddingTop: "env(safe-area-inset-top, 0px)",
              borderBottom: `1px solid ${line}`,
              backgroundColor: bg,
            }}
          >
            <div
              style={{
                position: "relative",
                height: headerHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `0 ${padX}`,
                boxSizing: "border-box",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: DRAWER.ICON_SIZE + DRAWER.ICON_HIT_PADDING * 2,
                  height: 1,
                  flexShrink: 0,
                }}
              />

              <Link
                href="/"
                onClick={onClose}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  maxWidth: "58%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: fg,
                  fontFamily: brandFontFamily || navFontFamily,
                  fontSize: DRAWER.HEADER_TITLE_SIZE,
                  fontWeight: DRAWER.HEADER_TITLE_WEIGHT,
                  letterSpacing: DRAWER.HEADER_TITLE_LETTER_SPACING,
                  lineHeight: 1,
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </Link>

              <button
                type="button"
                aria-label={isCn ? "搜索" : "Search"}
                onClick={onSearch}
                style={headerButtonStyle}
              >
                <ThinSearchIcon
                  size={DRAWER.ICON_SIZE - 2}
                  stroke={DRAWER.ICON_STROKE}
                  color={fg}
                />
              </button>
            </div>
          </header>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overscrollBehavior: "contain",
              padding: `${DRAWER.MENU_TOP_GAP} ${padX} ${DRAWER.MENU_BOTTOM_GAP}`,
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: "100%", maxWidth: DRAWER.CONTENT_MAX_WIDTH, margin: 0 }}>
              <nav
                aria-label={isCn ? "主导航" : "Main menu"}
                style={{ display: "flex", flexDirection: "column" }}
              >
                {menuList.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.18 + index * DRAWER.STAGGER_DELAY,
                      duration: 0.55,
                      ease: DRAWER.ANIM_EASING,
                    }}
                  >
                    <DrawerLink
                      item={item}
                      isActive={pathname === item.href}
                      onClick={() => {
                        onClose();
                        onLinkClick();
                      }}
                      isMobile={isMobile}
                      fontFamily={navFontFamily}
                      fg={fg}
                    />
                  </motion.div>
                ))}
              </nav>
            </div>
          </div>

          <footer
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
              padding: `clamp(14px, 2vh, 22px) ${padX} calc(${DRAWER.FOOTER_PADDING_BOTTOM} + env(safe-area-inset-bottom, 0px))`,
              borderTop: `1px solid ${line}`,
              color: fg,
              fontFamily: navFontFamily,
              fontSize: DRAWER.FOOTER_LINK_SIZE,
              letterSpacing: DRAWER.FOOTER_LINK_LETTER_SPACING,
              textTransform: "uppercase",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px" }}>
                <DrawerFooterLink href="/contact" color={fg} onClick={onClose}>
                  {isCn ? "联系" : "Contact"}
                </DrawerFooterLink>
                <DrawerFooterLink href="/archive" color={fg} onClick={onClose}>
                  {isCn ? "档案" : "Archive"}
                </DrawerFooterLink>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={onToggleLanguage}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onToggleLanguage();
                    }
                  }}
                  style={{ cursor: "pointer", opacity: 0.55, lineHeight: 1.5 }}
                >
                  {isCn ? "EN" : "CN"}
                </span>
            </div>

            <div
              style={{
                maxWidth: "52%",
                color: muted,
                lineHeight: 1.5,
                textAlign: "right",
              }}
            >
              © {new Date().getFullYear()} {title}
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Fixed above the sliding panel so the ☰ → ✕ morph is visible while
        the drawer travels in from the left. */}
    <AnimatePresence>
      {isOpen && (
        <motion.button
          key="drawer-close"
          type="button"
          aria-label={isCn ? "关闭菜单" : "Close menu"}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            ...headerButtonStyle,
            position: "fixed",
            top: `calc(env(safe-area-inset-top, 0px) + ${(headerHeight - (DRAWER.ICON_SIZE + DRAWER.ICON_HIT_PADDING * 2)) / 2}px)`,
            left: padX,
            zIndex: DRAWER.Z_INDEX + 1,
          }}
        >
          <MorphMenuIcon
            open={iconOpen}
            size={DRAWER.ICON_SIZE}
            stroke={DRAWER.ICON_STROKE}
            color={fg}
            duration={DRAWER.MORPH_DURATION}
          />
        </motion.button>
      )}
    </AnimatePresence>
    </>
  );

  // Portal to body: the nav sits inside a lower stacking context in the home
  // layout, which would otherwise let the writing rail paint over the drawer.
  if (typeof document === "undefined") return null;
  return createPortal(drawer, document.body);
}

// Minimal top-anchored search overlay. Loads the artwork list once on first
// open, filters client-side, and routes to the artwork detail page on pick.
function NavSearch({ open, onClose, isCn, colors, isDark, fontFamily }) {
  const { SEARCH, DRAWER } = NAV_CONFIG;
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(null); // null → not fetched yet
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const fetchedRef = useRef(false);

  // Focus + Esc-to-close + reset whenever the overlay opens.
  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Keep the page still while the search overlay is open.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Lazy-load the searchable list the first time it opens.
  useEffect(() => {
    if (!open || fetchedRef.current) return undefined;
    fetchedRef.current = true;
    let cancelled = false;
    setLoading(true);
    fetch(SEARCH.API, { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setItems(list);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !items) return [];
    const targetLang = isCn ? "CN" : "EN";
    return items
      .filter((it) => {
        if (!it) return false;
        const lang = (it.language || "").toUpperCase();
        if (lang && lang !== targetLang) return false;
        return (it.title || "").toLowerCase().includes(q);
      })
      .slice(0, SEARCH.MAX_RESULTS);
  }, [query, items, isCn]);

  const goTo = useCallback(
    (it) => {
      if (!it) return;
      onClose();
      router.push(`${SEARCH.BASE_HREF}/${slugifyTitle(it.title)}`);
    },
    [onClose, router]
  );

  const onInputKeyDown = (e) => {
    if (e.key === "Enter") goTo(results[0]);
  };

  const text = colors.text;
  const bg = colors.background;
  const line = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";
  const muted = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const accentColor = SEARCH.ACCENT.COLOR ?? text;
  const ruleColor = SEARCH.RULE_COLOR ?? colors.border;
  const showHint = !!query.trim();

  const overlay = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SEARCH.ANIM_DURATION }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: DRAWER.Z_INDEX + 9,
              backgroundColor: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
            }}
          />

          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: "tween", duration: SEARCH.ANIM_DURATION, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: DRAWER.Z_INDEX + 10,
              backgroundColor: bg,
              borderBottom: `1px solid ${line}`,
              padding: SEARCH.PANEL_PADDING,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: SEARCH.PANEL_SHADOW,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: SEARCH.ICON_GAP,
                width: "100%",
                maxWidth: SEARCH.PANEL_MAX_WIDTH,
                margin: "0 auto",
                borderBottom: `${SEARCH.RULE_WIDTH} solid ${ruleColor}`,
              }}
            >
              {/* Field: leading vertical rule + input */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: SEARCH.ACCENT.GAP,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: SEARCH.ACCENT.WIDTH,
                    height: SEARCH.ACCENT.HEIGHT,
                    background: accentColor,
                    flexShrink: 0,
                  }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder={isCn ? SEARCH.PLACEHOLDER_CN : SEARCH.PLACEHOLDER_EN}
                  aria-label={isCn ? SEARCH.PLACEHOLDER_CN : SEARCH.PLACEHOLDER_EN}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: text,
                    fontFamily,
                    fontSize: SEARCH.INPUT_FONT_SIZE,
                    letterSpacing: SEARCH.INPUT_LETTER_SPACING,
                    padding: "10px 0",
                  }}
                />
              </div>

              {/* Search + close, grouped on the right */}
              <button
                type="button"
                onClick={() => goTo(results[0])}
                aria-label={isCn ? SEARCH.PLACEHOLDER_CN : SEARCH.PLACEHOLDER_EN}
                style={{
                  background: "none",
                  border: "none",
                  padding: 4,
                  margin: 0,
                  cursor: "pointer",
                  color: text,
                  lineHeight: 0,
                  flexShrink: 0,
                }}
              >
                <ThinSearchIcon size={SEARCH.ICON_SIZE} stroke={NAV_CONFIG.ACTIONS.ICON.STROKE} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label={isCn ? "关闭" : "Close"}
                style={{
                  background: "none",
                  border: "none",
                  padding: 4,
                  margin: 0,
                  cursor: "pointer",
                  color: muted,
                  fontFamily,
                  fontSize: 22,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Results / states */}
            <div
              style={{
                width: "100%",
                maxWidth: SEARCH.PANEL_MAX_WIDTH,
                margin: "0 auto",
              }}
            >
              {showHint && loading && (
                <div style={{ color: muted, fontFamily, fontSize: SEARCH.RESULT_FONT_SIZE, padding: SEARCH.RESULT_PADDING }}>
                  {isCn ? SEARCH.LOADING_CN : SEARCH.LOADING_EN}
                </div>
              )}

              {showHint && !loading && results.length === 0 && (
                <div style={{ color: muted, fontFamily, fontSize: SEARCH.RESULT_FONT_SIZE, padding: SEARCH.RESULT_PADDING }}>
                  {isCn ? SEARCH.NO_RESULTS_CN : SEARCH.NO_RESULTS_EN}
                </div>
              )}

              {results.map((it, i) => (
                <Link
                  key={it._id || it.id || `${it.title}-${i}`}
                  href={`${SEARCH.BASE_HREF}/${slugifyTitle(it.title)}`}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 16,
                    textDecoration: "none",
                    color: text,
                    fontFamily,
                    fontSize: SEARCH.RESULT_FONT_SIZE,
                    padding: SEARCH.RESULT_PADDING,
                    borderTop: i === 0 ? "none" : `1px solid ${line}`,
                  }}
                >
                  <span style={{ minWidth: 0 }}>{it.title}</span>
                  <span style={{ color: muted, flexShrink: 0 }}>{it.year || ""}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}

// ----------------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------------

export default function MainNav() {
  const { isCn, toggleLanguage } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { isManager } = useContext(ManagerContext);
  const { colors, isDark } = useReverseTheme();
  const { fontFamily: resolvedFontFamily } = useFont(NAV_CONFIG.FONT.ROLE);
  const navFontFamily = resolvedFontFamily || NAV_CONFIG.FONT.FALLBACK_FAMILY;
  const { fontFamily: brandFontFamily } = useFont(NAV_CONFIG.BRAND.FONT_ROLE);
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fires on every link click; kept lightweight (throttleMs: 0) since the
  // page may navigate away immediately after. Wire up analytics/prefetch
  // logic inside this function.
  const { execute: onLinkClick } = useAsyncAction(
    async () => {
      console.log("Link clicked – async action triggered");
    },
    { throttleMs: 0, onSuccess: () => {}, onError: (err) => console.log(err) }
  );

  const isHome = pathname === "/";
  // Home uses a compact archive bar (menu · wordmark · search) on DESKTOP
  // instead of the public site's brand-left / actions-right bar.
  // On MOBILE + TABLET the home page now uses the SAME bar as every other
  // route (brand left · Archive · | · EN/CN · menu right) so the whole site
  // shares one mobile header format.
  const isHomeLayout = isHome && !isMobile;
  const homeBarHeight = 56;
  const barHeight = isHomeLayout ? homeBarHeight : NAV_CONFIG.BAR.HEIGHT;
  const languageKey = isCn ? "cn" : "en";

  // Menus come from the Meta document (manager-editable) with the JSON as fallback.
  const { meta: siteMeta } = useSiteMeta();
  const menuSource = siteMeta?.menu || DEFAULT_MENUS;
  const menuList = useMemo(() => {
    const source = isManager ? menuSource.managerMenu : menuSource.mainMenu;
    const list = source?.[languageKey] || [];
    return isManager ? withSystemManagerEntries(list, languageKey) : list;
  }, [menuSource, isManager, languageKey]);

  // Resolve configured colors against the theme fallback once per render.
  // Nav text follows the theme (black in light, white in dark) so the whole
  // layout switches with the light/dark control.
  const linkColor = NAV_CONFIG.LINK.COLOR ?? colors.text;
  const barBorderColor = NAV_CONFIG.BAR.BORDER_COLOR ?? colors.border;

  // Action cluster colours — the archive button inverts against the theme.
  const archiveBg = NAV_CONFIG.ACTIONS.ARCHIVE.BACKGROUND ?? colors.text;
  const archiveColor = NAV_CONFIG.ACTIONS.ARCHIVE.COLOR ?? colors.background;
  const iconColor = NAV_CONFIG.ACTIONS.ICON.COLOR ?? linkColor;

  // Brand wordmark text — env-driven (see utils/artistUtils.js → getBrandName).
  const brandName = getBrandName(isCn);
  const brandColor = NAV_CONFIG.BRAND.COLOR ?? linkColor;

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setDrawerOpen((v) => !v), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  // Search lives in the drawer header; close the menu and open the overlay
  // in the same tick so the search input gets focus immediately.
  const openSearchFromDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSearchOpen(true);
  }, []);

  // On the archive page the top-right button becomes "Home" and returns to
  // the index page instead of linking to the archive again.
  const isArchivePage = pathname === "/archive" || pathname === "/artworks/archive";
  const archiveLabel = isArchivePage
    ? isCn
      ? "首页"
      : "Home"
    : isCn
    ? NAV_CONFIG.ACTIONS.ARCHIVE.LABEL_CN
    : NAV_CONFIG.ACTIONS.ARCHIVE.LABEL_EN;
  const archiveHref = isArchivePage ? "/" : NAV_CONFIG.ACTIONS.ARCHIVE.HREF;

  // ── Action cluster ───────────────────────────────────────────────
  // Archive → | → EN/CN → menu. The language switch sits at the end of
  // the text controls, separated from the archive button by a thin rule.
  const archiveAction = {
    variant: "solid",
    label: archiveLabel,
    href: archiveHref,
    background: archiveBg,
    color: archiveColor,
  };
  const menuAction = {
    variant: "icon",
    icon: ({ size, stroke }) => (
      <MorphMenuIcon open={drawerOpen} size={size} stroke={stroke} />
    ),
    ariaLabel: isCn ? "菜单" : "Menu",
    onClick: toggleDrawer,
  };

  // ── Smart show / hide on scroll ──────────────────────────────────
  // Hides while scrolling down; reappears on scroll-up, near the very top,
  // or the moment a NEW section boundary is crossed ("each new area... the
  // nav reappears on top"). rAF-throttled so it stays smooth on mobile.
  useEffect(() => {
    const { HEIGHT } = NAV_CONFIG.BAR;
    const { SHOW_AT_TOP, BOUNDARY_HOLD, SECTION_SELECTOR, SCROLLED_AT } = NAV_CONFIG.SCROLL;
    let prevY = window.scrollY;
    let lastBoundaryY = -1e9;
    let activeIdx = -1;
    let raf = 0;
    const getSections = () => Array.from(document.querySelectorAll(SECTION_SELECTOR));
    const activeIndex = () => {
      const secs = getSections();
      let idx = -1;
      for (let i = 0; i < secs.length; i += 1) {
        if (secs[i].getBoundingClientRect().top <= HEIGHT + 8) idx = i;
      }
      return idx;
    };
    const run = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - prevY;
      prevY = y;
      setScrolled(y > SCROLLED_AT);
      if (y <= SHOW_AT_TOP) {
        setHidden(false);
        activeIdx = activeIndex();
        return;
      }
      const secs = getSections();
      if (secs.length) {
        const idx = activeIndex();
        if (idx !== activeIdx) { // reached a new area → pop the bar back in
          activeIdx = idx;
          lastBoundaryY = y;
          setHidden(false);
          return;
        }
        if (Math.abs(y - lastBoundaryY) < BOUNDARY_HOLD) {
          setHidden(false);
          return;
        }
      }
      if (dy > 0) setHidden(true);
      else if (dy < 0) setHidden(false);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    run();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Never hide the bar while an overlay (drawer / search) is open.
  useEffect(() => {
    if (drawerOpen || searchOpen) setHidden(false);
  }, [drawerOpen, searchOpen]);

  // Reset to visible on every route change.
  useEffect(() => { setHidden(false); }, [pathname]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: NAV_CONFIG.BAR.Z_INDEX,
          // Keep the bar in its own stacking context so its solid background
          // always paints in front of the hero/content.
          isolation: "isolate",
          height: isMobile
            ? `calc(${barHeight}px + env(safe-area-inset-top, 0px))`
            : barHeight,
          boxSizing: "border-box",
          display: isMobile ? "flex" : "grid",
          // Brand wordmark sits in the CENTRE track on every non-mobile
          // breakpoint (1fr auto 1fr), so the title is always page-centred
          // regardless of how wide the right-hand action cluster is.
          gridTemplateColumns: isMobile ? undefined : "minmax(0, 1fr) auto minmax(0, 1fr)",
          columnGap: isMobile ? undefined : 28,
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${
            isMobile ? NAV_CONFIG.BAR.PADDING_HORIZONTAL_MOBILE : NAV_CONFIG.BAR.PADDING_HORIZONTAL_DESKTOP
          }px`,
          paddingTop: isMobile ? "env(safe-area-inset-top, 0px)" : 0,
          // Solid theme bar (white in light mode, black in dark mode).
          backgroundColor: colors.background,
          backgroundImage: "none",
          borderBottom: isHomeLayout
            ? `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}`
            : NAV_CONFIG.BAR.SHOW_BORDER
              ? `${NAV_CONFIG.BAR.BORDER_WIDTH} solid ${barBorderColor}`
              : "none",
          transform: hidden && !isHomeLayout ? "translateY(-100%)" : "translateY(0)",
          transition: NAV_CONFIG.BAR.HIDE_TRANSITION,
          willChange: "transform",
          pointerEvents: hidden ? "none" : "auto",
        }}
      >
        {isHomeLayout ? (
          <>
            <button
              type="button"
              onClick={toggleDrawer}
              aria-label={isCn ? "菜单" : "Menu"}
              style={{
                justifySelf: "start",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                padding: 4,
                margin: 0,
                cursor: "pointer",
                color: colors.text,
                lineHeight: 0,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <MorphMenuIcon
                open={drawerOpen}
                size={21}
                stroke={1.6}
                color={colors.text}
                duration={NAV_CONFIG.DRAWER.MORPH_DURATION}
              />
            </button>

            <Link
              href="/"
              style={{
                justifySelf: "center",
                textDecoration: "none",
                color: colors.text,
                fontFamily: navFontFamily,
                fontSize: isMobile ? 14 : 15,
                fontWeight: 600,
                letterSpacing: isMobile ? "0.18em" : "0.22em",
                textTransform: "uppercase",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {brandName}
            </Link>

            <div
              style={{
                justifySelf: "end",
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 10 : 18,
              }}
            >
              {/* Archive sits directly beside the search icon on the home
                  wordmark bar (and stays reachable on mobile next to it). */}
              <ActionButton
                variant={archiveAction.variant}
                label={archiveAction.label}
                href={archiveAction.href}
                background={archiveAction.background}
                color={archiveAction.color}
                isMobile={isMobile}
                fontFamily={navFontFamily}
              />
              <button
                type="button"
                onClick={openSearch}
                aria-label={isCn ? "搜索" : "Search"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  padding: 4,
                  margin: 0,
                  cursor: "pointer",
                  color: colors.text,
                  lineHeight: 0,
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <ThinSearchIcon size={21} stroke={1.6} color={colors.text} />
              </button>
              {!isMobile && (
                <NavSeparator
                  color={colors.text}
                  fontFamily={navFontFamily}
                  isMobile={isMobile}
                />
              )}
              {!isMobile && (
                <NavLanguageButton
                  isCn={isCn}
                  onToggle={toggleLanguage}
                  color={colors.text}
                  fontFamily={navFontFamily}
                  isMobile={isMobile}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div
              style={
                isMobile
                  ? undefined
                  : { gridColumn: "2", justifySelf: "center", display: "flex" }
              }
            >
              <Brand
                isMobile={isMobile}
                name={brandName}
                fontFamily={brandFontFamily || navFontFamily}
                color={brandColor}
              />
            </div>

            {/* Right cluster — Archive button + search + menu. Same on every
                breakpoint; the text menu lives in the drawer (menu icon). */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? NAV_CONFIG.ACTIONS.ICON.GAP_MOBILE : NAV_CONFIG.ACTIONS.ICON.GAP,
                flexShrink: 0,
                color: iconColor,
                ...(isMobile ? {} : { gridColumn: "3", justifySelf: "end" }),
              }}
            >
              <ActionButton
                variant={archiveAction.variant}
                label={archiveAction.label}
                href={archiveAction.href}
                background={archiveAction.background}
                color={archiveAction.color}
                isMobile={isMobile}
                fontFamily={navFontFamily}
              />
              <NavSeparator
                color={iconColor}
                fontFamily={navFontFamily}
                isMobile={isMobile}
              />
              <NavLanguageButton
                isCn={isCn}
                onToggle={toggleLanguage}
                color={iconColor}
                fontFamily={navFontFamily}
                isMobile={isMobile}
              />
              <ActionButton
                variant={menuAction.variant}
                icon={menuAction.icon}
                ariaLabel={menuAction.ariaLabel}
                onClick={menuAction.onClick}
                isMobile={isMobile}
                fontFamily={navFontFamily}
              />
            </div>
          </>
        )}
      </nav>

      {/* Spacer: reserves the fixed bar height so content is not hidden behind it. */}
      <div
        aria-hidden="true"
        style={{
          height: isMobile
            ? `calc(${barHeight}px + env(safe-area-inset-top, 0px))`
            : barHeight,
          flexShrink: 0,
        }}
      />

      <MobileDrawer
        menuList={menuList}
        isOpen={drawerOpen}
        onClose={closeDrawer}
        isCn={isCn}
        isMobile={isMobile}
        isDark={isDark}
        pathname={pathname}
        navFontFamily={navFontFamily}
        brandFontFamily={brandFontFamily || navFontFamily}
        onLinkClick={onLinkClick}
        title={brandName}
        onSearch={openSearchFromDrawer}
        onToggleLanguage={toggleLanguage}
      />

      <NavSearch
        open={searchOpen}
        onClose={closeSearch}
        isCn={isCn}
        colors={colors}
        isDark={isDark}
        fontFamily={navFontFamily}
      />
    </>
  );
}

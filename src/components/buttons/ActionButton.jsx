"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useReverseTheme } from "@/hooks/useReverseTheme";

// ═════════════════════════════════════════════════════════════════════════
// ActionButton — ONE small, reusable, config-driven button.
//
// The ICON and the LABEL/action are fully replaceable props, and `variant`
// lets the SAME component render as any button style the site needs:
//
//   • "icon"  → bare icon button            (nav cluster: search, menu)
//   • "solid" → solid boxed button          (nav "Archive")
//   • "card"  → bordered icon + label       (future "card buttons")
//
// Usage:
//   <ActionButton variant="icon"  icon={ThinMenuIcon} ariaLabel="Menu" onClick={open} />
//   <ActionButton variant="solid" label="Archive" href="/artworks/archive" />
//   <ActionButton variant="card"  icon={PlusIcon} label="View all" href="/x" />
//
// `icon` may be an already-rendered node OR a function ({ size, stroke }) => node.
// Colours fall back to the current (reverse) theme when not passed.
// ═════════════════════════════════════════════════════════════════════════
export const ACTION_BUTTON = {
  TRANSITION:
    "opacity 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
  ICON: { SIZE: 21, STROKE: 1.6, HIT_PADDING: "4px", HIT_PADDING_MOBILE: "9px", HOVER_OPACITY: 0.55 },
  SOLID: {
    FONT_SIZE: "15px",
    FONT_SIZE_MOBILE: "14px",
    FONT_WEIGHT: 500,
    LETTER_SPACING: "0.01em",
    PADDING: "9px 20px",
    PADDING_MOBILE: "9px 16px",
    MIN_HEIGHT_MOBILE: 40,
    BORDER_RADIUS: 0,
    HOVER_OPACITY: 0.78,
  },
  CARD: { FONT_SIZE: "14px", FONT_WEIGHT: 500, PADDING: "9px 14px", BORDER_RADIUS: 0, GAP: 8, HOVER_OPACITY: 0.8 },
};

function renderIcon(icon, size, stroke) {
  if (!icon) return null;
  if (typeof icon === "function") return icon({ size, stroke });
  return icon;
}

export default function ActionButton({
  icon,
  label,
  ariaLabel,
  onClick,
  href,
  variant = "icon",
  isMobile = false,
  iconSize,
  stroke,
  gap,
  color,
  background,
  borderColor,
  fontFamily,
  hoverOpacity,
  hitPadding,
  boxed = false,
  children,
  className,
  style,
  ...rest
}) {
  const { colors } = useReverseTheme();
  const [hover, setHover] = useState(false);
  const textColor = color ?? colors.text;
  const C = ACTION_BUTTON;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    whiteSpace: "nowrap",
    flexShrink: 0,
    cursor: "pointer",
    fontFamily,
    transition: C.TRANSITION,
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    ...style,
  };

  let btnStyle;
  let content;

  if (variant === "solid") {
    const s = C.SOLID;
    btnStyle = {
      ...base,
      fontSize: isMobile ? s.FONT_SIZE_MOBILE : s.FONT_SIZE,
      fontWeight: s.FONT_WEIGHT,
      letterSpacing: s.LETTER_SPACING,
      lineHeight: 1,
      padding: isMobile ? s.PADDING_MOBILE : s.PADDING,
      minHeight: isMobile ? s.MIN_HEIGHT_MOBILE : undefined,
      borderRadius: s.BORDER_RADIUS,
      background: background ?? colors.text,
      color: textColor,
      border: "none",
      opacity: hover ? hoverOpacity ?? s.HOVER_OPACITY : 1,
    };
    content = children ?? label;
  } else if (variant === "card") {
    const s = C.CARD;
    btnStyle = {
      ...base,
      gap: gap ?? s.GAP,
      fontSize: s.FONT_SIZE,
      fontWeight: s.FONT_WEIGHT,
      lineHeight: 1,
      padding: s.PADDING,
      borderRadius: s.BORDER_RADIUS,
      background: background ?? "transparent",
      color: textColor,
      border: `1px solid ${borderColor ?? colors.border}`,
      opacity: hover ? hoverOpacity ?? s.HOVER_OPACITY : 1,
    };
    content = (
      <>
        {renderIcon(icon, iconSize ?? 18, stroke ?? C.ICON.STROKE)}
        {label ? <span>{label}</span> : null}
      </>
    );
  } else {
    const s = C.ICON;
    btnStyle = {
      ...base,
      background: "none",
      border: "none",
      margin: 0,
      padding: hitPadding ?? (isMobile ? s.HIT_PADDING_MOBILE : s.HIT_PADDING),
      color: textColor,
      lineHeight: 0,
      opacity: hover ? hoverOpacity ?? s.HOVER_OPACITY : 1,
    };
    // Optional hover box — a square outline that only shows on hover
    // (used by the archive arrows).
    if (boxed) {
      btnStyle.lineHeight = 1;
      btnStyle.borderRadius = 0;
      btnStyle.padding = hitPadding ?? (isMobile ? "12px" : "10px");
      btnStyle.border = `1px solid ${hover ? borderColor ?? colors.border : "transparent"}`;
    }
    content = renderIcon(icon, iconSize ?? s.SIZE, stroke ?? s.STROKE);
  }

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    className,
    style: btnStyle,
  };

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} {...handlers} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={ariaLabel} onClick={onClick} {...handlers} {...rest}>
      {content}
    </button>
  );
}

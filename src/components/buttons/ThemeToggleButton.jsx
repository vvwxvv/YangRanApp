"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useReverseTheme } from "@/hooks/useReverseTheme";

/**
 * ThemeToggleButton
 * ─────────────────────────────────────────────────────────────────────────────
 * A single light/dark switch, icon-based (NO moon shape). It shows the mode you
 * would switch TO:
 *   • currently light → a solid disc ("go dark")
 *   • currently dark  → a sun ("go light")
 *
 * Reads/writes the app's real theme engine (next-themes) and colours itself from
 * the reverse-theme hook, so it works on any page and always stays legible.
 */
function ContrastIcon({ color, size }) {
  // Half black / half white circle (contrast icon) — no sun, no moon.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.6" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill={color} />
    </svg>
  );
}

export default function ThemeToggleButton({ size = 16, label, style = {}, className = "" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { colors, isDark } = useReverseTheme();

  // Theme is unknown during SSR — defer the icon until mounted to avoid a
  // hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dark = mounted ? resolvedTheme === "dark" : isDark;
  const toggle = () => setTheme(dark ? "light" : "dark");
  const color = colors.text;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label || (dark ? "Switch to light mode" : "Switch to dark mode")}
      className={className}
      style={{
        background: "none",
        border: "none",
        padding: 6,
        minWidth: 32,
        minHeight: 32,
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        lineHeight: 0,
        ...style,
      }}
    >
      {mounted ? (
        <ContrastIcon color={color} size={size} />
      ) : (
        <span style={{ width: size, height: size, display: "inline-block" }} />
      )}
    </button>
  );
}

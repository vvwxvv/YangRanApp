// useBatchEditTokens.js
// Shared design-token hook for all batch-edit UI components.
// Import this wherever you need themed colours instead of hardcoding.
"use client";

import { useDarkMode }     from "@/hooks/useDarkMode";
import { useReverseTheme } from "@/hooks/useReverseTheme";

/**
 * Returns a flat object of design tokens derived from the current
 * dark-mode state and reverse-theme colours.
 *
 * Usage:
 *   const tok = useBatchEditTokens();
 *   <Box sx={{ color: tok.text, background: tok.bgCard }} />
 */
export default function useBatchEditTokens() {
  const isDark = useDarkMode();
  const { colors } = useReverseTheme();
  return {
    isDark,
    text:        colors.text,
    muted:       isDark ? "var(--text-primary, #888)" : "var(--text-primary, #666)",
    hint:        isDark ? "var(--text-primary, #555)" : "var(--text-primary, #aaa)",
    bg:          isDark ? "var(--background-primary, #0a0a0a)" : "var(--background-primary, #ffffff)",
    bgCard:      isDark ? "var(--background-primary, #111111)" : "var(--background-primary, #ffffff)",
    bgHover:     isDark ? "var(--interactive-background-hover, #1a1a1a)" : "var(--interactive-background-hover, #f7f7f7)",
    bgSelected:  isDark ? "var(--interactive-background-hover, #1c1c1c)" : "var(--interactive-background-hover, #f0f0f0)",
    border:      colors.border,
    borderSoft:  isDark ? "var(--border-light, rgba(255,255,255,0.08))" : "var(--border-light, rgba(0,0,0,0.07))",
    accentNew:   isDark ? "#2a5c2a" : "#1a7f1a",
    accentEdit:  isDark ? "#7a6500" : "#a07800",
    accentOrder: isDark ? "#1a3a6a" : "#1565c0",
    bgOrder:     isDark ? "#0d1f3c" : "#e3f2fd",
  };
}
"use client";

/**
 * <ProgressBar>  — standalone, reusable, fully theme-configurable
 *
 * DROP-IN USAGE
 * ─────────────────────────────────────────────────────────────────────────────
 *   import ProgressBar, { PROGRESS_BAR_THEME } from "@/components/ProgressBar";
 *
 *   // default (dark/gold, matches ConstrucationPDFPage)
 *   <ProgressBar value={90} />
 *
 *   // BW variant (matches ConstructionBWPage)
 *   <ProgressBar value={90} themeOverrides={PROGRESS_BAR_THEMES.bw} />
 *
 *   // Fully custom
 *   <ProgressBar
 *     value={72}
 *     label="Progress"
 *     showLabel
 *     showEndpoints
 *     animateDelay={2.5}
 *     themeOverrides={{ colors: { fill: "#a0c4ff", track: "rgba(160,196,255,0.15)" } }}
 *   />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// ─── BASE THEME ────────────────────────────────────────────────────────────────
// Dark/gold — matches ConstrucationPDFPage

export const PROGRESS_BAR_THEME = {
  colors: {
    label:      "rgba(245,240,235,0.38)",   // "PROGRESS" text
    fill:       "#c9a96e",                  // filled portion
    track:      "rgba(245,240,235,0.10)",   // empty track
    shimmer:    "rgba(245,240,235,0.22)",   // travelling highlight
    percentage: "#f5f0eb",                  // big % number
    endpoints:  "rgba(245,240,235,0.25)",   // "0%" / "100%"
  },
  fonts: {
    ui:      "'Inter', 'Helvetica Neue', sans-serif",
    display: "'Cormorant Garamond', 'Georgia', serif",
  },
  sizes: {
    label:      "9px",
    percentage: "14px",
    endpoints:  "11px",
    trackHeight: "1px",   // thin = elegant; bump to "3px" for chunky
  },
  spacing: {
    labelMb:   "10px",
    rowMt:     "10px",
  },
  timing: {
    fillDelay:    2.5,    // s — how long after mount before bar animates in
    fillDuration: 2.0,    // s
    shimmerSpeed: 1.8,    // s — shimmer loop
    fadeDuration: 0.8,    // s — initial fade-in
    fadeDelay:    2.0,    // s
  },
};

// ─── PRESET OVERRIDES ─────────────────────────────────────────────────────────

export const PROGRESS_BAR_THEMES = {
  /** Dark/gold — same as the default above */
  dark: {},

  /** Black-and-white — matches ConstructionBWPage */
  bw: {
    colors: {
      label:      "rgba(0,0,0,0.45)",
      fill:       "#000000",
      track:      "rgba(0,0,0,0.12)",
      shimmer:    "rgba(100,100,100,0.35)",
      percentage: "#000000",
      endpoints:  "rgba(0,0,0,0.35)",
    },
  },
};

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

const ProgressBar = ({
  /** 0–100 */
  value          = 0,

  /** Label shown above the bar. Pass null / "" to hide. */
  label          = "Progress",

  /** Whether to show the label row */
  showLabel      = true,

  /** Whether to show "0%" / "100%" endpoints */
  showEndpoints  = true,

  /** Whether to show the current value % beside the bar */
  showValue      = true,

  /** Delay before bar animates (seconds). Lets page-load animations finish first. */
  animateDelay,

  /** Cap fill width at a max px string, e.g. "420px". Defaults to "100%". */
  maxWidth       = "100%",

  /** Partial override of PROGRESS_BAR_THEME */
  themeOverrides = {},

  /** Any extra sx props for the root Box */
  sx             = {},
}) => {
  const theme = {
    ...PROGRESS_BAR_THEME,
    colors:  { ...PROGRESS_BAR_THEME.colors,  ...(themeOverrides.colors  ?? {}) },
    fonts:   { ...PROGRESS_BAR_THEME.fonts,   ...(themeOverrides.fonts   ?? {}) },
    sizes:   { ...PROGRESS_BAR_THEME.sizes,   ...(themeOverrides.sizes   ?? {}) },
    spacing: { ...PROGRESS_BAR_THEME.spacing, ...(themeOverrides.spacing ?? {}) },
    timing:  { ...PROGRESS_BAR_THEME.timing,  ...(themeOverrides.timing  ?? {}) },
  };

  const { colors, fonts, sizes, spacing, timing } = theme;
  const fillDelay = animateDelay ?? timing.fillDelay;

  const clamped = Math.min(100, Math.max(0, value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: timing.fadeDuration, delay: timing.fadeDelay }}
      style={{ width: "100%", maxWidth }}
    >
      <Box sx={{ width: "100%", ...sx }}>

        {/* ── Label row ── */}
        {showLabel && label && (
          <Typography
            component="div"
            sx={{
              fontFamily:    fonts.ui,
              fontSize:      sizes.label,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color:         colors.label,
              mb:            spacing.labelMb,
              userSelect:    "none",
            }}
          >
            {label}
          </Typography>
        )}

        {/* ── Track ── */}
        <Box
          sx={{
            position:     "relative",
            width:        "100%",
            height:       sizes.trackHeight,
            background:   colors.track,
            overflow:     "hidden",
          }}
        >
          {/* Filled portion */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{
              delay:    fillDelay,
              duration: timing.fillDuration,
              ease:     "easeOut",
            }}
            style={{
              position:   "absolute",
              top:        0,
              left:       0,
              height:     "100%",
              background: colors.fill,
              overflow:   "hidden",
            }}
          >
            {/* Shimmer highlight */}
            <motion.div
              animate={{ x: ["-120%", "120%"] }}
              transition={{
                duration: timing.shimmerSpeed,
                repeat:   Infinity,
                ease:     "linear",
                delay:    fillDelay + timing.fillDuration,
              }}
              style={{
                position:   "absolute",
                inset:      0,
                background: `linear-gradient(90deg, transparent, ${colors.shimmer}, transparent)`,
              }}
            />
          </motion.div>
        </Box>

        {/* ── Endpoints + value row ── */}
        {(showEndpoints || showValue) && (
          <Box
            sx={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              mt:             spacing.rowMt,
            }}
          >
            {showEndpoints ? (
              <Typography
                sx={{
                  fontFamily: fonts.ui,
                  fontSize:   sizes.endpoints,
                  color:      colors.endpoints,
                  userSelect: "none",
                }}
              >
                0%
              </Typography>
            ) : (
              <span />
            )}

            {showValue && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: fillDelay + timing.fillDuration + 0.3 }}
              >
                <Typography
                  sx={{
                    fontFamily:    fonts.ui,
                    fontSize:      sizes.percentage,
                    fontWeight:    300,
                    letterSpacing: "0.06em",
                    color:         colors.percentage,
                    userSelect:    "none",
                  }}
                >
                  {clamped}%
                </Typography>
              </motion.div>
            )}

            {showEndpoints ? (
              <Typography
                sx={{
                  fontFamily: fonts.ui,
                  fontSize:   sizes.endpoints,
                  color:      colors.endpoints,
                  userSelect: "none",
                }}
              >
                100%
              </Typography>
            ) : (
              <span />
            )}
          </Box>
        )}

      </Box>
    </motion.div>
  );
};

export default ProgressBar;
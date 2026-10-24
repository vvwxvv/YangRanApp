// StatusBadge.jsx
// Generic pill badge for status labels (new, edited, draft, etc.)
// Fully standalone — no tok dependency, accepts raw color.
"use client";

import React from "react";
import { Box } from "@mui/material";

/**
 * StatusBadge
 *
 * @param {string} label  – Text shown inside the badge (auto-uppercased)
 * @param {string} color  – Border + text color (hex / css var)
 * @param {object} sx     – Optional MUI sx overrides
 *
 * Usage:
 *   <StatusBadge label="new"    color="#1a7f1a" />
 *   <StatusBadge label="edited" color="#a07800" />
 */
export default function StatusBadge({ label, color, sx = {} }) {
  return (
    <Box
      component="span"
      sx={{
        display:       "inline-block",
        fontSize: "9px",
        fontWeight:    600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding:       "2px 7px",
        borderRadius:  "20px",
        border:        `1px solid ${color}`,
        color,
        lineHeight:    1.6,
        flexShrink:    0,
        ...sx,
      }}
    >
      {label}
    </Box>
  );
}
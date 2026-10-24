"use client";

import { Box } from "@mui/material";

/**
 * Gradient separator line.
 * Reused across detail pages wherever a visual divider is needed.
 */
export default function SeparatorLine() {
  return (
    <Box
      style={{
        width: "100%",
        height: "2px",
        background:"black",
        margin: "40px 0 20px 0",
      }}
    />
  );
}
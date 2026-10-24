"use client";

import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";

export default function GridAndMasonryLayout({
  masonry = false,
  columns = 3,
  spacing = 2,
  items = [],
  keyExtractor,
  renderItem,
}) {
  if (!items || items.length === 0) return null;

  /*
   * Always convert columns to a responsive object.
   * xs:1 ensures mobile is ALWAYS single-column via CSS,
   * regardless of what JS device-detection thinks.
   */
  const responsiveCols =
    typeof columns === "object"
      ? { xs: 1, ...columns }           // caller already passed responsive obj → keep, force xs:1
      : { xs: 1, sm: Math.min(columns, 2), md: columns };  // number → expand

  return (
    /*
     * overflow:hidden on wrapper clips MUI Masonry's internal
     * negative margin so content edges = parent edges on all breakpoints.
     */
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Masonry columns={responsiveCols} spacing={spacing}>
        {items.map((item, i) => (
          <div key={keyExtractor?.(item, i) ?? i}>
            {renderItem(item, i)}
          </div>
        ))}
      </Masonry>
    </Box>
  );
}
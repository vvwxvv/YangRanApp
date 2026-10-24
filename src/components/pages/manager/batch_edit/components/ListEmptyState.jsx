// ListEmptyState.jsx
// Zero-data placeholder for any list view.
"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import useBatchEditTokens from "@/components/pages/manager/hooks/useBatchEditTokens";
/**
 * ListEmptyState
 *
 * @param {boolean}  isFiltered     – True when a search/filter is active
 *                                    (shows "no matching" vs "no data" copy)
 * @param {string}   emptyText      – Override the no-data message
 * @param {string}   filteredText   – Override the no-match message
 * @param {function} getLabel       – Optional label resolver: getLabel("noData") etc.
 * @param {object}   labelFontStyle – Optional MUI sx font overrides
 * @param {object}   sx             – Container sx overrides
 *
 * Usage:
 *   <ListEmptyState isFiltered={!!searchTerm} getLabel={getLabel} />
 */
export default function ListEmptyState({
  isFiltered     = false,
  emptyText,
  filteredText,
  getLabel,
  labelFontStyle = {},
  sx             = {},
}) {
  const tok = useBatchEditTokens();

  const message = isFiltered
    ? (filteredText ?? getLabel?.("noMatchingData") ?? "No matching records")
    : (emptyText    ?? getLabel?.("noData")         ?? "No records yet");

  return (
    <Box
      sx={{
        border:       `1px solid ${tok.borderSoft}`,
        borderRadius: "10px",
        padding:      "40px 20px",
        textAlign:    "center",
        ...sx,
      }}
    >
      <Typography sx={{ color: tok.hint, fontSize: "11px", ...labelFontStyle }}>
        {message}
      </Typography>
    </Box>
  );
}
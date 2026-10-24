// FieldRow.jsx
// Generic key-value field row for detail/expand views.
// Suitable for any record detail panel, not just batch-edit.
"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import useBatchEditTokens from "@/components/pages/manager/hooks/useBatchEditTokens";
import { resolveFieldLabel } from "@/components/pages/manager/batch_edit/utils/fieldLabels";
import { getSystemLabel } from "@/components/labels/system_labels";

/**
 * FieldRow
 *
 * Renders a two-column (label | value) row with a top divider line.
 * If col.renderCell is provided it renders that instead of plain text.
 *
 * @param {object}   col            – Column definition: { field, headerName?, label?, renderCell? }
 * @param {object}   row            – The data record
 * @param {function} onCellUpdate   – Passed through to renderCell: (rowId, field, value) => void
 * @param {object}   labelFontStyle – Optional MUI sx font overrides
 *
 * Usage:
 *   <FieldRow col={col} row={row} onCellUpdate={onCellUpdate} />
 */
export default function FieldRow({ col, row, onCellUpdate, labelFontStyle = {}, isCn = false }) {
  const fieldLabel = resolveFieldLabel(col, { getSystemLabel, isCn });
  const tok      = useBatchEditTokens();
  const rawValue = row[col.field];
  const isEmpty  = rawValue === null || rawValue === undefined || rawValue === "";

  return (
    <Box
      sx={{
        display:             "grid",
        gridTemplateColumns: "120px 1fr",
        alignItems:          "start",
        gap:                 "10px",
        padding:             "8px 0",
        borderTop:           `1px solid ${tok.borderSoft}`,
      }}
    >
      {/* Label */}
      <Typography sx={{
        fontSize: "9px",
        fontWeight:    600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color:         tok.muted,
        paddingTop:    "6px",
        ...labelFontStyle,
      }}>
        {fieldLabel}
      </Typography>

      {/* Value */}
      <Box>
        {col.renderCell
          ? col.renderCell(row, col, onCellUpdate)
          : (
            <Typography sx={{
              fontSize: "11px",
              color:     isEmpty ? tok.hint : tok.text,
              fontStyle: isEmpty ? "italic" : "normal",
              ...labelFontStyle,
            }}>
              {isEmpty ? "—" : rawValue}
            </Typography>
          )
        }
      </Box>
    </Box>
  );
}
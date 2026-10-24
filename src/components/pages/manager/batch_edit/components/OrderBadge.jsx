// OrderBadge.jsx
// Inline-editable order number badge.
// Click to edit in place; Enter / blur to save; Escape to cancel.
// Usable in any list or table row — not tied to batch-edit specifically.
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, InputBase, Tooltip, Typography } from "@mui/material";
import useBatchEditTokens from "@/components/pages/manager/hooks/useBatchEditTokens";
/**
 * OrderBadge
 *
 * @param {string}   rowId         – Identifier of the row being edited
 * @param {any}      value         – Current order value. A scalar is inline
 *                                   editable; an object (multi page-order, e.g.
 *                                   { artist_page_order, exhibition_page_order })
 *                                   renders as a compact read-only summary.
 * @param {function} onSave        – Called with (rowId, newValue) on commit
 * @param {object}   labelFontStyle – Optional MUI sx font overrides
 * @param {string}   tooltipText   – Override the edit tooltip (default: "Click to edit order")
 *
 * Usage:
 *   <OrderBadge rowId={row.id} value={row.order} onSave={(id, val) => update(id, "order", val)} />
 */
/** True for a plain object (an order map), not a scalar/array/null. */
const isOrderMap = (v) => !!v && typeof v === "object" && !Array.isArray(v);

/** Non-empty entries of an order map. */
export const orderMapEntries = (v) =>
  Object.entries(v || {}).filter(
    ([, val]) => val !== null && val !== undefined && String(val).trim() !== ""
  );

/** "artist_page_order" → "Artist", "rolling_img_order" → "Rolling Img". */
export const shortOrderKey = (key = "") =>
  String(key)
    .replace(/_?(page_)?order$/i, "")
    .replace(/^art_fair$/i, "fair")
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function OrderBadge({
  rowId,
  value,
  onSave,
  // legacy alias — BatchEditCardList called this onCellUpdate(rowId, "order", val)
  onCellUpdate,
  labelFontStyle = {},
  tooltipText    = "Click to edit order",
}) {
  const tok = useBatchEditTokens();

  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(String(value ?? ""));
  const inputRef              = useRef(null);

  // Support both onSave and legacy onCellUpdate
  const handleSave = useCallback((newVal) => {
    if (onSave)        onSave(rowId, newVal);
    if (onCellUpdate)  onCellUpdate(rowId, "order", newVal);
  }, [onSave, onCellUpdate, rowId]);

  // Keep draft in sync when value changes externally
  useEffect(() => {
    if (!editing) setDraft(String(value ?? ""));
  }, [value, editing]);

  const startEdit = useCallback((e) => {
    e.stopPropagation();
    setDraft(String(value ?? ""));
    setEditing(true);
  }, [value]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed !== String(value ?? "")) handleSave(trimmed);
    setEditing(false);
  }, [draft, value, handleSave]);

  const cancel = useCallback(() => {
    setDraft(String(value ?? ""));
    setEditing(false);
  }, [value]);

  const handleKey = useCallback((e) => {
    e.stopPropagation();
    if (e.key === "Enter")  { e.preventDefault(); commit(); }
    if (e.key === "Escape") { cancel(); }
  }, [commit, cancel]);

  const orderMap = isOrderMap(value) ? orderMapEntries(value) : null;
  const isEmpty = isOrderMap(value)
    ? orderMap.length === 0
    : value === null || value === undefined || String(value).trim() === "";

  // ── Multi-key order maps (artworks/images) — read-only summary ──────────
  // The order pages own those values; typing a JSON blob in one field would
  // be wrong, so we only show what is set.
  if (orderMap) {
    const raw = orderMap.map(([k, v]) => `${k}: ${v}`).join("\n");
    return (
      <Tooltip title={raw || "No order set"} placement="top">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            flexWrap: "wrap",
            rowGap: "2px",
            minHeight: 24,
            px: "7px",
            py: "2px",
            borderRadius: "6px",
            border: `1px solid ${isEmpty ? tok.borderSoft : tok.accentOrder}`,
            bgcolor: isEmpty ? "transparent" : tok.bgOrder,
            cursor: "default",
            flexShrink: 0,
            maxWidth: 260,
          }}
        >
          {isEmpty ? (
            <Typography sx={{ fontSize: 9, fontWeight: 700, color: tok.hint, letterSpacing: "0.06em", ...labelFontStyle }}>
              — ORDER —
            </Typography>
          ) : (
            orderMap.map(([k, v]) => (
              <Box key={k} sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <Typography
                  sx={{
                    fontSize: 9, fontWeight: 700, color: tok.hint,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    userSelect: "none", ...labelFontStyle,
                  }}
                >
                  {shortOrderKey(k)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10, fontWeight: 600, color: tok.text,
                    fontVariantNumeric: "tabular-nums", ...labelFontStyle,
                  }}
                >
                  {String(v)}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Tooltip>
    );
  }

  if (editing) {
    return (
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          display:      "flex",
          alignItems:   "center",
          border:       `1.5px solid ${tok.accentOrder}`,
          borderRadius: "6px",
          overflow:     "hidden",
          bgcolor:      tok.bgOrder,
          flexShrink:   0,
          height:       24,
        }}
      >
        <Typography sx={{
          fontSize: 9, fontWeight: 700, color: tok.accentOrder,
          px: "5px", letterSpacing: "0.06em", userSelect: "none",
          ...labelFontStyle,
        }}>
          #
        </Typography>
        <InputBase
          inputRef={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKey}
          inputProps={{
            style: {
              width:              Math.max(28, draft.length * 8 + 12),
              fontSize: 10,
              fontWeight:         600,
              padding:            "0 4px 0 0",
              color:              tok.text,
              fontVariantNumeric: "tabular-nums",
            },
          }}
          sx={{ flex: 1 }}
        />
      </Box>
    );
  }

  return (
    <Tooltip title={tooltipText} placement="top">
      <Box
        onClick={startEdit}
        sx={{
          display:      "flex",
          alignItems:   "center",
          gap:          "3px",
          height:       24,
          px:           "7px",
          borderRadius: "6px",
          border:       `1px solid ${isEmpty ? tok.borderSoft : tok.accentOrder}`,
          bgcolor:      isEmpty ? "transparent" : tok.bgOrder,
          cursor:       "pointer",
          flexShrink:   0,
          transition:   "all 0.15s",
          "&:hover":    { borderColor: tok.accentOrder, bgcolor: tok.bgOrder },
        }}
      >
        <Typography sx={{
          fontSize: 9, fontWeight: 700,
          color: isEmpty ? tok.hint : tok.accentOrder,
          letterSpacing: "0.06em",
          ...labelFontStyle,
        }}>
          #
        </Typography>
        <Typography sx={{
          fontSize: 10,
          fontWeight:         600,
          color:              isEmpty ? tok.hint : tok.text,
          fontVariantNumeric: "tabular-nums",
          fontStyle:          isEmpty ? "italic" : "normal",
          ...labelFontStyle,
        }}>
          {isEmpty ? "—" : value}
        </Typography>
      </Box>
    </Tooltip>
  );
}
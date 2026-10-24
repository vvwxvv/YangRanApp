"use client";

/**
 * BachEditSortBar + useBachEditSortBar
 *
 * Handles sort state, sorted data, and renders the sort button bar.
 *
 * Built-in fields (auto-detected from data keys):
 *   order  — numeric sort  (label "Order #", asc default)
 *   year   — numeric sort  (label "Year",    desc default)
 *   alpha  — string sort   (label "A – Z",   asc  default)
 *            always present
 *
 * The Image model has: order (String → sorted numerically), updatedAt
 * (DateTime), tag_en/tag_cn, type, etc. The sort bar correctly handles
 * order as numeric even though it is stored as a String in MongoDB.
 *
 * Props for <BachEditSortBar> (spread BachEditSortBarProps from the hook):
 *   sortKey    {string}
 *   sortDir    {string}   "asc" | "desc"
 *   fields     {Array}
 *   defaultKey {string}
 *   defaultDir {string}
 *   isDefault  {boolean}
 *   onSort     {Function} (key, dir) => void
 *   onReset    {Function} () => void
 *   labelFontStyle {object}
 *   sx             {object}
 *
 * hideSortBar prop on BatchEditCardList gates rendering; this file is
 * unchanged by that flag.
 */

import React, { useState, useMemo, useCallback } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import CalendarTodayIcon  from "@mui/icons-material/CalendarToday";
import SortIcon           from "@mui/icons-material/Sort";
import SortByAlphaIcon    from "@mui/icons-material/SortByAlpha";
import NumbersIcon        from "@mui/icons-material/Numbers";
import ArrowUpwardIcon    from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon  from "@mui/icons-material/ArrowDownward";
import RestartAltIcon     from "@mui/icons-material/RestartAlt";
import { useDarkMode }    from "@/hooks/useDarkMode";
import { useReverseTheme } from "@/hooks/useReverseTheme";

// ─── tokens ───────────────────────────────────────────────────────────────────

function useTokens() {
  const isDark = useDarkMode();
  const { colors } = useReverseTheme();
  return {
    text:        colors.text,
    muted:       isDark ? "var(--text-primary, #888)" : "var(--text-primary, #666)",
    hint:        isDark ? "var(--text-primary, #555)" : "var(--text-primary, #aaa)",
    bg:          isDark ? "var(--background-primary, #0a0a0a)" : "var(--background-primary, #ffffff)",
    bgHover:     isDark ? "var(--interactive-background-hover, #1a1a1a)" : "var(--interactive-background-hover, #f7f7f7)",
    bgSelected:  isDark ? "var(--interactive-background-hover, #1c1c1c)" : "var(--interactive-background-hover, #f0f0f0)",
    borderSoft:  isDark ? "var(--border-light, rgba(255,255,255,0.08))" : "var(--border-light, rgba(0,0,0,0.07))",
    accentSort:  isDark ? "var(--text-primary, #ffffff)" : "var(--text-primary, #000000)",
  };
}

// ─── field detection ──────────────────────────────────────────────────────────

export function detectSortFields(data) {
  if (!data?.length) return { hasYear: false, hasOrder: false, hasUpdatedAt: false };
  const s = data[0];
  return {
    hasYear:      "year"      in s,
    hasOrder:     "order"     in s,
    hasUpdatedAt: "updatedAt" in s,
  };
}

// ─── field list builder ───────────────────────────────────────────────────────

/**
 * Build the canonical fields array.
 * Each field: { key, label, icon, type, defaultDir }
 *
 * Field order: order → year → updatedAt → alpha → extras
 */
export function buildFields(data, { labels = {}, extraFields = [] } = {}) {
  const { hasYear, hasOrder, hasUpdatedAt } = detectSortFields(data);
  const fields = [];

  // Order # — numeric, stored as String in Image model but parsed as float
  if (hasOrder) fields.push({
    key:        "order",
    label:      labels.order ?? "Order #",
    icon:       NumbersIcon,
    type:       "numeric",
    defaultDir: "asc",
  });

  if (hasYear) fields.push({
    key:        "year",
    label:      labels.year ?? "Year",
    icon:       CalendarTodayIcon,
    type:       "numeric",
    defaultDir: "desc",
  });

  if (hasUpdatedAt) fields.push({
    key:        "updatedAt",
    label:      labels.updatedAt ?? "Updated",
    icon:       CalendarTodayIcon,
    type:       "date",
    defaultDir: "desc",
  });

  // A–Z always present
  fields.push({
    key:        "alpha",
    label:      labels.alpha ?? "A – Z",
    icon:       SortByAlphaIcon,
    type:       "string",
    defaultDir: "asc",
  });

  for (const ef of extraFields) {
    fields.push({
      key:        ef.key,
      label:      ef.label ?? ef.key,
      icon:       ef.icon ?? SortIcon,
      type:       ef.type ?? "string",
      defaultDir: ef.defaultDir ?? "asc",
    });
  }

  return fields;
}

// ─── default key resolution ───────────────────────────────────────────────────

export function resolveDefault(fields, overrideKey, overrideDir) {
  if (overrideKey) {
    const f = fields.find((f) => f.key === overrideKey);
    return { key: overrideKey, dir: overrideDir ?? f?.defaultDir ?? "asc" };
  }
  // priority: order → year → first field
  for (const p of ["order", "year"]) {
    const f = fields.find((f) => f.key === p);
    if (f) return { key: f.key, dir: f.defaultDir ?? "asc" };
  }
  const first = fields[0];
  return { key: first?.key ?? "alpha", dir: first?.defaultDir ?? "asc" };
}

// ─── sort engine ─────────────────────────────────────────────────────────────

export function sortData(data, sortKey, sortDir, options = {}) {
  const { getAlphaKey, fields = [] } = options;

  const defaultAlpha = (row) => (
    row.title_en || row.title_cn ||
    row.name_en  || row.name_cn  ||
    row.title    || row.name     || ""
  ).toLowerCase();

  const alphaFn  = getAlphaKey ?? defaultAlpha;
  const fieldDef = fields.find((f) => f.key === sortKey);
  const type     = sortKey === "alpha"
    ? "string"
    : fieldDef?.type ?? (sortKey === "year" ? "numeric" : "string");

  return [...data].sort((a, b) => {
    if (type === "numeric") {
      // parseFloat handles order stored as String ("1", "10", etc.)
      const va = parseFloat(a[sortKey]) || 0;
      const vb = parseFloat(b[sortKey]) || 0;
      return sortDir === "asc" ? va - vb : vb - va;
    }
    if (type === "date") {
      const va = new Date(a[sortKey] || 0).getTime();
      const vb = new Date(b[sortKey] || 0).getTime();
      return sortDir === "asc" ? va - vb : vb - va;
    }
    // string / alpha
    const sa = sortKey === "alpha" ? alphaFn(a) : String(a[sortKey] ?? "").toLowerCase();
    const sb = sortKey === "alpha" ? alphaFn(b) : String(b[sortKey] ?? "").toLowerCase();
    return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
  });
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export function useBachEditSortBar(data, options = {}) {
  const {
    labels      = {},
    extraFields = [],
    defaultKey:  overrideKey,
    defaultDir:  overrideDir,
    getAlphaKey,
  } = options;

  const fields = useMemo(
    () => buildFields(data, { labels, extraFields }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.length > 0 ? JSON.stringify(Object.keys(data[0] ?? {})) : ""]
  );

  const { key: initKey, dir: initDir } = useMemo(
    () => resolveDefault(fields, overrideKey, overrideDir),
    [fields, overrideKey, overrideDir]
  );

  const [sortKey, setSortKey] = useState(initKey);
  const [sortDir, setSortDir] = useState(initDir);

  const { key: defKey, dir: defDir } = useMemo(
    () => resolveDefault(fields, overrideKey, overrideDir),
    [fields, overrideKey, overrideDir]
  );

  const handleSort  = useCallback((k, d) => { setSortKey(k); setSortDir(d); }, []);
  const handleReset = useCallback(() => { setSortKey(defKey); setSortDir(defDir); }, [defKey, defDir]);

  const sortedData = useMemo(
    () => sortData(data, sortKey, sortDir, { getAlphaKey, fields }),
    [data, sortKey, sortDir, getAlphaKey, fields]
  );

  const isDefault = sortKey === defKey && sortDir === defDir;

  return {
    sortedData,
    sortKey,
    sortDir,
    setSortKey,
    setSortDir,
    BachEditSortBarProps: {
      sortKey,
      sortDir,
      fields,
      defaultKey: defKey,
      defaultDir: defDir,
      isDefault,
      onSort:  handleSort,
      onReset: handleReset,
    },
  };
}

// ─── BachEditSortBar UI ───────────────────────────────────────────────────────

export default function BachEditSortBar({
  sortKey,
  sortDir,
  fields = [],
  defaultKey,
  defaultDir,
  isDefault,
  onSort,
  onReset,
  labelFontStyle = {},
  sx = {},
}) {
  const tok = useTokens();
  const _isDefault = isDefault ?? (sortKey === defaultKey && sortDir === defaultDir);

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: "6px",
      padding: "5px 10px",
      borderRadius: "8px",
      border: `1px solid ${tok.borderSoft}`,
      backgroundColor: tok.bgHover,
      flexWrap: "wrap",
      ...sx,
    }}>
      <Typography sx={{
        fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em",
        textTransform: "uppercase", color: tok.hint,
        marginRight: "2px", flexShrink: 0,
        ...labelFontStyle,
      }}>
        Sort
      </Typography>

      {fields.map((field) => (
        <SortButton
          key={field.key}
          field={field}
          active={sortKey === field.key}
          sortDir={sortDir}
          onSort={onSort}
          tok={tok}
          labelFontStyle={labelFontStyle}
        />
      ))}

      <Box sx={{ flex: 1 }} />

      {!_isDefault && (
        <Tooltip title="Reset to default order" placement="top">
          <IconButton
            size="small"
            onClick={onReset}
            sx={{
              width: 24, height: 24, borderRadius: "5px",
              border: `1px solid ${tok.borderSoft}`,
              color: tok.muted,
              "&:hover": { backgroundColor: tok.bgHover, color: tok.text },
            }}
          >
            <RestartAltIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

// ─── internal: single sort button ────────────────────────────────────────────

function SortButton({ field, active, sortDir, onSort, tok, labelFontStyle }) {
  const { key, label, icon: Icon, defaultDir = "asc" } = field;
  const nextDir = active ? (sortDir === "asc" ? "desc" : "asc") : defaultDir;
  const DirIcon = active ? (sortDir === "asc" ? ArrowUpwardIcon : ArrowDownwardIcon) : null;

  return (
    <Tooltip
      title={active ? `${label} — click to reverse` : `Sort by ${label}`}
      placement="top"
    >
      <Box
        onClick={() => onSort(key, nextDir)}
        sx={{
          display: "flex", alignItems: "center", gap: "4px",
          padding: "3px 8px", borderRadius: "6px", cursor: "pointer",
          border: active
            ? `1px solid ${tok.accentSort}`
            : `1px solid ${tok.borderSoft}`,
          backgroundColor: active ? tok.bgSelected : "transparent",
          transition: "all 0.15s",
          "&:hover": { backgroundColor: tok.bgHover, borderColor: tok.muted },
          userSelect: "none",
        }}
      >
        {Icon && <Icon sx={{ fontSize: 12, color: active ? tok.text : tok.muted }} />}
        <Typography sx={{
          fontSize: "9px",
          fontWeight: active ? 700 : 400,
          color: active ? tok.text : tok.muted,
          letterSpacing: "0.04em",
          lineHeight: 1,
          ...labelFontStyle,
        }}>
          {label}
        </Typography>
        {DirIcon && <DirIcon sx={{ fontSize: 9, color: tok.text }} />}
      </Box>
    </Tooltip>
  );
}
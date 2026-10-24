"use client";

/**
 * BatchEditCardList
 *
 * Batch-edit card list. Composes the shared UI primitives from this folder:
 *   useBatchEditTokens  — design tokens
 *   StatusBadge         — new / edited pills
 *   OrderBadge          — inline-editable order number
 *   FieldRow            — key-value field in expanded body
 *   ListPaginationBar   — pagination footer
 *   ListEmptyState      — zero-data placeholder
 */

import React, {
  useState, useCallback, useMemo, useContext,
} from "react";
import {
  Box, Checkbox, IconButton, Paper, Collapse, Typography,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ImageThumbnailWithPreview from "@/components/images/ImageThumbnailWithPreview";
import BachEditSortBar, { useBachEditSortBar } from "@/components/pages/manager/batch_edit/components/BachEditSortBar";

import useBatchEditTokens from "@/components/pages/manager/hooks/useBatchEditTokens";
import StatusBadge        from "@/components/pages/manager/batch_edit/components/StatusBadge";
import OrderBadge         from "@/components/pages/manager/batch_edit/components/OrderBadge";
import FieldRow           from "@/components/pages/manager/batch_edit/components/FieldRow";
import ListPaginationBar  from "@/components/pages/manager/batch_edit/components/ListPaginationBar";
import ListEmptyState     from "@/components/pages/manager/batch_edit/components/ListEmptyState";

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────────────────────────────────────

const IMG_FIELDS = new Set(["cover_img_url", "image_url", "img_url", "avatar_url"]);

function biStr(en, cn) {
  return [en, cn].filter(Boolean).join(" / ");
}

function deriveTitle(row, bodyColumns) {
  return (
    biStr(row.title_en,   row.title_cn)   ||
    biStr(row.name_en,    row.name_cn)    ||
    biStr(row.caption_en, row.caption_cn) ||
    row.title || row.name || row.caption  ||
    row[bodyColumns[0]?.field] || ""
  );
}

function deriveSubtitle(row) {
  return [
    biStr(row.artist_en, row.artist_cn) || row.artist || "",
    biStr(row.type_en,   row.type_cn)   || row.type   || "",
    row.year || "",
  ].filter(Boolean).join(" · ");
}

function parseOrderVal(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : Infinity;
}

// ─────────────────────────────────────────────────────────────────────────────
// ImageExpandSection
// ─────────────────────────────────────────────────────────────────────────────

function ImageExpandSection({ imgUrl, title, imgColumn, row, onCellUpdate, tok, labelFontStyle }) {
  if (!imgColumn) return null;

  return (
    <Box sx={{
      display:             "grid",
      gridTemplateColumns: "120px 1fr",
      alignItems:          "start",
      gap:                 "10px",
      padding:             "10px 0 0",
      borderTop:           `1px solid ${tok.borderSoft}`,
    }}>
      <Typography sx={{
        fontSize: "9px", fontWeight: 600, letterSpacing: "0.06em",
        textTransform: "uppercase", color: tok.muted, paddingTop: "4px",
        ...labelFontStyle,
      }}>
        {imgColumn.headerName || imgColumn.label || imgColumn.field}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {imgUrl && (
          <Box sx={{
            width:    "100%",
            minWidth: { xs: "unset", sm: "300px" },
            maxWidth: { xs: "100%", sm: "480px" },
            borderRadius: "6px",
            border:       `1px solid ${tok.borderSoft}`,
            background:   tok.bgHover,
            overflow:     "hidden",
          }}>
            <ImageThumbnailWithPreview
              src={imgUrl} alt={title || "image"} width="100%"
              style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
              showTooltip={true} enableGifRestart={true}
            />
          </Box>
        )}
        {imgColumn.renderCell && (
          <Box sx={{ width: "100%" }}>
            {imgColumn.renderCell(row, imgColumn, onCellUpdate)}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RecordCard
// ─────────────────────────────────────────────────────────────────────────────

function RecordCard({
  row, columns, isSelected, isExpanded,
  onSelect, onToggleExpand, onCellUpdate,
  tok, labelFontStyle, getLabel, isCn = false,
}) {
  const imgUrl      = row.cover_img_url || row.image_url || row.img_url || row.avatar_url || "";
  const imgColumn   = columns.find((c)  => IMG_FIELDS.has(c.field));
  const bodyColumns = columns.filter((c) => !IMG_FIELDS.has(c.field));
  const title       = deriveTitle(row, bodyColumns);
  const subtitle    = deriveSubtitle(row);
  const hasOrder    = "order" in row;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius:     "10px",
        backgroundColor:  isSelected ? tok.bgSelected : tok.bgCard,
        overflow:         "hidden",
        transition:       "border-color 0.15s, background-color 0.15s",
        border:           isSelected ? `1.5px solid ${tok.text}` : `1px solid ${tok.borderSoft}`,
        borderLeft:       row.isNew      ? `3px solid ${tok.accentNew}`
                        : row._modified  ? `3px solid ${tok.accentEdit}`
                        : isSelected     ? `1.5px solid ${tok.text}`
                        :                  `1px solid ${tok.borderSoft}`,
      }}
    >
      {/* ── Summary bar ── */}
      <Box sx={{
        display:         "flex",
        alignItems:      "flex-start",
        gap:             "10px",
        padding:         "10px 12px",
        cursor:          "default",
        backgroundColor: isExpanded ? tok.bgHover : "transparent",
        borderBottom:    isExpanded ? `1px solid ${tok.borderSoft}` : "none",
        transition:      "background-color 0.15s",
      }}>
        <Checkbox
          checked={isSelected}
          onChange={(e) => { e.stopPropagation(); onSelect(); }}
          onClick={(e) => e.stopPropagation()}
          size="small"
          sx={{ padding: 0, mt: "2px", flexShrink: 0, color: tok.text, "&.Mui-checked": { color: tok.text } }}
        />

        {imgUrl && (
          <Box sx={{ flexShrink: 0, width: 110 }} onClick={(e) => e.stopPropagation()}>
            <ImageThumbnailWithPreview
              src={imgUrl} alt={title || "image"} width="100%"
              style={{
                width: "100%", height: "auto", borderRadius: 3,
                border: `1px solid ${tok.borderSoft}`, background: tok.bgHover,
                objectFit: "contain", display: "block",
              }}
              showTooltip={true} enableGifRestart={false}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0, cursor: "pointer", mt: "2px" }} onClick={onToggleExpand}>
          <Typography sx={{
            fontSize: "11px", fontWeight: 600,
            color: title ? tok.text : tok.hint, fontStyle: title ? "normal" : "italic",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            ...labelFontStyle,
          }}>
            {title || getLabel?.("untitled") || "Untitled"}
          </Typography>
          {subtitle && (
            <Typography sx={{
              fontSize: "9px", color: tok.muted, marginTop: "1px",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              ...labelFontStyle,
            }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {hasOrder && (
            <OrderBadge
              rowId={row.id} value={row.order}
              onCellUpdate={onCellUpdate} labelFontStyle={labelFontStyle}
            />
          )}
          {row.isNew     && <StatusBadge label="new"    color={tok.accentNew}  />}
          {row._modified && !row.isNew && <StatusBadge label="edited" color={tok.accentEdit} />}

          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            sx={{
              width: 26, height: 26, borderRadius: "6px",
              border: `1px solid ${tok.borderSoft}`, color: tok.muted,
              transition: "transform 0.2s",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              "&:hover": { backgroundColor: tok.bgHover, color: tok.text },
            }}
          >
            <ChevronDown size={14} />
          </IconButton>
        </Box>
      </Box>

      {/* ── Expandable body ── */}
      <Collapse in={isExpanded} timeout={180}>
        <Box sx={{ padding: "0 16px 12px" }}>
          <ImageExpandSection
            imgUrl={imgUrl} title={title} imgColumn={imgColumn}
            row={row} onCellUpdate={onCellUpdate} tok={tok} labelFontStyle={labelFontStyle}
          />
          {bodyColumns.map((col) => (
            <FieldRow key={col.field} col={col} row={row} onCellUpdate={onCellUpdate} labelFontStyle={labelFontStyle} isCn={isCn} />
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar
// ─────────────────────────────────────────────────────────────────────────────

function Toolbar({ sortedData, selectedRows, onSelectAll, allExpanded, onToggleAll, tok, labelFontStyle, isCn = false }) {
  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: "8px",
      padding: "6px 12px", marginBottom: "8px", borderRadius: "8px",
      backgroundColor: tok.bgHover, border: `1px solid ${tok.borderSoft}`,
    }}>
      <Checkbox
        checked={sortedData.length > 0 && selectedRows.length === sortedData.length}
        indeterminate={selectedRows.length > 0 && selectedRows.length < sortedData.length}
        onChange={onSelectAll}
        size="small"
        sx={{
          padding: 0, color: tok.text,
          "&.Mui-checked":               { color: tok.text },
          "&.MuiCheckbox-indeterminate": { color: tok.text },
        }}
      />
      <Typography sx={{ fontSize: "9px", color: tok.muted, ...labelFontStyle }}>
        {selectedRows.length > 0
          ? isCn
            ? `已选 ${selectedRows.length} / ${sortedData.length}`
            : `${selectedRows.length} of ${sortedData.length} selected`
          : isCn
            ? `全选（${sortedData.length}）`
            : `Select all (${sortedData.length})`}
      </Typography>
      <Box sx={{ flex: 1 }} />
      <Typography
        onClick={onToggleAll}
        sx={{
          fontSize: "9px", color: tok.muted, cursor: "pointer",
          textDecoration: "underline", textUnderlineOffset: "2px",
          "&:hover": { color: tok.text },
          ...labelFontStyle,
        }}
      >
        {isCn
          ? allExpanded ? "全部收起" : "全部展开"
          : allExpanded ? "Collapse all" : "Expand all"}
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function BatchEditCardList({
  columns         = [],
  data            = [],
  loading,
  error,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  selectedRows    = [],
  onSelectRow,
  onSelectAll,
  onCellUpdate,
  getLabel,
  labelFontStyle  = {},
  searchTerm      = "",
  hideSortBar     = false,
  sortLabels,
  sortExtraFields,
  sortDefaultKey,
  sortDefaultDir,
}) {
  const tok = useBatchEditTokens();
  const { isCn } = useContext(LanguageContext);
  const [expandedIds, setExpandedIds] = useState({});

  // Sort-bar field labels follow the app language unless the caller overrides.
  const resolvedSortLabels =
    sortLabels || (isCn ? { order: "序号", year: "年份", updatedAt: "更新时间", alpha: "A – Z" } : undefined);

  const { sortedData: hookSortedData, BachEditSortBarProps } = useBachEditSortBar(data, {
    labels:      resolvedSortLabels,
    extraFields: sortExtraFields,
    defaultKey:  sortDefaultKey,
    defaultDir:  sortDefaultDir,
  });

  const sortedData = useMemo(() => {
    const hasOrder = data.length > 0 && "order" in data[0];
    if (hideSortBar && hasOrder) {
      return [...data].sort((a, b) => {
        if (!a.order && b.order) return 1;
        if (a.order && !b.order) return -1;
        return parseOrderVal(a.order) - parseOrderVal(b.order);
      });
    }
    return hookSortedData;
  }, [hideSortBar, data, hookSortedData]);

  const toggleExpand = useCallback((id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const allExpanded = sortedData.length > 0 && sortedData.every((r) => expandedIds[r.id]);

  const handleToggleAll = useCallback(() => {
    if (allExpanded) {
      setExpandedIds({});
    } else {
      const next = {};
      sortedData.forEach((r) => { next[r.id] = true; });
      setExpandedIds(next);
    }
  }, [allExpanded, sortedData]);

  if (loading) return <Box sx={{ p: 4, textAlign: "center", color: tok.muted }}>Loading…</Box>;
  if (error)   return <Box sx={{ p: 4, textAlign: "center" }}><Typography color="error">{error}</Typography></Box>;
  if (data.length === 0) return (
    <ListEmptyState
      isFiltered={!!searchTerm}
      getLabel={getLabel}
      labelFontStyle={labelFontStyle}
    />
  );

  return (
    <>
      {!hideSortBar && (
        <BachEditSortBar {...BachEditSortBarProps} labelFontStyle={labelFontStyle} sx={{ marginBottom: "6px" }} />
      )}

      <Toolbar
        sortedData={sortedData} selectedRows={selectedRows}
        onSelectAll={onSelectAll} allExpanded={allExpanded}
        onToggleAll={handleToggleAll} tok={tok} labelFontStyle={labelFontStyle}
        isCn={isCn}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {sortedData.map((row) => (
          <RecordCard
            key={row.id} row={row} columns={columns}
            isSelected={selectedRows.includes(row.id)}
            isExpanded={!!expandedIds[row.id]}
            onSelect={() => onSelectRow(row.id)}
            onToggleExpand={() => toggleExpand(row.id)}
            onCellUpdate={onCellUpdate}
            isCn={isCn}
            tok={tok} labelFontStyle={labelFontStyle} getLabel={getLabel}
          />
        ))}
      </Box>

      {page !== undefined && count !== undefined && onPageChange && (
        <ListPaginationBar
          page={page} rowsPerPage={rowsPerPage} count={count}
          onPageChange={onPageChange} onRowsPerPageChange={onRowsPerPageChange}
          labelFontStyle={labelFontStyle}
        />
      )}
    </>
  );
}
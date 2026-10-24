"use client";

import React, { useCallback } from "react";
import { Typography, Divider, Box } from "@mui/material";
import BatchEditLayout from "@/components/pages/manager/batch_edit/BatchEditLayout";
import BatchGroupList  from "@/components/pages/manager/batch_edit/components/BatchGroupList";
import { PAGE_CONFIGS } from "@/components/pages/manager/config/schemaBatchGroupConfig";
import batch_text_labels from "@/components/labels/batch_text_labels";

import {
  normalizeRow,
  getArtworkSchemaFields,
  getArtworkFieldGroups,
  getArtworkFieldTypes,
} from "@/components/pages/manager/utils/artworkBatchEditUtils";

// ── Switch the grouping key here ──────────────────────────────────────────
// PAGE_CONFIGS.artwork should now group by `series` (single field, not _cn/_en)
const ACTIVE_CONFIG = PAGE_CONFIGS.artwork;
// ─────────────────────────────────────────────────────────────────────────

export default function ArtworkBatchEditPage() {
  // CSV headers mirror the flat Artwork model fields (no _cn/_en suffixes)
  const csvHeaders = [
    "artist",
    "title",
    "type",
    "medium",
    "year",
    "size",
    "series",
    "caption",
    "duration",
    "credits",
    "special_thanks",
    "introduction",
    "video_url",
    "web_url",
    "work_value",
    "sold",
    "order.artist_page_order",
    "order.exhibition_page_order",
    "order.art_fair_page_order",
    "cover_img_url",
    "mark",
    "language",
  ];

  // ── Delete dialog row renderer ──────────────────────────────────────────
  // isCn only controls the UI labels, not the field names (model is mono-lang)
  const renderDeleteRow = useCallback(
    (row, index, selectedRowsData, labelFontStyle, getLabel, isCn) => {
      const t      = isCn ? batch_text_labels.CN : batch_text_labels.EN;
      const title  = row.title  || t.UNTITLED       || "Untitled";
      const artist = row.artist || t.UNKNOWN_ARTIST || "Unknown Artist";

      return (
        <React.Fragment key={row.id ?? index}>
          <Box sx={{ py: 0.75, px: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, ...labelFontStyle }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", ...labelFontStyle }}
            >
              {[artist, row.year, row.series].filter(Boolean).join(" · ")}
            </Typography>
          </Box>
          {index < selectedRowsData.length - 1 && <Divider />}
        </React.Fragment>
      );
    },
    []
  );

  // ── Grouped list renderer (passed to BatchEditLayout as renderList) ─────
  const renderList = useCallback(
    (
      rows,
      isCn,           // forwarded so BatchGroupList's UI labels follow the app language
      labelFontStyle,
      {
        groupConfig = null,
        onCellUpdate,
        selectedRows = [],
        onSelectRow,
        onSelectAll,
        columns = [],
        getLabel,
      } = {}
    ) => (
      <BatchGroupList
        config={groupConfig || ACTIVE_CONFIG}
        rows={rows}
        isCn={isCn}
        labelFontStyle={labelFontStyle}
        columns={columns}
        selectedRows={selectedRows}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
        onCellUpdate={onCellUpdate}
        getLabel={getLabel}
      />
    ),
    []
  );

  return (
    <BatchEditLayout
      entityName="artwork"
      apiEndpoint="/api/artwork"
      normalizeRow={normalizeRow}
      // both props accepted; BatchEditLayout prefers getSchemaFields
      getSchemaFields={getArtworkSchemaFields}
      getFieldGroups={getArtworkFieldGroups}
      getFieldTypes={getArtworkFieldTypes}
      // alphabet bar sorts/filters by title (single field, no _en/_cn)
      alphabetField="title"
      csvHeaders={csvHeaders}
      renderDeleteRow={renderDeleteRow}
      renderList={renderList}
      titles={{ en: "Artwork Batch Edit", cn: "作品批量编辑" }}
      defaultFieldGroup="core"
    />
  );
}
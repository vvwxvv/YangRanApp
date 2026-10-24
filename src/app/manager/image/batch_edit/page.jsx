"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { Typography, Divider, Box } from "@mui/material";
import BatchEditLayout  from "@/components/pages/manager/batch_edit/BatchEditLayout";
import BatchGroupList from "@/components/pages/manager/batch_edit/components/BatchGroupList";
import { PAGE_CONFIGS } from "@/components/pages/manager/config/schemaBatchGroupConfig";
import { normalizeRow } from "@/components/pages/manager/utils/imageExportUtils";
import {
  getImageFieldGroups,
  getImageSchemaFields,
  getImageFieldTypes,
} from "@/components/pages/manager/utils/imageBatchEditUtils";
import batch_text_labels from "@/components/labels/batch_text_labels";
import useData from "@/hooks/useData";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { getBatchGroupOptions } from "@/components/pages/manager/batch_edit/utils/batchGroupOptions";
import {
  buildImageSourceIndex,
  imageGroupKeys,
  parseGroupKey,
} from "@/components/pages/manager/images/hooks/useImageSourceIndex";

// ── Change this one line to switch group-by field ──────────────────────────
const ACTIVE_CONFIG = PAGE_CONFIGS.image;   // groups by tag_en / tag_cn
// ──────────────────────────────────────────────────────────────────────────

export default function ImageBatchEditPage() {
  const { isCn } = useContext(LanguageContext);

  // Same data the image manager uses, so the batch page can group by ARTIST
  // exactly like the manager does (image tag → artwork/exhibition → artist).
  const { data: rawArtworks = [] } = useData("/api/artwork");
  const { data: rawImages = [] } = useData("/api/image");
  const sourceIndex = useMemo(
    () =>
      buildImageSourceIndex({
        artworks: Array.isArray(rawArtworks) ? rawArtworks : [],
        images: Array.isArray(rawImages) ? rawImages : [],
      }),
    [rawArtworks, rawImages]
  );

  const artistOf = useCallback(
    (row) => {
      const keys = imageGroupKeys(row, sourceIndex) || [];
      const parts = parseGroupKey(keys[0] || "");
      return parts.ungrouped || !parts.artist ? "" : parts.artist;
    },
    [sourceIndex]
  );

  // Group-by options: "Tag / Title" (manager default) then "Artist".
  const groupOptions = useMemo(
    () =>
      getBatchGroupOptions("image", isCn, {
        artist: {
          getKey: (row) => artistOf(row).toLowerCase(),
          noGroupKey: "__NO_ARTIST__",
          noGroupLabel: isCn ? "（未匹配艺术家）" : "(No Artist)",
          groupsLabel: isCn ? "艺术家" : "artists",
          searchPlaceholder: isCn ? "搜索艺术家…" : "Search artist…",
          emptyLabel: isCn ? "没有匹配的艺术家" : "No artists match your search",
          augmentGroup: (group, row) => {
            const name = artistOf(row);
            if (name.length > group._rawVal.length) group._rawVal = name;
            if (row.type) group.meta.add(row.type);
          },
          getDisplay: (group) => ({
            primary:
              sourceIndex.labelFor(group._rawVal, { lang: isCn ? "cn" : "en" }) ||
              group._rawVal ||
              "—",
            secondary: "",
            meta: group.meta.size ? [...group.meta].slice(0, 3).join(" · ") : "",
            showIcon: false,
          }),
          canSearch: (group, q) =>
            !group.noGroup && String(group._rawVal).toLowerCase().includes(q),
        },
      }),
    [isCn, artistOf, sourceIndex]
  );

  const csvHeaders = [
    "img_url",
    "tag_en",    "tag_cn",
    "type",
    "caption_en","caption_cn",
    "mark",      "tag_source",
    "order.artist_page_order", "order.exhibition_page_order",
    "order.art_fair_page_order", "order.rolling_img_order", "order.artist_detail_rolling_img_order",
  ];

  const renderDeleteRow = useCallback(
    (row, index, selectedRowsData, labelFontStyle, getLabel, isCn) => {
      const t   = isCn ? batch_text_labels.CN : batch_text_labels.EN;
      const tag = row.tag_cn || row.tag_en || t.UNTITLED || "Untitled";
      return (
        <React.Fragment key={row.id ?? index}>
          <Box sx={{ py: 0.75, px: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, ...labelFontStyle }}>
              {tag}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", ...labelFontStyle }}>
              {[row.type, row.caption_cn || row.caption_en].filter(Boolean).join(" · ")}
            </Typography>
          </Box>
          {index < selectedRowsData.length - 1 && <Divider />}
        </React.Fragment>
      );
    },
    []
  );

  const renderList = useCallback(
    (rows, isCn, labelFontStyle, { groupConfig = null, onCellUpdate, selectedRows = [], onSelectRow, onSelectAll, columns = [], getLabel } = {}) => (
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
      entityName="image"
      apiEndpoint="/api/image"
      normalizeRow={normalizeRow}
      getFieldGroups={getImageFieldGroups}
      getSchemaFields={getImageSchemaFields}
      getFieldTypes={getImageFieldTypes}
      alphabetField="tag_en"
      csvHeaders={csvHeaders}
      renderDeleteRow={renderDeleteRow}
      renderList={renderList}
      titles={{ en: "Image Batch Edit", cn: "图片批量编辑" }}
      groupOptions={groupOptions}
      defaultGroup="tag"
      defaultFieldGroup="core"
    />
  );
}
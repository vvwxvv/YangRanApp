"use client";

import React, { useCallback } from "react";
import { Typography, Divider, Box } from "@mui/material";
import BatchEditLayout from "@/components/pages/manager/batch_edit/BatchEditLayout";
import BatchGroupList  from "@/components/pages/manager/batch_edit/components/BatchGroupList";
import { PAGE_CONFIGS } from "@/components/pages/manager/config/schemaBatchGroupConfig";
import { normalizeAboutRow } from "@/components/pages/manager/utils/aboutExportUtils";
import {
  getAboutFieldGroups,
  getAboutSchemaFields,
  getAboutFieldTypes,
} from "@/components/pages/manager/utils/aboutBatchEditUtils";
import batch_text_labels from "@/components/labels/batch_text_labels";

// ── Swap to a different PAGE_CONFIGS entry if grouping changes ─────────────
const ACTIVE_CONFIG = PAGE_CONFIGS.about;
// ──────────────────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  "artist",
  "portrait_image_url",
  "caption",
  "introduction",
  "language",
  "order",
  "mark",
];

export default function AboutBatchEditPage() {
  const renderDeleteRow = useCallback(
    (row, index, selectedRowsData, labelFontStyle, getLabel, isCn) => {
      const t       = isCn ? batch_text_labels.CN : batch_text_labels.EN;
      const artist  = row.artist || t.UNTITLED    || "Untitled";
      const caption = row.caption || t.NO_VALUE   || "—";
      return (
        <React.Fragment key={row.id ?? index}>
          <Box sx={{ py: 0.75, px: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, ...labelFontStyle }}>
              {artist}
              {row.isNew && (
                <Box component="span" sx={{ color: "#4CAF50", ml: 1, fontSize: "0.8em" }}>
                  {t.NEW_TAG}
                </Box>
              )}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", ...labelFontStyle }}>
              {caption}
            </Typography>
          </Box>
          {index < selectedRowsData.length - 1 && <Divider />}
        </React.Fragment>
      );
    },
    []
  );

  const renderList = useCallback(
    (rows, isCn, labelFontStyle, {
      groupConfig = null,
      onCellUpdate, selectedRows = [], onSelectRow, onSelectAll, columns = [], getLabel,
    } = {}) => (
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
      entityName="about"
      apiEndpoint="/api/about"
      normalizeRow={normalizeAboutRow}
      getFieldGroups={getAboutFieldGroups}
      getSchemaFields={getAboutSchemaFields}
      getFieldTypes={getAboutFieldTypes}
      alphabetField="artist"
      csvHeaders={CSV_HEADERS}
      renderDeleteRow={renderDeleteRow}
      renderList={renderList}
      titles={{ en: "About Batch Edit", cn: "关于批量编辑" }}
      defaultFieldGroup="core"
    />
  );
}

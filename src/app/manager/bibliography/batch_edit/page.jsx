"use client";

import React, { useCallback } from "react";
import { Typography, Divider, Box } from "@mui/material";
import BatchEditLayout from "@/components/pages/manager/batch_edit/BatchEditLayout";
import BatchGroupList from "@/components/pages/manager/batch_edit/components/BatchGroupList";
import { PAGE_CONFIGS } from "@/components/pages/manager/config/schemaBatchGroupConfig";
import { normalizeBibliographyRow } from "@/components/pages/manager/utils/bibliographyExportUtils";
import {
  getBibliographyFieldGroups,
  getBibliographySchemaFields,
  getBibliographyFieldTypes,
} from "@/components/pages/manager/utils/bibliographyBatchEditUtils";
import batch_text_labels from "@/components/labels/batch_text_labels";

// ── Swap to a different PAGE_CONFIGS entry if grouping changes ─────────────
const ACTIVE_CONFIG = PAGE_CONFIGS.bibliography;
// ──────────────────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  "title",
  "subtitle",
  "author",
  "type",
  "year",
  "date",
  "published_at",
  "cover_img_url",
  "pdf_url",
  "web_url",
  "video_url",
  "related_exhibition",
  "order",
];

export default function BibliographyBatchEditPage() {
  const renderDeleteRow = useCallback(
    (row, index, selectedRowsData, labelFontStyle, getLabel, isCn) => {
      const t      = isCn ? batch_text_labels.CN : batch_text_labels.EN;
      const title  = row.title || t.UNTITLED || "Untitled";
      const author = row.author || t.NO_VALUE || "—";
      return (
        <React.Fragment key={row.id ?? index}>
          <Box sx={{ py: 0.75, px: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, ...labelFontStyle }}>
              {title}
              {row.isNew && (
                <Box component="span" sx={{ color: "#4CAF50", ml: 1, fontSize: "0.8em" }}>
                  {t.NEW_TAG}
                </Box>
              )}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", ...labelFontStyle }}>
              {author}
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
      entityName="bibliography"
      apiEndpoint="/api/bibliography"
      normalizeRow={normalizeBibliographyRow}
      getFieldGroups={getBibliographyFieldGroups}
      getSchemaFields={getBibliographySchemaFields}
      getFieldTypes={getBibliographyFieldTypes}
      alphabetField="title"
      csvHeaders={CSV_HEADERS}
      renderDeleteRow={renderDeleteRow}
      renderList={renderList}
      titles={{ en: "Bibliography Batch Edit", cn: "书目批量编辑" }}
      defaultFieldGroup="core"
    />
  );
}
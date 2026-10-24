"use client";

import React, { useCallback } from "react";
import { Typography, Divider, Box } from "@mui/material";
import BatchEditLayout from "@/components/pages/manager/batch_edit/BatchEditLayout";
import BatchGroupList from "@/components/pages/manager/batch_edit/components/BatchGroupList";
import { PAGE_CONFIGS } from "@/components/pages/manager/config/schemaBatchGroupConfig";
import { normalizeResumeRow } from "@/components/pages/manager/utils/resumeExportUtils";
import {
  getResumeFieldGroups,
  getResumeSchemaFields,
  getResumeFieldTypes,
} from "@/components/pages/manager/utils/resumeBatchEditUtils";
import batch_text_labels from "@/components/labels/batch_text_labels";

// ── Swap to a different PAGE_CONFIGS entry if grouping changes ─────────────
const ACTIVE_CONFIG = PAGE_CONFIGS.resume;
// ──────────────────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  "artist",
  "year",
  "start_date",
  "end_date",
  "type",
  "description",
  "introduction",
];

export default function ResumeBatchEditPage() {
  const renderDeleteRow = useCallback(
    (row, index, selectedRowsData, labelFontStyle, getLabel, isCn) => {
      const t      = isCn ? batch_text_labels.CN : batch_text_labels.EN;
      const title  = row.type || row.artist || t.UNTITLED || "Untitled";
      const artist = row.artist || t.NO_VALUE || "—";
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
              {artist}
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
      entityName="resume"
      apiEndpoint="/api/resume"
      normalizeRow={normalizeResumeRow}
      getFieldGroups={getResumeFieldGroups}
      getSchemaFields={getResumeSchemaFields}
      getFieldTypes={getResumeFieldTypes}
      alphabetField="artist"
      csvHeaders={CSV_HEADERS}
      renderDeleteRow={renderDeleteRow}
      renderList={renderList}
      titles={{ en: "Resume Batch Edit", cn: "履历批量编辑" }}
      defaultFieldGroup="basic"
    />
  );
}

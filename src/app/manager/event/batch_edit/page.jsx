"use client";

import React, { useCallback } from "react";
import { Typography, Divider, Box } from "@mui/material";
import BatchEditLayout  from "@/components/pages/manager/batch_edit/BatchEditLayout";
import BatchGroupList from "@/components/pages/manager/batch_edit/components/BatchGroupList";
import { PAGE_CONFIGS } from "@/components/pages/manager/config/schemaBatchGroupConfig";
import { normalizeRow } from "@/components/pages/manager/utils/eventExportUtils";
import {
  getEventFieldGroups,
  getEventSchemaFields,
  getEventFieldTypes,
} from "@/components/pages/manager/utils/eventBatchEditUtils";
import batch_text_labels from "@/components/labels/batch_text_labels";

// ── Change this one line to switch group-by field ──────────────────────────
const ACTIVE_CONFIG = PAGE_CONFIGS.event;
// ──────────────────────────────────────────────────────────────────────────

export default function EventBatchEditPage() {
  const csvHeaders = [
    "cover_img_url",
    "title",
    "year",
    "start_date",
    "end_date",
    "open_time",
    "type",
    "host",
    "support",
    "special_thanks",
    "venue",
    "address",
    "caption",
    "introduction",
    "related_artwork_title",
    "mark",
    "order",
    "language",
  ];

  const renderDeleteRow = useCallback(
    (row, index, selectedRowsData, labelFontStyle, getLabel, isCn) => {
      const t = isCn ? batch_text_labels.CN : batch_text_labels.EN;
      const title = row.title || t.UNTITLED || "Untitled";
      const year = row.year || row.start_date?.split("-")[0] || "";
      return (
        <React.Fragment key={row.id ?? index}>
          <Box sx={{ py: 0.75, px: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, ...labelFontStyle }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", ...labelFontStyle }}>
              {[year, row.type].filter(Boolean).join(" · ")}
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
      entityName="event"
      apiEndpoint="/api/event"
      normalizeRow={normalizeRow}
      getFieldGroups={getEventFieldGroups}
      getSchemaFields={getEventSchemaFields}
      getFieldTypes={getEventFieldTypes}
      alphabetField="title"
      csvHeaders={csvHeaders}
      renderDeleteRow={renderDeleteRow}
      renderList={renderList}
      titles={{ en: "Event Batch Edit", cn: "活动批量编辑" }}
      defaultFieldGroup="core"
    />
  );
}

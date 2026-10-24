"use client";

import React, { useCallback } from "react";
import { Typography, Divider, Box } from "@mui/material";
import BatchEditLayout from "@/components/pages/manager/batch_edit/BatchEditLayout";
import BatchGroupList  from "@/components/pages/manager/batch_edit/components/BatchGroupList";
import { PAGE_CONFIGS } from "@/components/pages/manager/config/schemaBatchGroupConfig";
import batch_text_labels from "@/components/labels/batch_text_labels";

import {
  normalizeRow,
  getEnquireSchemaFields,
  getEnquireFieldGroups,
  getEnquireFieldTypes,
} from "@/components/pages/manager/utils/enquireBatchEditUtils";

// ── Switch the grouping key here ──────────────────────────────────────────
// PAGE_CONFIGS.enquire should typically group by `status`
const ACTIVE_CONFIG = PAGE_CONFIGS.enquire;
// ─────────────────────────────────────────────────────────────────────────

export default function EnquireBatchEditPage() {
  // CSV headers mirror the flat Enquire model fields
  const csvHeaders = [
    "name",
    "email",
    "message",
    "status",
    "createdAt",
  ];

  // ── Delete dialog row renderer ──────────────────────────────────────────
  const renderDeleteRow = useCallback(
    (row, index, selectedRowsData, labelFontStyle, getLabel, isCn) => {
      const t      = isCn ? batch_text_labels.CN : batch_text_labels.EN;
      const name   = row.name  || t.UNTITLED       || "Unknown Sender";
      const email  = row.email || "No email";

      return (
        <React.Fragment key={row.id ?? index}>
          <Box sx={{ py: 0.75, px: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, ...labelFontStyle }}
            >
              {name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", ...labelFontStyle }}
            >
              {[email, row.status].filter(Boolean).join(" · ")}
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
      entityName="enquire"
      apiEndpoint="/api/enquire"
      normalizeRow={normalizeRow}
      getSchemaFields={getEnquireSchemaFields}
      getFieldGroups={getEnquireFieldGroups}
      getFieldTypes={getEnquireFieldTypes}
      // alphabet bar sorts/filters by name
      alphabetField="name"
      csvHeaders={csvHeaders}
      renderDeleteRow={renderDeleteRow}
      renderList={renderList}
      titles={{ en: "Enquiry Batch Edit", cn: "咨询批量编辑" }}
      defaultFieldGroup="core"
    />
  );
}
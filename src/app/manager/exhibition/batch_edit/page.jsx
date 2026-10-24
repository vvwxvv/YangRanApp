"use client";

import React, { useCallback } from "react";
import { Typography, Divider, Box } from "@mui/material";
import BatchEditLayout from "@/components/pages/manager/batch_edit/BatchEditLayout";
import BatchGroupList  from "@/components/pages/manager/batch_edit/components/BatchGroupList";
import { PAGE_CONFIGS } from "@/components/pages/manager/config/schemaBatchGroupConfig";
import batch_text_labels from "@/components/labels/batch_text_labels";

import {
  normalizeRow,
  getExhibitionSchemaFields,
  getExhibitionFieldGroups,
  getExhibitionFieldTypes,
} from "@/components/pages/manager/utils/exhibitionBatchEditUtils";

const ACTIVE_CONFIG = PAGE_CONFIGS.exhibition || PAGE_CONFIGS.artwork;

export default function ExhibitionBatchEditPage() {
  const csvHeaders = [
    "artist",
    "title",
    "type",
    "medium",
    "year",
    "start_date",
    "end_date",
    "location",
    "caption",
    "introduction",
    "web_url",
    "cover_img_url",
    "order",
    "language",
  ];

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
              {[artist, row.year, row.location].filter(Boolean).join(" · ")}
            </Typography>
          </Box>
          {index < selectedRowsData.length - 1 && <Divider />}
        </React.Fragment>
      );
    },
    []
  );

  const renderList = useCallback(
    (
      rows,
      isCn,
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
      entityName="exhibition"
      apiEndpoint="/api/exhibition"
      normalizeRow={normalizeRow}
      getSchemaFields={getExhibitionSchemaFields}
      getFieldGroups={getExhibitionFieldGroups}
      getFieldTypes={getExhibitionFieldTypes}
      alphabetField="title"
      csvHeaders={csvHeaders}
      renderDeleteRow={renderDeleteRow}
      renderList={renderList}
      titles={{ en: "Exhibition Batch Edit", cn: "展览批量编辑" }}
      defaultFieldGroup="core"
    />
  );
}

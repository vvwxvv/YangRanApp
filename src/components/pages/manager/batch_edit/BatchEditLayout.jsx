"use client";

import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import {
  Alert,
  Box,
  Typography,
  Container,
  Stack,
  Grow,
  Divider,
} from "@mui/material";
import {
  Warning as WarningIcon,
  TableView as TableViewIcon,
} from "@mui/icons-material";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useFont from '@/hooks/useFont';
import { getSystemLabel } from "@/components/labels/system_labels";
import EditableCell from "@/components/pages/manager/batch_edit/components/EditableCell";
import { getBatchGroupOptions } from "@/components/pages/manager/batch_edit/utils/batchGroupOptions";
import {
  StyledPaper,
  AnimatedBox,
} from "@/components/pages/manager/batch_edit/styles/batchEditStyles";
import { makeBatchEditColumns } from "@/components/pages/manager/utils/makeBatchEditColumns";
import BatchEditActions from "@/components/pages/manager/batch_edit/components/BatchEditActions";
import BatchEditCardList from "@/components/pages/manager/batch_edit/components/BatchEditCardList";
import AppSnackbar from "@/components/ui/Snackbar";
import AlertInfo from "@/components/alerts/AlertInfo";
import BatchDialog from "@/components/pages/manager/batch_edit/components/BatchDialog";
import BatchEditDialog from "@/components/pages/manager/batch_edit/components/BatchEditDialog";
import LoadingLayer from "@/components/animations/LoadingLayer";
import InfoBar from "@/components/alerts/InfoBar";
import { useDarkMode } from "@/hooks/useDarkMode";
import AlphabetPaginationBar from "@/components/navs/AlphabetPaginationBar";
import {
  filterByAlphabetLetter,
  ALPHABET_FILTER_VALUES,
  sortAlphabetically,
} from "@/utils/alphabetPaginationUtils";
import batch_text_labels from "@/components/labels/batch_text_labels";
import {
  checkForChanges,
  hasNewRowsInData,
  calculateChanges,
  filterBySearchTerm,
  sortDataByColumn,
  exportToCSV,
} from "@/components/pages/manager/utils/batchEditCommonUtils";

// ── Language filter helpers ───────────────────────────────────────────────
/**
 * Returns true if any row in the dataset carries a non-empty `language` field.
 * Used to decide whether to show the language filter toggle at all.
 */
function dataHasLanguageField(rows) {
  return rows.some(
    (r) => r.language !== undefined && r.language !== null && String(r.language).trim() !== ""
  );
}

/**
 * Filter rows by language match.
 *
 * Rules (intentionally permissive so editors can still see/fix bad data):
 *  - Rows with no language value (empty string / null / undefined) are always shown.
 *  - Rows whose language contains "cn" (case-insensitive) are shown when isCn is true.
 *  - Rows whose language contains "en" (case-insensitive) are shown when isCn is false.
 *  - Rows with any other language value are always shown (unknown → don't hide).
 *  - New / temp rows are always shown regardless of language.
 */
function filterByLanguage(rows, isCn) {
  return rows.filter((row) => {
    // always show new/temp rows
    if (row.isNew || !row._id || String(row.id ?? "").startsWith("temp")) return true;

    const lang = String(row.language ?? "").trim().toLowerCase();

    // no language set → show everywhere
    if (!lang) return true;

    // known language values
    if (lang.includes("cn")) return isCn;
    if (lang.includes("en")) return !isCn;

    // unknown value → show to avoid hiding anything
    return true;
  });
}

/**
 * Reusable Batch Edit Layout Component — card-list variant
 *
 * @param {Object} config
 * @param {string}   config.entityName        - Name of the entity (e.g. "image")
 * @param {string}   config.apiEndpoint       - API endpoint path (e.g. "/api/image")
 * @param {Function} config.normalizeRow      - Row normaliser
 * @param {Function} config.getFieldGroups    - Returns field groups
 * @param {Function} config.getSchemaFields   - Returns schema fields
 * @param {Function} config.getFieldTypes     - Returns field types
 * @param {string}   config.alphabetField     - Field used for alphabet filtering
 * @param {Array}    config.csvHeaders        - Field names for CSV export
 * @param {Function} config.renderDeleteRow   - Render fn for delete dialog rows
 * @param {Function} config.renderSaveRow     - Render fn for save dialog rows
 * @param {Object}   config.titles            - { en, cn }
 * @param {string}   config.defaultFieldGroup - Default field group key
 *
 * @param {Function} [config.renderList]
 *   Optional override for the list area.
 *   Signature: (rows, isCn, labelFontStyle, { onCellUpdate, onDeleteRows }) => ReactNode
 */
export default function BatchEditLayout({
  entityName,
  apiEndpoint,
  normalizeRow,
  getSchemaFields: getSchemaFieldsProp,
  getFieldGroups,
  getFieldTypes,
  alphabetField = "date",
  csvHeaders = [],
  renderDeleteRow,
  renderSaveRow,
  titles = { en: "Batch Edit", cn: "批量编辑" },
  renderList,
  // Grouping: by default the batch page mirrors the manager page's own
  // dimension (see utils/batchGroupOptions). Pass `groupOptions` to override.
  groupOptions = null,
  defaultGroup = null,
}) {
  const getSchemaFields = getSchemaFieldsProp ?? getFieldGroups;

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [hasNewRows, setHasNewRows] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(ALPHABET_FILTER_VALUES.ALL);
  const [isGrouped, setIsGrouped] = useState(true);
  // ── Language filter state ─────────────────────────────────────────────────
  // Three-state: "auto" = follow isCn from context, "all" = show everything
  const [languageFilter, setLanguageFilter] = useState("auto");

  const { isCn } = useContext(LanguageContext);
  // Batch-edit pages run 2px tighter than the rest of the app. `labelFontStyle`
  // is spread (often *after* local sizes) across the whole page — the list
  // renderers, the grouped list and the cards — so trimming it here keeps the
  // whole batch UI consistently 2px smaller without touching global fonts.
  const { style: rawFontStyle } = useFont();
  const labelFontStyle = useMemo(() => {
    if (!rawFontStyle) return rawFontStyle;
    const size = parseFloat(rawFontStyle.fontSize);
    const next = { ...rawFontStyle };
    if (Number.isFinite(size)) next.fontSize = `${Math.max(9, size - 2)}px`;
    const lineHeight = parseFloat(rawFontStyle.lineHeight);
    if (Number.isFinite(lineHeight))
      next.lineHeight = `${Math.max(10, lineHeight - 2)}px`;
    return next;
  }, [rawFontStyle]);
  const isDark = useDarkMode();

  // ── Grouping dimension (mirrors the manager page by default) ──────────────
  const resolvedGroupOptions = useMemo(
    () => groupOptions || getBatchGroupOptions(entityName, isCn),
    [groupOptions, entityName, isCn]
  );
  const [groupBy, setGroupBy] = useState(
    defaultGroup || resolvedGroupOptions?.[0]?.value || null
  );
  const activeGroupOption =
    resolvedGroupOptions.find((o) => o.value === groupBy) ||
    resolvedGroupOptions[0] ||
    null;


  const getLabel = (key) => getSystemLabel(key, isCn);
  const t = isCn ? batch_text_labels.CN : batch_text_labels.EN;

  useEffect(() => { setHasNewRows(hasNewRowsInData(data)); }, [data]);

  const getSelectedRowsData = () => data.filter((row) => selectedRows.includes(row.id));

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 401 || response.status === 403) {
        setError("login_required"); setData([]); return;
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Server error: ${response.status}`);
        setData([]); return;
      }
      const result = await response.json();
      const dataArray = result.data || result;
      if (!Array.isArray(dataArray)) {
        setError(isCn ? "收到的数据格式无效" : "Invalid data format received"); setData([]); return;
      }
      const normalizedData = dataArray.map(normalizeRow);
      setData(normalizedData);
      setOriginalData(JSON.parse(JSON.stringify(normalizedData)));
      setHasNewRows(false);
    } catch (err) {
      console.log("Fetch error:", err);
      setError(err.message || (isCn ? "数据加载失败" : "Failed to load data"));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // ── Detect whether this dataset uses the language field ───────────────────
  const schemaHasLanguage = useMemo(() => dataHasLanguageField(data), [data]);

  // ── alphabet filter ───────────────────────────────────────────────────────
  const handleLetterChange = useCallback((letter) => {
    if (hasChanges || hasNewRows) {
      setSnackbar({ open: true, message: t.SAVE_CHANGES_BEFORE_FILTER, severity: "warning" });
      return;
    }
    setSelectedLetter(letter);
    setPage(0);
  }, [hasChanges, hasNewRows, t]);

  // ── sort ──────────────────────────────────────────────────────────────────
  const handleRequestSort = (property) => {
    if (hasChanges || hasNewRows) {
      setSnackbar({ open: true, message: t.SAVE_CHANGES_BEFORE_SORT, severity: "warning" });
      return;
    }
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0);
  };

  // ── columns ───────────────────────────────────────────────────────────────
  const allColumns = useMemo(() => {
    if (typeof getSchemaFields !== "function" || typeof getFieldTypes !== "function") return [];
    return makeBatchEditColumns({ schemaFields: getSchemaFields(), getLabel }).map((col) => {
      const { arrayFields, multilineFields } = getFieldTypes();

      if (arrayFields?.includes(col.field)) {
        return {
          ...col,
          fieldType: "multiline",
          renderCell: (row, column, onCellUpdate) => {
            const cellValue = Array.isArray(row[column.field])
              ? row[column.field].join("\n\n")
              : row[column.field] || "";
            return (
              <EditableCell
                key={`${row.id}-${column.field}-${cellValue}`}
                value={cellValue}
                onSave={(value) =>
                  onCellUpdate(row.id, column.field,
                    value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
                  )
                }
                type={column.type} options={column.options} fieldType="multiline"
                labelFontStyle={labelFontStyle} isCn={isCn} column={column}
                renderDisplay={(displayValue) => {
                  const val = displayValue !== undefined ? displayValue : cellValue;
                  if (val && String(val).trim()) {
                    const preview = String(val).split("\n").slice(0, 2).join("\n") +
                      (String(val).split("\n").length > 2 ? "…" : "");
                    return <span style={{ whiteSpace: "pre-line", ...labelFontStyle }}>{preview}</span>;
                  }
                  return <span style={{ color: "var(--text-primary, #999)", fontStyle: "italic", display: "inline-block", minWidth: "60px", minHeight: "20px", ...labelFontStyle }}>{t.CLICK_TO_EDIT}</span>;
                }}
              />
            );
          },
        };
      }

      if (multilineFields?.includes(col.field)) {
        return {
          ...col,
          fieldType: "multiline",
          renderCell: (row, column, onCellUpdate) => {
            const cellValue = row[column.field] || "";
            return (
              <EditableCell
                key={`${row.id}-${column.field}-${cellValue}`}
                value={cellValue}
                onSave={(value) => onCellUpdate(row.id, column.field, value)}
                type={column.type} options={column.options} fieldType="multiline"
                labelFontStyle={labelFontStyle} isCn={isCn} column={column}
                renderDisplay={(displayValue) => {
                  const val = displayValue !== undefined ? displayValue : cellValue;
                  if (val && String(val).trim()) {
                    return <span style={{ whiteSpace: "pre-line", ...labelFontStyle }}>{val}</span>;
                  }
                  return <span style={{ color: "var(--text-primary, #999)", fontStyle: "italic", display: "inline-block", minWidth: "60px", minHeight: "20px", ...labelFontStyle }}>{t.CLICK_TO_EDIT}</span>;
                }}
              />
            );
          },
        };
      }

      return {
        ...col,
        renderCell: (row, column, onCellUpdate) => {
          const raw = row[column.field];
          const cellValue = Array.isArray(raw) ? raw.join("; ") : raw || "";
          return (
            <EditableCell
              key={`${row.id}-${column.field}-${cellValue}`}
              value={cellValue}
              onSave={(value) => onCellUpdate(row.id, column.field, value)}
              type={column.type} options={column.options} fieldType={column.fieldType}
              labelFontStyle={labelFontStyle} isCn={isCn} column={column}
              renderDisplay={(displayValue) => {
                const val = displayValue !== undefined ? displayValue : cellValue;
                if (val !== undefined && val !== null && String(val).trim() !== "") {
                  return <span style={labelFontStyle}>{String(val)}</span>;
                }
                return <span style={{ color: "var(--text-primary, #999)", fontStyle: "italic", display: "inline-block", minWidth: "60px", minHeight: "20px", ...labelFontStyle }}>{t.CLICK_TO_EDIT}</span>;
              }}
            />
          );
        },
      };
    });
  }, [getSchemaFields, getFieldTypes, labelFontStyle, isCn, t]);

  // ── derived data ──────────────────────────────────────────────────────────
  const alphabetFilteredData = useMemo(() => {
    if (selectedLetter === ALPHABET_FILTER_VALUES.ALL) return [...data];
    return data.filter((item) => {
      if (item.isNew && (!item._id || item.id?.startsWith("temp"))) return true;
      return filterByAlphabetLetter([item], alphabetField, selectedLetter).length > 0;
    });
  }, [data, alphabetField, selectedLetter]);

  // ── Language filter applied after alphabet filter ─────────────────────────
  const languageFilteredData = useMemo(() => {
    // Only filter when: schema has language field AND user hasn't toggled to "all"
    if (!schemaHasLanguage || languageFilter === "all") return alphabetFilteredData;
    return filterByLanguage(alphabetFilteredData, isCn);
  }, [alphabetFilteredData, schemaHasLanguage, languageFilter, isCn]);

  const sortedData = useMemo(() => {
    if (hasChanges || hasNewRows) {
      const newRows = languageFilteredData.filter(
        (item) => item.isNew && (!item._id || item.id?.startsWith("temp"))
      );
      const existingRows = languageFilteredData.filter(
        (item) => !(item.isNew && (!item._id || item.id?.startsWith("temp")))
      );
      return [...newRows, ...existingRows];
    }
    return sortAlphabetically(languageFilteredData, alphabetField, "asc", "en");
  }, [languageFilteredData, hasChanges, hasNewRows, alphabetField]);

  const processedData = useMemo(() => {
    let result = filterBySearchTerm(sortedData, searchTerm);
    if (orderBy && !hasChanges && !hasNewRows) {
      result = sortDataByColumn(result, orderBy, order, allColumns);
    }
    return result;
  }, [sortedData, searchTerm, orderBy, order, hasChanges, hasNewRows, allColumns]);

  const paginatedData = processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ── cell update ───────────────────────────────────────────────────────────
  const handleCellUpdate = useCallback((rowId, field, value) => {
    setHasChanges(true);
    setData((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));
  }, []);

  // ── delete rows from renderList ───────────────────────────────────────────
  const handleDeleteRowsFromList = useCallback((rowIds) => {
    if (!rowIds || rowIds.length === 0) return;
    const tempIds = rowIds.filter((id) => {
      const row = data.find((r) => r.id === id);
      return row && (row.isNew || !row._id || row._id.startsWith("temp_"));
    });
    const persistedIds = rowIds.filter((id) => !tempIds.includes(id));
    if (tempIds.length > 0) {
      setData((prev) => {
        const updated = prev.filter((r) => !tempIds.includes(r.id));
        setHasNewRows(hasNewRowsInData(updated));
        setHasChanges(checkForChanges(updated, originalData));
        return updated;
      });
    }
    if (persistedIds.length > 0) {
      setSelectedRows(persistedIds);
      setDeleteDialogOpen(true);
    }
  }, [data, originalData]);

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSaveClick = () => setSaveDialogOpen(true);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveDialogOpen(false);
      const newItems = data.filter((item) => item.isNew && (!item._id || item._id.startsWith("temp_")));
      const existingItems = data.filter((item) => item._id && !item._id.startsWith("temp_") && !item.isNew);

      for (const item of newItems) {
        const { id, isNew, _id, ...itemData } = item;
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
        if (!response.ok) console.log("Failed to create item:", await response.text());
      }

      if (existingItems.length > 0) {
        const formattedItems = existingItems.map(({ isNew, ...rest }) => ({ ...rest, id: rest._id }));
        const response = await fetch(`${apiEndpoint}/batch_edit`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedItems),
        });
        if (!response.ok) console.log("Failed to update items:", await response.text());
      }

      await fetchData();
      setHasChanges(false); setHasNewRows(false); setSelectedRows([]);
      setSelectedLetter(ALPHABET_FILTER_VALUES.ALL);
      setSnackbar({ open: true, message: getLabel("saveSuccess") || t.SAVE_SUCCESS, severity: "success" });
    } catch (err) {
      console.log("Save error:", err);
      setSnackbar({ open: true, message: err.message || getLabel("saveFailed") || t.SAVE_FAILED, severity: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // ── add row ───────────────────────────────────────────────────────────────
  const handleAddRow = () => {
    const newRow = normalizeRow({ id: `temp_${Date.now()}_${Math.random()}`, isNew: true });
    setData((prev) => [newRow, ...prev]);
    setHasChanges(true); setHasNewRows(true); setPage(0); setOrderBy(""); setOrder("asc");
  };

  // ── delete ────────────────────────────────────────────────────────────────
  const handleDeleteSelectedClick = () => { if (selectedRows.length === 0) return; setDeleteDialogOpen(true); };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteDialogOpen(false); setIsSaving(true);
      const itemsToDelete = data.filter((row) => selectedRows.includes(row.id));
      let deletedCount = 0;
      for (const item of itemsToDelete) {
        if (!item._id || item._id.startsWith("temp_")) { deletedCount++; continue; }
        const response = await fetch(`${apiEndpoint}/${item._id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Failed to delete item ${item._id}: ${await response.text()}`);
        deletedCount++;
      }
      const updatedData = data.filter((row) => !selectedRows.includes(row.id));
      const updatedOriginal = originalData.filter((row) => !selectedRows.includes(row.id));
      setData(updatedData); setOriginalData(updatedOriginal); setSelectedRows([]);
      setHasNewRows(hasNewRowsInData(updatedData));
      setHasChanges(checkForChanges(updatedData, updatedOriginal));
      setSnackbar({ open: true, message: t.DELETE_SUCCESS_TEMPLATE(deletedCount), severity: "success" });
    } catch (err) {
      console.log("Delete error:", err);
      setSnackbar({ open: true, message: err.message || t.DELETE_FAILED, severity: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // ── row selection ─────────────────────────────────────────────────────────
  const handleSelectRow = (rowId) => {
    setSelectedRows((prev) => prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]);
  };
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) setSelectedRows([]);
    else setSelectedRows(paginatedData.map((row) => row.id));
  };

  // ── CSV export ────────────────────────────────────────────────────────────
  const downloadCSV = () => {
    exportToCSV(processedData, csvHeaders, `${entityName}_export_${new Date().toISOString().split("T")[0]}.csv`);
  };

  // ── early returns ─────────────────────────────────────────────────────────
  if (isLoading) return <LoadingLayer isLoading={isLoading} />;
  if (error === "login_required") {
    return <AlertInfo message={getSystemLabel("loginRequired", isCn) || t.LOGIN_REQUIRED} subMessage={getSystemLabel("loginPrompt", isCn) || ""} isCn={isCn} />;
  }
  if (error && error !== "login_required") {
    return <AlertInfo message={getSystemLabel("saveFailed", isCn) || t.ERROR_LOADING} subMessage={error} isCn={isCn} />;
  }

  const selectedRowsData = getSelectedRowsData();
  const { newCount, modifiedCount } = calculateChanges(data, originalData);

  // ── shared pill style factory ─────────────────────────────────────────────
  const pillSx = (active) => ({
    display: "flex", alignItems: "center", gap: "5px",
    px: 1.5, py: 0.6, borderRadius: "6px", cursor: "pointer",
    fontSize: 10, fontWeight: active ? 700 : 400,
    border: "0.5px solid",
    borderColor: active ? "text.primary" : "divider",
    bgcolor: active ? (isDark ? "var(--interactive-background-hover, #1a1a1a)" : "var(--interactive-background-hover, #f0f0f0)") : "transparent",
    color: active ? "text.primary" : "text.secondary",
    transition: "all 0.15s", userSelect: "none",
    "&:hover": { borderColor: "text.secondary", color: "text.primary" },
    ...labelFontStyle,
  });

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <AnimatedBox>
      <Container maxWidth={false} sx={{ px: 3, py: 4 }}>
        <StyledPaper elevation={0}>
          <Stack spacing={3} sx={{ minHeight: 500 }}>

            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <TableViewIcon sx={{ fontSize: 30, color: isDark ? "var(--text-primary, #fff)" : "var(--text-primary, #000)" }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: isDark ? "var(--text-primary, #fff)" : "var(--text-primary, #000)", ...labelFontStyle }}>
                {isCn ? titles.cn : titles.en}
              </Typography>
            </Stack>

            {/* Data Info */}
            <InfoBar
              message={t.DATA_INFO_TEMPLATE(data.length, processedData.length, hasChanges || hasNewRows)}
              isCn={isCn}
              labelFontStyle={labelFontStyle}
            />

            {/* No Data */}
            {data.length === 0 && !hasNewRows && (
              <Alert severity="info" sx={{ borderRadius: "8px", "& .MuiAlert-message": labelFontStyle }}>
                {t.NO_DATA_NOTICE}
              </Alert>
            )}

            {/* Unsaved Changes Warning */}
            {(hasChanges || hasNewRows) && (
              <Alert severity="info" sx={{ borderRadius: "8px", "& .MuiAlert-message": labelFontStyle }}>
                {t.UNSAVED_CHANGES_WARNING}
              </Alert>
            )}

            {/* Alphabet Pagination Bar */}
            <AlphabetPaginationBar
              data={data}
              field={alphabetField}
              selectedLetter={selectedLetter}
              onLetterChange={handleLetterChange}
              isCn={isCn}
              labelFontStyle={labelFontStyle}
              showCounts={true}
              disabled={hasChanges || hasNewRows}
              compact={false}
            />

            {/* ── Language filter toggle ── only shown when data has language field ── */}
            {schemaHasLanguage && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Auto pill: follows isCn from the app's language switcher */}
                <Box onClick={() => setLanguageFilter("auto")} sx={pillSx(languageFilter === "auto")}>
                  {isCn ? "中文" : "EN"}
                </Box>

                {/* All pill: show every row regardless of language */}
                <Box onClick={() => setLanguageFilter("all")} sx={pillSx(languageFilter === "all")}>
                  {isCn ? "全部" : "All"}
                </Box>

                {/* Dim label so the user knows what these pills control */}
                <Typography sx={{ fontSize: 9, color: "text.disabled", ml: 0.5, ...labelFontStyle }}>
                  {isCn ? "语言筛选" : "language filter"}
                </Typography>
              </Box>
            )}

            <Divider sx={{ borderColor: isDark ? "var(--border-light, #fff)" : "var(--border-light, #000)", my: 2 }} />

            {error && (
              <Grow in={!!error}>
                <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: "8px" }}>
                  {error}
                </Alert>
              </Grow>
            )}

            <BatchEditActions
              onSave={handleSaveClick}
              onAdd={handleAddRow}
              onDelete={handleDeleteSelectedClick}
              hasChanges={hasChanges}
              isSaving={isSaving}
              selectedRows={selectedRows}
              processedData={processedData}
              getLabel={getLabel}
              labelFontStyle={labelFontStyle}
              onDownloadCSV={downloadCSV}
            />

            <Divider sx={{ borderColor: isDark ? "var(--border-light, #fff)" : "var(--border-light, #000)", my: 2 }} />

            {/* ── Grouped / Flat toggle + Group by ── */}
            {renderList && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: -1,
                  flexWrap: "wrap",
                  rowGap: 1,
                }}
              >
                <Box onClick={() => setIsGrouped(true)} sx={pillSx(isGrouped)}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "2px", flexShrink: 0 }}>
                    <Box sx={{ width: 14, height: 2, borderRadius: 1, bgcolor: "currentColor" }} />
                    <Box sx={{ width: 10, height: 2, borderRadius: 1, bgcolor: "currentColor", ml: "2px" }} />
                    <Box sx={{ width: 10, height: 2, borderRadius: 1, bgcolor: "currentColor", ml: "2px" }} />
                    <Box sx={{ width: 14, height: 2, borderRadius: 1, bgcolor: "currentColor" }} />
                    <Box sx={{ width: 10, height: 2, borderRadius: 1, bgcolor: "currentColor", ml: "2px" }} />
                  </Box>
                  {isCn ? "分组" : "Grouped"}
                </Box>
                <Box onClick={() => setIsGrouped(false)} sx={pillSx(!isGrouped)}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "2px", flexShrink: 0 }}>
                    {[0, 1, 2, 3].map((i) => (
                      <Box key={i} sx={{ width: 14, height: 2, borderRadius: 1, bgcolor: "currentColor" }} />
                    ))}
                  </Box>
                  {isCn ? "平铺" : "Flat"}
                </Box>

                {/* Group by — mirrors the manager page's grouping dimension */}
                {isGrouped && resolvedGroupOptions.length > 1 && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      ml: 1,
                      pl: 1.5,
                      borderLeft: "1px solid",
                      borderColor: isDark ? "var(--border-light, #fff)" : "var(--border-light, #000)",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 10, opacity: 0.7, whiteSpace: "nowrap", ...labelFontStyle }}
                    >
                      {isCn ? "分组方式" : "Group by"}
                    </Typography>
                    <Box sx={{ display: "inline-flex", gap: 0.75, flexWrap: "wrap" }}>
                      {resolvedGroupOptions.map((option) => {
                        const active = option.value === activeGroupOption?.value;
                        return (
                          <Box
                            key={option.value}
                            onClick={() => setGroupBy(option.value)}
                            sx={{
                              px: 1.25,
                              py: 0.5,
                              cursor: "pointer",
                              borderRadius: "8px",
                              border: "1px solid",
                              borderColor: active
                                ? isDark
                                  ? "var(--border-light, #fff)"
                                  : "var(--border-light, #000)"
                                : "transparent",
                              backgroundColor: active
                                ? isDark
                                  ? "var(--interactive-background-hover, rgba(255,255,255,.1))"
                                  : "var(--interactive-background-hover, rgba(0,0,0,.06))"
                                : "transparent",
                              fontSize: 10,
                              fontWeight: active ? 600 : 400,
                              whiteSpace: "nowrap",
                              ...labelFontStyle,
                            }}
                          >
                            {option.label?.[isCn ? "cn" : "en"] || option.value}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* ── List area ── */}
            {renderList && isGrouped ? (
              renderList(processedData, isCn, labelFontStyle, {
                onCellUpdate: handleCellUpdate,
                onDeleteRows: handleDeleteRowsFromList,
                selectedRows,
                onSelectRow: handleSelectRow,
                onSelectAll: handleSelectAll,
                columns: allColumns,
                getLabel,
                // Grouping (same shape as the manager's group config)
                groupConfig: activeGroupOption?.config || null,
                groupBy,
                setGroupBy,
                groupOptions: resolvedGroupOptions,
              })
            ) : (
              <BatchEditCardList
                columns={allColumns}
                data={renderList ? processedData : paginatedData}
                loading={isLoading}
                error={error}
                page={renderList ? undefined : page}
                rowsPerPage={renderList ? undefined : rowsPerPage}
                count={renderList ? undefined : processedData.length}
                onPageChange={renderList ? undefined : (e, newPage) => setPage(newPage)}
                onRowsPerPageChange={renderList ? undefined : (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                selectedRows={selectedRows}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                onCellUpdate={handleCellUpdate}
                getLabel={getLabel}
                labelFontStyle={labelFontStyle}
                searchTerm={searchTerm}
                orderBy={orderBy}
                order={order}
                onRequestSort={handleRequestSort}
                sortingDisabled={hasChanges || hasNewRows}
                emptyMessage={t.EMPTY_TABLE_MESSAGE}
              />
            )}

            {/* Delete Confirmation Dialog */}
            <BatchDialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={handleDeleteConfirm}
              title={getLabel("confirmDelete") || t.CONFIRM_DELETE_TITLE}
              message={getLabel("confirmDeleteMessage") || t.CONFIRM_DELETE_MESSAGE}
              confirmLabel={getLabel("delete") || t.DELETE_BUTTON}
              cancelLabel={getLabel("cancel") || t.CANCEL_BUTTON}
              type="delete"
              rowsData={selectedRowsData}
              getLabel={getLabel}
              labelFontStyle={labelFontStyle}
              renderRow={renderDeleteRow}
            />

            {/* Save Confirmation Dialog */}
            <BatchEditDialog
              open={saveDialogOpen}
              onClose={() => setSaveDialogOpen(false)}
              onConfirm={handleSave}
              title={getLabel("confirmSave") || t.CONFIRM_SAVE_TITLE}
              message={
                <span style={{ display: "block", marginBottom: 8, color: isDark ? "var(--text-primary, #fff)" : "var(--text-primary, #333)", fontWeight: 500 }}>
                  {t.CONFIRM_SAVE_MESSAGE(newCount, modifiedCount)}
                </span>
              }
              confirmLabel={getLabel("confirm") || t.CONFIRM_BUTTON}
              cancelLabel={getLabel("cancel") || t.CANCEL_BUTTON}
              icon={<WarningIcon sx={{ color: "var(--text-primary, #666)" }} />}
              rowsData={(() => {
                const SKIP = new Set(["id", "_id", "isNew", "_modified", "updatedAt", "createdAt"]);
                return data.map((item) => {
                  if (item.isNew && (!item._id || item._id.startsWith("temp_"))) {
                    const filledKeys = Object.keys(item).filter(
                      (k) => !SKIP.has(k) && item[k] !== null && item[k] !== undefined && String(item[k]).trim() !== ""
                    );
                    return { item, original: null, changedKeys: filledKeys };
                  }
                  const original = originalData.find((o) => o._id === item._id);
                  if (!original) return null;
                  const changedKeys = Object.keys(item).filter((k) => {
                    if (SKIP.has(k)) return false;
                    return JSON.stringify(item[k]) !== JSON.stringify(original[k]);
                  });
                  if (changedKeys.length === 0) return null;
                  return { item, original, changedKeys };
                }).filter(Boolean);
              })()}
              getLabel={getLabel}
              labelFontStyle={labelFontStyle}
              renderRow={(entry, index, allEntries) => {
                if (!entry) return null;
                const { item, original, changedKeys } = entry;
                const isNew = !original;
                const rowLabel = (
                  item.tag_cn || item.tag_en ||
                  item.title_cn || item.title_en ||
                  item.name_cn || item.name_en ||
                  item.title || item.name ||
                  item.caption_cn || item.caption_en ||
                  item.caption || item.artist ||
                  `#${index + 1}`
                );
                const fmt = (v) => {
                  if (v === null || v === undefined || String(v).trim() === "") return "—";
                  if (Array.isArray(v)) return v.join(", ") || "—";
                  return String(v);
                };
                return (
                  <React.Fragment key={item.id ?? index}>
                    <Box sx={{ py: 1, px: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, ...labelFontStyle }}>{rowLabel}</Typography>
                        {isNew && (
                          <Box component="span" sx={{ fontSize: "9px", fontWeight: 700, px: "6px", py: "1px", borderRadius: "10px", bgcolor: "success.light", color: "success.dark" }}>
                            NEW
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4, pl: 1 }}>
                        {changedKeys.map((key) => (
                          <Box key={key} sx={{ display: "flex", alignItems: "baseline", gap: 0.75, flexWrap: "wrap" }}>
                            <Typography sx={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.disabled", minWidth: 80, flexShrink: 0, ...labelFontStyle }}>
                              {key}
                            </Typography>
                            {!isNew && (
                              <>
                                <Typography sx={{ fontSize: 10, color: "error.main", textDecoration: "line-through", opacity: 0.7, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...labelFontStyle }}>
                                  {fmt(original[key])}
                                </Typography>
                                <Typography sx={{ fontSize: 9, color: "text.disabled" }}>→</Typography>
                              </>
                            )}
                            <Typography sx={{ fontSize: 10, color: "success.dark", fontWeight: 500, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...labelFontStyle }}>
                              {fmt(item[key])}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    {index < allEntries.length - 1 && <Divider />}
                  </React.Fragment>
                );
              }}
            />

            <AppSnackbar
              open={snackbar.open}
              message={snackbar.message}
              severity={snackbar.severity}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              sx={labelFontStyle}
              snackbarSx={{ zIndex: 1400 }}
              closeLabel={t.CLOSE_BUTTON}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              autoHideDuration={6000}
              alertProps={{ icon: <WarningIcon /> }}
            />
          </Stack>
        </StyledPaper>
      </Container>
    </AnimatedBox>
  );
}
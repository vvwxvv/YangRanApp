"use client";

import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import {
  Alert,
  Typography,
  Container,
  Stack,
  Grow,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { TableIcon, AlertTriangle } from "lucide-react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useFont from '@/hooks/useFont';
import { getSystemLabel } from "@/components/labels/system_labels";
import EditableCell from "@/components/pages/manager/batch_edit/EditableCell";
import { AnimatedBox } from "@/components/pages/manager/batch_edit/batchEditStyles";
import { makeBatchEditColumns } from "@/components/pages/manager/batch_edit/columnFactory";
import { BatchEditActions } from "@/components/pages/manager/batch_edit/BatchEditActions";
import BatchEditTable from "@/components/pages/manager/batch_edit/BatchEditTable";
import AppSnackbar from "@/components/ui/Snackbar";
import AlertInfo from "@/components/alerts/AlertInfo";
import BatchDialog from "@/components/popups/BatchDialog";
import BatchEditDialog from "@/components/popups/BatchEditDialog";
import LoadingLayer from "@/components/animations/LoadingLayer";
import { useDarkMode } from "@/hooks/useDarkMode";
import InfoBar from "@/components/alerts/InfoBar";
import ImageThumbnailWithPreview from "@/components/images/ImageThumbnailWithPreview";
import PageTitle from "@/components/titles/PageTitle";

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook to manage data state and changes tracking
 */
const useDataState = (normalizeRow, isCn) => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const calculateChanges = useCallback(() => {
    const newItems = data.filter((item) => item.isNew || item.id?.startsWith("temp_"));
    const existingItems = data.filter((item) => (item._id || item.id) && !item.id?.startsWith("temp_") && !item.isNew);
    const modifiedItems = existingItems.filter((item) => {
      const itemId = item._id || item.id;
      const original = originalData.find((orig) => (orig._id || orig.id) === itemId);
      if (!original) return false;
      return Object.keys(item).some((key) => {
        if (key === "id" || key === "_id" || key === "isNew") return false;
        return JSON.stringify(item[key]) !== JSON.stringify(original[key]);
      });
    });
    return {
      newCount: newItems.length,
      modifiedCount: modifiedItems.length,
      newItems,
      modifiedItems,
    };
  }, [data, originalData]);

  // Track changes effect
  useEffect(() => {
    const changes = calculateChanges();
    const hasAnyChanges = changes.newCount > 0 || changes.modifiedCount > 0;
    setHasChanges(hasAnyChanges);
  }, [calculateChanges]);

  // Empty data effect - ensure at least one row exists
  const ensureMinimumRow = useCallback(() => {
    if (data.length === 0) {
      const newRow = normalizeRow({
        id: `temp_${Date.now()}_${Math.random()}`,
        isNew: true,
        language: isCn ? "CN" : "EN",
      });
      setData([newRow]);
    }
  }, [data.length, normalizeRow, isCn]);

  return {
    data,
    setData,
    originalData,
    setOriginalData,
    hasChanges,
    calculateChanges,
    ensureMinimumRow,
  };
};

/**
 * Hook to manage UI state
 */
const useUIState = (defaultRowsPerPage) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  const resetPagination = useCallback(() => {
    setPage(0);
    setRowsPerPage(defaultRowsPerPage);
    setOrderBy("");
    setOrder("asc");
  }, [defaultRowsPerPage]);

  return {
    snackbar,
    setSnackbar,
    selectedRows,
    setSelectedRows,
    searchTerm,
    setSearchTerm,
    saveDialogOpen,
    setSaveDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    orderBy,
    setOrderBy,
    order,
    setOrder,
    resetPagination,
  };
};

/**
 * Hook to manage API operations
 */
const useDataAPI = ({ apiEndpoint, normalizeRow, entityName, useBatchEditEndpoint, schemaFields }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      const dataArray = result.data || result;

      if (!Array.isArray(dataArray)) {
        throw new Error("Invalid data format received");
      }

      return dataArray.map(normalizeRow);
    } catch (err) {
      console.log("Fetch error:", err);
      setError(err.message || "Failed to load data");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, normalizeRow]);

  const createItems = useCallback(
    async (items) => {
      const createdItems = [];
      
      for (const item of items) {
        const { id, isNew, _id, ...itemData } = item;

        // Validate required fields
        const requiredFields = schemaFields.filter((field) => field.required).map((field) => field.name);
        const missingFields = requiredFields.filter((field) => itemData[field] === undefined || itemData[field] === null || itemData[field] === "");

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
        }

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to create item");
        }

        const result = await response.json();
        createdItems.push(result.data || result);
      }
      
      return createdItems;
    },
    [apiEndpoint, schemaFields]
  );

  const updateItems = useCallback(
    async (items) => {
      if (useBatchEditEndpoint) {
        const formattedItems = items.map((item) => {
          const { isNew, ...rest } = item;
          return { ...rest, id: item._id || item.id };
        });
        const response = await fetch(`${apiEndpoint}/batch_edit`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [entityName]: formattedItems }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to update items");
        }
      } else {
        for (const item of items) {
          const { isNew, ...itemData } = item;
          const itemId = item._id || item.id;
          const response = await fetch(`${apiEndpoint}/${itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemData),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to update item: ${itemId}`);
          }
        }
      }
    },
    [apiEndpoint, useBatchEditEndpoint, entityName]
  );

  const deleteItems = useCallback(
    async (items) => {
      for (const item of items) {
        const itemId = item._id || item.id;
        const response = await fetch(`${apiEndpoint}/${itemId}`, { method: "DELETE" });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to delete item: ${itemId}`);
        }
      }
    },
    [apiEndpoint]
  );

  return {
    isLoading,
    isSaving,
    setIsSaving,
    error,
    setError,
    fetchData,
    createItems,
    updateItems,
    deleteItems,
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Default data sorter - prioritizes new items
 */
const defaultSort = (data) => {
  return [...data].sort((a, b) => {
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    return 0;
  });
};

/**
 * Default data filter
 */
const defaultFilter = (data, { searchTerm, isCn, schemaFields }) => {
  return data.filter((item) => {
    if (!item) return false;

    // Language filtering - only if schema includes a "language" field
    if (schemaFields.some((field) => field.name === "language")) {
      const itemLanguage = item.language || "EN";
      const targetLanguage = isCn ? "CN" : "EN";
      // Always show new unsaved rows regardless of language
      if (!item.isNew && itemLanguage !== targetLanguage) return false;
    }

    // Search filtering
    if (!searchTerm) return true;
    try {
      const searchLower = searchTerm.toLowerCase();
      return Object.values(item).some((value) => {
        if (Array.isArray(value)) {
          return value.some((v) => String(v).toLowerCase().includes(searchLower));
        }
        return value && String(value).toLowerCase().includes(searchLower);
      });
    } catch {
      return true;
    }
  });
};

/**
 * Generate CSV content from data
 */
const generateCSVContent = (data, schemaFields) => {
  const headers = schemaFields.map((field) => field.name);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((key) => {
          const val = (row[key] || "").toString().replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(",")
    ),
  ].join("\n");

  return csvContent;
};

/**
 * Download CSV file
 */
const downloadCSVFile = (content, filename) => {
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Helper for pluralization
 */
const pluralize = (count, singular, plural) => (count === 1 ? singular : plural);

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Page header with icon and title
 */
const PageHeader = ({ entityName, isCn, isDark }) => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <TableIcon size={32} color={isDark ? "var(--text-primary, #fff)" : "var(--text-primary, #000)"} />
    <PageTitle
      title={
        isCn
          ? `批量编辑${entityName}`
          : `Batch Edit ${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`
      }
    />
  </Stack>
);

/**
 * Data info bar
 */
const DataInfoBar = ({ enableLanguageFilter, entityName, recordCount, isCn, labelFontStyle }) => {
  const message = enableLanguageFilter
    ? isCn
      ? `当前显示中文 (CN) 数据，共 ${recordCount} 条记录`
      : `Currently showing English (EN) data, ${recordCount} records total`
    : isCn
    ? `当前显示 ${entityName} 数据，共 ${recordCount} 条记录`
    : `Currently showing ${entityName} data, ${recordCount} records total`;

  return <InfoBar message={message} isCn={isCn} labelFontStyle={labelFontStyle} />;
};

/**
 * Field group selector
 */
const FieldGroupSelector = ({ fieldGroups, fieldGroup, onChange, isDark, labelFontStyle }) => (
  <ToggleButtonGroup
    value={fieldGroup}
    exclusive
    onChange={(_, newGroup) => {
      if (newGroup) onChange(newGroup);
    }}
    sx={{
      mb: 2,
      flexWrap: "wrap",
      "& .MuiToggleButton-root": {
        color: isDark ? "var(--text-primary, #fff)" : "var(--text-primary, #000)",
        borderColor: isDark ? "var(--border-light, #555)" : "var(--border-light, #ddd)",
        fontSize: "13px",
        padding: "6px 12px",
        minHeight: "36px",
        ...labelFontStyle,
      },
      "& .Mui-selected": {
        backgroundColor: isDark ? "var(--interactive-background-hover, rgba(255,255,255,0.16))" : "var(--background-primary, #000)",
        color: isDark ? "var(--text-primary, #fff)" : "var(--text-primary, #fff)",
        borderColor: isDark ? "var(--border-light, #fff)" : "var(--border-light, #000)",
        "&:hover": {
          backgroundColor: isDark ? "var(--interactive-background-hover, rgba(255,255,255,0.22))" : "var(--interactive-background-hover, #333)",
        },
      },
    }}
  >
    {fieldGroups.groups.map((group) => (
      <ToggleButton key={group.key} value={group.key}>
        {group.label}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

/**
 * Save confirmation message
 */
const SaveConfirmationMessage = ({ newCount, modifiedCount, isCn }) => (
  <span style={{ display: "block", marginBottom: 8, color: "var(--text-primary, #333)", fontWeight: 500 }}>
    {isCn ? (
      <>
        您将保存 <b>{newCount}</b> 个新项 和 <b>{modifiedCount}</b> 个已修改项。
        <br />
        请仔细检查您的更改。此操作无法撤销。
      </>
    ) : (
      <>
        You are about to save <b>{newCount}</b> new {pluralize(newCount, "item", "items")} and{" "}
        <b>{modifiedCount}</b> modified {pluralize(modifiedCount, "item", "items")}.
        <br />
        Please review your changes carefully. This action cannot be undone.
      </>
    )}
  </span>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Reusable Batch Edit Manager Component
 *
 * A comprehensive batch editing solution that handles CRUD operations for any entity type.
 * Supports custom sorting, filtering, field grouping, image previews, and more.
 */
export default function BatchEditManagerShell({ config }) {
  const {
    entityName,
    apiEndpoint,
    normalizeRow,
    schemaFields,
    getOptions,
    fieldGroups,
    customSort,
    customFilter,
    renderRowPreview,
    imageFields = [],
    enableCSVExport = false,
    enableLanguageFilter = false,
    useBatchEditEndpoint = false,
    defaultRowsPerPage = 100,
  } = config;

  // Context and hooks
  const { isCn } = useContext(LanguageContext);
  const { style: labelFontStyle } = useFont();
  const isDark = useDarkMode();

  // Custom hooks for state management
  const dataState = useDataState(normalizeRow, isCn);
  const uiState = useUIState(defaultRowsPerPage);
  const api = useDataAPI({ apiEndpoint, normalizeRow, entityName, useBatchEditEndpoint, schemaFields });

  // Field grouping state
  const [fieldGroup, setFieldGroup] = useState(fieldGroups.groups[0]?.key || "basic-0");

  // Helper function
  const getLabel = useCallback((key) => getSystemLabel(key, isCn), [isCn]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await api.fetchData();
      dataState.setData(fetchedData);
      dataState.setOriginalData(fetchedData);
    };
    loadData();
  }, [isCn]); // Re-fetch when language changes

  // Ensure minimum row exists
  useEffect(() => {
    if (!api.isLoading && dataState.data.length === 0) {
      dataState.ensureMinimumRow();
    }
  }, [api.isLoading, dataState.data.length]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleRequestSort = useCallback(
    (property) => {
      uiState.setOrder((prevOrder) =>
        uiState.orderBy === property && prevOrder === "asc" ? "desc" : "asc"
      );
      uiState.setOrderBy(property);
      uiState.setPage(0);
    },
    [uiState.orderBy]
  );

  const handleCellUpdate = useCallback((rowId, field, value) => {
    dataState.setData((prevData) =>
      prevData.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  }, []);

  const handleAddRow = useCallback(() => {
    const newRow = normalizeRow({
      id: `temp_${Date.now()}_${Math.random()}`,
      isNew: true,
      language: isCn ? "CN" : "EN",
    });

    dataState.setData((prevData) => [newRow, ...prevData]);
    uiState.resetPagination();
  }, [normalizeRow, isCn]);

  const handleSave = useCallback(async () => {
    try {
      // Start saving process
      api.setIsSaving(true);
      uiState.setSaveDialogOpen(false);

      // Calculate changes
      const { newItems, modifiedItems } = dataState.calculateChanges();

      // Create new items first and get their IDs
      let createdItems = [];
      if (newItems.length > 0) {
        createdItems = await api.createItems(newItems);
      }

      // Update modified items
      if (modifiedItems.length > 0) {
        await api.updateItems(modifiedItems);
      }

      // Fetch fresh data from server to get the complete updated list
      const refreshedData = await api.fetchData();
      
      // Update both current and original data with fresh server data
      dataState.setData(refreshedData);
      dataState.setOriginalData(refreshedData);

      // Reset selected rows and show success message
      uiState.setSelectedRows([]);
      
      const totalSaved = newItems.length + modifiedItems.length;
      const message = isCn 
        ? `成功保存 ${totalSaved} 项` 
        : `Successfully saved ${totalSaved} ${pluralize(totalSaved, "item", "items")}`;
      
      uiState.setSnackbar({
        open: true,
        message,
        severity: "success",
      });
    } catch (err) {
      console.log("Save error:", err);
      uiState.setSnackbar({
        open: true,
        message: err.message || getLabel("saveFailed"),
        severity: "error",
      });
    } finally {
      // End saving process
      api.setIsSaving(false);
    }
  }, [dataState, api, uiState, getLabel, isCn]);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      uiState.setDeleteDialogOpen(false);
      api.setIsSaving(true);
  
      const itemsToDelete = dataState.data.filter((row) => uiState.selectedRows.includes(row.id));
      
      // Only delete items that:
      // 1. Have a real _id or id (not temporary)
      // 2. Are not new unsaved items
      // 3. Exist in the original data (haven't been deleted already)
      const existingItemsToDelete = itemsToDelete.filter((item) => {
        const itemId = item._id || item.id;
        // Skip temporary/new items
        if (!itemId || itemId.startsWith("temp_") || item.isNew) {
          return false;
        }
        // Verify item exists in original data
        const existsInOriginal = dataState.originalData.some(
          (orig) => (orig._id || orig.id) === itemId
        );
        return existsInOriginal;
      });
  
      // Only call API if there are actual items to delete
      if (existingItemsToDelete.length > 0) {
        await api.deleteItems(existingItemsToDelete);
      }

      // Fetch fresh data from server
      const refreshedData = await api.fetchData();
      dataState.setData(refreshedData);
      dataState.setOriginalData(refreshedData);
      
      uiState.setSelectedRows([]);
  
      const totalDeleted = itemsToDelete.length;
      const message = isCn
        ? `成功删除 ${totalDeleted} 项`
        : `Successfully deleted ${totalDeleted} ${pluralize(totalDeleted, "item", "items")}`;
  
      uiState.setSnackbar({
        open: true,
        message,
        severity: "success",
      });
    } catch (err) {
      console.log("Delete error:", err);
      uiState.setSnackbar({
        open: true,
        message: err.message || (isCn ? "删除项目失败" : "Failed to delete items"),
        severity: "error",
      });
    } finally {
      api.setIsSaving(false);
    }
  }, [dataState.data, dataState.originalData, uiState.selectedRows, api, isCn]);

  const handleSelectRow = useCallback((rowId) => {
    uiState.setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  }, []);

  const handleSelectAll = useCallback((currentPageData) => {
    uiState.setSelectedRows((prev) => {
      if (prev.length === currentPageData.length) {
        return [];
      }
      return currentPageData.map((row) => row.id);
    });
  }, []);

  const downloadCSV = useCallback(() => {
    if (!enableCSVExport) return;

    const csvContent = generateCSVContent(processedData, schemaFields);
    const filename = `${entityName}_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSVFile(csvContent, filename);
  }, [enableCSVExport, schemaFields, entityName]);

  // ============================================================================
  // DATA PROCESSING
  // ============================================================================

  // Build columns with image field support
  const allColumns = useMemo(() => {
    return makeBatchEditColumns({
      schemaFields,
      getLabel,
      getOptions,
    }).map((col) => {
      const isImageField = imageFields.includes(col.field);

      return {
        ...col,
        renderCell: (row, column, onCellUpdate) => (
          <EditableCell
            value={row[column.field] !== undefined && row[column.field] !== null ? row[column.field] : ""}
            onSave={(value) => onCellUpdate(row.id, column.field, value)}
            type={column.type}
            options={column.options}
            fieldType={column.fieldType}
            labelFontStyle={labelFontStyle}
            isCn={isCn}
            column={column}
            renderDisplay={
              isImageField
                ? (value) =>
                    value &&
                    typeof value === "string" &&
                    (value.startsWith("http://") || value.startsWith("https://")) ? (
                      <ImageThumbnailWithPreview src={value} tooltip={value} width={200} />
                    ) : (
                      <span style={{ color: "var(--text-primary, #999)" }}>-</span>
                    )
                : undefined
            }
          />
        ),
      };
    });
  }, [schemaFields, getLabel, getOptions, imageFields, labelFontStyle, isCn]);

  // Get current field group
  const currentGroup = useMemo(
    () => fieldGroups.groups.find((g) => g.key === fieldGroup) || fieldGroups.groups[0],
    [fieldGroups.groups, fieldGroup]
  );

  // Filter columns by current group
  const shownColumns = useMemo(
    () => allColumns.filter((col) => currentGroup.fields.includes(col.field)),
    [allColumns, currentGroup.fields]
  );

  // Sort data
  const sortedData = useMemo(() => {
    if (customSort) {
      return customSort([...dataState.data], { isCn, order: uiState.order, orderBy: uiState.orderBy });
    }
    return defaultSort(dataState.data);
  }, [dataState.data, customSort, isCn, uiState.order, uiState.orderBy]);

  // Filter data
  const processedData = useMemo(() => {
    if (customFilter) {
      return customFilter(sortedData, {
        searchTerm: uiState.searchTerm,
        isCn,
        enableLanguageFilter,
      });
    }
    return defaultFilter(sortedData, {
      searchTerm: uiState.searchTerm,
      isCn,
      schemaFields,
    });
  }, [sortedData, customFilter, uiState.searchTerm, isCn, schemaFields, enableLanguageFilter]);

  // Paginate data
  const paginatedData = useMemo(
    () =>
      processedData.slice(
        uiState.page * uiState.rowsPerPage,
        uiState.page * uiState.rowsPerPage + uiState.rowsPerPage
      ),
    [processedData, uiState.page, uiState.rowsPerPage]
  );

  // Get selected rows data
  const selectedRowsData = useMemo(
    () => dataState.data.filter((row) => uiState.selectedRows.includes(row.id)),
    [dataState.data, uiState.selectedRows]
  );

  // Get changed items for save dialog
  const changedItemsForSave = useMemo(
    () =>
      dataState.data.filter((item) => {
        if (item.isNew || item.id?.startsWith("temp_")) return true;
        const itemId = item._id || item.id;
        const original = dataState.originalData.find((orig) => (orig._id || orig.id) === itemId);
        if (!original) return false;
        return Object.keys(item).some((key) => {
          if (key === "id" || key === "_id" || key === "isNew") return false;
          return JSON.stringify(item[key]) !== JSON.stringify(original[key]);
        });
      }),
    [dataState.data, dataState.originalData]
  );

  const { newCount, modifiedCount } = dataState.calculateChanges();

  // ============================================================================
  // RENDER STATES
  // ============================================================================

  if (api.isLoading) {
    return <LoadingLayer isLoading={api.isLoading} />;
  }

  if (api.error && dataState.data.length === 0) {
    return (
      <AlertInfo message={getSystemLabel("loadFailed", isCn)} subMessage={api.error} isCn={isCn} />
    );
  }

  if (dataState.data.length === 0 && !api.isLoading) {
    return (
      <AlertInfo
        message={getSystemLabel("noData", isCn)}
        subMessage={getSystemLabel("noDataInputBelow", isCn)}
        isCn={isCn}
      />
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <AnimatedBox
      sx={{
        minHeight: "100vh",
        height: "auto",
        overflowY: "auto",
      }}
    >
      <Container maxWidth={false} sx={{ px: 2, py: 2 }}>
        <Stack spacing={2} sx={{ minHeight: 500 }}>
          {/* Header */}
          <PageHeader entityName={entityName} isCn={isCn} isDark={isDark} />

          {/* Data Info */}
          <DataInfoBar
            enableLanguageFilter={enableLanguageFilter}
            entityName={entityName}
            recordCount={processedData.length}
            isCn={isCn}
            labelFontStyle={labelFontStyle}
          />

          {/* Instructions */}
          <Typography variant="body2" sx={{ color: "var(--text-primary, #666)", fontSize: "13px", ...labelFontStyle }}>
            {getLabel("batchEditInstructions")}
          </Typography>

          {/* Error Alert */}
          {api.error && (
            <Grow in={!!api.error}>
              <Alert
                severity="warning"
                onClose={() => api.setError(null)}
                sx={{ borderRadius: "8px" }}
              >
                {api.error}
              </Alert>
            </Grow>
          )}

          {/* Action Buttons */}
          <BatchEditActions
            onSave={() => uiState.setSaveDialogOpen(true)}
            onAdd={handleAddRow}
            onDelete={() => {
              if (uiState.selectedRows.length > 0) uiState.setDeleteDialogOpen(true);
            }}
            onExport={enableCSVExport ? downloadCSV : undefined}
            hasChanges={dataState.hasChanges}
            isSaving={api.isSaving}
            selectedRows={uiState.selectedRows}
            processedData={processedData}
            getLabel={getLabel}
            labelFontStyle={labelFontStyle}
          />

          <Divider sx={{ borderColor: isDark ? "var(--border-light, #333)" : "var(--border-light, #ddd)", my: 2 }} />

          {/* Field Group Selector */}
          <FieldGroupSelector
            fieldGroups={fieldGroups}
            fieldGroup={fieldGroup}
            onChange={setFieldGroup}
            isDark={isDark}
            labelFontStyle={labelFontStyle}
          />

          {/* Main Table */}
          <BatchEditTable
            columns={shownColumns}
            data={paginatedData}
            loading={api.isLoading}
            error={api.error}
            page={uiState.page}
            rowsPerPage={uiState.rowsPerPage}
            count={processedData.length}
            onPageChange={(e, newPage) => uiState.setPage(newPage)}
            onRowsPerPageChange={(e) => {
              uiState.setRowsPerPage(parseInt(e.target.value, 10));
              uiState.setPage(0);
            }}
            selectedRows={uiState.selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={() => handleSelectAll(paginatedData)}
            onCellUpdate={handleCellUpdate}
            getLabel={getLabel}
            labelFontStyle={labelFontStyle}
            searchTerm={uiState.searchTerm}
            orderBy={uiState.orderBy}
            order={uiState.order}
            onRequestSort={handleRequestSort}
          />

          {/* Delete Confirmation Dialog */}
          <BatchDialog
            open={uiState.deleteDialogOpen}
            onClose={() => uiState.setDeleteDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            title={getLabel("confirmDelete")}
            message={getLabel("confirmDeleteMessage")}
            confirmLabel={getLabel("delete")}
            cancelLabel={getLabel("cancel")}
            type="delete"
            rowsData={selectedRowsData}
            getLabel={getLabel}
            labelFontStyle={labelFontStyle}
            renderRow={(row, index) => (
              <React.Fragment key={row.id || index}>
                {renderRowPreview(row, index, getLabel, isCn, selectedRowsData)}
              </React.Fragment>
            )}
          />

          {/* Save Confirmation Dialog */}
          <BatchEditDialog
            open={uiState.saveDialogOpen}
            onClose={() => uiState.setSaveDialogOpen(false)}
            onConfirm={handleSave}
            title={getLabel("confirmSave")}
            message={
              <SaveConfirmationMessage newCount={newCount} modifiedCount={modifiedCount} isCn={isCn} />
            }
            confirmLabel={getLabel("confirm")}
            cancelLabel={getLabel("cancel")}
            icon={<AlertTriangle size={20} color="var(--text-primary, #666)" />}
            rowsData={changedItemsForSave}
            getLabel={getLabel}
            labelFontStyle={labelFontStyle}
            renderRow={(row, index) => (
              <React.Fragment key={row.id || index}>
                {renderRowPreview(row, index, getLabel, isCn, dataState.data)}
              </React.Fragment>
            )}
          />

          {/* Snackbar */}
          <AppSnackbar
            open={uiState.snackbar.open}
            message={uiState.snackbar.message}
            severity={uiState.snackbar.severity}
            onClose={() => uiState.setSnackbar({ ...uiState.snackbar, open: false })}
            sx={labelFontStyle}
            snackbarSx={{ zIndex: 1400 }}
            closeLabel={isCn ? "关闭" : "Close"}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={6000}
            alertProps={{ icon: <AlertTriangle size={16} /> }}
          />
        </Stack>
      </Container>
    </AnimatedBox>
  );
}
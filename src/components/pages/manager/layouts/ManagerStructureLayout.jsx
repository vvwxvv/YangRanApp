"use client";

import React, {
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ListOrdered, Mouse, Maximize2, AlertCircle } from "lucide-react";

// ─── Contexts ──────────────────────────────────────────────────────────────
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";

// ─── Hooks ─────────────────────────────────────────────────────────────────
import useFont from '@/hooks/useFont';
import { shouldHideArtistField } from '@/utils/artistUtils';
import useData from "@/hooks/useData";
import useDeleteItem from "@/hooks/useDeleteItem";
import useDataExport from "@/hooks/useDataExport";
import useDebounce from "@/hooks/useDebounce";
import useDeleteDialog from "@/hooks/useDeleteDialog";
import { useSnackbarNotification } from "@/hooks/useSnackbarNotification";

// ─── Utils ─────────────────────────────────────────────────────────────────
import { createFilterHandlersWithReset } from "@/utils/filterHandlers";
import { groupData } from "@/utils/groupData";
import ManagerUserGuide from "@/components/docs/ManagerUserGuide";
import { getSystemLabel } from "@/components/labels/system_labels";
import { resolveLocalizedLabel } from "@/utils/bilingualUtils";
import {
  filterByAlphabetLetter,
  ALPHABET_FILTER_VALUES,
} from "@/utils/alphabetPaginationUtils";
import { getNumericOrder } from "@/utils/getNumericOrder";
import { renderFilters, renderControl } from "@/utils/filterRenderers";
import { triggerDataRefresh } from "@/utils/dataRefresh";

// ─── Components ────────────────────────────────────────────────────────────
import AddButton from "@/components/buttons/AddButton";
import ViewModeToggle from "@/components/buttons/ViewModeToggle";
import ButtonRow from "@/components/buttons/ButtonRow";
import AlertInfo from "@/components/alerts/AlertInfo";
import LoadingLayer from "@/components/animations/LoadingLayer";
import ManagerCard from "@/components/pages/manager/components/ManagerCard";
import GridViewLayout from "@/components/layouts/GridViewLayout";
import ListWithExpandInfo from "@/components/lists/ListWithExpandInfo";
import AppSnackbar from "@/components/ui/Snackbar";
import AlphabetPaginationBar from "@/components/navs/AlphabetPaginationBar";
import AccordionBox from "@/components/others/AccordionBox";
import DeleteDialog from "@/components/popups/DeleteDialog";
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Card size (scale) control — the group summary slider drives these bounds.
const MIN_CARD_WIDTH = 160;
const MAX_CARD_WIDTH = 520;
const DEFAULT_CARD_WIDTH = 340;

// ─────────────────────────────────────────────────────────────────────────────
// Constants (single source of truth for theme tokens, timing & layout)
// ─────────────────────────────────────────────────────────────────────────────

/** CSS-variable-backed colors (fallbacks preserved from the original UI). */
const COLORS = {
  pageBg: "var(--background-primary, #ffffff)",
  pageText: "var(--text-primary, #000000)",
  surfaceBg: "var(--background-primary, #ffffff)",
  surfaceText: "var(--text-primary, #000000)",
  surfaceBorder: "var(--border-light, #e5e7eb)",
};

/** Colors passed to AccordionBox / group cards. */
const SURFACE_COLORS = {
  background: COLORS.surfaceBg,
  text: COLORS.surfaceText,
  border: COLORS.surfaceBorder,
};

const TIMING = {
  DEFAULT_DEBOUNCE_MS: 300,
  SNACKBAR_AUTOHIDE_MS: 4000,
};

const LAYOUT = {
  CONTROLS_TOP_OVERLAP: "0px",
  SURFACE_RADIUS: "12px",
  SECTION_GAP: "16px",
  CARD_MAX_HEIGHT: 800,
};

const SNACKBAR_ANCHOR = { vertical: "bottom", horizontal: "center" };

/** Exported style map — consumed by this component and external callers. */
const STYLES = {
  PAGE_CONTAINER: {
    p: { xs: 1, sm: 2, md: 3 },
    minHeight: "100vh",
    boxSizing: "border-box",
    mt: "270px",
  },
  PAGE_CONTAINER_MOBILE: {
    p: { xs: 1, sm: 2, md: 3 },
    minHeight: "100vh",
    boxSizing: "border-box",
    mt: "80px",
  },
  CONTAINER: {
    px: { xs: 0.5, sm: 2 },
    width: "100%",
  },
  HEADER: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  COUNT_DISPLAY: {
    fontWeight: 500,
    fontSize: "1rem",
    marginLeft: 16,
  },
  DIVIDER: {
    width: "100%",
    borderBottom: "2px solid",
    marginBottom: "1.5rem",
  },
  TITLE: {
    fontSize: "24px",
    fontWeight: "bold",
    color: COLORS.pageText,
    margin: 0,
    letterSpacing: "2px",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers (no React state — kept at module scope)
// ─────────────────────────────────────────────────────────────────────────────

/** Resolves a bilingual text object to the current language string. */
const pickLang = (obj, lang) => obj?.[lang] ?? obj?.EN ?? "";

/** Resolve a bilingual label ({cn,en} or {CN,EN}) to a plain string. */
const pickText = (value, isCn) => {
  if (value === null || value === undefined) return "";
  if (typeof value !== "object") return value;
  return isCn
    ? value.cn ?? value.CN ?? ""
    : value.en ?? value.EN ?? "";
};

/** Ensures every item carries a consistent `id` / `_id` pair. */
const normalizeId = (item) => {
  if (!item) return item;
  const resolvedId = item.id || item._id;
  return { ...item, id: resolvedId, _id: resolvedId };
};

/**
 * Sort items. Supports the JSON per-page `order` field (`order.<key>`) with a
 * sensible fallback: when an item has no usable order it falls back to year
 * (descending) and then title (A→Z).
 * @param {Array} items
 * @param {string|null} field
 * @param {'asc'|'desc'} direction
 * @returns {Array} sorted copy
 */
function sortItems(items, field, direction = "asc") {
  if (!field) return items;

  const isOrderField = field === "order" || field.startsWith("order.");
  const orderKey = field.startsWith("order.")
    ? field.slice("order.".length)
    : "artist_page_order";

  return [...items].sort((a, b) => {
    let aVal;
    let bVal;

    if (isOrderField) {
      const aOrd = getNumericOrder(a, orderKey);
      const bOrd = getNumericOrder(b, orderKey);
      if (aOrd !== bOrd) return direction === "asc" ? aOrd - bOrd : bOrd - aOrd;

      // No usable order (or tied) → year (desc), then title (A→Z)
      const aYear = Number(a?.year) || 0;
      const bYear = Number(b?.year) || 0;
      if (aYear !== bYear) return bYear - aYear;
      return String(a?.title || "").localeCompare(String(b?.title || ""));
    }

    aVal = a[field] ?? "";
    bVal = b[field] ?? "";
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/** Renders the labelled detail fields shown inside the delete dialog. */
function renderItemDetails({ item, fontStyle, isCn, fields = [], defaultFields = null }) {
  if (!item) {
    return (
      <div style={{ ...fontStyle, lineHeight: 1.7 }}>
        {getSystemLabel("loading", isCn)}
      </div>
    );
  }

  const fallbackDefaultFields = defaultFields || [
    { key: "title", label: getSystemLabel("title", isCn) },
    { key: "type", label: getSystemLabel("type", isCn) },
    { key: "year", label: getSystemLabel("year", isCn) },
    { key: "series", label: getSystemLabel("series", isCn) },
    { key: "caption", label: getSystemLabel("caption", isCn) },
  ];

  const fieldsToShow = fields.length > 0 ? fields : fallbackDefaultFields;

  return (
    <div style={{ ...fontStyle, lineHeight: 1.7 }}>
      {fieldsToShow.map((field) => {
        const value = item[field.key];
        if (!value && value !== 0) return null;
        return (
          <div key={field.key}>
            <b>{field.label}:</b> {value || "N/A"}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Local sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Delete confirmation dialog with default content + optional data refresh. */
function DeleteDialogWrapper({
  open,
  item,
  onClose,
  onConfirm,
  loading,
  title,
  content,
  confirmText,
  cancelText,
  fontStyle,
  isCn,
  fields = [],
  itemName = "item",
  schemaName = null,
  triggerRefresh = true,
  defaultFields = null,
}) {
  const handleConfirm = async () => {
    await onConfirm();
    if (triggerRefresh && schemaName) {
      triggerDataRefresh(schemaName);
    }
  };

  const renderContent = () => {
    if (content) return content;

    const defaultContent = getSystemLabel("delete_dialog_text", isCn).replace(
      "{itemName}",
      itemName
    );

    return (
      <div style={{ fontFamily: fontStyle?.fontFamily }}>
        <p style={{ marginBottom: "1rem", fontWeight: 500 }}>{defaultContent}</p>
        {renderItemDetails({ item, fontStyle, isCn, fields, defaultFields })}
      </div>
    );
  };

  return (
    <DeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      loading={loading}
      title={title}
      content={renderContent()}
      confirmText={confirmText}
      cancelText={cancelText}
    />
  );
}

/** Search input + optional single-select dropdown. */
function SearchAndSelectPanel({
  searchTerm = "",
  onSearchChange,
  placeholder = "Search...",
  ariaLabelSearch = "Search",
  options = [],
  selectedOption = "all",
  onOptionChange,
  optionPlaceholder = "Select an option",
  ariaLabelSelect = "Select option",
  fontStyle = {},
}) {
  const inputStyle = { ...fontStyle, fontSize: "14px" };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Search box */}
      <div className="w-full sm:flex-1">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 h-[42px] border border-black dark:border-white rounded-[10px] focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white outline-none transition-colors text-sm bg-white dark:bg-black text-black dark:text-white placeholder:text-black/35 dark:placeholder:text-white/35"
            style={inputStyle}
            aria-label={ariaLabelSearch}
          />
        </div>
      </div>

      {/* Select dropdown */}
      {options.length > 0 && (
        <div className="w-full sm:w-[210px] sm:flex-none">
          <select
            value={selectedOption}
            onChange={(e) => onOptionChange?.(e.target.value)}
            className="w-full h-[42px] px-3 border border-black dark:border-white rounded-[10px] focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white outline-none transition-colors text-sm bg-white dark:bg-black text-black dark:text-white cursor-pointer"
            style={inputStyle}
            aria-label={ariaLabelSelect}
          >
            <option value="all">{optionPlaceholder}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

/**
 * FilterPanel — wraps renderFilters and resets all filters when the language
 * changes, using the original setters for a direct reset.
 */
function FilterPanel(props) {
  const {
    filterHandlers,
    originalSetters = {},
    filterValues = { ALL: "all" },
    ...renderFiltersProps
  } = props;

  const safeFilterHandlers = useMemo(() => filterHandlers || {}, [filterHandlers]);
  const memoizedOriginalSetters = useMemo(() => originalSetters, [originalSetters]);

  const languageContext = useContext(LanguageContext);
  const { onLanguageChange } = languageContext || {};

  const handleLanguageChange = useCallback(() => {
    const defaultValue = filterValues.ALL !== undefined ? filterValues.ALL : "all";
    Object.values(memoizedOriginalSetters).forEach((setter) => {
      if (typeof setter === "function") setter(defaultValue);
    });
  }, [memoizedOriginalSetters, filterValues.ALL]);

  useEffect(() => {
    if (typeof onLanguageChange !== "function") return undefined;
    return onLanguageChange(handleLanguageChange);
  }, [onLanguageChange, handleLanguageChange]);

  return renderFilters({
    ...renderFiltersProps,
    filterHandlers: safeFilterHandlers,
    filterValues,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {{ managerSchemaConfig: import("@/types/schemaConfig").SchemaConfig }} props
 */
export default function ManagerStructureLayout({ managerSchemaConfig }) {
  // ── Contexts ───────────────────────────────────────────────────────────────
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const router = useRouter();
  const { style: fontStyle } = useFont();

  const lang = isCn ? "CN" : "EN";
  const t = useCallback((obj) => pickLang(obj, lang), [lang]);

  // ── Guard: schema config is required ──────────────────────────────────────
  if (!managerSchemaConfig) {
    console.warn("ManagerStructureLayout: managerSchemaConfig missing or invalid");
    return null;
  }

  // ── Schema config ─────────────────────────────────────────────────────────
  const {
    title,
    schemaName,
    navigation,
    dataConfig,
    filterConfig,
    exportConfig,
    uiConfig,
    labels,
    components = {},
  } = managerSchemaConfig;

  const hideArtist = shouldHideArtistField();
  const artistFilterFields = new Set([
    "artist",
    "artist_name",
    "related_artist",
    "related_artists",
    "participating_artists",
  ]);
  const alphabetFilterField =
    hideArtist && artistFilterFields.has(dataConfig?.alphabetFilterField)
      ? null
      : dataConfig?.alphabetFilterField;

  const { filterFields = [], values: FILTER_VALUES } = filterConfig || {};
  const { pageText, itemName } = labels;
  const { viewModes } = uiConfig;
  const { actionButtons, searchConfig } = components;
  const defaultSort = dataConfig.defaultSort || null;

  // ── State ─────────────────────────────────────────────────────────────────
  const [sortField, setSortField] = useState(defaultSort?.field || null);
  const [sortDirection, setSortDirection] = useState(defaultSort?.direction || "asc");
  // Which per-page order key the manager shows/sorts by (JSON `order.<key>`).
  const [orderKey, setOrderKey] = useState(defaultSort?.orderKey || "artist_page_order");
  // Per-group card width, set by the scale slider in each group summary.
  const [cardWidths, setCardWidths] = useState({});

  // Which dimension the manager groups by (dataConfig.groupConfig.options).
  const [groupBy, setGroupBy] = useState(
    dataConfig.groupConfig?.default ||
      dataConfig.groupConfig?.options?.[0]?.value ||
      null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(ALPHABET_FILTER_VALUES.ALL);
  const [viewMode, setViewMode] = useState(uiConfig.defaultViewMode ?? viewModes.GRID);
  const [deleteError, setDeleteError] = useState(null);

  const initialFilterState = useMemo(
    () =>
      Object.fromEntries(
        (filterFields || []).map((f) => [f.key, FILTER_VALUES?.ALL || "all"])
      ),
    [filterFields, FILTER_VALUES]
  );
  const [filterState, setFilterState] = useState(initialFilterState);

  const debouncedSearch = useDebounce(
    searchTerm,
    uiConfig.debounceDelay ?? TIMING.DEFAULT_DEBOUNCE_MS
  );

  // ── Derived config ────────────────────────────────────────────────────────
  const fields = useMemo(
    () =>
      dataConfig
        .getFields(lang)
        // Schema configs still ship COMBINED labels ("Artist / 艺术家") —
        // resolve them to the ACTIVE language so no card, list row, delete
        // dialog or filter ever mixes English and Chinese.
        .map((f) => ({ ...f, label: resolveLocalizedLabel(f.label, isCn) })),
    [lang, dataConfig, isCn]
  );
  const deleteDialogFields = useMemo(
    () => dataConfig.getDeleteDialogFields(lang),
    [lang, dataConfig]
  );
  const controlPanelConfig = useMemo(
    () => filterConfig?.createControlPanelConfig(isCn),
    [isCn, filterConfig]
  );

  const themeStyles = useMemo(
    () => ({
      ...STYLES,
      COUNT_DISPLAY: { ...STYLES.COUNT_DISPLAY, color: COLORS.pageText },
      DIVIDER: { ...STYLES.DIVIDER, borderBottomColor: COLORS.pageText },
      LIST_CONTAINER: {},
    }),
    []
  );

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetAllFilters = useCallback(() => {
    setFilterState(initialFilterState);
    setSearchTerm("");
    setSelectedLetter(ALPHABET_FILTER_VALUES.ALL);
    setSortField(defaultSort?.field || null);
    setSortDirection(defaultSort?.direction || "asc");
  }, [initialFilterState, defaultSort]);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const {
    data: rawData = [],
    isLoading,
    error,
    refetch,
  } = useData(managerSchemaConfig.api.endpoint);

  const safeData = useMemo(() => (Array.isArray(rawData) ? rawData : []), [rawData]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const { deleteItem, loadingId } = useDeleteItem(
    () => {
      refetch?.();
      resetAllFilters();
    },
    setDeleteError,
    managerSchemaConfig.api.deleteEndpoint,
    { itemUrl: managerSchemaConfig.api.listEndpoint }
  );

  const {
    openDialogItem,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useDeleteDialog(deleteItem, null, schemaName);

  const handleDeleteConfirmWithRefresh = useCallback(async () => {
    try {
      await handleDeleteConfirm();
    } catch {
      // Errors surfaced via deleteError state
    }
  }, [handleDeleteConfirm]);

  // ── Export / Notifications ────────────────────────────────────────────────
  const { handleExport } = useDataExport();
  const { snackbar, showNotification, hideNotification } = useSnackbarNotification();

  // ── Filter setters ────────────────────────────────────────────────────────
  const setFilter = useCallback(
    (key, value) => setFilterState((prev) => ({ ...prev, [key]: value })),
    []
  );

  const filterSetters = useMemo(
    () =>
      Object.fromEntries(
        (filterFields || []).map((f) => {
          const capitalized = f.key.charAt(0).toUpperCase() + f.key.slice(1);
          return [`setSelected${capitalized}`, (val) => setFilter(f.key, val)];
        })
      ),
    [filterFields, setFilter]
  );

  // ── Data pipeline: language → search → alphabet → filters → sort ──────────

  const languageFilteredData = useMemo(() => {
    if (!dataConfig.languageField) return safeData;

    const languageValue = isCn ? "CN" : "EN";
    return safeData.filter((item) => {
      const itemLanguage = item[dataConfig.languageField];
      return !itemLanguage || itemLanguage === languageValue || itemLanguage === "";
    });
  }, [safeData, isCn, dataConfig.languageField]);

  const searchFilteredData = useMemo(() => {
    const term = debouncedSearch?.trim().toLowerCase();
    if (!term) return languageFilteredData;

    const searchFields = dataConfig.searchFields || [];
    return languageFilteredData.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (!value) return false;
        if (Array.isArray(value)) {
          return value.some((v) => String(v).toLowerCase().includes(term));
        }
        return String(value).toLowerCase().includes(term);
      })
    );
  }, [languageFilteredData, debouncedSearch, dataConfig.searchFields]);

  const alphabetFilteredData = useMemo(() => {
    if (!alphabetFilterField) return searchFilteredData;
    return filterByAlphabetLetter(
      searchFilteredData,
      alphabetFilterField,
      selectedLetter
    );
  }, [searchFilteredData, selectedLetter, alphabetFilterField]);

  const filteredData = useMemo(() => {
    if (!filterConfig?.filterFields) return alphabetFilteredData;

    return alphabetFilteredData.filter((item) =>
      filterConfig.filterFields.every(({ key, fields: filterMatchFields }) => {
        const selectedValue = filterState[key];
        if (!selectedValue || selectedValue === FILTER_VALUES?.ALL) return true;

        return filterMatchFields.some((field) => {
          const itemValue = item[field];
          if (!itemValue) return false;
          if (Array.isArray(itemValue)) {
            return itemValue.some(
              (val) => String(val).toLowerCase() === selectedValue.toLowerCase()
            );
          }
          return String(itemValue).toLowerCase() === selectedValue.toLowerCase();
        });
      })
    );
  }, [alphabetFilteredData, filterState, filterConfig, FILTER_VALUES]);

  const processedData = useMemo(() => {
    const mapped = filteredData.map((item) => ({
      ...dataConfig.getEmptyItem(),
      ...item,
    }));
    return sortField ? sortItems(mapped, sortField, sortDirection) : mapped;
  }, [filteredData, sortField, sortDirection, dataConfig]);

  const normalizedProcessedData = useMemo(
    () => processedData.map(normalizeId),
    [processedData]
  );

  // ── Grouping ──────────────────────────────────────────────────────────────
  // `groupConfig.options` lets the manager switch the grouping dimension at
  // runtime (e.g. image manager: group by tag OR by artist). Each option may
  // override any groupConfig field (field / getGroupKey / getGroupLabel / …).
  const resolvedGroupConfig = useMemo(() => {
    const base =
      dataConfig.groupConfig || managerSchemaConfig.groupConfig || null;
    if (!base?.enabled) return base;

    const options = base.options || [];
    if (!options.length) return base;

    const selected =
      options.find((option) => option.value === groupBy) || options[0];

    return { ...base, ...(selected.overrides || {}), enabled: true };
  }, [dataConfig, managerSchemaConfig, groupBy]);

  const groupedData = useMemo(() => {
    if (!resolvedGroupConfig?.enabled) return null;

    const applyTo = resolvedGroupConfig.applyTo || ["grid", "list"];
    if (!applyTo.includes(viewMode)) return null;

    return groupData(normalizedProcessedData, resolvedGroupConfig, {
      isCn,
      t,
      managerSchemaConfig,
    });
  }, [normalizedProcessedData, resolvedGroupConfig, managerSchemaConfig, viewMode, isCn, t]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearchChange = useCallback((eventOrValue) => {
    if (typeof eventOrValue === "string") return setSearchTerm(eventOrValue);
    return setSearchTerm(eventOrValue?.target?.value ?? "");
  }, []);

  const handleLetterChange = useCallback((l) => setSelectedLetter(l), []);
  const handleViewModeChange = useCallback((mode) => setViewMode(mode), []);
  const handleRetry = useCallback(() => refetch?.(), [refetch]);

  const handleEditClick = useCallback(
    (id) => router.push(navigation.editPathTemplate.replace("{id}", id)),
    [router, navigation.editPathTemplate]
  );

  const handleExportClick = useCallback(() => {
    try {
      const formatted = exportConfig.formatter(processedData, isCn);
      const filename = isCn ? exportConfig.filename.CN : exportConfig.filename.EN;
      handleExport(formatted, "csv", filename);
      showNotification(
        `${t(pageText.export.success)} — ${processedData.length} ${t(pageText.export.items)}`,
        "success"
      );
    } catch {
      showNotification(t(pageText.export.error), "error");
    }
  }, [exportConfig, processedData, isCn, handleExport, showNotification, t, pageText]);

  const handleSortByField = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  // ── Prefetch create page ──────────────────────────────────────────────────
  useEffect(() => {
    if (navigation?.createPath) router.prefetch(navigation.createPath);
  }, [navigation?.createPath, router]);

  const handleCreateClick = useCallback(() => {
    router.push(navigation.createPath);
  }, [router, navigation.createPath]);

  // ── Control-panel derived state ───────────────────────────────────────────
  const filterStateForPanel = useMemo(() => {
    const prefixed = Object.fromEntries(
      Object.entries(filterState).map(([key, val]) => [
        `selected${key.charAt(0).toUpperCase() + key.slice(1)}`,
        val,
      ])
    );
    return { filteredData, ...prefixed };
  }, [filterState, filteredData]);

  const filterHandlers = useMemo(
    () => createFilterHandlersWithReset(filterSetters, FILTER_VALUES),
    [filterSetters, FILTER_VALUES]
  );

  const controlHandlers = useMemo(() => {
    const handlers = {};
    controlPanelConfig?.controls?.forEach((control) => {
      if (control.action === "sortByField" && control.sortField) {
        handlers.sortByField = (controlConfig) => {
          const field = controlConfig?.sortField || control.sortField;
          handleSortByField(field);
        };
      }
      if (control.action === "selectOrderKey") {
        handlers.selectOrderKey = (controlConfig, value) => {
          const key =
            value ||
            controlConfig?.defaultOrderKey ||
            controlConfig?.value ||
            "artist_page_order";
          setOrderKey(key);
          setSortField(`order.${key}`);
          setSortDirection("asc");
        };
      }
      if (control.action === "selectGroupBy") {
        handlers.selectGroupBy = (controlConfig, value) => {
          const next =
            value ||
            controlConfig?.defaultGroupBy ||
            controlConfig?.value ||
            null;
          if (next) setGroupBy(next);
        };
      }
    });
    return handlers;
  }, [handleSortByField, controlPanelConfig]);

  const translatedControlPanelConfig = useMemo(() => {
    if (!controlPanelConfig) return null;
    return {
      ...controlPanelConfig,
      filters: controlPanelConfig.filters
        ?.filter((filter) => !(hideArtist && artistFilterFields.has(filter.field || filter.key)))
        .map((filter) => ({
          ...filter,
          label: typeof filter.label === "object" ? t(filter.label) : filter.label,
        })),
      controls: controlPanelConfig.controls
        ?.filter((control) => !(hideArtist && (artistFilterFields.has(control.sortField) || artistFilterFields.has(control.field))))
        .map((control) => ({
        ...control,
        label: pickText(control.label, isCn),
        tooltip: pickText(control.tooltip, isCn),
        // Bilingual dropdown options → plain strings
        options: control.options?.map((o) => ({
          ...o,
          label: pickText(o.label, isCn),
        })),
        // Inject the current value for value-bound controls (e.g. order key)
        value:
          control.valueKey === "activeOrderKey"
            ? orderKey
            : control.valueKey === "activeGroupBy"
            ? groupBy
            : control.value,
      })),
    };
  }, [controlPanelConfig, t, orderKey, groupBy, isCn, hideArtist]);

  // Controls marked `pinned` render in an always-visible bar (never hidden in
  // the collapsible filter accordion) — used for the order-dimension select.
  const pinnedControls = useMemo(
    () => (translatedControlPanelConfig?.controls || []).filter((c) => c.pinned),
    [translatedControlPanelConfig]
  );

  const inlineControlPanelConfig = useMemo(() => {
    if (!translatedControlPanelConfig) return null;
    return {
      ...translatedControlPanelConfig,
      controls: (translatedControlPanelConfig.controls || []).filter(
        (c) => !c.pinned
      ),
    };
  }, [translatedControlPanelConfig]);

  // ── Group helpers ─────────────────────────────────────────────────────────
  const getGroupItems = (group) => {
    if (!group) return [];
    if (Array.isArray(group)) return group;
    if (Array.isArray(group.items)) return group.items;
    if (Array.isArray(group.data)) return group.data;
    if (Array.isArray(group.children)) return group.children;
    return [];
  };

  const getGroupLabel = (group, fallbackIndex) => {
    if (!group) return `Group ${fallbackIndex + 1}`;
    return (
      group.label ||
      group.title ||
      group.groupLabel ||
      group.groupName ||
      group.key ||
      `Group ${fallbackIndex + 1}`
    );
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderEmptyState = (isSearch = false) => (
    <AlertInfo
      isCn={isCn}
      message={
        isSearch
          ? t(pageText.emptyState.noMatchingItems)
          : t(pageText.emptyState.noData)
      }
      subMessage=""
    />
  );

  const renderGroupSummary = (group, index, scaleScope = undefined) => {
    const count = getGroupItems(group).length;
    const label = getGroupLabel(group, index);
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          ...fontStyle,
        }}
      >
        <span style={{ fontWeight: 600, minWidth: 0 }}>{label}</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            flex: "0 0 auto",
          }}
        >
          {scaleScope ? renderCardScale(scaleScope) : null}
          <span style={{ fontSize: "13px", opacity: 0.8, whiteSpace: "nowrap" }}>
            {isCn
              ? `${count} ${t(itemName)}`
              : `${count} ${count === 1 ? t(itemName) : `${t(itemName)}s`}`}
          </span>
        </span>
      </div>
    );
  };

  // ── Card size (scale) control — same idea as the order page slider ────────
  // Lives in the right-hand side of each group's summary row and resizes that
  // group's cards. Stops propagation so it never toggles the accordion.
  const renderCardScale = (scopeKey) => {
    const width = cardWidths[scopeKey] ?? DEFAULT_CARD_WIDTH;
    const stop = (e) => e.stopPropagation();
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          opacity: 0.85,
        }}
        onClick={stop}
        onMouseDown={stop}
        onMouseUp={stop}
        onPointerDown={stop}
        onTouchStart={stop}
        onKeyDown={stop}
        title={isCn ? `卡片大小 ${width}px` : `Card size ${width}px`}
      >
        <Maximize2 size={13} aria-hidden="true" />
        <input
          type="range"
          aria-label={isCn ? "卡片大小" : "Card size"}
          min={MIN_CARD_WIDTH}
          max={MAX_CARD_WIDTH}
          step={10}
          value={width}
          onChange={(e) => {
            const next = Number(e.target.value);
            setCardWidths((prev) => ({ ...prev, [scopeKey]: next }));
          }}
          style={{ width: "96px", accentColor: "#000", cursor: "pointer" }}
        />
      </span>
    );
  };

  const gridComponentProps = useMemo(
    () => ({
      fields,
      titleField: dataConfig.titleField,
      fieldDisplayConfig: dataConfig.fieldDisplayConfig,
      isCn,
      orderKey,
      style: fontStyle,
      onEdit: (idOrItem) => {
        const id =
          typeof idOrItem === "string" ? idOrItem : idOrItem?.id || idOrItem?._id;
        if (id) handleEditClick(id);
      },
      onDelete: (item) => handleDeleteClick(normalizeId(item)),
      showActions: true,
      useOriginalSize: uiConfig.useOriginalSize ?? false,
      customHeight: uiConfig.customHeight ?? null,
      customWidth: uiConfig.customWidth ?? null,
      maxHeight: uiConfig.maxHeight ?? LAYOUT.CARD_MAX_HEIGHT,
      minHeight: uiConfig.minHeight ?? 0,
      objectFit: uiConfig.objectFit ?? "cover",
      aspectRatio: uiConfig.aspectRatio ?? null,
    }),
    [fields, dataConfig, isCn, orderKey, fontStyle, uiConfig, handleEditClick, handleDeleteClick]
  );

  const renderGridItems = (items, minColumnWidth = null) => {
    const normalizedData = (items || []).map(normalizeId);
    return (
      <GridViewLayout
        data={normalizedData}
        Component={ManagerCard}
        componentProps={gridComponentProps}
        style={fontStyle}
        minColumnWidth={minColumnWidth}
      />
    );
  };

  const renderListItems = (items) => {
    const summaryFieldsConfig = (dataConfig.fieldDisplayConfig?.summaryFields || []).map(
      (fieldKey) => fields.find((f) => f.key === fieldKey) || { key: fieldKey, label: fieldKey }
    );
    const detailFieldsConfig = (dataConfig.fieldDisplayConfig?.detailFields || []).map(
      (fieldKey) => fields.find((f) => f.key === fieldKey) || { key: fieldKey, label: fieldKey }
    );

    const normalizedData = sortItems(
      (items || []).map(normalizeId),
      sortField || `order.${orderKey}`,
      sortDirection
    );

    return (
      <div style={themeStyles.LIST_CONTAINER}>
        {normalizedData.map((item) => (
          <ListWithExpandInfo
            key={item.id}
            item={item}
            fields={fields}
            titleKey={dataConfig.titleField}
            subtitleKey={dataConfig.descriptionField}
            imageKey={dataConfig.imageField}
            videoKey={dataConfig.videoField}
            summaryFields={summaryFieldsConfig}
            detailFields={detailFieldsConfig}
            onEdit={() => handleEditClick(item.id)}
            onDelete={() => handleDeleteClick(item)}
            loadingId={loadingId}
            isCn={isCn}
            manager
          />
        ))}
      </div>
    );
  };

  const renderGroupContent = (groupItems, scopeKey = null) => {
    if (viewMode !== viewModes.GRID) return renderListItems(groupItems);
    const width = scopeKey ? cardWidths[scopeKey] ?? DEFAULT_CARD_WIDTH : null;
    return renderGridItems(groupItems, width);
  };

  // ── Grouped rendering (flat list, or one parent box per artist) ───────────
  const groupList = useMemo(() => {
    if (!groupedData) return [];
    if (Array.isArray(groupedData)) return groupedData;
    if (Array.isArray(groupedData.groups)) return groupedData.groups;
    if (typeof groupedData === "object") {
      return Object.entries(groupedData).map(([key, value]) => ({
        key,
        label: key,
        items: Array.isArray(value) ? value : [],
      }));
    }
    return [];
  }, [groupedData]);

  // A group config may ask for a second level: `getGroupParent(key)` returns
  // the id of the box a group belongs to (image manager → one big box per
  // artist, its source groups nested inside). Without it everything stays flat.
  const groupTree = useMemo(() => {
    const parentOf = resolvedGroupConfig?.getGroupParent;
    if (typeof parentOf !== "function" || !groupList.length) return null;

    const parents = new Map();
    const topLevel = [];

    for (const group of groupList) {
      let parentId = null;
      try {
        parentId = parentOf(group.key, group);
      } catch {
        parentId = null;
      }

      if (!parentId) {
        topLevel.push(group);
        continue;
      }

      if (!parents.has(parentId)) {
        parents.set(parentId, {
          key: parentId,
          label:
            resolvedGroupConfig?.getGroupParentLabel?.(parentId, group, {
              isCn,
              t,
              managerSchemaConfig,
            }) ||
            group?.label ||
            parentId,
          children: [],
        });
      }
      parents.get(parentId).children.push(group);
    }

    if (!parents.size) return null;
    return { parents: [...parents.values()], topLevel };
  }, [groupList, resolvedGroupConfig]);

  const renderParentSummary = (parent) => {
    const count = (parent.children || []).reduce(
      (total, child) => total + getGroupItems(child).length,
      0
    );
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          width: "100%",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: ".01em" }}>
          {parent.label}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            flex: "0 0 auto",
          }}
        >
          {renderCardScale(parent.key)}
          <span style={{ fontSize: "13px", opacity: 0.8, whiteSpace: "nowrap" }}>
            {isCn
              ? `${count} ${t(itemName)}`
              : `${count} ${count === 1 ? t(itemName) : `${t(itemName)}s`}`}
          </span>
        </span>
      </div>
    );
  };

  const renderGroupBox = (
    group,
    key,
    { defaultOpen = false, nested = false, scopeKey = null, showScale = true } = {}
  ) => (
    <AccordionBox
      key={key}
      summary_text={renderGroupSummary(group, 0, showScale ? key : null)}
      colors={SURFACE_COLORS}
      defaultOpen={defaultOpen}
      content={renderGroupContent(getGroupItems(group), scopeKey || key)}
      contentStyle={nested ? { padding: "14px 0 6px" } : null}
    />
  );

  const renderArtistTree = (tree) => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: LAYOUT.SECTION_GAP }}
    >
      {tree.parents.map((parent, parentIndex) => (
        <AccordionBox
          key={parent.key}
          summary_text={renderParentSummary(parent)}
          colors={SURFACE_COLORS}
          defaultOpen={parentIndex === 0}
          labelStyle={{ padding: "2px 0" }}
          boxStyle={{
            border: `1px solid ${SURFACE_COLORS.border}`,
            borderRadius: LAYOUT.SURFACE_RADIUS,
            marginBottom: 0,
          }}
          contentStyle={{ padding: "6px 14px 18px" }}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: LAYOUT.SECTION_GAP,
              }}
            >
              {parent.children.map((child, childIndex) =>
                renderGroupBox(child, child.key, {
                  nested: true,
                  defaultOpen: parentIndex === 0 && childIndex === 0,
                  // One scale control per artist box (on the parent summary).
                  scopeKey: parent.key,
                  showScale: false,
                })
              )}
            </div>
          }
        />
      ))}

      {tree.topLevel.map((group, index) =>
        renderGroupBox(group, group.key || `top-${index}`)
      )}
    </div>
  );

  const renderGroupedContent = () => {
    if (!groupedData) return null;

    const groups = groupList;

    if (!groups.length) return renderEmptyState(!!searchTerm);

    // Two-level grouping (artist → source groups).
    if (groupTree) return renderArtistTree(groupTree);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: LAYOUT.SECTION_GAP }}>
        {groups.map((group, index) => {
          const groupItems = getGroupItems(group);
          const groupKey = group?.key || group?.label || group?.title || `group-${index}`;
          const content = renderGroupContent(groupItems, groupKey);

          // First group renders open (static card); the rest are collapsible.
          if (index === 0) {
            return (
              <div
                key={groupKey}
                style={{
                  border: `1px solid ${SURFACE_COLORS.border}`,
                  borderRadius: LAYOUT.SURFACE_RADIUS,
                  background: SURFACE_COLORS.background,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${SURFACE_COLORS.border}`,
                    fontWeight: 600,
                    color: SURFACE_COLORS.text,
                  }}
                >
                  {renderGroupSummary(group, index, groupKey)}
                </div>
                <div style={{ padding: LAYOUT.SECTION_GAP }}>{content}</div>
              </div>
            );
          }

          return (
            <AccordionBox
              key={groupKey}
              summary_text={renderGroupSummary(group, index, groupKey)}
              colors={SURFACE_COLORS}
              defaultOpen={false}
              content={content}
            />
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) return <LoadingLayer isLoading />;

    if (error) {
      return (
        <AlertInfo
          message={t(pageText.errors.loadingError)}
          subMessage={t(pageText.errors.systemError)}
          buttonText={t(pageText.errors.tryAgain)}
          onBack={handleRetry}
          isCn={isCn}
        />
      );
    }

    if (deleteError) {
      return (
        <AlertInfo
          message={deleteError}
          subMessage={t(pageText.errors.pleaseRetry)}
          buttonText={t(pageText.errors.ok)}
          messageCn={deleteError}
          subMessageCn={pageText.errors.pleaseRetry?.CN}
          buttonTextCn={pageText.errors.ok?.CN}
          onBack={() => setDeleteError(null)}
          isCn={isCn}
        />
      );
    }

    if (safeData.length === 0) return renderEmptyState(false);
    if (processedData.length === 0) return renderEmptyState(!!searchTerm);
    if (groupedData) return renderGroupedContent();

    return viewMode === viewModes.GRID
      ? renderGridItems(normalizedProcessedData)
      : renderListItems(normalizedProcessedData);
  };

  const renderActionButtons = () => {
    if (!actionButtons?.length) return null;

    const buttons = actionButtons.map((btn) => {
      const button = { ...btn, style: fontStyle };
      if (btn.action === "export") {
        button.onClick = handleExportClick;
        button.label = getSystemLabel(btn.labelKey || "exportData", isCn);
      } else if (btn.route) {
        button.label = getSystemLabel(btn.labelKey, isCn);
      } else {
        // Custom action (e.g. the image manager's "Refresh Images" sync) — the
        // page supplies the label + onClick.
        button.label = btn.label
          ? pickText(btn.label, isCn)
          : getSystemLabel(btn.labelKey || btn.action, isCn);
        if (typeof btn.onClick === "function") button.onClick = btn.onClick;
      }
      return button;
    });

    return <ButtonRow buttons={buttons} style={fontStyle} />;
  };

  const renderSearchPanel = () => {
    if (!searchConfig) return null;

    const { placeholder, ariaLabel, selectConfig } = searchConfig;
    const effectiveSelectConfig =
      selectConfig && !(hideArtist && artistFilterFields.has(selectConfig.filterKey))
        ? selectConfig
        : null;
    let selectOptions = [];
    let selectedValue = "all";
    let onSelectChange = null;

    if (effectiveSelectConfig) {
      const filterKey = effectiveSelectConfig.filterKey;
      selectOptions = [
        ...new Set(
          safeData
            .map((item) => item[filterKey])
            .filter((val) => val && String(val).trim() !== "")
        ),
      ].sort();
      selectedValue = filterState[filterKey] || "all";
      onSelectChange = (value) => {
        const setter = filterSetters[filterKey];
        if (setter) setter(value === "all" ? "all" : value);
      };
    }

    return (
      <SearchAndSelectPanel
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder={t(placeholder)}
        ariaLabelSearch={t(ariaLabel)}
        options={effectiveSelectConfig ? selectOptions : []}
        selectedOption={selectedValue}
        onOptionChange={onSelectChange}
        optionPlaceholder={effectiveSelectConfig ? t(effectiveSelectConfig.placeholder) : ""}
        ariaLabelSelect={effectiveSelectConfig ? t(effectiveSelectConfig.ariaLabel) : ""}
        fontStyle={fontStyle}
      />
    );
  };

  // Order controls — rendered at the RIGHT edge of the controls accordion's
  // header row (so they sit on the same line as the accordion label).
  const renderOrderControls = () => {
    const orderPath = dataConfig.orderPagePath;
    const hoverPath = dataConfig.hoverPagePath;
    if (!pinnedControls.length && !orderPath && !hoverPath) return null;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          gap: "14px",
          ...fontStyle,
        }}
      >
        {pinnedControls.length > 0 &&
          pinnedControls.map((c) => (
            <div
              key={c.action}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              {c.label ? (
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    opacity: 0.75,
                  }}
                >
                  {c.label}:
                </span>
              ) : null}
              {renderControl(c, controlHandlers, fontStyle, isCn)}
            </div>
          ))}

        {/* Always-visible header actions supplied by the page (e.g. the image
            manager's "Refresh Images" sync). A disabled action reads as a grey,
            inactive state (nothing to do); `notice` shows a short hint. */}
        {(dataConfig.headerActionButtons || []).map((btn, idx) => {
          const Icon = btn.icon || null;
          const label = btn.label ? pickText(btn.label, isCn) : btn.action;
          const notice = btn.notice ? pickText(btn.notice, isCn) : "";
          const off = Boolean(btn.disabled);
          return (
            <span
              key={btn.action || btn.labelKey || idx}
              style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
            >
              {notice ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: "12px",
                    fontFamily: fontStyle?.fontFamily,
                    color: "var(--text-primary, rgba(0,0,0,.55))",
                    whiteSpace: "nowrap",
                  }}
                >
                  <AlertCircle size={12} />
                  {notice}
                </span>
              ) : null}
              <button
                type="button"
                className="ordrow-btn"
                onClick={btn.onClick}
                disabled={off}
                title={pickText(btn.tooltip, isCn) || label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  fontSize: "13px",
                  fontFamily: fontStyle?.fontFamily,
                  fontWeight: 500,
                  border: `1px solid ${off ? "var(--border-light, rgba(0,0,0,.25))" : "var(--border-light, #000)"}`,
                  borderRadius: 8,
                  background: "var(--background-primary, #fff)",
                  color: off ? "var(--text-primary, rgba(0,0,0,.35))" : "var(--text-primary, #000)",
                  cursor: off ? "default" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {Icon ? <Icon size={14} /> : null}
                {label}
              </button>
            </span>
          );
        })}

        {orderPath && (
          <button
            type="button"
            onClick={() => router.push(orderPath)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              fontSize: "13px",
              fontFamily: fontStyle?.fontFamily,
              fontWeight: 500,
              border: "1px solid var(--border-light, #000)",
              borderRadius: 8,
              background: "var(--background-primary, #fff)",
              color: "var(--text-primary, #000)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <ListOrdered size={14} />
            {/* `orderPageLabel` lets a manager rename this shortcut (the image
                manager orders the rolling images; artworks keep the generic
                wording). */}
            {pickText(dataConfig.orderPageLabel, isCn) ||
              (isCn ? "打开排序页" : "Open order page")}
          </button>
        )}

        {/* Second shortcut: the mark page for this collection (e.g. the image
            manager's “Artist Name Hover Image” page). */}
        {hoverPath && (
          <button
            type="button"
            onClick={() => router.push(hoverPath)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 14px",
              fontSize: "13px",
              fontFamily: fontStyle?.fontFamily,
              fontWeight: 500,
              border: "1px solid var(--border-light, #000)",
              borderRadius: 8,
              background: "var(--background-primary, #fff)",
              color: "var(--text-primary, #000)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Mouse size={14} />
            {pickText(dataConfig.hoverPageLabel, isCn) ||
              (isCn ? "悬停图" : "Hover image")}
          </button>
        )}
      </div>
    );
  };

  const renderFilterPanel = () => {
    if (isMobile) return null;
    return (
      <FilterPanel
        controlPanelConfig={inlineControlPanelConfig}
        filterState={filterStateForPanel}
        filterHandlers={filterHandlers}
        originalSetters={filterSetters}
        controlHandlers={controlHandlers}
        isCn={isCn}
        isMobile={isMobile}
        fontStyle={fontStyle}
        filterValues={FILTER_VALUES}
        isArtistweb={uiConfig.isArtistweb || hideArtist}
      />
    );
  };

  const renderControlsAccordion = () => {
    const hasActionButtons = actionButtons?.length > 0;
    const hasSearchPanel = searchConfig != null;
    const hasFilterPanel = !isMobile;
    const hasAlphabetBar = safeData.length > 0 && !!alphabetFilterField;

    if (!hasActionButtons && !hasSearchPanel && !hasFilterPanel && !hasAlphabetBar) {
      return null;
    }

    return (
      <Box sx={{ marginBottom: 2, marginTop: LAYOUT.CONTROLS_TOP_OVERLAP }}>
        <AccordionBox
          summary_text={isCn ? "搜索与筛选" : "Search & filter"}
          headerIcon={<SlidersHorizontal size={16} strokeWidth={2} />}
          headerExtra={renderOrderControls()}
          colors={SURFACE_COLORS}
          defaultOpen={false}
          content={
            <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingTop: 4 }}>
              {hasActionButtons && renderActionButtons()}
              {hasSearchPanel && renderSearchPanel()}
              {hasFilterPanel && renderFilterPanel()}
              {hasAlphabetBar && (
                <>
                  <div style={{ height: 1, background: "var(--interactive-background-hover, rgba(0,0,0,0.08))" }} />
                  <AlphabetPaginationBar
                    data={safeData}
                    field={alphabetFilterField}
                    selectedLetter={selectedLetter}
                    onLetterChange={handleLetterChange}
                    isCn={isCn}
                    showCounts
                  />
                </>
              )}
            </div>
          }
        />
      </Box>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const dialogItemId = openDialogItem?.id || openDialogItem?._id;

  return (
    <Box
      sx={{
        backgroundColor: COLORS.pageBg,
        color: COLORS.pageText,
        padding: isMobile ? "20px" : "0px",
      }}
    >
      <Container maxWidth="lg" sx={themeStyles.CONTAINER}>
        {/* Header */}
        <div className="flex justify-between items-end mb-4">
          <div style={{ ...STYLES.TITLE, ...fontStyle }}>{title}</div>
          <div className="flex items-center gap-2">
            <AddButton
              onClick={handleCreateClick}
              tooltipTitle={t(pageText.createTooltip)}
              fontStyle={fontStyle}
            />
            <span className="mx-2" style={{ color: COLORS.pageText }}>
              |
            </span>
            <ViewModeToggle
              viewMode={viewMode}
              setViewMode={handleViewModeChange}
              fontStyle={fontStyle}
            />
          </div>
        </div>

        <div style={themeStyles.DIVIDER} />

        {renderControlsAccordion()}
        {renderContent()}

        <DeleteDialogWrapper
          open={openDialogItem !== null}
          item={openDialogItem ? normalizeId(openDialogItem) : null}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirmWithRefresh}
          loading={loadingId === dialogItemId}
          title={t(pageText.deleteDialog.title)}
          confirmText={t(pageText.deleteDialog.confirm)}
          cancelText={t(pageText.deleteDialog.cancel)}
          fontStyle={fontStyle}
          isCn={isCn}
          fields={deleteDialogFields}
          itemName={t(itemName)}
          schemaName={schemaName}
          triggerRefresh
        />

        <AppSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={hideNotification}
          autoHideDuration={TIMING.SNACKBAR_AUTOHIDE_MS}
          anchorOrigin={SNACKBAR_ANCHOR}
        />
      </Container>

      {/* In-app documentation for every manager page (floating "Guide" tab). */}
      <ManagerUserGuide />
    </Box>
  );
}

export { STYLES };
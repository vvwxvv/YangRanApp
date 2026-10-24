/**
 * GroupedBatchList.jsx
 *
 * Generic reusable grouped/flat list for all batch-edit pages.
 * Driven entirely by a GROUP_CONFIG from groupConfigs.js.
 *
 * What's new in this revision
 * ----------------------------------------------------------------------
 * 1. View modes — "Grouped" (collapsible accordions by group) and
 *    "Flat" (a single ordered list of every row, no grouping).
 *
 * 2. Auto-detection — if the underlying data has no usable grouping
 *    information at all (every row falls into the "no group" bucket),
 *    the Grouped view is hidden entirely and Flat becomes the only
 *    (and default) view. There's no point showing a "1 group / 1
 *    accordion containing everything" UI — that's strictly worse than
 *    just listing the rows.
 *
 * 3. Info banner — split into its own component, BatchGroupInfoBanner
 *    (in ./components/BatchGroupInfoBanner.jsx), shown above the list.
 *    It's bilingual (EN / 中文) via the `isCn` prop, which is passed
 *    straight through from this component's own `isCn` prop — no
 *    built-in language switch (use your existing one, e.g.
 *    LanguageContext). Plain black-and-white style, matching the
 *    original InfoBanner.
 *
 * 4. FREEZE BEHAVIOR — grouping and ordering are locked to the
 *    last committed state until the parent bumps `commitSignal`.
 *    This prevents annoying re‑ordering / group shifting while the
 *    user is still editing values (e.g. changing an `order` field).
 *    The cards still show live edited values; only the structure
 *    (which group each row belongs to and the order of rows/groups)
 *    stays frozen. After a successful save, the parent should
 *    change `commitSignal` to re‑freeze at the new state.
 *
 * Usage:
 *   import GroupedBatchList from "@/components/pages/manager/batch_edit/GroupedBatchList";
 *   import { PAGE_CONFIGS }  from "@/components/pages/manager/batch_edit/groupConfigs";
 *
 *   const [saveCounter, setSaveCounter] = useState(0);
 *
 *   <GroupedBatchList
 *     config={PAGE_CONFIGS.image}
 *     rows={rows}
 *     commitSignal={saveCounter}        // <-- bump this after successful save
 *     labelFontStyle={labelFontStyle}
 *     columns={columns}
 *     selectedRows={selectedRows}
 *     onSelectRow={onSelectRow}
 *     onSelectAll={onSelectAll}
 *     onCellUpdate={onCellUpdate}
 *     getLabel={getLabel}
 *     isCn={isCn}
 *   />
 *
 * Optional config fields (all optional — sensible fallbacks provided):
 *   - groupDimensionLabel   {string}  e.g. "series"   — used in the EN banner copy
 *   - groupDimensionLabelCn {string}  e.g. "所属系列"   — used in the CN banner copy
 *   - itemsLabelCn          {string}  CN translation of `itemsLabel`
 *   - canSearchRow(row, q)  {function} flat-view search predicate
 *   - sortRows(rows, dir)   {function} flat-view sort function
 */

"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Typography,
  Divider,
  Box,
  Collapse,
  Chip,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchIcon            from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SortIcon              from "@mui/icons-material/Sort";
import SortByAlphaIcon       from "@mui/icons-material/SortByAlpha";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import ViewListOutlinedIcon   from "@mui/icons-material/ViewListOutlined";
import BatchEditCardList     from "@/components/pages/manager/batch_edit/components/BatchEditCardList";
import { buildGroups, getOrderRange } from "@/components/pages/manager/config/schemaBatchGroupConfig";
import BatchGroupInfoBanner   from "@/components/pages/manager/batch_edit/components/BatchGroupInfoBanner";

// ─────────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A "group" is only useful if at least one group is a real, named group
 * (i.e. not the catch-all "no group" bucket). If every row landed in the
 * "no group" bucket, grouping carries zero information and we should not
 * present it as a real view option.
 */
function hasUsableGroups(groups) {
  return groups.some((g) => !g.noGroup && g.rows.length > 0);
}

/**
 * `getLabel` is a UI helper — on most pages it returns a React node
 * (e.g. a bilingual title block), not a plain string, so it can't be
 * used directly for searching/sorting. This pulls a plain comparable
 * string out of a row: a string/number result from `getLabel` is used
 * as-is, otherwise we fall back to the row's own text fields (matching
 * the same fields the old flat list used for ordering/searching).
 */
function toComparableLabel(row, getLabel) {
  if (getLabel) {
    const raw = getLabel(row);
    if (typeof raw === "string") return raw;
    if (typeof raw === "number") return String(raw);
  }
  const fallback =
    row?.title_en ?? row?.title_cn ??
    row?.name_en  ?? row?.name_cn  ??
    row?.title    ?? row?.name     ??
    row?.label    ?? row?.id       ?? "";
  return typeof fallback === "string" ? fallback : String(fallback);
}

/**
 * Fallback search predicate for the Flat view, used when
 * `config.canSearchRow` isn't provided. Matches against the row's
 * comparable label plus any string / string-array fields on the row.
 */
function defaultRowMatches(row, query, getLabel) {
  const label = toComparableLabel(row, getLabel);
  if (label.toLowerCase().includes(query)) return true;

  return Object.values(row).some((value) => {
    if (typeof value === "string") return value.toLowerCase().includes(query);
    if (Array.isArray(value)) {
      return value.some((v) => typeof v === "string" && v.toLowerCase().includes(query));
    }
    return false;
  });
}

/**
 * Fallback sort for the Flat view, used when `config.sortRows` isn't
 * provided. Numeric configs sort by an `order`/`index` field — the same
 * field `getOrderRange`/the grouped view already rely on — everything
 * else sorts alphabetically by the row's comparable label.
 */
function defaultSortRows(rows, dir, config, getLabel) {
  const sorted = [...rows].sort((a, b) => {
    if (config.sortType === "numeric") {
      const av = a.order ?? a.index ?? 0;
      const bv = b.order ?? b.index ?? 0;
      return av - bv;
    }
    const al = toComparableLabel(a, getLabel);
    const bl = toComparableLabel(b, getLabel);
    return al.localeCompare(bl);
  });
  return dir === config.sortDefaultDir ? sorted : sorted.reverse();
}

// ─────────────────────────────────────────────────────────────────────────────
// Single accordion for one group (Grouped view)
// ─────────────────────────────────────────────────────────────────────────────
function GroupAccordion({
  group,            // includes .liveRows (array of live row objects) and .rows (frozen for metadata)
  index,
  config,
  labelFontStyle,
  columns,
  selectedRows,
  onSelectRow,
  onCellUpdate,
  getLabel,
}) {
  const [open, setOpen] = useState(false);
  const Icon = config.icon;

  const liveRows = group.liveRows;
  const groupIds = liveRows.map((r) => r.id);
  const selectedCount = groupIds.filter((id) => selectedRows.includes(id)).length;
  const allSelected   = groupIds.length > 0 && selectedCount === groupIds.length;

  const handleGroupSelectAll = useCallback(() => {
    if (allSelected) {
      groupIds.forEach((id) => { if (selectedRows.includes(id))  onSelectRow(id); });
    } else {
      groupIds.forEach((id) => { if (!selectedRows.includes(id)) onSelectRow(id); });
    }
  }, [allSelected, groupIds, selectedRows, onSelectRow]);

  const orderRange   = getOrderRange(liveRows); // show order range from live rows (updates while editing)
  const noGroupLabel = config.noGroupLabel;
  const { primary, secondary, meta, showIcon } = config.getDisplay(group);

  return (
    <Box sx={{
      border: "0.5px solid", borderColor: "divider", borderRadius: 2,
      overflow: "hidden", transition: "box-shadow 0.15s",
      "&:hover": { boxShadow: "0 1px 8px 0 rgba(0,0,0,0.06)" },
    }}>
      {/* ── Header ── */}
      <Box
        onClick={() => setOpen((v) => !v)}
        sx={{
          display: "flex", alignItems: "center", px: 2, py: 1.5,
          cursor: "pointer",
          bgcolor: open ? "grey.50" : "background.paper",
          transition: "background 0.12s",
          "&:hover": { bgcolor: "grey.50" },
          userSelect: "none",
        }}
      >
        {/* index */}
        <Typography variant="caption" sx={{
          minWidth: 28, color: "text.disabled",
          fontVariantNumeric: "tabular-nums", fontSize: 9, ...labelFontStyle,
        }}>
          {String(index + 1).padStart(2, "0")}
        </Typography>

        {/* label */}
        <Box sx={{ flex: 1, minWidth: 0, mx: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            {showIcon && !group.noGroup && (
              <Icon sx={{ fontSize: 11, color: "text.secondary", flexShrink: 0 }} />
            )}
            <Typography variant="body2" sx={{
              fontWeight: 600, lineHeight: 1.3,
              fontSize: config.sortType === "numeric" ? 12 : 11,
              color: group.noGroup ? "text.disabled" : "text.primary",
              fontStyle: group.noGroup ? "italic" : "normal",
              fontVariantNumeric: config.sortType === "numeric" ? "tabular-nums" : "normal",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              ...labelFontStyle,
            }}>
              {group.noGroup ? noGroupLabel : (primary || "—")}
            </Typography>
          </Box>
          {!group.noGroup && secondary && (
            <Typography variant="caption" sx={{
              color: "text.secondary", lineHeight: 1.3,
              overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", display: "block", ...labelFontStyle,
            }}>
              {secondary}
            </Typography>
          )}
          {meta && (
            <Typography variant="caption" sx={{
              color: "text.disabled", fontSize: 9, display: "block", mt: 0.1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              ...labelFontStyle,
            }}>
              {meta}
            </Typography>
          )}
        </Box>

        {/* badges */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1.5, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedCount > 0 && (
            <Chip
              label={`${selectedCount} selected`}
              size="small"
              onClick={(e) => { e.stopPropagation(); handleGroupSelectAll(); }}
              sx={{
                height: 22, fontSize: 9, cursor: "pointer",
                bgcolor: "primary.light", color: "primary.dark",
                border: "0.5px solid", borderColor: "primary.main",
              }}
            />
          )}
          {orderRange && (
            <Chip label={orderRange} size="small" sx={{
              height: 22, fontSize: 9, fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              bgcolor: "#e3f2fd", color: "#1565c0", border: "0.5px solid #90caf9",
            }} />
          )}
          <Chip
            icon={<Icon sx={{ fontSize: "13px !important" }} />}
            label={liveRows.length}
            size="small"
            sx={{
              height: 22, fontSize: 10, fontWeight: 500,
              bgcolor: "grey.100", color: "text.primary",
              border: "0.5px solid", borderColor: "divider",
              "& .MuiChip-icon": { ml: "6px" },
            }}
          />
        </Box>

        <KeyboardArrowDownIcon sx={{
          fontSize: 16, color: "text.disabled", transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0,
        }} />
      </Box>

      {/* ── Expanded body ── */}
      <Collapse in={open} unmountOnExit>
        <Divider />
        <Box sx={{ p: 1.5 }}>
          <BatchEditCardList
            columns={columns}
            data={liveRows}
            selectedRows={selectedRows}
            onSelectRow={onSelectRow}
            onSelectAll={handleGroupSelectAll}
            onCellUpdate={onCellUpdate}
            getLabel={getLabel}
            labelFontStyle={labelFontStyle}
            hideSortBar
          />
        </Box>
      </Collapse>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GroupedBatchList — main export
// ─────────────────────────────────────────────────────────────────────────────
export default function BatchGroupList({
  config,
  rows           = [],
  commitSignal   = 0,      // parent bumps this after a successful save → re‑freeze
  labelFontStyle = {},
  columns        = [],
  selectedRows   = [],
  onSelectRow,
  onSelectAll,
  onCellUpdate,
  getLabel,
  /** EN/中文 toggle — controlled by the app's own language switch
   *  (e.g. LanguageContext), passed straight through to the info banner
   *  and the Grouped/Flat toggle labels. */
  isCn = false,
}) {
  const [search,        setSearch]        = useState("");
  const [sortDir,       setSortDir]       = useState(config.sortDefaultDir);
  const [viewModeChoice, setViewModeChoice] = useState(null);

  // ── Freeze mechanism ─────────────────────────────────────────────────────
  // `committedRows` is the frozen snapshot used for all grouping and ordering.
  // It only updates when the parent bumps `commitSignal` (i.e. after a save).
  const [committedRows, setCommittedRows] = useState(() => rows);
  useEffect(() => {
    setCommittedRows(rows);
  }, [commitSignal]);   // eslint-disable-line react-hooks/exhaustive-deps

  // Build groups from the frozen committedRows (stable structure)
  const frozenGroups = useMemo(() => buildGroups(committedRows, config), [committedRows, config]);
  const groupingAvailable = useMemo(() => hasUsableGroups(frozenGroups), [frozenGroups]);
  const viewMode = groupingAvailable ? (viewModeChoice ?? "grouped") : "flat";

  // ── Live row lookup (for displaying current edited values) ──────────────
  const liveRowMap = useMemo(() => new Map(rows.map(r => [r.id, r])), [rows]);

  // ── Search on live rows (produces a Set of matching IDs) ─────────────────
  const matchingIds = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    const set = new Set();
    rows.forEach(row => {
      if (config.canSearchRow
          ? config.canSearchRow(row, q)
          : defaultRowMatches(row, q, getLabel)) {
        set.add(row.id);
      }
    });
    return set;
  }, [rows, search, config, getLabel]);

  // ── Grouped view data (preserves frozen group structure, but filters
  //    rows inside each group based on search, and maps to live rows) ──────
  const filteredGroups = useMemo(() => {
    const sortedGroups = config.sortGroups(frozenGroups, sortDir);
    if (!matchingIds) {
      // No search active – every row in the group is shown, using live values
      return sortedGroups.map(g => ({
        ...g,
        liveRows: g.rows.map(fr => liveRowMap.get(fr.id) || fr),
      }));
    }
    // With search: keep only rows whose live version matches the query
    return sortedGroups.reduce((acc, g) => {
      const liveRowsForGroup = g.rows
        .map(fr => liveRowMap.get(fr.id) || fr)
        .filter(row => matchingIds.has(row.id));
      if (liveRowsForGroup.length === 0 && !g.noGroup) return acc;
      acc.push({
        ...g,
        liveRows: liveRowsForGroup,
      });
      return acc;
    }, []);
  }, [frozenGroups, config, sortDir, matchingIds, liveRowMap]);

  const totalLiveRows = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.liveRows.length, 0),
    [filteredGroups]
  );

  // ── Flat view data (order frozen from committedRows, filtered by search,
  //    mapped to live rows) ────────────────────────────────────────────────
  const filteredFlatRows = useMemo(() => {
    // 1. Sort the frozen committedRows according to config
    const sortedBase = config.sortRows
      ? config.sortRows(committedRows, sortDir)
      : defaultSortRows(committedRows, sortDir, config, getLabel);
    // 2. Map each frozen row to its live counterpart (if exists)
    const liveRowsOrdered = sortedBase.map(fr => liveRowMap.get(fr.id) || fr);
    // 3. Apply search filter (based on live values)
    if (!matchingIds) return liveRowsOrdered;
    return liveRowsOrdered.filter(row => matchingIds.has(row.id));
  }, [committedRows, sortDir, config, getLabel, matchingIds, liveRowMap]);

  const Icon        = config.icon;
  const isNumeric   = config.sortType === "numeric";
  const SortBtnIcon = isNumeric ? SortIcon : SortByAlphaIcon;
  const altDir      = config.sortDefaultDir === "asc" ? "desc" : "asc";

  return (
    <Box>
      {/* ── Info banner ── */}
      <Box sx={{ mb: 2 }}>
        <BatchGroupInfoBanner
          hasGroups={groupingAvailable}
          viewMode={viewMode}
          config={config}
          itemCount={rows.length}
          groupCount={frozenGroups.filter((g) => !g.noGroup).length}
          isCn={isCn}
        />
      </Box>

      {/* ── Toolbar ── */}
      <Box sx={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1.5,
      }}>
        {/* summary pills */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          {groupingAvailable && (
            <ToggleButtonGroup
              value={viewMode} exclusive size="small"
              onChange={(_, val) => { if (val) setViewModeChoice(val); }}
              sx={{
                height: 28,
                "& .MuiToggleButton-root": {
                  px: 1.2, py: 0, fontSize: 9, fontWeight: 600,
                  textTransform: "none", border: "0.5px solid",
                  borderColor: "divider", color: "text.secondary", gap: 0.5,
                  "&.Mui-selected": { bgcolor: "grey.100", color: "text.primary" },
                },
              }}
            >
              <ToggleButton value="grouped">
                <ViewAgendaOutlinedIcon sx={{ fontSize: 12 }} />
                {isCn ? "分组" : "Grouped"}
              </ToggleButton>
              <ToggleButton value="flat">
                <ViewListOutlinedIcon sx={{ fontSize: 12 }} />
                {isCn ? "平铺" : "Flat"}
              </ToggleButton>
            </ToggleButtonGroup>
          )}

          {viewMode === "grouped" ? (
            <>
              <Chip
                label={`${filteredGroups.length} ${config.groupsLabel}`}
                size="small" variant="outlined"
                sx={{ height: 24, fontSize: 10, color: "text.secondary", borderColor: "divider" }}
              />
              <Chip
                icon={<Icon sx={{ fontSize: "13px !important" }} />}
                label={`${totalLiveRows} ${config.itemsLabel}`}
                size="small" variant="outlined"
                sx={{
                  height: 24, fontSize: 10, color: "text.secondary", borderColor: "divider",
                  "& .MuiChip-icon": { ml: "6px", color: "text.disabled" },
                }}
              />
            </>
          ) : (
            <Chip
              icon={<Icon sx={{ fontSize: "13px !important" }} />}
              label={`${filteredFlatRows.length} ${config.itemsLabel}`}
              size="small" variant="outlined"
              sx={{
                height: 24, fontSize: 10, color: "text.secondary", borderColor: "divider",
                "& .MuiChip-icon": { ml: "6px", color: "text.disabled" },
              }}
            />
          )}

          {selectedRows.length > 0 && (
            <Chip
              label={`${selectedRows.length} selected`}
              size="small"
              sx={{
                height: 24, fontSize: 10,
                bgcolor: "primary.light", color: "primary.dark",
                border: "0.5px solid", borderColor: "primary.main",
              }}
            />
          )}
        </Box>

        {/* sort + search */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ToggleButtonGroup
            value={sortDir} exclusive size="small"
            onChange={(_, val) => { if (val) setSortDir(val); }}
            sx={{
              height: 32,
              "& .MuiToggleButton-root": {
                px: 1.2, py: 0, fontSize: 9, fontWeight: 600,
                textTransform: "none", border: "0.5px solid",
                borderColor: "divider", color: "text.secondary", gap: 0.5,
                "&.Mui-selected": { bgcolor: "grey.100", color: "text.primary" },
              },
            }}
          >
            <ToggleButton value={config.sortDefaultDir}>
              <SortBtnIcon sx={{ fontSize: 12 }} />
              {config.sortDefaultDir === "asc" ? config.sortAscLabel : config.sortDescLabel}
            </ToggleButton>
            <ToggleButton value={altDir}>
              <SortBtnIcon sx={{ fontSize: 12, transform: "scaleY(-1)" }} />
              {altDir === "asc" ? config.sortAscLabel : config.sortDescLabel}
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            size="small"
            placeholder={config.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: isNumeric ? 160 : 200,
              "& .MuiOutlinedInput-root": {
                fontSize: 11,
                "& fieldset": { borderWidth: "0.5px", borderColor: "divider" },
              },
            }}
          />
        </Box>
      </Box>

      {/* ── Grouped view ── */}
      {viewMode === "grouped" && (
        filteredGroups.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: "text.disabled" }}>
            <Icon sx={{ fontSize: 30, mb: 1, display: "block", mx: "auto", opacity: 0.4 }} />
            <Typography variant="body2" sx={{ ...labelFontStyle }}>
              {config.emptyLabel}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {filteredGroups.map((group, gi) => (
              <GroupAccordion
                key={group.key}
                group={group}
                index={gi}
                config={config}
                labelFontStyle={labelFontStyle}
                columns={columns}
                selectedRows={selectedRows}
                onSelectRow={onSelectRow}
                onCellUpdate={onCellUpdate}
                getLabel={getLabel}
              />
            ))}
          </Box>
        )
      )}

      {/* ── Flat view ── */}
      {viewMode === "flat" && (
        filteredFlatRows.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: "text.disabled" }}>
            <Icon sx={{ fontSize: 30, mb: 1, display: "block", mx: "auto", opacity: 0.4 }} />
            <Typography variant="body2" sx={{ ...labelFontStyle }}>
              {config.emptyLabel}
            </Typography>
          </Box>
        ) : (
          <BatchEditCardList
            columns={columns}
            data={filteredFlatRows}
            selectedRows={selectedRows}
            onSelectRow={onSelectRow}
            onSelectAll={onSelectAll}
            onCellUpdate={onCellUpdate}
            getLabel={getLabel}
            labelFontStyle={labelFontStyle}
            hideSortBar
          />
        )
      )}
    </Box>
  );
}
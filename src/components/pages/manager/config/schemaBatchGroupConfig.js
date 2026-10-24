/**
 * ===========================================================================
 * WHAT   Batch-edit grouping for every collection.
 * USED   /manager/<collection>/batch_edit -> BatchEditLayout, which reads
 *        PAGE_CONFIGS[collection] for its column groups and primary key.
 * LOGIC  Describes how the spreadsheet is split (by series/type/year), which
 *        columns belong together and which CSV headers the import expects.
 *        It does NOT drive the manager list.
 * EDIT   One PAGE_CONFIGS entry per collection; keep the keys aligned with the
 *        field names used by that collection's batch-edit utils.
 * ===========================================================================
 */
/**
 * groupConfigs.js
 *
 * Shared declarative group-by configuration system for all batch-edit pages.
 * Single-language schema — all fields are plain strings (no _en / _cn suffixes).
 *
 * ── USAGE ────────────────────────────────────────────────────────────────────
 *
 *   import { GROUP_CONFIGS, PAGE_CONFIGS, buildGroups } from
 *     "@/components/pages/manager/batch_edit/groupConfigs";
 *
 *   const ACTIVE_CONFIG = PAGE_CONFIGS.artwork;      // series
 *   const ACTIVE_CONFIG = PAGE_CONFIGS.event;        // type
 *   const ACTIVE_CONFIG = PAGE_CONFIGS.exhibition;   // type
 *   const ACTIVE_CONFIG = PAGE_CONFIGS.fair;         // type
 *   const ACTIVE_CONFIG = PAGE_CONFIGS.image;        // tag
 *
 * ── GROUP CONFIG SHAPE ───────────────────────────────────────────────────────
 *
 *   id               string          unique key
 *   icon             MUI SvgIcon     count chip + empty state
 *   sortType         "alpha"|"numeric"
 *   sortDefaultDir   "asc"|"desc"
 *   sortAscLabel     string
 *   sortDescLabel    string
 *   searchPlaceholder string
 *   groupsLabel      string          summary pill  e.g. "groups"
 *   itemsLabel       string          summary pill  e.g. "images"
 *   emptyLabel       string          empty-state message
 *   noGroupLabel     string          no-value bucket label
 *   noGroupKey       string          sentinel key for no-value bucket
 *
 *   getKey(row)               (row) => string
 *   augmentGroup(group, row)  mutates group with secondary data
 *   getDisplay(group)         => { primary, secondary, meta, showIcon }
 *   canSearch(group, q)       => bool
 *   sortGroups(groups, dir)   => groups[]   (no-group bucket always last)
 *
 * ── buildGroups ──────────────────────────────────────────────────────────────
 *
 *   buildGroups(rows, config) => group[]
 *   Each group: { key, noGroup, rows, meta: Set, _rawVal }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import ImageIcon         from "@mui/icons-material/Image";
import VideoLibraryIcon  from "@mui/icons-material/VideoLibrary";
import LanguageIcon      from "@mui/icons-material/Language";
import CollectionsIcon   from "@mui/icons-material/Collections";
import CategoryIcon      from "@mui/icons-material/Category";
import PersonIcon        from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FolderIcon        from "@mui/icons-material/Folder";
import EventIcon         from "@mui/icons-material/Event";
import EditNoteIcon      from "@mui/icons-material/EditNote";
import FlagIcon          from "@mui/icons-material/Flag";

// ─── internal helpers ────────────────────────────────────────────────────────

/** Normalize a value for grouping keys: trim, collapse spaces, lowercase. */
export function nk(v) {
  if (v === null || v === undefined || v === "") return "";
  // Values are not always strings (e.g. numeric `year` fields) — coerce first.
  return String(v).trim().replace(/\s+/g, " ").toLowerCase();
}

/** Year-range label from a Set or Array of year strings — null if none valid. */
export function getYearRange(years) {
  const ys = [...years]
    .map(Number).filter((n) => !isNaN(n) && n > 0)
    .sort((a, b) => a - b);
  if (!ys.length) return null;
  return ys.length === 1 ? `${ys[0]}` : `${ys[0]}–${ys[ys.length - 1]}`;
}

/** Order-range label from a group's rows — null if none have order set. */
export function getOrderRange(rows) {
  const vals = rows
    .map((r) =>
      r.order && typeof r.order === "object" ? r.order.artist_page_order : r.order
    )
    .filter((v) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(Number).filter((n) => !isNaN(n))
    .sort((a, b) => a - b);
  if (!vals.length) return null;
  return vals.length === 1 ? `#${vals[0]}` : `#${vals[0]}–${vals[vals.length - 1]}`;
}

// ═════════════════════════════════════════════════════════════════════════════
// GROUP_CONFIGS
// ═════════════════════════════════════════════════════════════════════════════

export const GROUP_CONFIGS = {

  // ── tag (Image · Video · Web) ─────────────────────────────────────────────
  // Prisma fields: tag_en, tag_cn, type, caption_en, caption_cn, mark, tag_source, order
  tag: {
    id:                "tag",
    icon:              ImageIcon,
    sortType:          "alpha",
    sortDefaultDir:    "asc",
    sortAscLabel:      "A → Z",
    sortDescLabel:     "Z → A",
    searchPlaceholder: "Search tags…",
    groupsLabel:       "groups",
    itemsLabel:        "items",
    emptyLabel:        "No groups match your search",
    noGroupLabel:      "(No Tag)",
    noGroupKey:        "__NO_TAG__",

    getKey: (row) => nk(row.tag_en || row.tag_cn || ""),

    augmentGroup: (group, row) => {
      const val = String(row.tag_en || row.tag_cn || "").trim();
      if (val.length > group._rawVal.length) group._rawVal = val;
      if (row.type) group.meta.add(row.type);
    },

    getDisplay: (group) => ({
      primary:   group._rawVal || "—",
      secondary: "",
      meta:      group.meta.size ? [...group.meta].join(", ") : "",
      showIcon:  false,
    }),

    canSearch: (group, q) =>
      !group.noGroup && group._rawVal.toLowerCase().includes(q),

    sortGroups: (groups, dir) =>
      [...groups].sort((a, b) => {
        if (a.noGroup) return 1;
        if (b.noGroup) return -1;
        const la = a._rawVal.toLowerCase();
        const lb = b._rawVal.toLowerCase();
        return dir === "asc" ? la.localeCompare(lb) : lb.localeCompare(la);
      }),
  },

  // ── series (Artwork) ──────────────────────────────────────────────────────
  // Prisma fields: series, artist, type, year   (Artwork model — no standalone Series model exists)
  series: {
    id:                "series",
    icon:              CollectionsIcon,
    sortType:          "alpha",
    sortDefaultDir:    "asc",
    sortAscLabel:      "A → Z",
    sortDescLabel:     "Z → A",
    searchPlaceholder: "Search series…",
    groupsLabel:       "series",
    itemsLabel:        "artworks",
    emptyLabel:        "No series match your search",
    noGroupLabel:      "(No Series)",
    noGroupKey:        "__NO_SERIES__",

    getKey: (row) => nk(row.series || ""),

    augmentGroup: (group, row) => {
      const val = String(row.series ?? "").trim();
      if (val.length > group._rawVal.length) group._rawVal = val;
      if (row.type) group.meta.add(row.type);
      if (row.artist) {
        if (!group._artists) group._artists = new Set();
        group._artists.add(row.artist);
      }
      if (row.year) {
        if (!group._years) group._years = new Set();
        group._years.add(row.year);
      }
    },

    getDisplay: (group) => {
      const artists   = group._artists?.size
        ? [...group._artists].slice(0, 3).join(" · ") : "";
      const types     = group.meta.size
        ? [...group.meta].slice(0, 2).join(", ") : "";
      const yearRange = group._years ? getYearRange(group._years) : null;
      return {
        primary:   group._rawVal || "—",
        secondary: artists,
        meta:      [types, yearRange].filter(Boolean).join("  ·  "),
        showIcon:  false,
      };
    },

    canSearch: (group, q) =>
      !group.noGroup && group._rawVal.toLowerCase().includes(q),

    sortGroups: (groups, dir) =>
      [...groups].sort((a, b) => {
        if (a.noGroup) return 1;
        if (b.noGroup) return -1;
        const la = a._rawVal.toLowerCase();
        const lb = b._rawVal.toLowerCase();
        return dir === "asc" ? la.localeCompare(lb) : lb.localeCompare(la);
      }),
  },

  // ── type (Event · Exhibition · Fair) ──────────────────────────────────────
  // Prisma fields: type, year, venue  (all three models share this shape)
  type: {
    id:                "type",
    icon:              CategoryIcon,
    sortType:          "alpha",
    sortDefaultDir:    "asc",
    sortAscLabel:      "A → Z",
    sortDescLabel:     "Z → A",
    searchPlaceholder: "Search types…",
    groupsLabel:       "types",
    itemsLabel:        "items",
    emptyLabel:        "No types match your search",
    noGroupLabel:      "(No Type)",
    noGroupKey:        "__NO_TYPE__",

    getKey: (row) => nk(row.type || ""),

    augmentGroup: (group, row) => {
      const val = String(row.type ?? "").trim();
      if (val.length > group._rawVal.length) group._rawVal = val;
      // Event has related_artist[]; Exhibition/Fair have participating_artists (string)
      if (Array.isArray(row.related_artist)) {
        row.related_artist.forEach((a) => a && group.meta.add(a));
      } else if (row.participating_artists) {
        group.meta.add(row.participating_artists);
      }
      if (row.year) {
        if (!group._years) group._years = new Set();
        group._years.add(row.year);
      }
      if (row.venue) {
        if (!group._venues) group._venues = new Set();
        group._venues.add(row.venue);
      }
    },

    getDisplay: (group) => {
      const artists   = group.meta.size ? [...group.meta].slice(0, 3).join(" · ") : "";
      const venues    = group._venues?.size ? [...group._venues].slice(0, 2).join(" · ") : "";
      const yearRange = group._years ? getYearRange(group._years) : null;
      const meta      = [artists || venues, yearRange].filter(Boolean).join("  ·  ");
      return { primary: group._rawVal || "—", secondary: "", meta, showIcon: false };
    },

    canSearch: (group, q) =>
      !group.noGroup && group._rawVal.toLowerCase().includes(q),

    sortGroups: (groups, dir) =>
      [...groups].sort((a, b) => {
        if (a.noGroup) return 1;
        if (b.noGroup) return -1;
        const la = a._rawVal.toLowerCase();
        const lb = b._rawVal.toLowerCase();
        return dir === "asc" ? la.localeCompare(lb) : lb.localeCompare(la);
      }),
  },

  // ── year ──────────────────────────────────────────────────────────────────
  // Prisma fields: year, type, artist  (generic — no model currently mapped to this by default)
  year: {
    id:                "year",
    icon:              CalendarTodayIcon,
    sortType:          "numeric",
    sortDefaultDir:    "desc",
    sortAscLabel:      "Old → New",
    sortDescLabel:     "New → Old",
    searchPlaceholder: "Search year…",
    groupsLabel:       "years",
    itemsLabel:        "items",
    emptyLabel:        "No years match your search",
    noGroupLabel:      "(No Year)",
    noGroupKey:        "__NO_YEAR__",

    getKey: (row) => nk(row.year || ""),

    augmentGroup: (group, row) => {
      const val = String(row.year ?? "").trim();
      if (val.length > group._rawVal.length) group._rawVal = val;
      if (row.type) group.meta.add(row.type);
      if (row.artist) {
        if (!group._artists) group._artists = new Set();
        group._artists.add(row.artist);
      }
    },

    getDisplay: (group) => ({
      primary:   group.noGroup ? null : group._rawVal,
      secondary: group._artists ? [...group._artists].slice(0, 4).join(" · ") : "",
      meta:      group.meta.size ? [...group.meta].slice(0, 3).join(" · ") : "",
      showIcon:  !group.noGroup,
    }),

    canSearch: (group, q) =>
      !group.noGroup && String(group._rawVal).toLowerCase().includes(q),

    sortGroups: (groups, dir) =>
      [...groups].sort((a, b) => {
        if (a.noGroup) return 1;
        if (b.noGroup) return -1;
        return dir === "desc"
          ? Number(b._rawVal) - Number(a._rawVal)
          : Number(a._rawVal) - Number(b._rawVal);
      }),
  },

  // ── artist (About) ───────────────────────────────────────────────────────
  // Prisma fields: artist   (About model — one profile per artist)
  artist: {
    id:                "artist",
    icon:              PersonIcon,
    sortType:          "alpha",
    sortDefaultDir:    "asc",
    sortAscLabel:      "A → Z",
    sortDescLabel:     "Z → A",
    searchPlaceholder: "Search artist…",
    groupsLabel:       "artists",
    itemsLabel:        "items",
    emptyLabel:        "No artists match your search",
    noGroupLabel:      "(No Artist)",
    noGroupKey:        "__NO_ARTIST__",

    getKey: (row) => nk(row.artist || ""),

    augmentGroup: (group, row) => {
      const val = String(row.artist ?? "").trim();
      if (val.length > group._rawVal.length) group._rawVal = val;
      if (row.type) group.meta.add(row.type);
      if (row.year) {
        if (!group._years) group._years = new Set();
        group._years.add(row.year);
      }
    },

    getDisplay: (group) => {
      const types     = group.meta.size ? [...group.meta].slice(0, 3).join(" · ") : "";
      const yearRange = group._years ? getYearRange(group._years) : null;
      return {
        primary:   group._rawVal || "—",
        secondary: "",
        meta:      [types, yearRange].filter(Boolean).join("  ·  "),
        showIcon:  false,
      };
    },

    canSearch: (group, q) =>
      !group.noGroup && group._rawVal.toLowerCase().includes(q),

    sortGroups: (groups, dir) =>
      [...groups].sort((a, b) => {
        if (a.noGroup) return 1;
        if (b.noGroup) return -1;
        const la = a._rawVal.toLowerCase();
        const lb = b._rawVal.toLowerCase();
        return dir === "asc" ? la.localeCompare(lb) : lb.localeCompare(la);
      }),
  },

  // ── category (Writing) ────────────────────────────────────────────────────
  // Prisma fields: category, type, author, year, status
  category: {
    id:                "category",
    icon:              EditNoteIcon,
    sortType:          "alpha",
    sortDefaultDir:    "asc",
    sortAscLabel:      "A → Z",
    sortDescLabel:     "Z → A",
    searchPlaceholder: "Search category…",
    groupsLabel:       "categories",
    itemsLabel:        "writings",
    emptyLabel:        "No categories match your search",
    noGroupLabel:      "(No Category)",
    noGroupKey:        "__NO_CATEGORY__",

    getKey: (row) => nk(row.category || ""),

    augmentGroup: (group, row) => {
      const val = String(row.category ?? "").trim();
      if (val.length > group._rawVal.length) group._rawVal = val;
      if (row.type) group.meta.add(row.type);
      if (row.year) {
        if (!group._years) group._years = new Set();
        group._years.add(row.year);
      }
      if (row.status) {
        if (!group._statuses) group._statuses = new Set();
        group._statuses.add(row.status);
      }
    },

    getDisplay: (group) => {
      const types     = group.meta.size ? [...group.meta].slice(0, 3).join(" · ") : "";
      const yearRange = group._years ? getYearRange(group._years) : null;
      const statuses  = group._statuses?.size ? [...group._statuses].join(", ") : "";
      return {
        primary:   group._rawVal || "—",
        secondary: statuses,
        meta:      [types, yearRange].filter(Boolean).join("  ·  "),
        showIcon:  false,
      };
    },

    canSearch: (group, q) =>
      !group.noGroup && group._rawVal.toLowerCase().includes(q),

    sortGroups: (groups, dir) =>
      [...groups].sort((a, b) => {
        if (a.noGroup) return 1;
        if (b.noGroup) return -1;
        const la = a._rawVal.toLowerCase();
        const lb = b._rawVal.toLowerCase();
        return dir === "asc" ? la.localeCompare(lb) : lb.localeCompare(la);
      }),
  },

  // ── status (Enquire) ──────────────────────────────────────────────────────
  // Prisma fields: status, createdAt, name, email
  status: {
    id:                "status",
    icon:              FlagIcon,
    sortType:          "alpha",
    sortDefaultDir:    "asc",
    sortAscLabel:      "A → Z",
    sortDescLabel:     "Z → A",
    searchPlaceholder: "Search status…",
    groupsLabel:       "statuses",
    itemsLabel:        "enquiries",
    emptyLabel:        "No statuses match your search",
    noGroupLabel:      "(No Status)",
    noGroupKey:        "__NO_STATUS__",

    getKey: (row) => nk(row.status || ""),

    augmentGroup: (group, row) => {
      const val = String(row.status ?? "").trim();
      if (val.length > group._rawVal.length) group._rawVal = val;
      if (row.createdAt) {
        if (!group._dates) group._dates = new Set();
        group._dates.add(String(row.createdAt).slice(0, 10));
      }
    },

    getDisplay: (group) => {
      const dates = group._dates?.size
        ? [...group._dates].sort().slice(-1)[0]
        : "";
      return {
        primary:   group._rawVal || "—",
        secondary: "",
        meta:      dates ? `${group._dates.size} · ${dates}` : "",
        showIcon:  false,
      };
    },

    canSearch: (group, q) =>
      !group.noGroup && String(group._rawVal).toLowerCase().includes(q),

    sortGroups: (groups, dir) =>
      [...groups].sort((a, b) => {
        if (a.noGroup) return 1;
        if (b.noGroup) return -1;
        const la = a._rawVal.toLowerCase();
        const lb = b._rawVal.toLowerCase();
        return dir === "asc" ? la.localeCompare(lb) : lb.localeCompare(la);
      }),
  },
};

export const PAGE_CONFIGS = {
  image:      { ...GROUP_CONFIGS.tag,      icon: ImageIcon,        itemsLabel: "images"    },
  video:      { ...GROUP_CONFIGS.tag,      icon: VideoLibraryIcon, itemsLabel: "videos"    },
  web:        { ...GROUP_CONFIGS.tag,      icon: LanguageIcon,     itemsLabel: "links"     },
  artwork:    { ...GROUP_CONFIGS.series,   icon: CollectionsIcon,  itemsLabel: "artworks"  },
  event:      { ...GROUP_CONFIGS.type,     icon: EventIcon,        itemsLabel: "events"    },
  exhibition: { ...GROUP_CONFIGS.type,     icon: EventIcon,        itemsLabel: "exhibitions" },
  fair:       { ...GROUP_CONFIGS.type,     icon: FolderIcon,       itemsLabel: "fairs"     },
  writing:    { ...GROUP_CONFIGS.category, icon: EditNoteIcon,     itemsLabel: "writings"  },
  about:      { ...GROUP_CONFIGS.artist,   icon: PersonIcon,       itemsLabel: "profiles"  },
  enquire:    { ...GROUP_CONFIGS.status,   icon: FlagIcon,         itemsLabel: "enquiries" },
  series:     { ...GROUP_CONFIGS.artist,   icon: CollectionsIcon,  itemsLabel: "series"    },
  resume:     { ...GROUP_CONFIGS.artist,   icon: PersonIcon,       itemsLabel: "resumes"   },
};

// ─── buildGroups ──────────────────────────────────────────────────────────────
// 新增：从行数据和配置构建分组数组，供 BatchGroupList 使用

export function buildGroups(rows, config) {
  const groupsMap = new Map();
  const noGroupKey = config.noGroupKey;

  for (const row of rows) {
    const key = config.getKey(row);
    const isNoGroup = !key || key === noGroupKey;
    const groupKey = isNoGroup ? noGroupKey : key;

    let group = groupsMap.get(groupKey);
    if (!group) {
      group = {
        key: groupKey,
        noGroup: isNoGroup,
        rows: [],
        meta: new Set(),
        _rawVal: "",
      };
      groupsMap.set(groupKey, group);
    }

    group.rows.push(row);
    config.augmentGroup(group, row);
  }

  return Array.from(groupsMap.values());
}
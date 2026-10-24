/**
 * batchGroupOptions.js
 *
 * Makes the batch-edit pages group **exactly like the manager pages**, and —
 * where the manager offers more than one dimension — lets the user pick it
 * (the same “Group by” idea as the manager's control panel).
 *
 * It wraps the existing `GROUP_CONFIGS` from
 * `@/components/pages/manager/config/schemaBatchGroupConfig` (tag / series /
 * type / year / artist / category) with:
 *   - Chinese labels (`localizeGroupConfig`)
 *   - a per-entity option list whose FIRST entry mirrors the manager page's own
 *     grouping (`src/app/manager/<entity>/page.jsx → dataConfig.groupConfig`)
 *   - the ability to override one option (used by the image page to group by
 *     artist through the shared image→artist index).
 *
 *   artist (manager default for artwork, bibliography, video, web)
 *   year   (exhibition, fair)      type (event, writing)      tag (image)
 */

import { GROUP_CONFIGS } from "@/components/pages/manager/config/schemaBatchGroupConfig";

/** CN strings for the shared group configs (the originals are EN-only). */
const CN_LABELS = {
  tag: {
    groupsLabel: "标签分组",
    itemsLabel: "项",
    searchPlaceholder: "搜索标签…",
    emptyLabel: "没有匹配的分组",
    noGroupLabel: "（无标签）",
  },
  series: {
    groupsLabel: "系列",
    itemsLabel: "件",
    searchPlaceholder: "搜索系列…",
    emptyLabel: "没有匹配的系列",
    noGroupLabel: "（无系列）",
  },
  type: {
    groupsLabel: "类型",
    itemsLabel: "项",
    searchPlaceholder: "搜索类型…",
    emptyLabel: "没有匹配的类型",
    noGroupLabel: "（无类型）",
  },
  year: {
    groupsLabel: "年份",
    itemsLabel: "项",
    searchPlaceholder: "搜索年份…",
    emptyLabel: "没有匹配的年份",
    noGroupLabel: "（无年份）",
  },
  artist: {
    groupsLabel: "艺术家",
    itemsLabel: "项",
    searchPlaceholder: "搜索艺术家…",
    emptyLabel: "没有匹配的艺术家",
    noGroupLabel: "（无艺术家）",
  },
  category: {
    groupsLabel: "分类",
    itemsLabel: "篇",
    searchPlaceholder: "搜索分类…",
    emptyLabel: "没有匹配的分类",
    noGroupLabel: "（无分类）",
  },
};

/** Apply the Chinese strings (arrows stay universal). */
export const localizeGroupConfig = (config, isCn) => {
  if (!config) return config;
  if (!isCn) return config;
  const cn = CN_LABELS[config.id] || {};
  return { ...config, ...cn };
};

/**
 * Per-entity dimensions, the first one matching the manager page's grouping.
 * `label` is shown in the “Group by” selector.
 */
const ENTITY_OPTIONS = {
  artwork: [
    { key: "artist", label: { en: "Artist", cn: "艺术家" } },
    { key: "series", label: { en: "Series", cn: "系列" } },
    { key: "year", label: { en: "Year", cn: "年份" } },
  ],
  exhibition: [
    { key: "year", label: { en: "Year", cn: "年份" } },
    { key: "type", label: { en: "Type", cn: "类型" } },
  ],
  fair: [
    { key: "year", label: { en: "Year", cn: "年份" } },
    { key: "type", label: { en: "Type", cn: "类型" } },
  ],
  event: [
    { key: "type", label: { en: "Type", cn: "类型" } },
    { key: "year", label: { en: "Year", cn: "年份" } },
  ],
  writing: [
    { key: "type", label: { en: "Type", cn: "类型" } },
    { key: "category", label: { en: "Category", cn: "分类" } },
    { key: "year", label: { en: "Year", cn: "年份" } },
  ],
  bibliography: [
    { key: "artist", label: { en: "Artist", cn: "艺术家" } },
    { key: "year", label: { en: "Year", cn: "年份" } },
  ],
  series: [
    { key: "artist", label: { en: "Artist", cn: "艺术家" } },
    { key: "year", label: { en: "Year", cn: "年份" } },
  ],
  resume: [
    { key: "artist", label: { en: "Artist", cn: "艺术家" } },
    { key: "year", label: { en: "Year", cn: "年份" } },
  ],
  about: [
    { key: "artist", label: { en: "Artist", cn: "艺术家" } },
    { key: "language", label: { en: "Language", cn: "语言" } },
  ],
  enquire: [
    { key: "status", label: { en: "Status", cn: "状态" } },
  ],
  image: [
    { key: "tag", label: { en: "Tag / Title", cn: "标签 / 标题" } },
    { key: "artist", label: { en: "Artist", cn: "艺术家" } },
    { key: "type", label: { en: "Type", cn: "类型" } },
  ],
  video: [
    { key: "tag", label: { en: "Tag / Title", cn: "标签 / 标题" } },
    { key: "type", label: { en: "Type", cn: "类型" } },
  ],
  web: [
    { key: "tag", label: { en: "Tag / Title", cn: "标签 / 标题" } },
    { key: "type", label: { en: "Type", cn: "类型" } },
  ],
};

/** Fallback config for dimensions the shared registry does not ship. */
const makeFieldConfig = (id, { itemsEn = "items", itemsCn = "项" } = {}) => ({
  id,
  icon: GROUP_CONFIGS.tag.icon,
  sortType: id === "language" ? "alpha" : "alpha",
  sortDefaultDir: "asc",
  sortAscLabel: "A → Z",
  sortDescLabel: "Z → A",
  searchPlaceholder: `Search ${id}…`,
  groupsLabel: id,
  itemsLabel: itemsEn,
  emptyLabel: `No ${id} match your search`,
  noGroupLabel: `(No ${id})`,
  noGroupKey: `__NO_${id.toUpperCase()}__`,
  getKey: (row) => String(row?.[id] ?? "").trim().toLowerCase(),
  augmentGroup: (group, row) => {
    const val = String(row?.[id] ?? "").trim();
    if (val.length > group._rawVal.length) group._rawVal = val;
    if (row.type) group.meta.add(row.type);
  },
  getDisplay: (group) => ({
    primary: group._rawVal || "—",
    secondary: "",
    meta: group.meta.size ? [...group.meta].slice(0, 3).join(" · ") : "",
    showIcon: false,
  }),
  canSearch: (group, q) => !group.noGroup && group._rawVal.toLowerCase().includes(q),
  sortGroups: (groups, dir) =>
    [...groups].sort((a, b) => {
      if (a.noGroup) return 1;
      if (b.noGroup) return -1;
      const la = a._rawVal.toLowerCase();
      const lb = b._rawVal.toLowerCase();
      return dir === "asc" ? la.localeCompare(lb) : lb.localeCompare(la);
    }),
});

const FALLBACK_CN = {
  status: { groupsLabel: "状态", itemsLabel: "条", searchPlaceholder: "搜索状态…", emptyLabel: "没有匹配的状态", noGroupLabel: "（无状态）" },
  language: { groupsLabel: "语言", itemsLabel: "项", searchPlaceholder: "搜索语言…", emptyLabel: "没有匹配的语言", noGroupLabel: "（无语言）" },
};

/**
 * The “Group by” options for one batch-edit page.
 *
 * @param {string} entity          e.g. "image"
 * @param {boolean} isCn
 * @param {object} [overrides]     { [key]: Partial<config> } — e.g. the image
 *                                 page passes an artist `getKey` built from the
 *                                 shared image→artist index.
 * @returns {Array<{ value, label:{en,cn}, config }>}
 */
export function getBatchGroupOptions(entity, isCn = false, overrides = {}) {
  const defs = ENTITY_OPTIONS[entity] || [];
  return defs.map((def) => {
    const base =
      GROUP_CONFIGS[def.key] || makeFieldConfig(def.key, { itemsCn: "项" });
    const localized = isCn
      ? { ...base, ...(CN_LABELS[def.key] || FALLBACK_CN[def.key] || {}) }
      : base;
    return {
      value: def.key,
      label: def.label,
      config: { ...localized, ...(overrides[def.key] || {}) },
    };
  });
}

export default getBatchGroupOptions;

/**
 * ===========================================================================
 * WHAT   Artwork — manager list config
 * USED   /manager/artwork  ->  <EditorialManagerList config={...} />  (Cards + List)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */

import { createComprehensiveArtworkExport } from "@/components/pages/manager/utils/artworkExportUtils";
import { FIXED_SIZE_PRESET } from "@/components/pages/manager/constants/cardDisplayPresets";

/* ── FIELDS ─────────────────────────────────────────────────────────────── */

export const ARTWORK_FIELDS = [
  { key: "cover_img_url", label: "Cover Image" },
  { key: "artist", label: "Artist / 艺术家" },
  { key: "title", label: "Title / 标题" },
  { key: "type", label: "Type / 类型" },
  { key: "year", label: "Year / 年份" },

  { key: "medium", label: "Medium / 媒介" },
  { key: "size", label: "Size / 尺寸" },
  { key: "series", label: "Series / 系列" },
  { key: "duration", label: "Duration / 时长" },
  { key: "caption", label: "Caption / 说明" },
  { key: "credits", label: "Credits / 致谢" },
  { key: "special_thanks", label: "Special Thanks / 特别感谢" },
  { key: "introduction", label: "Introduction / 介绍", isArray: true },

  { key: "venue", label: "Venue / 场地" },
  { key: "country", label: "Country / 国家" },

  { key: "related_exhibition", label: "Related Gallery/Exhibition / 关联画廊/展览", isArray: true },
  { key: "relatedWebs", label: "Related Websites / 相关网页", isArray: true },

  { key: "video_url", label: "Video URL / 视频链接" },
  { key: "web_url", label: "Web URL / 网页链接" },
  { key: "work_value", label: "Work Value / 作品价值" },
  { key: "sold", label: "Sold / 已售" },

  { key: "mark", label: "Mark / 标记" },
  { key: "tag", label: "Tags / 标签", isArray: true },
  { key: "language", label: "Language / 语言" },

  { key: "updatedAt", label: "Updated At / 更新时间" },
];

export const getArtworkFields = () => ARTWORK_FIELDS;

/* ── FILTERS ────────────────────────────────────────────────────────────── */
/* Add / remove / reorder a key here and the filter bar follows. Array-valued
   fields (tag) are skipped — the bar matches scalar values only. */

export const ARTWORK_FILTER_FIELDS = [
  "type",
  "series",
  "year",
];

const FILTER_LABELS = {
  artist: { en: "Artist", cn: "艺术家" },
  type: { en: "Type", cn: "类型" },
  medium: { en: "Medium", cn: "媒介" },
  series: { en: "Series", cn: "系列" },
  year: { en: "Year", cn: "年份" },
  sold: { en: "Sold", cn: "已售" },
};

const FILTER_WIDTHS = {
  artist: 110,
  type: 90,
  medium: 100,
  series: 100,
  year: 60,
  sold: 70,
};

const FILTER_SORTS = { year: "numericDesc" };

export const ARTWORK_FILTERS = ARTWORK_FILTER_FIELDS.filter(
  (field) => field !== "tag"
).map((field) => {
  const label = FILTER_LABELS[field] || { en: field, cn: field };
  return {
    field,
    allLabel: { en: `${label.en}: All`, cn: `${label.cn}：全部` },
    ariaLabel: { en: `Filter by ${label.en}`, cn: `按${label.cn}筛选` },
    width: FILTER_WIDTHS[field] ?? 100,
    ...(FILTER_SORTS[field] ? { sort: FILTER_SORTS[field] } : {}),
  };
});

/* ── ROUTES ─────────────────────────────────────────────────────────────── */

const API = "/api/artwork";
const ROUTES = {
  create: "/manager/artwork/create",
  batchEdit: "/manager/artwork/batch_edit",
  edit: (id) => `/manager/artwork/${id}/edit`,
  order: "/manager/artwork/order",
};

/* ── CONFIG ─────────────────────────────────────────────────────────────── */

export const artworkManagerConfig = {
  key: "artwork",
  api: API,
  title: { en: "Artwork", cn: "作品" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#C2452D",

  createHref: ROUTES.create,
  batchEditHref: ROUTES.batchEdit,
  editHref: ROUTES.edit,
  exportFn: (rows, isCn) => createComprehensiveArtworkExport(rows, isCn),

  // Keep records without a language tag, hide the other language's records.
  languageField: "language",
  languageMode: "lenient",

  itemNoun: { en: "work", cn: "件" },

  primaryField: "title",
  metaFields: ["artist", "type", "year"],
  bodyField: "caption",
  coverField: "cover_img_url",
  captionFields: ["artist", "type", "year"],
  links: [
    { field: "web_url", label: { en: "Website", cn: "网页" }, showHost: true },
    { field: "video_url", label: { en: "Video", cn: "视频" } },
  ],
  related: [
    { field: "related_exhibition", label: { en: "Exhibitions", cn: "展览" }, max: 3 },
  ],

  searchPlaceholder: {
    en: "Search title, artist, medium, series…",
    cn: "搜索标题、艺术家、媒介、系列…",
  },
  searchFields: [
    "title",
    "artist",
    "type",
    "year",
    "medium",
    "series",
    "caption",
    "tag",
    "venue",
    "country",
  ],

  filters: ARTWORK_FILTERS,

  groupBy: {
    default: "year",
    caption: { en: "Group", cn: "分组" },
    allLabel: { en: "None", cn: "不分组" },
    options: [
      { value: "year", label: { en: "Year", cn: "年份" } },
      { value: "letter", label: { en: "A–Z", cn: "字母 A–Z" } },
      { value: "type", label: { en: "Type", cn: "类型" } },
    ],
  },

  cardView: {
    defaultMode: "grid",
    cardWidth: 340,
    fields: ARTWORK_FIELDS,
    titleField: "title",
    imageField: "cover_img_url",
    videoField: "video_url",
    deleteFields: ["artist", "title", "type", "year", "medium"],
    cardProps: {
      ...FIXED_SIZE_PRESET,
      aspectRatio: "4 / 3",
      summaryFieldCount: 3,
      orderKey: "artist_page_order",
    },
  },

  extraLinks: [
    { href: ROUTES.order, label: { en: "Order page", cn: "排序页" } },
  ],

  emptyMessage: { en: "No artworks yet.", cn: "暂无作品。" },
  accordionOver: 10,
  // Expanded artwork rows keep their heading — the body (caption) is often
  // empty for video works, so the expanded panel must identify the piece.
  accordionShowHeading: true,
};

export default artworkManagerConfig;

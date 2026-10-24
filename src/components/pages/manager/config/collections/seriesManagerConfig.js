/**
 * ===========================================================================
 * WHAT   Series — manager list config
 * USED   /manager/series  ->  <EditorialManagerList config={...} />  (List only)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveSeriesExport } from "@/components/pages/manager/utils/seriesExportUtils";

/**
 * Series — editorial manager list config.
 * See `layouts/EditorialManagerList.jsx` for the layout contract.
 */
export const seriesManagerConfig = {
  key: "series",
  api: "/api/series",
  title: { en: "Series", cn: "系列" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#2E7D6B",

  createHref: "/manager/series/create",
  batchEditHref: "/manager/series/batch_edit",
  editHref: (id) => `/manager/series/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveSeriesExport(rows, isCn),

  languageField: "language",

  primaryField: "title",
  subtitleField: "artist",
  metaFields: ["type", "medium", "year"],
  bodyField: "caption",
  bodyFields: ["introduction"],
  coverField: "cover_img_url",
  captionFields: ["type", "year"],
  related: [{ field: "tag", label: { en: "Tags", cn: "标签" }, max: 4 }],

  searchPlaceholder: {
    en: "Search title, artist, type, medium…",
    cn: "搜索标题、艺术家、类型、媒介…",
  },
  searchFields: ["title", "artist", "type", "medium", "year", "caption", "tag"],

  filters: [
    {
      field: "type",
      allLabel: { en: "Type: All", cn: "类型：全部" },
      ariaLabel: { en: "Filter by type", cn: "按类型筛选" },
      width: 100,
    },
    {
      field: "year",
      allLabel: { en: "Year: All", cn: "年份：全部" },
      ariaLabel: { en: "Filter by year", cn: "按年份筛选" },
      width: 60,
      sort: "numericDesc",
    },
  ],

  emptyMessage: { en: "No series yet.", cn: "暂无系列。" },
  accordionOver: 10,
};

export default seriesManagerConfig;

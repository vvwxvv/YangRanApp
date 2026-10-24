/**
 * ===========================================================================
 * WHAT   Writing — manager list config
 * USED   /manager/writing  ->  <EditorialManagerList config={...} />  (List only)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveWritingExport } from "@/components/pages/manager/utils/writingExportUtils";

/**
 * Writing — editorial manager list config.
 * See `layouts/EditorialManagerList.jsx` for the layout contract.
 */
export const writingManagerConfig = {
  key: "writing",
  api: "/api/writing",
  title: { en: "Writing", cn: "写作" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#8A3B57",

  createHref: "/manager/writing/create",
  batchEditHref: "/manager/writing/batch_edit",
  editHref: (id) => `/manager/writing/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveWritingExport(rows, isCn),

  languageField: "language",

  primaryField: "title",
  subtitleField: "subtitle",
  metaFields: ["type", "year", "author"],
  bodyField: "summary",
  coverField: "cover_img_url",
  captionFields: ["author", "type", "year"],
  related: [{ field: "tag", label: { en: "Tags", cn: "标签" }, max: 4 }],

  searchPlaceholder: {
    en: "Search title, author, type, keywords…",
    cn: "搜索标题、作者、类型、关键词…",
  },
  searchFields: ["title", "subtitle", "author", "type", "year", "summary", "keywords", "category"],

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

  emptyMessage: { en: "No writing entries yet.", cn: "暂无写作条目。" },
  accordionOver: 10,
};

export default writingManagerConfig;

/**
 * ===========================================================================
 * WHAT   Bibliography — manager list config
 * USED   /manager/bibliography  ->  <EditorialManagerList config={...} />  (List only)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveBibliographyExport } from "@/components/pages/manager/utils/bibliographyExportUtils";

/**
 * Bibliography — editorial manager list config.
 * This collection is the reference design for the shared layout, so its
 * config is the closest mirror of the original page.
 */
export const bibliographyManagerConfig = {
  key: "bibliography",
  api: "/api/bibliography",
  title: { en: "Bibliography", cn: "文献" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#4A6FA5",

  createHref: "/manager/bibliography/create",
  batchEditHref: "/manager/bibliography/batch_edit",
  editHref: (id) => `/manager/bibliography/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveBibliographyExport(rows, isCn),

  languageField: "language",

  primaryField: "title",
  subtitleField: "subtitle",
  metaFields: ["type", "year", "author"],
  coverField: "cover_img_url",
  captionFields: ["author", "type", "year"],
  links: [
    { field: "web_url", label: { en: "Website", cn: "网页" }, showHost: true },
    { field: "pdf_url", label: { en: "PDF", cn: "PDF" } },
    { field: "video_url", label: { en: "Video", cn: "视频" } },
  ],
  related: [
    { field: "related_artist", label: { en: "Artists", cn: "艺术家" }, max: 3 },
    { field: "related_exhibition", label: { en: "Exhibitions", cn: "展览" }, max: 2 },
  ],

  searchPlaceholder: {
    en: "Search title, author, year…",
    cn: "搜索标题、作者、年份…",
  },
  searchFields: [
    "title",
    "subtitle",
    "author",
    "type",
    "year",
    "date",
    "published_at",
    "related_artist",
    "related_exhibition",
  ],

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

  emptyMessage: { en: "No bibliography entries yet.", cn: "暂无文献条目。" },
  accordionOver: 10,
};

export default bibliographyManagerConfig;

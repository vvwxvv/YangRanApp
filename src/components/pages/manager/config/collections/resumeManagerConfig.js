/**
 * ===========================================================================
 * WHAT   Resume — manager list config
 * USED   /manager/resume  ->  <EditorialManagerList config={...} />  (List only)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveResumeExport } from "@/components/pages/manager/utils/resumeExportUtils";

/**
 * Resume — editorial manager list config.
 * Resume records have no `title` and no cover: the artist name is the primary
 * line, the dates sit under it, and the row stays single-column.
 */
const dateRange = (item) => {
  const start = String(item?.start_date || "").trim();
  const end = String(item?.end_date || "").trim();
  if (start && end && start !== end) return `${start} – ${end}`;
  return start || end || "";
};

export const resumeManagerConfig = {
  key: "resume",
  api: "/api/resume",
  title: { en: "Resume", cn: "履历" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#5A6B7B",

  createHref: "/manager/resume/create",
  batchEditHref: "/manager/resume/batch_edit",
  editHref: (id) => `/manager/resume/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveResumeExport(rows, isCn),

  languageField: "language",

  primaryField: "artist",
  primaryItalic: true,
  metaFields: ["type"],
  metaResolver: (item) => dateRange(item) || String(item?.year || "").trim(),
  bodyField: "description",
  coverField: null,

  searchPlaceholder: {
    en: "Search artist, type, year, description…",
    cn: "搜索艺术家、类型、年份、描述…",
  },
  searchFields: ["artist", "type", "year", "description", "start_date", "end_date"],

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

  emptyMessage: { en: "No resume entries yet.", cn: "暂无履历条目。" },
  accordionOver: 10,
};

export default resumeManagerConfig;

/**
 * ===========================================================================
 * WHAT   Event — manager list config
 * USED   /manager/event  ->  <EditorialManagerList config={...} />  (List only)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveEventExport } from "@/components/pages/manager/utils/eventExportUtils";

/**
 * Event — editorial manager list config.
 * See `layouts/EditorialManagerList.jsx` for the layout contract.
 */
export const eventManagerConfig = {
  key: "event",
  api: "/api/event",
  title: { en: "Event", cn: "活动" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#B07A1E",

  createHref: "/manager/event/create",
  batchEditHref: "/manager/event/batch_edit",
  editHref: (id) => `/manager/event/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveEventExport(rows, isCn),

  languageField: "language",

  primaryField: "title",
  subtitleField: "subtitle",
  metaFields: ["type", "date_time"],
  metaResolver: (item) =>
    String(item?.date_time || "").trim() ? "" : String(item?.year || "").trim(),
  bodyField: "introduction",
  bodyFields: ["caption"],
  coverField: "cover_img_url",
  captionFields: ["type", "year"],
  links: [
    { field: "web_url", label: { en: "Website", cn: "网页" }, showHost: true },
    { field: "video_url", label: { en: "Video", cn: "视频" } },
  ],
  related: [{ field: "related_artist", label: { en: "Artists", cn: "艺术家" }, max: 3 }],

  searchPlaceholder: {
    en: "Search title, host, venue, caption…",
    cn: "搜索标题、主办方、场馆、说明…",
  },
  searchFields: ["title", "subtitle", "host", "venue", "caption", "year", "type", "date_time"],

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

  emptyMessage: { en: "No events yet.", cn: "暂无活动。" },
  accordionOver: 10,
};

export default eventManagerConfig;

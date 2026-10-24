/**
 * ===========================================================================
 * WHAT   Web — manager list config
 * USED   /manager/web  ->  <EditorialManagerList config={...} />  (List only)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { formatWebDataForCSV } from "@/components/pages/manager/utils/webExportUtils";

/**
 * Web — editorial manager list config.
 * Web records are link cards: the tag is the primary line, the caption is the
 * body, and the URL is shown as a host link. No cover, no year.
 */
export const webManagerConfig = {
  key: "web",
  api: "/api/web",
  title: { en: "Web", cn: "网页" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#55606E",

  createHref: "/manager/web/create",
  batchEditHref: "/manager/web/batch_edit",
  editHref: (id) => `/manager/web/${id}/edit`,
  exportFn: (rows, isCn) => formatWebDataForCSV(rows, isCn),

  languageField: null,

  primaryField: { en: "tag_en", cn: "tag_cn" },
  subtitleField: { en: "tag_cn", cn: "tag_en" },
  metaFields: ["type", "tag_source"],
  bodyField: { en: "caption_en", cn: "caption_cn" },
  coverField: null,
  links: [{ field: "web_url", label: { en: "Website", cn: "网页" }, showHost: true }],

  searchPlaceholder: {
    en: "Search tag, caption, source…",
    cn: "搜索标签、说明、来源…",
  },
  searchFields: ["tag_en", "tag_cn", "caption_en", "caption_cn", "type", "tag_source"],

  filters: [
    {
      field: "type",
      allLabel: { en: "Type: All", cn: "类型：全部" },
      ariaLabel: { en: "Filter by type", cn: "按类型筛选" },
      width: 100,
    },
    {
      field: "tag_source",
      allLabel: { en: "Source: All", cn: "来源：全部" },
      ariaLabel: { en: "Filter by source", cn: "按来源筛选" },
      width: 110,
    },
  ],

  emptyMessage: { en: "No web entries yet.", cn: "暂无网页条目。" },
  accordionOver: 10,
};

export default webManagerConfig;

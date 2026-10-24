/**
 * ===========================================================================
 * WHAT   Enquiry — manager list config
 * USED   /manager/enquire  ->  <EditorialManagerList config={...} />  (List only)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveEnquireExport } from "@/components/pages/manager/utils/enquireExportUtils";

/**
 * Enquiry — manager list config (editorial list only; no cards).
 * Inbox-style collection: newest first, grouped by status by default.
 * No batch edit route exists for enquiries, so `batchEditHref` is omitted.
 */
export const enquireManagerConfig = {
  key: "enquire",
  api: "/api/enquire",
  title: { en: "Enquiry", cn: "咨询" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#A34A3F",

  createHref: "/manager/enquire/create",
  editHref: (id) => `/manager/enquire/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveEnquireExport(rows, isCn),

  languageField: null,
  itemNoun: { en: "enquiry", cn: "条" },
  itemNounPlural: { en: "enquiries", cn: "条" },

  primaryField: "name",
  subtitleField: "email",
  metaFields: ["status", "createdAt"],
  bodyField: "message",
  coverField: null,
  captionFields: ["status", "createdAt"],

  searchPlaceholder: {
    en: "Search name, email, message…",
    cn: "搜索姓名、邮箱、留言…",
  },
  searchFields: ["name", "email", "message", "status"],

  filters: [
    {
      field: "status",
      allLabel: { en: "Status: All", cn: "状态：全部" },
      ariaLabel: { en: "Filter by status", cn: "按状态筛选" },
      width: 90,
    },
  ],

  groupBy: {
    default: "status",
    caption: { en: "Group", cn: "分组" },
    allLabel: { en: "None", cn: "不分组" },
    options: [
      { value: "status", field: "status", label: { en: "Status", cn: "状态" } },
      {
        value: "letter",
        kind: "letter",
        field: "name",
        label: { en: "A–Z", cn: "字母 A–Z" },
      },
    ],
  },

  sortRows: (a, b) => {
    const ad = String(a?.createdAt || "");
    const bd = String(b?.createdAt || "");
    if (ad && bd && ad !== bd) return bd.localeCompare(ad); // newest first
    return String(a?.name || "").localeCompare(String(b?.name || ""));
  },

  emptyMessage: { en: "No enquiries yet.", cn: "暂无咨询。" },
  accordionOver: 10,
};

export default enquireManagerConfig;

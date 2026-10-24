/**
 * ===========================================================================
 * WHAT   About — manager list config
 * USED   /manager/about  ->  <EditorialManagerList config={...} />  (List only)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveAboutExport } from "@/components/pages/manager/utils/aboutExportUtils";

/**
 * About — manager list config (editorial list only; no cards).
 * About entries are a single portrait + bio block, so the page ships without a
 * `cardView` and therefore has no Cards/List switch.
 */
export const aboutManagerConfig = {
  key: "about",
  api: "/api/about",
  title: { en: "About", cn: "关于" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#7A5C3E",

  createHref: "/manager/about/create",
  batchEditHref: "/manager/about/batch_edit",
  editHref: (id) => `/manager/about/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveAboutExport(rows, isCn),

  languageField: "language",
  itemNoun: { en: "entry", cn: "条" },

  primaryField: "artist",
  metaFields: [],
  metaResolver: (item, isCn) => {
    const order = item?.order;
    if (order === null || order === undefined || String(order).trim() === "") return "";
    if (Number(order) === 0) return "";
    return `${isCn ? "顺序" : "Order"} ${order}`;
  },
  bodyFields: ["caption", "introductions", "introduction"],
  // One bio block per page — show it in full instead of clamping to 4 lines.
  bodyLines: 0,
  coverField: "portrait_image_url",
  captionFields: ["artist"],
  links: [
    { field: "web_url", label: { en: "Website", cn: "网页" }, showHost: true },
    { field: "pdf_url", label: { en: "Portfolio PDF", cn: "作品集 PDF" } },
  ],

  searchPlaceholder: {
    en: "Search artist, caption…",
    cn: "搜索艺术家、说明…",
  },
  searchFields: [
    "artist",
    "caption",
    "introduction",
    "introductions",
    "web_url",
    "pdf_url",
  ],

  filters: [
    {
      field: "artist",
      allLabel: { en: "Artist: All", cn: "艺术家：全部" },
      ariaLabel: { en: "Filter by artist", cn: "按艺术家筛选" },
      width: 110,
    },
  ],

  groupBy: {
    default: "none",
    caption: { en: "Group", cn: "分组" },
    allLabel: { en: "None", cn: "不分组" },
    options: [
      {
        value: "letter",
        kind: "letter",
        field: "artist",
        label: { en: "A–Z", cn: "字母 A–Z" },
      },
    ],
  },

  sortRows: (a, b) => {
    const ao = Number(a?.order);
    const bo = Number(b?.order);
    const aHas = Number.isFinite(ao) && String(a?.order ?? "").trim() !== "";
    const bHas = Number.isFinite(bo) && String(b?.order ?? "").trim() !== "";
    if (aHas && bHas && ao !== bo) return ao - bo;
    if (aHas !== bHas) return aHas ? -1 : 1;
    return String(a?.artist || "").localeCompare(String(b?.artist || ""));
  },

  emptyMessage: { en: "No about entries yet.", cn: "暂无关于条目。" },
  accordionOver: 10,
  accordionShowHeading: false,
};

export default aboutManagerConfig;

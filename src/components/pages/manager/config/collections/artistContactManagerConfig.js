/**
 * ===========================================================================
 * WHAT   Artist contact — manager list config
 * USED   /manager/artist-contact  ->  <EditorialManagerList config={...} />  (List only)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveArtistContactExport } from "@/components/pages/manager/utils/artistContactExportUtils";

/**
 * Artist contact — manager list config (editorial list only; no cards).
 * Each entry is a contact block, not an image, so no cardView.
 */
export const artistContactManagerConfig = {
  key: "artist_contact",
  api: "/api/artist-contact",
  title: { en: "Artist Contacts", cn: "艺术家联系" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#7E6B4F",

  createHref: "/manager/artist-contact/create",
  editHref: (id) => `/manager/artist-contact/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveArtistContactExport(rows, isCn),

  languageField: "language",
  itemNoun: { en: "contact", cn: "条" },

  primaryField: "artist_name",
  metaFields: ["email", "phone"],
  bodyFields: ["address", "social_media"],
  coverField: null,
  links: [
    { field: "web_url", label: { en: "Website", cn: "网页" }, showHost: true },
  ],

  searchPlaceholder: {
    en: "Search name, email, phone…",
    cn: "搜索姓名、邮箱、电话…",
  },
  searchFields: [
    "artist_name",
    "email",
    "phone",
    "address",
    "social_media",
    "web_url",
  ],

  filters: [
    {
      field: "artist_name",
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
        field: "artist_name",
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
    return String(a?.artist_name || "").localeCompare(String(b?.artist_name || ""));
  },

  emptyMessage: { en: "No artist contacts yet.", cn: "暂无艺术家联系。" },
  accordionOver: 10,
};

export default artistContactManagerConfig;

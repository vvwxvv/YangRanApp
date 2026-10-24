/**
 * ===========================================================================
 * WHAT   Video — manager list config
 * USED   /manager/video  ->  <EditorialManagerList config={...} />  (Cards + List)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveVideoExport } from "@/components/pages/manager/utils/videoExportUtils";

/**
 * Video — manager list config (Cards + editorial List).
 * Videos have no cover image: cards fall back to the video-only accordion,
 * and the editorial row shows the video link instead of a still.
 */
const VIDEO_FIELDS = [
  { key: 'video_url', label: 'Video URL / 视频链接' },
  { key: 'tag_en', label: 'Tag (EN)' },
  { key: 'tag_cn', label: 'Tag (CN) / 标签' },
  { key: 'type', label: 'Type / 类型' },
  { key: 'caption_en', label: 'Caption (EN)' },
  { key: 'caption_cn', label: 'Caption (CN) / 说明' },
  { key: 'tag_source', label: 'Tag Source / 标签来源' },
  { key: 'order', label: 'Order / 顺序' },
  { key: 'updatedAt', label: 'Updated At / 更新时间' },
];

export const videoManagerConfig = {
  key: "video",
  api: "/api/video",
  title: { en: "Video", cn: "视频" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#6B4C9A",

  createHref: "/manager/video/create",
  batchEditHref: "/manager/video/batch_edit",
  editHref: (id) => `/manager/video/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveVideoExport(rows, isCn),

  languageField: null,

  itemNoun: { en: "video", cn: "个视频" },

  primaryField: { en: "tag_en", cn: "tag_cn" },
  subtitleField: { en: "caption_en", cn: "caption_cn" },
  metaFields: ["type", "tag_source"],
  coverField: null,
  captionFields: ["type", "tag_source"],
  links: [{ field: "video_url", label: { en: "Video", cn: "视频" }, showHost: true }],

  searchPlaceholder: {
    en: "Search tag, caption, type…",
    cn: "搜索标签、说明、类型…",
  },
  searchFields: ["tag_en", "tag_cn", "caption_en", "caption_cn", "type", "tag_source"],

  filters: [
    {
      field: "type",
      allLabel: { en: "Type: All", cn: "类型：全部" },
      ariaLabel: { en: "Filter by type", cn: "按类型筛选" },
      width: 90,
    },
    {
      field: "tag_source",
      allLabel: { en: "Source: All", cn: "来源：全部" },
      ariaLabel: { en: "Filter by source", cn: "按来源筛选" },
      width: 90,
    },
  ],

  groupBy: {
    default: "letter",
    caption: { en: "Group", cn: "分组" },
    allLabel: { en: "None", cn: "不分组" },
    options: [
      {
        value: "letter",
        kind: "letter",
        // Letter = first letter of the tag, not of the localized caption.
        field: { en: "tag_en", cn: "tag_cn" },
        label: { en: "A–Z", cn: "字母 A–Z" },
      },
      { value: "type", field: "type", format: "type", label: { en: "Type", cn: "类型" } },
      { value: "tag_source", field: "tag_source", label: { en: "Source", cn: "来源" } },
    ],
  },

  sortRows: (a, b) => {
    const ao = Number(a?.order);
    const bo = Number(b?.order);
    const aHas = Number.isFinite(ao) && String(a?.order ?? "").trim() !== "";
    const bHas = Number.isFinite(bo) && String(b?.order ?? "").trim() !== "";
    if (aHas && bHas && ao !== bo) return ao - bo;
    if (aHas !== bHas) return aHas ? -1 : 1;
    return String(a?.tag_en || "").localeCompare(String(b?.tag_en || ""));
  },

  cardView: {
    defaultMode: "grid",
    cardWidth: 340,
    fields: VIDEO_FIELDS,
    titleField: { en: "tag_en", cn: "tag_cn" },
    imageField: null,
    videoField: "video_url",
    deleteFields: ["tag_en", "type", "tag_source"],
    cardProps: {
      summaryFieldCount: 3,
    },
  },

  emptyMessage: { en: "No videos yet.", cn: "暂无视频。" },
  accordionOver: 10,
};

export default videoManagerConfig;

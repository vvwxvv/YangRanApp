/**
 * ===========================================================================
 * WHAT   Exhibition — manager list config
 * USED   /manager/exhibition  ->  <EditorialManagerList config={...} />  (Cards + List)
 * LOGIC  A page passes this object to the shared layout. The layout reads
 *        fields, then filters, grouping, rows/cards. Filters are derived from
 *        the filter list in this file (or a *_FILTER_FIELDS block). Nothing
 *        else imports this file.
 * EDIT   The *_FIELDS / *_FILTER_FIELDS / ROUTES blocks at the top, then the
 *        view options below.
 * ===========================================================================
 */
import { createComprehensiveExhibitionExport } from "@/components/pages/manager/utils/exhibitionExportUtils";
import { FIXED_SIZE_PRESET } from "@/components/pages/manager/constants/cardDisplayPresets";

/**
 * Exhibition — manager list config (Cards + editorial List).
 * Every page owns its own filters / grouping / shortcuts; the shared layout
 * only renders what is declared here.
 */
const EXHIBITION_FIELDS = [
  { key: 'cover_img_url', label: 'Cover Image' },
  { key: 'title', label: 'Title / 标题' },
  { key: 'subtitle', label: 'Subtitle / 副标题' },
  { key: 'type', label: 'Type / 类型' },
  { key: 'date_start', label: 'Date Start / 开始日期' },
  { key: 'date_end', label: 'Date End / 结束日期' },
  { key: 'opening_date', label: 'Opening Date / 开幕日期' },
  { key: 'year', label: 'Year / 年份' },
  { key: 'venue', label: 'Venue / 场地' },
  { key: 'location', label: 'Location / 地点' },
  { key: 'curator', label: 'Curator / 策展人' },
  { key: 'organiser', label: 'Organiser / 主办方' },
  { key: 'participating_artists', label: 'Participating Artists / 参展艺术家' },
  { key: 'caption', label: 'Caption / 说明' },
  { key: 'description', label: 'Description / 描述' },
  { key: 'introduction', label: 'Introduction / 介绍', isArray: true },
  { key: 'press_release', label: 'Press Release / 新闻稿', isArray: true },
  // related_artwork —— 对象数组 [{ title, order, mark }]，不是字符串数组。
  // 用 isObjectArray 标记，subFields 声明每列（供表单渲染器识别）。
  {
    key: 'related_artwork',
    label: 'Related Artworks / 相关作品',
    isObjectArray: true,
    subFields: [
      { key: 'title', label: 'Title / 标题' },
      { key: 'order', label: 'Order / 排序' },
      { key: 'mark', label: 'Mark / 标记' },
    ],
  },
  { key: 'related_artist', label: 'Related Gallery Artists / 相关画廊艺术家', isArray: true },
  { key: 'web_url', label: 'Web URL / 网页链接' },
  { key: 'video_url', label: 'Video URL / 视频链接' },
  { key: 'language', label: 'Language / 语言' },
  { key: 'order', label: 'Order / 顺序' },
  { key: 'status', label: 'Status / 状态' },
  { key: 'updatedAt', label: 'Updated At / 更新时间' },
];

export const exhibitionManagerConfig = {
  key: "exhibition",
  api: "/api/exhibition",
  title: { en: "Exhibition", cn: "展览" },
  // Collection accent — the header chip uses this, so the page is
  // identifiable at a glance.
  accentColor: "#2F6F5E",

  createHref: "/manager/exhibition/create",
  batchEditHref: "/manager/exhibition/batch_edit",
  editHref: (id) => `/manager/exhibition/${id}/edit`,
  exportFn: (rows, isCn) => createComprehensiveExhibitionExport(rows, isCn),

  languageField: "language",
  languageMode: "lenient",
  itemNoun: { en: "exhibition", cn: "个展览" },

  primaryField: "title",
  metaFields: ["type", "year", "venue"],
  bodyField: "caption",
  coverField: "cover_img_url",
  captionFields: ["type", "year", "venue"],
  links: [
    { field: "web_url", label: { en: "Website", cn: "网页" }, showHost: true },
    { field: "video_url", label: { en: "Video", cn: "视频" } },
  ],
  related: [
    {
      field: "related_artist",
      label: { en: "Artists", cn: "艺术家" },
      max: 3,
    },
  ],

  searchPlaceholder: {
    en: "Search title, venue, curator, year…",
    cn: "搜索标题、场地、策展人、年份…",
  },
  searchFields: [
    "title",
    "subtitle",
    "type",
    "year",
    "venue",
    "location",
    "curator",
    "organiser",
    "caption",
    "status",
  ],

  filters: [
    {
      field: "type",
      allLabel: { en: "Type: All", cn: "类型：全部" },
      ariaLabel: { en: "Filter by type", cn: "按类型筛选" },
      width: 90,
    },
    {
      field: "year",
      allLabel: { en: "Year: All", cn: "年份：全部" },
      ariaLabel: { en: "Filter by year", cn: "按年份筛选" },
      width: 60,
      sort: "numericDesc",
    },
  ],

  groupBy: {
    default: "year",
    caption: { en: "Group", cn: "分组" },
    allLabel: { en: "None", cn: "不分组" },
    options: [
      { value: "year", field: "year", sort: "numericDesc", label: { en: "Year", cn: "年份" } },
      { value: "letter", kind: "letter", field: "title", label: { en: "A–Z", cn: "字母 A–Z" } },
      { value: "type", field: "type", format: "type", label: { en: "Type", cn: "类型" } },
      { value: "venue", field: "venue", label: { en: "Venue", cn: "场地" } },
    ],
  },

  sortRows: (a, b) => {
    const ay = Number(a?.year) || 0;
    const by = Number(b?.year) || 0;
    if (ay !== by) return by - ay;
    const ad = String(a?.date_start || "");
    const bd = String(b?.date_start || "");
    if (ad !== bd) return bd.localeCompare(ad);
    return String(a?.title || "").localeCompare(String(b?.title || ""));
  },

  cardView: {
    defaultMode: "grid",
    cardWidth: 340,
    fields: EXHIBITION_FIELDS,
    titleField: "title",
    imageField: "cover_img_url",
    videoField: "video_url",
    deleteFields: ["title", "type", "year", "venue", "status"],
    cardProps: {
      ...FIXED_SIZE_PRESET,
      aspectRatio: "4 / 3",
      summaryFieldCount: 3,
    },
  },

  extraLinks: [
    { href: "/manager/exhibition/reorder", label: { en: "Reorder", cn: "排序" } },
  ],

  emptyMessage: { en: "No exhibitions yet.", cn: "暂无展览。" },
  accordionOver: 10,
};

export default exhibitionManagerConfig;

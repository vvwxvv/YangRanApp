/**
 * ----------------------------------------------------------------------------
 * Series Export Utilities – Fully compatible with Prisma Series model
 * ----------------------------------------------------------------------------
 * Model fields (Prisma):
 *   id, cover_img_url, artist, title, type, medium, year, caption,
 *   credits, special_thanks, introduction[], order, mark, tag[],
 *   language, updatedAt
 * ----------------------------------------------------------------------------
 */

// ============ 统一标签配置 ============
const FIELD_LABELS = {
  en: {
    id: "ID",
    cover_img_url: "Cover Image URL",
    artist: "Artist",
    title: "Title",
    type: "Type",
    medium: "Medium",
    year: "Year",
    caption: "Caption",
    credits: "Credits",
    special_thanks: "Special Thanks",
    introduction: "Introduction",
    order: "Order",
    mark: "Mark",                       //  NEW
    tag: "Tag",                          //  NEW
    language: "Language",
    updatedAt: "Updated At",
  },
  zh: {
    id: "ID",
    cover_img_url: "封面图片",
    artist: "艺术家",
    title: "标题",
    type: "类型",
    medium: "媒介",
    year: "年份",
    caption: "说明",
    credits: "鸣谢",
    special_thanks: "特别感谢",
    introduction: "引言",
    order: "排序",
    mark: "标记",                        //  NEW
    tag: "标签",                          //  NEW
    language: "语言",
    updatedAt: "更新时间",
  },
};

// ============ 工具函数 ============
function getLabels(isCn) {
  return isCn ? FIELD_LABELS.zh : FIELD_LABELS.en;
}

function formatArrayField(value) {
  return Array.isArray(value) ? value.join("; ") : "";
}

function formatDateTime(value) {
  if (!value) return "";
  try {
    const date = new Date(value);
    return date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0];
  } catch {
    return "";
  }
}

// Coerce string / array → array (used by tag).
function toArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    return v.split(/[;,]\s*/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

// ============ 1. 综合导出（所有字段） ============
export function createComprehensiveSeriesExport(seriesData, isCn = false) {
  if (!Array.isArray(seriesData)) return [];
  const labels = getLabels(isCn);

  return seriesData.map((item) => ({
    [labels.id]: item.id || "",
    [labels.cover_img_url]: item.cover_img_url || "",
    [labels.artist]: item.artist || "",
    [labels.title]: item.title || "",
    [labels.type]: item.type || "",
    [labels.medium]: item.medium || "",
    [labels.year]: item.year || "",
    [labels.caption]: item.caption || "",
    [labels.credits]: item.credits || "",
    [labels.special_thanks]: item.special_thanks || "",
    [labels.introduction]: formatArrayField(item.introduction),
    [labels.order]: item.order || "",
    [labels.mark]: item.mark || "",                          //  NEW
    [labels.tag]: formatArrayField(item.tag),                //  NEW
    [labels.language]: item.language || "",
    [labels.updatedAt]: formatDateTime(item.updatedAt),
  }));
}

// ============ 2. CSV 格式化（使用统一标签） ============
export function formatSeriesDataForCSV(seriesData, isCn = false) {
  if (!Array.isArray(seriesData) || seriesData.length === 0) return [];
  const labels = getLabels(isCn);

  return seriesData.map((entry) => {
    const formatted = {};
    for (const [key, label] of Object.entries(labels)) {
      let value = entry[key];
      if (key === "introduction" || key === "tag") {         //  tag added
        value = formatArrayField(value);
      } else if (key === "updatedAt") {
        value = formatDateTime(value);
      } else {
        value = value ?? "";
      }
      formatted[label] = value;
    }
    return formatted;
  });
}

// ============ 3. 简化导出（仅核心字段） ============
export function createSimplifiedSeriesExport(seriesData, isCn = false) {
  if (!Array.isArray(seriesData)) return [];
  const labels = getLabels(isCn);
  const essential = ["title", "artist", "year", "cover_img_url", "type"];

  return seriesData.map((entry) => {
    const simplified = {};
    for (const key of essential) {
      simplified[labels[key]] = entry[key] ?? "";
    }
    return simplified;
  });
}

// ============ 4. 语言专用导出（不适用，但保留占位，实际返回综合导出） ============
export function createLanguageSpecificSeriesExport(seriesData, isCn = false) {
  return createComprehensiveSeriesExport(seriesData, isCn);
}

// ============ 5. 双语合并（与综合导出相同） ============
export function createBilingualCombinedSeriesExport(seriesData, isCn = false) {
  return createComprehensiveSeriesExport(seriesData, isCn);
}

// ============ 6. 媒体 URL 验证 ============
export function validateMediaUrls(seriesData) {
  return seriesData.map((entry) => ({
    ...entry,
    cover_img_valid:
      entry.cover_img_url &&
      (entry.cover_img_url.startsWith("http://") || entry.cover_img_url.startsWith("https://"))
        ? "Valid"
        : "Invalid",
  }));
}

// ============ 7. 详细导出（含验证状态） ============
export function createDetailedSeriesExport(seriesData, isCn = false) {
  if (!Array.isArray(seriesData)) return [];
  const validated = validateMediaUrls(seriesData);
  const labels = getLabels(isCn);

  const detailFields = [
    "artist",
    "title",
    "cover_img_url",
    "type",
    "medium",
    "year",
    "caption",
    "credits",
    "special_thanks",
    "order",
    "mark",                            //  NEW
    "tag",                              //  NEW
    "language",
    "updatedAt",
  ];

  return validated.map((entry) => {
    const detailed = {};
    for (const key of detailFields) {
      let value = entry[key];
      if (key === "updatedAt") {
        value = formatDateTime(value);
      } else if (key === "tag") {                 //  NEW
        value = formatArrayField(value);
      } else {
        value = value ?? "";
      }
      detailed[labels[key]] = value;
    }
    // 状态字段
    detailed[isCn ? "封面图片状态" : "Cover Image Status"] =
      entry.cover_img_valid === "Valid" ? (isCn ? "有效" : "Valid") : isCn ? "无效" : "Invalid";
    return detailed;
  });
}

// ============ 8. 统计数据 ============
export function getSeriesStatistics(seriesData, isCn = false) {
  if (!Array.isArray(seriesData) || seriesData.length === 0) return {};
  const validated = validateMediaUrls(seriesData);

  return {
    total: seriesData.length,
    validCoverUrls: validated.filter((a) => a.cover_img_valid === "Valid").length,
    invalidCoverUrls: validated.filter((a) => a.cover_img_valid === "Invalid").length,
    withTitle: validated.filter((a) => a.title).length,
    withArtist: validated.filter((a) => a.artist).length,
    withYear: validated.filter((a) => a.year).length,
    withType: validated.filter((a) => a.type).length,
    withIntroduction: validated.filter(
      (a) => a.introduction && a.introduction.length > 0
    ).length,
    withMark: validated.filter((a) => a.mark).length,                                    //  NEW
    withTag: validated.filter((a) => a.tag && a.tag.length > 0).length,                  //  NEW
    withCoverImage: validated.filter((a) => a.cover_img_url).length,
  };
}

// ============ 9. 统计导出为行数组 ============
export function createSeriesStatisticsExport(seriesData, isCn = false) {
  const stats = getSeriesStatistics(seriesData, isCn);
  if (!stats.total) return [];

  const rows = [
    { metric: isCn ? "总数" : "Total", value: stats.total },
    { metric: isCn ? "有效封面链接" : "Valid Cover URLs", value: stats.validCoverUrls },
    { metric: isCn ? "无效封面链接" : "Invalid Cover URLs", value: stats.invalidCoverUrls },
    { metric: isCn ? "包含标题" : "With Title", value: stats.withTitle },
    { metric: isCn ? "包含艺术家" : "With Artist", value: stats.withArtist },
    { metric: isCn ? "包含年份" : "With Year", value: stats.withYear },
    { metric: isCn ? "包含类型" : "With Type", value: stats.withType },
    { metric: isCn ? "包含引言" : "With Introduction", value: stats.withIntroduction },
    { metric: isCn ? "包含标记" : "With Mark", value: stats.withMark },                   //  NEW
    { metric: isCn ? "包含标签" : "With Tag", value: stats.withTag },                     //  NEW
    { metric: isCn ? "包含封面图片" : "With Cover Image", value: stats.withCoverImage },
  ];

  return rows.map((row) => ({
    [isCn ? "统计项" : "Metric"]: row.metric,
    [isCn ? "数值" : "Value"]: row.value.toString(),
  }));
}

// ============ 10. 文件名生成 ============
export function getSeriesExportFilename(isCn = false, exportType = "comprehensive") {
  const timestamp = new Date().toISOString().split("T")[0];
  const prefix = isCn ? "系列数据" : "series_data";
  const types = {
    comprehensive: isCn ? "_完整" : "_comprehensive",
    simplified: isCn ? "_简化" : "_simplified",
    language: isCn ? "_语言" : "_language",
    bilingual: isCn ? "_双语" : "_bilingual",
    detailed: isCn ? "_详细" : "_detailed",
    statistics: isCn ? "_统计" : "_statistics",
  };
  const suffix = types[exportType] || "";
  return `${prefix}${suffix}_${timestamp}`;
}

// ============ 11. 格式化辅助（保留原有接口风格） ============
export function formatSeriesTitle(title, _titleCn, isCn = false) {
  return title || "";
}

export function formatSeriesArtist(artist, _artistCn, isCn = false) {
  return artist || "";
}

export function isValidMediaUrl(url) {
  return !!(url && (url.startsWith("http://") || url.startsWith("https://")));
}

// ============ 12. 数据规范化 ============
export const normalizeSeriesRow = (row) => {
  let mongoId = row._id?.$oid || row._id || row.id;
  if (mongoId && typeof mongoId === "object") {
    mongoId = mongoId.$oid || JSON.stringify(mongoId);
  }

  return {
    id: mongoId ? String(mongoId) : `temp_${Date.now()}_${Math.random()}`,
    _id: mongoId,
    cover_img_url: row.cover_img_url || "",
    artist: row.artist || "",
    title: row.title || "",
    type: row.type || "",
    medium: row.medium || "",
    year: row.year || "",
    caption: row.caption || "",
    credits: row.credits || "",
    special_thanks: row.special_thanks || "",
    introduction: toArray(row.introduction),         //  use toArray for safety
    order: row.order || "",
    mark: row.mark || "",                            //  NEW
    tag: toArray(row.tag),                           //  NEW
    language: row.language || "",
    updatedAt: row.updatedAt || "",
    isNew: row.isNew || false,
  };
};
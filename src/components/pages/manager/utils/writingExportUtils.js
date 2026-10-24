import { getMarkValue } from "@/utils/mediaMarks";
/**
 * ----------------------------------------------------------------------------
 * Writing Export Utilities – Compatible with Prisma Writing model
 * ----------------------------------------------------------------------------
 * Model fields used:
 *   id, cover_img_url, author, title, subtitle, summary, keywords, category,
 *   type, year, paragraphs[], caption, status, mark, tag, language,
 *   createdAt, updatedAt
 * ----------------------------------------------------------------------------
 */

/**
 * Creates a comprehensive export with all fields from the Writing model.
 * @param {Array} writingData - Array of writing objects (as per Prisma model)
 * @param {boolean} isCn - If true, uses Chinese column labels; otherwise English
 * @returns {Array} Formatted data for CSV/export
 */
export function createComprehensiveWritingExport(writingData, isCn) {
  if (!Array.isArray(writingData)) return [];

  return writingData.map((item) => ({
    ID: item.id || "",
    Author: item.author || "",
    Title: item.title || "",
    Subtitle: item.subtitle || "",
    Summary: item.summary || "",
    Keywords: item.keywords || "",
    Category: item.category || "",
    Type: item.type || "",
    Year: item.year || "",
    Paragraphs: (item.paragraphs || []).join("; "),
    Caption: item.caption || "",
    Status: item.status || "",
    Mark: getMarkValue(item) || "",
    Tag: item.tag || "",
    Language: item.language || "",
    "Cover Image URL": item.cover_img_url || "",
    Created: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString(isCn ? "zh-CN" : "en-US")
      : "",
    "Last Updated": item.updatedAt
      ? new Date(item.updatedAt).toLocaleDateString(isCn ? "zh-CN" : "en-US")
      : "",
  }));
}

/**
 * Formats Writing data for CSV export with all fields, using dynamic column headers.
 * @param {Array} writingData - Array of writing objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Formatted data
 */
export function formatWritingDataForCSV(writingData, isCn = false) {
  if (!Array.isArray(writingData) || writingData.length === 0) return [];

  const fieldMappings = {
    id: isCn ? "ID" : "ID",
    cover_img_url: isCn ? "封面图片" : "Cover Image URL",
    author: isCn ? "作者" : "Author",
    title: isCn ? "标题" : "Title",
    subtitle: isCn ? "副标题" : "Subtitle",
    summary: isCn ? "摘要" : "Summary",
    keywords: isCn ? "关键词" : "Keywords",
    category: isCn ? "分类" : "Category",
    type: isCn ? "类型" : "Type",
    year: isCn ? "年份" : "Year",
    paragraphs: isCn ? "段落" : "Paragraphs",
    caption: isCn ? "说明" : "Caption",
    status: isCn ? "状态" : "Status",
    mark: isCn ? "标记" : "Mark",
    tag: isCn ? "标签" : "Tag",
    language: isCn ? "语言" : "Language",
    createdAt: isCn ? "创建时间" : "Created At",
    updatedAt: isCn ? "更新时间" : "Updated At",
  };

  const arrayFields = ["paragraphs"];
  const dateFields = ["createdAt", "updatedAt"];

  return writingData.map((writing) => {
    const formatted = {};
    for (const [key, label] of Object.entries(fieldMappings)) {
      let value = writing[key];
      if (arrayFields.includes(key) && Array.isArray(value)) {
        value = value.join(" | ");
      } else if (dateFields.includes(key) && value) {
        try {
          const date = new Date(value);
          value =
            date.toISOString().split("T")[0] +
            " " +
            date.toTimeString().split(" ")[0];
        } catch {
          value = "";
        }
      } else {
        value = value ?? "";
      }
      formatted[label] = value;
    }
    return formatted;
  });
}

/**
 * Normalize an incoming row (from CSV or external source) to match the Prisma Writing model.
 * Handles both plain objects and MongoDB `_id` wrappers.
 * @param {Object} row
 * @returns {Object}
 */
export const normalizeRow = (row) => {
  let mongoId = row._id?.$oid || row._id || row.id;
  if (mongoId && typeof mongoId === "object") {
    mongoId = mongoId.$oid || JSON.stringify(mongoId);
  }

  return {
    id: mongoId ? String(mongoId) : `temp_${Date.now()}_${Math.random()}`,
    _id: mongoId,
    cover_img_url: row.cover_img_url || "",
    author: row.author || "",
    title: row.title || "",
    subtitle: row.subtitle || "",
    summary: row.summary || "",
    keywords: row.keywords || "",
    category: row.category || "",
    type: row.type || "",
    year: row.year || "",
    paragraphs: Array.isArray(row.paragraphs) ? row.paragraphs : [],
    caption: row.caption || "",
    status: row.status || "",
    mark: getMarkValue(row) || "",
    tag: row.tag || "",
    language: row.language || "",
    createdAt: row.createdAt || "",
    updatedAt: row.updatedAt || "",
    isNew: row.isNew || false,
  };
};

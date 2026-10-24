import { getMarkValue } from "@/utils/mediaMarks";
/**
 * ----------------------------------------------------------------------------
 * About Export Utilities – Compatible with Prisma About model
 * ----------------------------------------------------------------------------
 * Model fields used:
 *   id, artist, portrait_image_url, caption, introduction[], pdf_url, web_url,
 *   language, order, mark, updatedAt
 * ----------------------------------------------------------------------------
 */

/**
 * Creates a comprehensive export with all fields from the About model.
 * @param {Array} aboutData - Array of About objects (as per Prisma model)
 * @param {boolean} isCn - If true, uses Chinese column labels; otherwise English
 * @returns {Array} Formatted data for CSV/export
 */
export function createComprehensiveAboutExport(aboutData, isCn) {
  if (!Array.isArray(aboutData)) return [];

  return aboutData.map((item) => ({
    ID: item.id || "",
    Artist: item.artist || "",
    "Portrait Image URL": item.portrait_image_url || "",
    Caption: item.caption || "",
    Introduction: (item.introduction || []).join("; "),
    "PDF URL": item.pdf_url || "",                 // 新增
    "Website URL": item.web_url || "",             // 新增
    Language: item.language || "",
    Order: item.order || "",
    Mark: getMarkValue(item) || "",
    "Last Updated": item.updatedAt
      ? new Date(item.updatedAt).toLocaleDateString(isCn ? "zh-CN" : "en-US")
      : "",
  }));
}

/**
 * Formats About data for CSV export with all fields.
 * @param {Array} aboutData - Array of About objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Formatted data
 */
export function formatAboutDataForCSV(aboutData, isCn = false) {
  if (!Array.isArray(aboutData) || aboutData.length === 0) return [];

  const fieldMappings = {
    id: isCn ? "ID" : "ID",
    artist: isCn ? "艺术家" : "Artist",
    portrait_image_url: isCn ? "肖像图片" : "Portrait Image URL",
    caption: isCn ? "说明" : "Caption",
    introduction: isCn ? "介绍" : "Introduction",
    pdf_url: isCn ? "PDF链接" : "PDF URL",         // 新增
    web_url: isCn ? "网页链接" : "Website URL",   // 新增
    language: isCn ? "语言" : "Language",
    order: isCn ? "排序" : "Order",
    mark: isCn ? "标记" : "Mark",
    updatedAt: isCn ? "更新时间" : "Updated At",
  };

  return aboutData.map((about) => {
    const formatted = {};
    for (const [key, label] of Object.entries(fieldMappings)) {
      let value = about[key];
      if (key === "introduction" && Array.isArray(value)) {
        value = value.join(" | ");
      } else if (key === "updatedAt" && value) {
        try {
          const date = new Date(value);
          value = date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0];
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
 * Simplified export – only essential fields.
 * (Still includes pdf_url and web_url for completeness.)
 * @param {Array} aboutData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createSimplifiedAboutExport(aboutData, isCn = false) {
  if (!Array.isArray(aboutData)) return [];

  const essentialFields = {
    artist: isCn ? "艺术家" : "Artist",
    portrait_image_url: isCn ? "肖像图片" : "Portrait Image URL",
    pdf_url: isCn ? "PDF链接" : "PDF URL",         // 新增
    web_url: isCn ? "网页链接" : "Website URL",   // 新增
    language: isCn ? "语言" : "Language",
  };

  return aboutData.map((about) => {
    const simplified = {};
    for (const [key, label] of Object.entries(essentialFields)) {
      simplified[label] = about[key] ?? "";
    }
    return simplified;
  });
}

/**
 * Language‑specific export – uses the `language` field.
 * (Caller should filter by language beforehand; this only formats.)
 * @param {Array} aboutData - Already filtered by language if needed
 * @param {boolean} isCn - Only affects column labels
 * @returns {Array}
 */
export function createLanguageSpecificAboutExport(aboutData, isCn = false) {
  if (!Array.isArray(aboutData)) return [];

  const fields = isCn
    ? {
        artist: "艺术家",
        caption: "说明",
        introduction: "介绍",
        portrait_image_url: "肖像图片",
        pdf_url: "PDF链接",      // 新增
        web_url: "网页链接",    // 新增
      }
    : {
        artist: "Artist",
        caption: "Caption",
        introduction: "Introduction",
        portrait_image_url: "Portrait Image URL",
        pdf_url: "PDF URL",      // 新增
        web_url: "Website URL",  // 新增
      };

  return aboutData.map((about) => {
    const result = {};
    for (const [key, label] of Object.entries(fields)) {
      let value = about[key];
      if (key === "introduction" && Array.isArray(value)) {
        value = value.join(" | ");
      } else {
        value = value ?? "";
      }
      result[label] = value;
    }
    return result;
  });
}

/**
 * Validates portrait image URL.
 * @param {Array} aboutData
 * @returns {Array} Original data plus validation flag
 */
export function validatePortraitUrl(aboutData) {
  return aboutData.map((about) => ({
    ...about,
    portrait_url_valid:
      about.portrait_image_url &&
      (about.portrait_image_url.startsWith("http://") || about.portrait_image_url.startsWith("https://"))
        ? "Valid"
        : "Invalid",
  }));
}

/**
 * Detailed export with URL validation and new fields.
 * @param {Array} aboutData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createDetailedAboutExport(aboutData, isCn = false) {
  if (!Array.isArray(aboutData)) return [];
  const validated = validatePortraitUrl(aboutData);

  const fieldMappings = {
    artist: isCn ? "艺术家" : "Artist",
    portrait_image_url: isCn ? "肖像图片" : "Portrait Image URL",
    portrait_url_valid: isCn ? "图片状态" : "Image Status",
    caption: isCn ? "说明" : "Caption",
    introduction: isCn ? "介绍" : "Introduction",
    pdf_url: isCn ? "PDF链接" : "PDF URL",         // 新增
    web_url: isCn ? "网页链接" : "Website URL",   // 新增
    language: isCn ? "语言" : "Language",
    order: isCn ? "排序" : "Order",
    mark: isCn ? "标记" : "Mark",
    updatedAt: isCn ? "更新时间" : "Updated At",
  };

  return validated.map((about) => {
    const detailed = {};
    for (const [key, label] of Object.entries(fieldMappings)) {
      let value = about[key];
      if (key === "portrait_url_valid") {
        value = value === "Valid" ? (isCn ? "有效" : "Valid") : isCn ? "无效" : "Invalid";
      } else if (key === "introduction" && Array.isArray(value)) {
        value = value.join(" | ");
      } else if (key === "updatedAt" && value) {
        try {
          const date = new Date(value);
          value = date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0];
        } catch {
          value = "";
        }
      } else {
        value = value ?? "";
      }
      detailed[label] = value;
    }
    return detailed;
  });
}

/**
 * Returns statistics based on the About model fields (including new URL fields).
 * @param {Array} aboutData
 * @param {boolean} isCn
 * @returns {Object}
 */
export function getAboutStatistics(aboutData, isCn = false) {
  if (!Array.isArray(aboutData) || aboutData.length === 0) return {};

  const validated = validatePortraitUrl(aboutData);

  return {
    total: aboutData.length,
    validPortraitUrls: validated.filter((a) => a.portrait_url_valid === "Valid").length,
    invalidPortraitUrls: validated.filter((a) => a.portrait_url_valid === "Invalid").length,
    withArtist: validated.filter((a) => a.artist).length,
    withCaption: validated.filter((a) => a.caption).length,
    withIntroduction: validated.filter((a) => a.introduction && a.introduction.length > 0).length,
    withPortrait: validated.filter((a) => a.portrait_image_url).length,
    withPdfUrl: validated.filter((a) => a.pdf_url).length,           // 新增
    withWebUrl: validated.filter((a) => a.web_url).length,           // 新增
    languages: [...new Set(validated.map((a) => a.language).filter(Boolean))],
  };
}

/**
 * Creates a statistics export as an array of rows.
 * @param {Array} aboutData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createAboutStatisticsExport(aboutData, isCn = false) {
  const stats = getAboutStatistics(aboutData, isCn);
  if (!stats.total) return [];

  const rows = [
    { metric: isCn ? "总数" : "Total", value: stats.total },
    { metric: isCn ? "有效肖像链接" : "Valid Portrait URLs", value: stats.validPortraitUrls },
    { metric: isCn ? "无效肖像链接" : "Invalid Portrait URLs", value: stats.invalidPortraitUrls },
    { metric: isCn ? "包含艺术家" : "With Artist", value: stats.withArtist },
    { metric: isCn ? "包含说明" : "With Caption", value: stats.withCaption },
    { metric: isCn ? "包含介绍" : "With Introduction", value: stats.withIntroduction },
    { metric: isCn ? "包含肖像图片" : "With Portrait Image", value: stats.withPortrait },
    { metric: isCn ? "包含PDF链接" : "With PDF URL", value: stats.withPdfUrl },      // 新增
    { metric: isCn ? "包含网页链接" : "With Website URL", value: stats.withWebUrl }, // 新增
    { metric: isCn ? "语言分布" : "Languages", value: stats.languages.join(", ") },
  ];

  return rows.map((row) => ({
    [isCn ? "统计项" : "Metric"]: row.metric,
    [isCn ? "数值" : "Value"]: row.value.toString(),
  }));
}

/**
 * Returns a timestamped filename for the export.
 * @param {boolean} isCn
 * @param {string} exportType
 * @returns {string}
 */
export function getAboutExportFilename(isCn = false, exportType = "comprehensive") {
  const timestamp = new Date().toISOString().split("T")[0];
  const prefix = isCn ? "关于数据" : "about_data";
  const types = {
    comprehensive: isCn ? "_完整" : "_comprehensive",
    simplified: isCn ? "_简化" : "_simplified",
    language: isCn ? "_语言" : "_language",
    detailed: isCn ? "_详细" : "_detailed",
    statistics: isCn ? "_统计" : "_statistics",
  };
  const suffix = types[exportType] || "";
  return `${prefix}${suffix}_${timestamp}`;
}

/**
 * Format introduction array into a readable string.
 * @param {Array} introduction
 * @param {boolean} isCn (unused, kept for consistency)
 * @returns {string}
 */
export function formatAboutIntroduction(introduction, isCn = false) {
  return Array.isArray(introduction) ? introduction.join("\n\n") : "";
}

/**
 * Validate a single portrait URL.
 * @param {string} url
 * @returns {boolean}
 */
export function isValidPortraitUrl(url) {
  return !!(url && (url.startsWith("http://") || url.startsWith("https://")));
}

/**
 * Normalize an incoming row (from CSV or external source) to match the Prisma About model.
 * Handles both plain objects and MongoDB `_id` wrappers.
 * @param {Object} row
 * @returns {Object}
 */
export const normalizeAboutRow = (row) => {
  let mongoId = row._id?.$oid || row._id || row.id;
  if (mongoId && typeof mongoId === "object") {
    mongoId = mongoId.$oid || JSON.stringify(mongoId);
  }

  return {
    id: mongoId ? String(mongoId) : `temp_${Date.now()}_${Math.random()}`,
    _id: mongoId,
    artist: row.artist || "",
    portrait_image_url: row.portrait_image_url || "",
    caption: row.caption || "",
    introduction: Array.isArray(row.introduction) ? row.introduction : [],
    pdf_url: row.pdf_url || "",                           // 新增
    web_url: row.web_url || "",                           // 新增
    language: row.language || "",
    order: row.order || "",
    mark: getMarkValue(row) || "",
    updatedAt: row.updatedAt || "",
    isNew: row.isNew || false,
  };
};
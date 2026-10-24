/**
 * ----------------------------------------------------------------------------
 * Resume Export Utilities – Fully compatible with Prisma Resume model
 * ----------------------------------------------------------------------------
 * Model fields (Prisma):
 *   id, artist, year, start_date, end_date, type, description,
 *   introduction, mark, language, updatedAt
 * ----------------------------------------------------------------------------
 */

// ============ 统一标签配置 ============
const FIELD_LABELS = {
    en: {
      id: "ID",
      artist: "Artist",
      year: "Year",
      start_date: "Start Date",
      end_date: "End Date",
      type: "Type",
      description: "Description",
      introduction: "Introduction",
      language: "Language",
      updatedAt: "Updated At",
    },
    zh: {
      id: "ID",
      artist: "艺术家",
      year: "年份",
      start_date: "开始日期",
      end_date: "结束日期",
      type: "类型",
      description: "描述",
      introduction: "引言",
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

  // ============ 1. 综合导出（所有字段） ============
  export function createComprehensiveResumeExport(resumeData, isCn = false) {
    if (!Array.isArray(resumeData)) return [];
    const labels = getLabels(isCn);

    return resumeData.map((item) => ({
      [labels.id]: item.id || "",
      [labels.artist]: item.artist || "",
      [labels.year]: item.year || "",
      [labels.start_date]: item.start_date || "",
      [labels.end_date]: item.end_date || "",
      [labels.type]: item.type || "",
      [labels.description]: item.description || "",
      [labels.introduction]: formatArrayField(item.introduction),
      [labels.language]: item.language || "",
      [labels.updatedAt]: formatDateTime(item.updatedAt),
    }));
  }

  // ============ 2. CSV 格式化（使用统一标签） ============
  export function formatResumeDataForCSV(resumeData, isCn = false) {
    if (!Array.isArray(resumeData) || resumeData.length === 0) return [];
    const labels = getLabels(isCn);

    return resumeData.map((entry) => {
      const formatted = {};
      for (const [key, label] of Object.entries(labels)) {
        let value = entry[key];
        if (key === "introduction") {
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
  export function createSimplifiedResumeExport(resumeData, isCn = false) {
    if (!Array.isArray(resumeData)) return [];
    const labels = getLabels(isCn);
    const essential = ["artist", "year", "type", "start_date", "end_date"];

    return resumeData.map((entry) => {
      const simplified = {};
      for (const key of essential) {
        simplified[labels[key]] = entry[key] ?? "";
      }
      return simplified;
    });
  }

  // ============ 4. 语言专用导出（不适用，但保留占位，实际返回综合导出） ============
  export function createLanguageSpecificResumeExport(resumeData, isCn = false) {
    return createComprehensiveResumeExport(resumeData, isCn);
  }

  // ============ 5. 双语合并（与综合导出相同） ============
  export function createBilingualCombinedResumeExport(resumeData, isCn = false) {
    return createComprehensiveResumeExport(resumeData, isCn);
  }

  // ============ 6. 详细导出 ============
  export function createDetailedResumeExport(resumeData, isCn = false) {
    if (!Array.isArray(resumeData)) return [];
    const labels = getLabels(isCn);

    const detailFields = [
      "artist",
      "year",
      "start_date",
      "end_date",
      "type",
      "description",
      "language",
      "updatedAt",
    ];

    return resumeData.map((entry) => {
      const detailed = {};
      for (const key of detailFields) {
        let value = entry[key];
        if (key === "updatedAt") {
          value = formatDateTime(value);
        } else {
          value = value ?? "";
        }
        detailed[labels[key]] = value;
      }
      return detailed;
    });
  }

  // ============ 7. 统计数据 ============
  export function getResumeStatistics(resumeData, isCn = false) {
    if (!Array.isArray(resumeData) || resumeData.length === 0) return {};

    return {
      total: resumeData.length,
      withArtist: resumeData.filter((a) => a.artist).length,
      withYear: resumeData.filter((a) => a.year).length,
      withType: resumeData.filter((a) => a.type).length,
      withDescription: resumeData.filter((a) => a.description).length,
      withIntroduction: resumeData.filter(
        (a) => a.introduction && a.introduction.length > 0
      ).length,
    };
  }

  // ============ 8. 统计导出为行数组 ============
  export function createResumeStatisticsExport(resumeData, isCn = false) {
    const stats = getResumeStatistics(resumeData, isCn);
    if (!stats.total) return [];

    const rows = [
      { metric: isCn ? "总数" : "Total", value: stats.total },
      { metric: isCn ? "包含艺术家" : "With Artist", value: stats.withArtist },
      { metric: isCn ? "包含年份" : "With Year", value: stats.withYear },
      { metric: isCn ? "包含类型" : "With Type", value: stats.withType },
      { metric: isCn ? "包含描述" : "With Description", value: stats.withDescription },
      { metric: isCn ? "包含引言" : "With Introduction", value: stats.withIntroduction },
    ];

    return rows.map((row) => ({
      [isCn ? "统计项" : "Metric"]: row.metric,
      [isCn ? "数值" : "Value"]: row.value.toString(),
    }));
  }

  // ============ 9. 文件名生成 ============
  export function getResumeExportFilename(isCn = false, exportType = "comprehensive") {
    const timestamp = new Date().toISOString().split("T")[0];
    const prefix = isCn ? "履历数据" : "resume_data";
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

  // ============ 10. 格式化辅助（保留原有接口风格） ============
  export function formatResumeArtist(artist, _artistCn, isCn = false) {
    return artist || "";
  }

  export function isValidMediaUrl(url) {
    return !!(url && (url.startsWith("http://") || url.startsWith("https://")));
  }

  // ============ 11. 数据规范化 ============
  export const normalizeResumeRow = (row) => {
    let mongoId = row._id?.$oid || row._id || row.id;
    if (mongoId && typeof mongoId === "object") {
      mongoId = mongoId.$oid || JSON.stringify(mongoId);
    }

    return {
      id: mongoId ? String(mongoId) : `temp_${Date.now()}_${Math.random()}`,
      _id: mongoId,
      artist: row.artist || "",
      year: row.year || "",
      start_date: row.start_date || "",
      end_date: row.end_date || "",
      type: row.type || "",
      description: row.description || "",
      introduction: Array.isArray(row.introduction) ? row.introduction : [],
      language: row.language || "",
      updatedAt: row.updatedAt || "",
      isNew: row.isNew || false,
    };
  };

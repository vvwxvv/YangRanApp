/**
 * ----------------------------------------------------------------------------
 * Bibliography Export Utilities – Fully compatible with Prisma Bibliography model
 * ----------------------------------------------------------------------------
 * Model fields (Prisma):
 *   id, related_exhibition, title, subtitle, cover_img_url, author,
 *   type, year, date, published_at, pdf_url, web_url, video_url, order, updatedAt
 * ----------------------------------------------------------------------------
 */

// ============ 统一标签配置 ============
const FIELD_LABELS = {
    en: {
      id: "ID",
      title: "Title",
      subtitle: "Subtitle",
      cover_img_url: "Cover Image URL",
      author: "Author",
      type: "Type",
      year: "Year",
      date: "Date",
      published_at: "Published At",
      pdf_url: "PDF URL",
      web_url: "Website URL",
      video_url: "Video URL",
      related_exhibition: "Related Gallery/Exhibition",
      order: "Order",
      updatedAt: "Updated At",
    },
    zh: {
      id: "ID",
      title: "标题",
      subtitle: "副标题",
      cover_img_url: "封面图片",
      author: "作者",
      type: "类型",
      year: "年份",
      date: "日期",
      published_at: "出版时间",
      pdf_url: "PDF链接",
      web_url: "网页链接",
      video_url: "视频链接",
      related_exhibition: "关联画廊/展览",
      order: "排序",
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
  export function createComprehensiveBibliographyExport(bibliographyData, isCn = false) {
    if (!Array.isArray(bibliographyData)) return [];
    const labels = getLabels(isCn);
  
    return bibliographyData.map((item) => ({
      [labels.id]: item.id || "",
      [labels.title]: item.title || "",
      [labels.subtitle]: item.subtitle || "",
      [labels.cover_img_url]: item.cover_img_url || "",
      [labels.author]: item.author || "",
      [labels.type]: item.type || "",
      [labels.year]: item.year || "",
      [labels.date]: item.date || "",
      [labels.published_at]: item.published_at || "",
      [labels.pdf_url]: item.pdf_url || "",
      [labels.web_url]: item.web_url || "",
      [labels.video_url]: item.video_url || "",
      [labels.related_exhibition]: formatArrayField(item.related_exhibition),
      [labels.order]: item.order || "",
      [labels.updatedAt]: formatDateTime(item.updatedAt),
    }));
  }
  
  // ============ 2. CSV 格式化（使用统一标签） ============
  export function formatBibliographyDataForCSV(bibliographyData, isCn = false) {
    if (!Array.isArray(bibliographyData) || bibliographyData.length === 0) return [];
    const labels = getLabels(isCn);
  
    return bibliographyData.map((entry) => {
      const formatted = {};
      for (const [key, label] of Object.entries(labels)) {
        let value = entry[key];
        if (key === "related_exhibition") {
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
  export function createSimplifiedBibliographyExport(bibliographyData, isCn = false) {
    if (!Array.isArray(bibliographyData)) return [];
    const labels = getLabels(isCn);
    const essential = ["title", "author", "year", "cover_img_url", "type"];
  
    return bibliographyData.map((entry) => {
      const simplified = {};
      for (const key of essential) {
        simplified[labels[key]] = entry[key] ?? "";
      }
      return simplified;
    });
  }
  
  // ============ 4. 语言专用导出（不适用，但保留占位，实际返回综合导出） ============
  export function createLanguageSpecificBibliographyExport(bibliographyData, isCn = false) {
    // Bibliography 无 language 字段，因此与综合导出相同
    return createComprehensiveBibliographyExport(bibliographyData, isCn);
  }
  
  // ============ 5. 双语合并（与综合导出相同） ============
  export function createBilingualCombinedBibliographyExport(bibliographyData, isCn = false) {
    return createComprehensiveBibliographyExport(bibliographyData, isCn);
  }
  
  // ============ 6. 媒体 URL 验证 ============
  export function validateMediaUrls(bibliographyData) {
    return bibliographyData.map((entry) => ({
      ...entry,
      cover_img_valid:
        entry.cover_img_url &&
        (entry.cover_img_url.startsWith("http://") || entry.cover_img_url.startsWith("https://"))
          ? "Valid"
          : "Invalid",
      pdf_url_valid:
        entry.pdf_url &&
        (entry.pdf_url.startsWith("http://") || entry.pdf_url.startsWith("https://"))
          ? "Valid"
          : "Invalid",
      web_url_valid:
        entry.web_url &&
        (entry.web_url.startsWith("http://") || entry.web_url.startsWith("https://"))
          ? "Valid"
          : "Invalid",
      video_url_valid:
        entry.video_url &&
        (entry.video_url.startsWith("http://") || entry.video_url.startsWith("https://"))
          ? "Valid"
          : "Invalid",
    }));
  }
  
  // ============ 7. 详细导出（含验证状态） ============
  export function createDetailedBibliographyExport(bibliographyData, isCn = false) {
    if (!Array.isArray(bibliographyData)) return [];
    const validated = validateMediaUrls(bibliographyData);
    const labels = getLabels(isCn);
  
    const detailFields = [
      "title",
      "author",
      "cover_img_url",
      "pdf_url",
      "web_url",
      "video_url",
      "type",
      "year",
      "date",
      "published_at",
      "order",
      "updatedAt",
    ];
  
    return validated.map((entry) => {
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
      // 状态字段
      detailed[isCn ? "封面图片状态" : "Cover Image Status"] =
        entry.cover_img_valid === "Valid" ? (isCn ? "有效" : "Valid") : isCn ? "无效" : "Invalid";
      detailed[isCn ? "PDF链接状态" : "PDF URL Status"] =
        entry.pdf_url_valid === "Valid" ? (isCn ? "有效" : "Valid") : isCn ? "无效" : "Invalid";
      detailed[isCn ? "网页链接状态" : "Web URL Status"] =
        entry.web_url_valid === "Valid" ? (isCn ? "有效" : "Valid") : isCn ? "无效" : "Invalid";
      detailed[isCn ? "视频链接状态" : "Video URL Status"] =
        entry.video_url_valid === "Valid" ? (isCn ? "有效" : "Valid") : isCn ? "无效" : "Invalid";
      return detailed;
    });
  }
  
  // ============ 8. 统计数据 ============
  export function getBibliographyStatistics(bibliographyData, isCn = false) {
    if (!Array.isArray(bibliographyData) || bibliographyData.length === 0) return {};
    const validated = validateMediaUrls(bibliographyData);
  
    return {
      total: bibliographyData.length,
      validCoverUrls: validated.filter((a) => a.cover_img_valid === "Valid").length,
      invalidCoverUrls: validated.filter((a) => a.cover_img_valid === "Invalid").length,
      validPdfUrls: validated.filter((a) => a.pdf_url_valid === "Valid").length,
      invalidPdfUrls: validated.filter((a) => a.pdf_url_valid === "Invalid").length,
      validWebUrls: validated.filter((a) => a.web_url_valid === "Valid").length,
      invalidWebUrls: validated.filter((a) => a.web_url_valid === "Invalid").length,
      validVideoUrls: validated.filter((a) => a.video_url_valid === "Valid").length,
      invalidVideoUrls: validated.filter((a) => a.video_url_valid === "Invalid").length,
      withTitle: validated.filter((a) => a.title).length,
      withAuthor: validated.filter((a) => a.author).length,
      withYear: validated.filter((a) => a.year).length,
      withType: validated.filter((a) => a.type).length,
      withRelatedGallery: validated.filter(
        (a) => a.related_exhibition && a.related_exhibition.length > 0
      ).length,
      withCoverImage: validated.filter((a) => a.cover_img_url).length,
      withPdf: validated.filter((a) => a.pdf_url).length,
      withWeb: validated.filter((a) => a.web_url).length,
      withVideo: validated.filter((a) => a.video_url).length,
    };
  }
  
  // ============ 9. 统计导出为行数组 ============
  export function createBibliographyStatisticsExport(bibliographyData, isCn = false) {
    const stats = getBibliographyStatistics(bibliographyData, isCn);
    if (!stats.total) return [];
  
    const rows = [
      { metric: isCn ? "总数" : "Total", value: stats.total },
      { metric: isCn ? "有效封面链接" : "Valid Cover URLs", value: stats.validCoverUrls },
      { metric: isCn ? "无效封面链接" : "Invalid Cover URLs", value: stats.invalidCoverUrls },
      { metric: isCn ? "有效PDF链接" : "Valid PDF URLs", value: stats.validPdfUrls },
      { metric: isCn ? "无效PDF链接" : "Invalid PDF URLs", value: stats.invalidPdfUrls },
      { metric: isCn ? "有效网页链接" : "Valid Web URLs", value: stats.validWebUrls },
      { metric: isCn ? "无效网页链接" : "Invalid Web URLs", value: stats.invalidWebUrls },
      { metric: isCn ? "有效视频链接" : "Valid Video URLs", value: stats.validVideoUrls },
      { metric: isCn ? "无效视频链接" : "Invalid Video URLs", value: stats.invalidVideoUrls },
      { metric: isCn ? "包含标题" : "With Title", value: stats.withTitle },
      { metric: isCn ? "包含作者" : "With Author", value: stats.withAuthor },
      { metric: isCn ? "包含年份" : "With Year", value: stats.withYear },
      { metric: isCn ? "包含类型" : "With Type", value: stats.withType },
      { metric: isCn ? "包含关联画廊/展览" : "With Related Gallery/Exhibition", value: stats.withRelatedGallery },
      { metric: isCn ? "包含封面图片" : "With Cover Image", value: stats.withCoverImage },
      { metric: isCn ? "包含PDF" : "With PDF", value: stats.withPdf },
      { metric: isCn ? "包含网页" : "With Web", value: stats.withWeb },
      { metric: isCn ? "包含视频" : "With Video", value: stats.withVideo },
    ];
  
    return rows.map((row) => ({
      [isCn ? "统计项" : "Metric"]: row.metric,
      [isCn ? "数值" : "Value"]: row.value.toString(),
    }));
  }
  
  // ============ 10. 文件名生成 ============
  export function getBibliographyExportFilename(isCn = false, exportType = "comprehensive") {
    const timestamp = new Date().toISOString().split("T")[0];
    const prefix = isCn ? "书目数据" : "bibliography_data";
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
  export function formatBibliographyTitle(title, _titleCn, isCn = false) {
    return title || "";
  }
  
  export function formatBibliographyAuthor(author, _authorCn, isCn = false) {
    return author || "";
  }
  
  // 无 introduction，提供空实现或返回 subtitle
  export function formatBibliographySubtitle(subtitle, isCn = false) {
    return subtitle || "";
  }
  
  export function isValidMediaUrl(url) {
    return !!(url && (url.startsWith("http://") || url.startsWith("https://")));
  }
  
  // ============ 12. 数据规范化（含新字段） ============
  export const normalizeBibliographyRow = (row) => {
    let mongoId = row._id?.$oid || row._id || row.id;
    if (mongoId && typeof mongoId === "object") {
      mongoId = mongoId.$oid || JSON.stringify(mongoId);
    }
  
    return {
      id: mongoId ? String(mongoId) : `temp_${Date.now()}_${Math.random()}`,
      _id: mongoId,
      title: row.title || "",
      subtitle: row.subtitle || "",
      cover_img_url: row.cover_img_url || "",
      author: row.author || "",
      type: row.type || "",
      year: row.year || "",
      date: row.date || "",
      published_at: row.published_at || "",
      pdf_url: row.pdf_url || "",
      web_url: row.web_url || "",
      video_url: row.video_url || "",
      related_exhibition: Array.isArray(row.related_exhibition)
        ? row.related_exhibition
        : [],
      order: row.order || "",
      updatedAt: row.updatedAt || "",
      isNew: row.isNew || false,
    };
  };
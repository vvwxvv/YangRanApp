import { getMarkValue } from "@/utils/mediaMarks";
/**
 * Web Export Utilities
 * Handles data formatting and export for Web entities
 * Matches Prisma Web model fields:
 * - web_url
 * - tag_en
 * - tag_cn
 * - type
 * - caption_en
 * - caption_cn
 * - mark
 * - tag_source
 * - order
 * - updatedAt
 */

/**
 * Formats web data for CSV/Excel export with proper field mapping
 * @param {Array} webs - Array of web objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Formatted data ready for export
 */
export function formatWebDataForCSV(webs, isCn = false) {
  if (!Array.isArray(webs) || webs.length === 0) {
    return [];
  }

  const fieldMappings = {
    web_url: isCn ? "网页链接" : "Web URL",
    tag_en: isCn ? "标签(英)" : "Tag (EN)",
    tag_cn: isCn ? "标签(中)" : "Tag (CN)",
    type: isCn ? "类型" : "Type",
    caption_en: isCn ? "说明(英)" : "Caption (EN)",
    caption_cn: isCn ? "说明(中)" : "Caption (CN)",
    mark: isCn ? "标记" : "Mark",
    tag_source: isCn ? "标签来源" : "Tag Source",
    order: isCn ? "顺序" : "Order",
    updatedAt: isCn ? "更新时间" : "Updated At",
  };

  return webs.map((web) => {
    const formattedWeb = {};

    Object.keys(fieldMappings).forEach((key) => {
      const label = fieldMappings[key];
      let value = web[key];

      switch (key) {
        case "updatedAt":
          if (value) {
            try {
              const date = new Date(value);
              value =
                date.toISOString().split("T")[0] +
                " " +
                date.toTimeString().split(" ")[0];
            } catch (e) {
              value = "";
            }
          } else {
            value = "";
          }
          break;

        default:
          value = value !== null && value !== undefined ? value : "";
      }

      formattedWeb[label] = value;
    });

    return formattedWeb;
  });
}

/**
 * Creates a comprehensive web export with all available fields
 * @param {Array} webs - Array of web objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Comprehensive formatted data
 */
export function createComprehensiveWebExport(webs, isCn = false) {
  return formatWebDataForCSV(webs, isCn);
}

/**
 * Normalize an incoming row (from CSV or external source) to match the Prisma Web model.
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
    web_url: row.web_url || "",
    tag_en: row.tag_en || "",
    tag_cn: row.tag_cn || "",
    type: row.type || "",
    caption_en: row.caption_en || "",
    caption_cn: row.caption_cn || "",
    mark: getMarkValue(row) || "",
    tag_source: row.tag_source || "",
    order: row.order || "",
    updatedAt: row.updatedAt || new Date().toISOString(),
    isNew: row.isNew || false,
  };
};

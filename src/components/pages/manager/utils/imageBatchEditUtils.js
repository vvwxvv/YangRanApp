
/**
 * Get field group definitions for Image data
 */
import { exportToCSV } from '@/components/pages/manager/utils/batchEditCommonUtils';
import { normalizeImageOrder } from '@/utils/mediaOrder';
export const getImageFieldGroups = (isCn) => {
  const groupKeyLabels = {
    core: isCn ? "核心信息" : "Core Info",
    content: isCn ? "内容" : "Content",
    classification: isCn ? "分类" : "Classification",
  };

  return {
    core: ["img_url", "tag_en", "tag_cn", "type"],
    content: ["caption_en", "caption_cn"],
    classification: ["tag_source", "order.artist_page_order", "order.exhibition_page_order", "order.art_fair_page_order", "order.rolling_img_order", "order.artist_detail_rolling_img_order"],
    groupKeyLabels,
  };
};

/**
 * Get all Image schema fields for column definitions
 */
export const getImageSchemaFields = () => [
  { name: "img_url", labelKey: "imgUrl", label: "Image URL" },
  { name: "tag_en", labelKey: "tagEn", label: "Tag (EN)" },
  { name: "tag_cn", labelKey: "tagCn", label: "Tag (CN)" },
  { name: "type", labelKey: "type", label: "Type" },
  { name: "caption_en", labelKey: "captionEn", label: "Caption (EN)" },
  { name: "caption_cn", labelKey: "captionCn", label: "Caption (CN)" },
  { name: "tag_source", labelKey: "tagSource", label: "Tag Source" },
  { name: "order.artist_page_order",     labelKey: "order.artist_page_order",     label: "Artist Page Order" },
  { name: "order.exhibition_page_order", labelKey: "order.exhibition_page_order", label: "Exhibition Page Order" },
  { name: "order.art_fair_page_order",   labelKey: "order.art_fair_page_order",   label: "Art Fair Page Order" },
  { name: "order.rolling_img_order",     labelKey: "order.rolling_img_order",     label: "Rolling Image Order" },
  { name: "order.artist_detail_rolling_img_order", labelKey: "order.artist_detail_rolling_img_order", label: "Artist Detail Rolling Image Order" },
];

/**
 * Get field type categories for Image data
 */
export const getImageFieldTypes = () => ({
  arrayFields: [],
  multilineFields: ["caption_en", "caption_cn"],
});

/**
 * Export Image data to CSV format
 */
export const exportImageToCSV = (data, filename) => {
  const headers = [
    "img_url",
    "tag_en",
    "tag_cn",
    "type",
    "caption_en",
    "caption_cn",
    "tag_source",
    "order.artist_page_order",
    "order.exhibition_page_order",
    "order.art_fair_page_order",
    "order.rolling_img_order",
    "order.artist_detail_rolling_img_order",
  ];

  // Flatten the JSON `order` into the four flat columns before export.
  const exportData = (Array.isArray(data) ? data : []).map((item) => {
    const o = normalizeImageOrder(item?.order);
    return {
      ...item,
      "order.artist_page_order": o.artist_page_order,
      "order.exhibition_page_order": o.exhibition_page_order,
      "order.art_fair_page_order": o.art_fair_page_order,
      "order.rolling_img_order": o.rolling_img_order,
      "order.artist_detail_rolling_img_order": o.artist_detail_rolling_img_order,
      order: undefined,
    };
  });

  const defaultFilename = `image_${new Date().toISOString().slice(0, 10)}.csv`;
  exportToCSV(exportData, headers, filename || defaultFilename);
};

/**
 * Filter data by search term
 */
export const filterBySearchTerm = (data, searchTerm) => {
  if (!searchTerm) return data;

  return data.filter((item) => {
    if (!item) return true;
    try {
      const searchLower = searchTerm.toLowerCase();
      return Object.values(item).some((value) => {
        if (Array.isArray(value)) {
          return value.some((v) =>
            String(v).toLowerCase().includes(searchLower)
          );
        }
        return value && String(value).toLowerCase().includes(searchLower);
      });
    } catch {
      return true;
    }
  });
};

/**
 * Sort data by column
 */
export const sortDataByColumn = (data, orderBy, order, columns) => {
  if (!orderBy) return data;

  return [...data].sort((a, b) => {
    const column = columns.find((col) => col.field === orderBy);
    const isNumeric = column?.fieldType === "number" || column?.type === "number";
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    if (isNumeric) {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
      return order === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      aValue = String(aValue || "").toLowerCase();
      bValue = String(bValue || "").toLowerCase();
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });
};

/**
 * Pluralize helper function
 */
export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};
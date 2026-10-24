/**
 * webBatchEditUtils.js
 * Utilities for Web model:
 *   id, web_url, tag_en, tag_cn, type, caption_en, caption_cn,
 *   mark, tag_source, order, updatedAt
 */

import { exportToCSV } from "@/components/pages/manager/utils/batchEditCommonUtils";

// ── normalizeRow ──────────────────────────────────────────────────────────
export function normalizeRow(raw = {}) {
  return {
    id: raw.id ?? raw._id ?? `temp_${Date.now()}_${Math.random()}`,
    _id: raw._id ?? raw.id ?? null,
    isNew: raw.isNew ?? false,

    web_url: raw.web_url ?? "",
    tag_en: raw.tag_en ?? "",
    tag_cn: raw.tag_cn ?? "",
    type: raw.type ?? "",
    caption_en: raw.caption_en ?? "",
    caption_cn: raw.caption_cn ?? "",
    tag_source: raw.tag_source ?? "",
    order: raw.order ?? "",
  };
}

// ── getWebFieldGroups ─────────────────────────────────────────────────────
export const getWebFieldGroups = (isCn) => {
  const groupKeyLabels = {
    core: isCn ? "核心信息" : "Core Info",
    content: isCn ? "内容" : "Content",
    classification: isCn ? "分类" : "Classification",
  };

  return {
    core: ["web_url", "tag_en", "tag_cn", "type"],
    content: ["caption_en", "caption_cn"],
    classification: ["tag_source", "order"],
    groupKeyLabels,
  };
};

// ── getWebSchemaFields ────────────────────────────────────────────────────
export const getWebSchemaFields = () => [
  { name: "web_url", labelKey: "webUrl", label: "Web URL" },
  { name: "tag_en", labelKey: "tagEn", label: "Tag (EN)" },
  { name: "tag_cn", labelKey: "tagCn", label: "Tag (CN)" },
  { name: "type", labelKey: "type", label: "Type" },
  { name: "caption_en", labelKey: "captionEn", label: "Caption (EN)" },
  { name: "caption_cn", labelKey: "captionCn", label: "Caption (CN)" },
  { name: "tag_source", labelKey: "tagSource", label: "Tag Source" },
  { name: "order", labelKey: "order", label: "Order" },
];

// ── getWebFieldTypes ──────────────────────────────────────────────────────
export const getWebFieldTypes = () => ({
  arrayFields: [],
  multilineFields: ["caption_en", "caption_cn"],
});

// ── exportWebToCSV ────────────────────────────────────────────────────────
export const exportWebToCSV = (data, filename) => {
  const headers = [
    "web_url",
    "tag_en",
    "tag_cn",
    "type",
    "caption_en",
    "caption_cn",
    "tag_source",
    "order",
  ];
  exportToCSV(data, headers, filename || `web_${new Date().toISOString().slice(0, 10)}.csv`);
};

// ── checkForChanges ───────────────────────────────────────────────────────
export const checkForChanges = (currentData, origData) => {
  const newItems = currentData.filter(
    (item) => item.isNew && (!item._id || item.id.startsWith("temp"))
  );
  if (newItems.length > 0) return true;

  const existingItems = currentData.filter(
    (item) => item._id && !item.id.startsWith("temp") && !item.isNew
  );
  const modifiedItems = existingItems.filter((item) => {
    const original = origData.find((orig) => orig._id === item._id);
    if (!original) return false;
    return Object.keys(item).some((key) => {
      if (key === "id" || key === "_id" || key === "isNew") return false;
      return JSON.stringify(item[key]) !== JSON.stringify(original[key]);
    });
  });

  return modifiedItems.length > 0;
};

// ── hasNewRowsInData ──────────────────────────────────────────────────────
export const hasNewRowsInData = (data) => {
  return data.some(
    (item) => item.isNew && (!item._id || item.id?.startsWith("temp"))
  );
};

// ── calculateChanges ──────────────────────────────────────────────────────
export const calculateChanges = (data, originalData) => {
  const newItems = data.filter(
    (item) => item.isNew && (!item._id || item.id.startsWith("temp"))
  );
  const existingItems = data.filter(
    (item) => item._id && !item.id.startsWith("temp") && !item.isNew
  );
  const modifiedItems = existingItems.filter((item) => {
    const original = originalData.find((orig) => orig._id === item._id);
    if (!original) return false;
    return Object.keys(item).some((key) => {
      if (key === "id" || key === "_id" || key === "isNew") return false;
      return JSON.stringify(item[key]) !== JSON.stringify(original[key]);
    });
  });
  return {
    newCount: newItems.length,
    modifiedCount: modifiedItems.length,
  };
};

// ── filterBySearchTerm ────────────────────────────────────────────────────
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

// ── sortDataByColumn ──────────────────────────────────────────────────────
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

// ── pluralize ─────────────────────────────────────────────────────────────
export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};

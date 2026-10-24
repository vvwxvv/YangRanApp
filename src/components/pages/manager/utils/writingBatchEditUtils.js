/**
 * writingBatchEditUtils.js
 * Utilities for Writing model:
 *   id, cover_img_url, author, title, subtitle, summary, keywords, category,
 *   type, year, paragraphs[], caption, status, mark, tag, language,
 *   createdAt, updatedAt
 */

import { exportToCSV } from "@/components/pages/manager/utils/batchEditCommonUtils";

// ── normalizeRow ──────────────────────────────────────────────────────────
export function normalizeRow(raw = {}) {
  return {
    id: raw.id ?? raw._id ?? `temp_${Date.now()}_${Math.random()}`,
    _id: raw._id ?? raw.id ?? null,
    isNew: raw.isNew ?? false,

    cover_img_url: raw.cover_img_url ?? "",
    author: raw.author ?? "",
    title: raw.title ?? "",
    subtitle: raw.subtitle ?? "",
    summary: raw.summary ?? "",
    keywords: raw.keywords ?? "",
    category: raw.category ?? "",
    type: raw.type ?? "",
    year: raw.year ?? "",

    paragraphs: Array.isArray(raw.paragraphs)
      ? raw.paragraphs
      : raw.paragraphs
        ? [raw.paragraphs]
        : [],

    caption: raw.caption ?? "",
    status: raw.status ?? "",
    tag: raw.tag ?? "",
    language: raw.language ?? "",
  };
}

// ── getWritingFieldGroups ─────────────────────────────────────────────────
export const getWritingFieldGroups = (isCn) => {
  const groupKeyLabels = {
    core: isCn ? "核心信息" : "Core Info",
    meta: isCn ? "元数据" : "Metadata",
    content: isCn ? "内容" : "Content",
    classification: isCn ? "分类" : "Classification",
  };

  return {
    core: ["author", "title", "subtitle", "cover_img_url"],
    meta: ["year", "category", "type", "keywords", "summary"],
    content: ["paragraphs", "caption"],
    classification: ["language", "status", "tag"],
    groupKeyLabels,
  };
};

// ── getWritingSchemaFields ────────────────────────────────────────────────
export const getWritingSchemaFields = () => [
  { name: "cover_img_url", labelKey: "coverImageUrl", label: "Cover Image URL" },
  { name: "author", labelKey: "author", label: "Author" },
  { name: "title", labelKey: "title", label: "Title" },
  { name: "subtitle", labelKey: "subtitle", label: "Subtitle" },
  { name: "summary", labelKey: "summary", label: "Summary" },
  { name: "keywords", labelKey: "keywords", label: "Keywords" },
  { name: "category", labelKey: "category", label: "Category" },
  { name: "type", labelKey: "type", label: "Type" },
  { name: "year", labelKey: "year", label: "Year" },
  { name: "paragraphs", labelKey: "paragraphs", label: "Paragraphs" },
  { name: "caption", labelKey: "caption", label: "Caption" },
  { name: "status", labelKey: "status", label: "Status" },
  { name: "tag", labelKey: "tag", label: "Tag" },
  { name: "language", labelKey: "language", label: "Language" },
];

// ── getWritingFieldTypes ──────────────────────────────────────────────────
export const getWritingFieldTypes = () => ({
  arrayFields: ["paragraphs"],
  multilineFields: ["caption", "summary"],
});

// ── exportWritingToCSV ────────────────────────────────────────────────────
export const exportWritingToCSV = (data, filename) => {
  const headers = [
    "cover_img_url",
    "author",
    "title",
    "subtitle",
    "summary",
    "keywords",
    "category",
    "type",
    "year",
    "paragraphs",
    "caption",
    "status",
    "tag",
    "language",
  ];
  exportToCSV(data, headers, filename || `writing_${new Date().toISOString().slice(0, 10)}.csv`);
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

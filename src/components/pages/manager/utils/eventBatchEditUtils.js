/**
 * Check if there are unsaved changes in the data
 */
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

/**
 * Check if there are new rows being edited
 */
export const hasNewRowsInData = (data) => {
  return data.some(
    (item) => item.isNew && (!item._id || item.id?.startsWith("temp"))
  );
};

/**
 * Calculate the number of new and modified items
 */
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

/**
 * Get field group definitions for Event data (aligned with Moodsea Prisma model)
 */
export const getEventFieldGroups = (isCn) => {
  const groupKeyLabels = {
    basic: isCn ? "基础信息" : "Basic Info",
    location: isCn ? "位置信息" : "Location",
    content: isCn ? "内容" : "Content",
    relations: isCn ? "关联关系" : "Relations",
    links: isCn ? "链接" : "Links",
    meta: isCn ? "元数据" : "Metadata",
  };

  return {
    basic: [
      "cover_img_url",
      "title",
      "subtitle",
      "year",
      "date_time",
      "type",
      "host",
      "support",
      "special_thanks",
    ],
    location: ["venue", "address"],
    content: ["caption", "introduction"],
    relations: ["related_artist"],
    links: ["web_url", "video_url"],
    meta: ["order", "language"],
    groupKeyLabels,
  };
};

/**
 * Get all Event schema fields for column definitions (full Moodsea Prisma model)
 */
export const getEventSchemaFields = () => [
  { name: "cover_img_url", labelKey: "coverImageUrl", label: "Cover Image URL" },
  { name: "title", labelKey: "title", label: "Title" },
  { name: "subtitle", labelKey: "subtitle", label: "Subtitle" },
  { name: "year", labelKey: "year", label: "Year" },
  { name: "date_time", labelKey: "date_time", label: "Date & Time" },
  { name: "type", labelKey: "type", label: "Type" },
  { name: "host", labelKey: "host", label: "Host" },
  { name: "support", labelKey: "support", label: "Support" },
  { name: "special_thanks", labelKey: "special_thanks", label: "Special Thanks" },
  { name: "venue", labelKey: "venue", label: "Venue" },
  { name: "address", labelKey: "address", label: "Address" },
  { name: "caption", labelKey: "caption", label: "Caption" },
  { name: "introduction", labelKey: "introduction", label: "Introduction" },
  { name: "related_artist", labelKey: "related_artist", label: "Related Artists" },
  { name: "web_url", labelKey: "web_url", label: "Web URL" },
  { name: "video_url", labelKey: "video_url", label: "Video URL" },
  { name: "order", labelKey: "order", label: "Order" },
  { name: "language", labelKey: "language", label: "Language" },
  { name: "updatedAt", labelKey: "updatedAt", label: "Last Updated" },
];

/**
 * Get field type categories for Event data
 */
export const getEventFieldTypes = () => ({
  arrayFields: ["introduction", "related_artist"],
  multilineFields: ["caption"],
});

/**
 * Export Event data to CSV format (aligned with Moodsea Prisma fields)
 */
export const exportEventToCSV = (data, filename) => {
  const headers = [
    "cover_img_url",
    "title",
    "subtitle",
    "year",
    "date_time",
    "type",
    "host",
    "support",
    "special_thanks",
    "venue",
    "address",
    "caption",
    "introduction",
    "related_artist",
    "web_url",
    "video_url",
    "order",
    "language",
    "updatedAt",
  ];

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((key) => {
          let val = row[key] || "";
          if (Array.isArray(val)) {
            val = val.join("; ");
          }
          val = val.toString().replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `event_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
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

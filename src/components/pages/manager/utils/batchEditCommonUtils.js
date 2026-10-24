/**
 * Common utility functions for all Batch Edit pages
 * Shared across Dream, Writing, Reading, and Web schemas
 */

/**
 * Check if there are unsaved changes in the data
 * @param {Array} currentData - Current state of data
 * @param {Array} origData - Original data from server
 * @returns {boolean} - True if there are unsaved changes
 */
export const checkForChanges = (currentData, origData) => {
  const newItems = currentData.filter(
    (item) => item.isNew && (!item._id || item.id?.startsWith("temp"))
  );
  if (newItems.length > 0) return true;

  const existingItems = currentData.filter(
    (item) => item._id && !item.id?.startsWith("temp") && !item.isNew
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
 * @param {Array} data - Data array to check
 * @returns {boolean} - True if there are new rows
 */
export const hasNewRowsInData = (data) => {
  return data.some(
    (item) => item.isNew && (!item._id || item.id?.startsWith("temp"))
  );
};

/**
 * Calculate the number of new and modified items
 * @param {Array} data - Current data
 * @param {Array} originalData - Original data from server
 * @returns {Object} - Object with newCount and modifiedCount
 */
export const calculateChanges = (data, originalData) => {
  const newItems = data.filter(
    (item) => item.isNew && (!item._id || item.id?.startsWith("temp"))
  );
  const existingItems = data.filter(
    (item) => item._id && !item.id?.startsWith("temp") && !item.isNew
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
 * Filter data by search term
 * @param {Array} data - Data to filter
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered data
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
 * @param {Array} data - Data to sort
 * @param {string} orderBy - Column to order by
 * @param {string} order - Order direction ('asc' or 'desc')
 * @param {Array} columns - Column definitions
 * @returns {Array} - Sorted data
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
 * @param {number} count - Count to check
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form
 * @returns {string} - Correct form based on count
 */
export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};

/**
 * Export data to CSV format
 * @param {Array} data - Data to export
 * @param {Array} headers - CSV headers
 * @param {string} filename - Filename for download
 */
export const exportToCSV = (data, headers, filename) => {
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
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
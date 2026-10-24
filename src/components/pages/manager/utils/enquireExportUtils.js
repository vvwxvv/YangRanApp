/**
 * ----------------------------------------------------------------------------
 * Enquire Export Utilities – Compatible with Prisma Enquire model
 * ----------------------------------------------------------------------------
 * Model fields used:
 *   id, name, email, message, createdAt, status
 * ----------------------------------------------------------------------------
 */

/**
 * Creates a comprehensive export with all fields from the Enquire model.
 * @param {Array} enquireData - Array of enquire objects (as per Prisma model)
 * @param {boolean} isCn - If true, uses Chinese column labels; otherwise English
 * @returns {Array} Formatted data for CSV/export
 */
export function createComprehensiveEnquireExport(enquireData, isCn) {
  if (!Array.isArray(enquireData)) return [];

  return enquireData.map((item) => ({
    ID: item.id || "",
    Name: item.name || "",
    Email: item.email || "",
    Message: item.message || "",
    Status: item.status || "",
    "Date Created": item.createdAt
      ? new Date(item.createdAt).toLocaleString(isCn ? "zh-CN" : "en-US")
      : "",
  }));
}

/**
 * Formats Enquire data for CSV export with all fields, using dynamic column headers.
 * @param {Array} enquireData - Array of enquire objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Formatted data
 */
export function formatEnquireDataForCSV(enquireData, isCn = false) {
  if (!Array.isArray(enquireData) || enquireData.length === 0) return [];

  const fieldMappings = {
    id: isCn ? "ID" : "ID",
    name: isCn ? "姓名" : "Name",
    email: isCn ? "邮箱" : "Email",
    message: isCn ? "留言" : "Message",
    status: isCn ? "状态" : "Status",
    createdAt: isCn ? "创建时间" : "Date Created",
  };

  return enquireData.map((enquiry) => {
    const formatted = {};
    for (const [key, label] of Object.entries(fieldMappings)) {
      let value = enquiry[key];
      if (key === "createdAt" && value) {
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
 * @param {Array} enquireData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createSimplifiedEnquireExport(enquireData, isCn = false) {
  if (!Array.isArray(enquireData)) return [];

  const essentialFields = {
    name: isCn ? "姓名" : "Name",
    email: isCn ? "邮箱" : "Email",
    status: isCn ? "状态" : "Status",
    createdAt: isCn ? "创建时间" : "Date Created",
  };

  return enquireData.map((enquiry) => {
    const simplified = {};
    for (const [key, label] of Object.entries(essentialFields)) {
      let value = enquiry[key];
      if (key === "createdAt" && value) {
        try {
          const date = new Date(value);
          value = date.toISOString().split("T")[0];
        } catch {
          value = "";
        }
      }
      simplified[label] = value ?? "";
    }
    return simplified;
  });
}

/**
 * Language‑specific export – format data based on locale labels.
 * @param {Array} enquireData
 * @param {boolean} isCn - Only affects column labels
 * @returns {Array}
 */
export function createLanguageSpecificEnquireExport(enquireData, isCn = false) {
  if (!Array.isArray(enquireData)) return [];

  const fields = isCn
    ? {
        name: "姓名",
        email: "邮箱",
        message: "留言",
        status: "状态",
        createdAt: "创建时间",
      }
    : {
        name: "Name",
        email: "Email",
        message: "Message",
        status: "Status",
        createdAt: "Date Created",
      };

  return enquireData.map((enquiry) => {
    const result = {};
    for (const [key, label] of Object.entries(fields)) {
      let value = enquiry[key];
      if (key === "createdAt" && value) {
        try {
          value = new Date(value).toLocaleDateString(isCn ? "zh-CN" : "en-US");
        } catch {
          value = "";
        }
      } else {
        value = value ?? "";
      }
      result[label] = value;
    }
    return result;
  });
}

/**
 * Bilingual combined export – keeps standard functionality.
 * @param {Array} enquireData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createBilingualCombinedEnquireExport(enquireData, isCn = false) {
  return createComprehensiveEnquireExport(enquireData, isCn);
}

/**
 * Validates email formats.
 * @param {Array} enquireData
 * @returns {Array} Original data plus validation flags
 */
export function validateEmails(enquireData) {
  return enquireData.map((enquiry) => ({
    ...enquiry,
    email_valid: isValidEmail(enquiry.email) ? "Valid" : "Invalid",
  }));
}

/**
 * Detailed export with Email validation status.
 * @param {Array} enquireData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createDetailedEnquireExport(enquireData, isCn = false) {
  if (!Array.isArray(enquireData)) return [];
  const validated = validateEmails(enquireData);

  const fieldMappings = {
    name: isCn ? "姓名" : "Name",
    email: isCn ? "邮箱" : "Email",
    email_valid: isCn ? "邮箱状态" : "Email Status",
    message: isCn ? "留言" : "Message",
    status: isCn ? "状态" : "Status",
    createdAt: isCn ? "创建时间" : "Date Created",
  };

  return validated.map((enquiry) => {
    const detailed = {};
    for (const [key, label] of Object.entries(fieldMappings)) {
      let value = enquiry[key];
      if (key === "email_valid") {
        value = value === "Valid" ? (isCn ? "有效" : "Valid") : isCn ? "无效" : "Invalid";
      } else if (key === "createdAt" && value) {
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
 * Returns statistics based on the Enquire model fields.
 * @param {Array} enquireData
 * @param {boolean} isCn
 * @returns {Object}
 */
export function getEnquireStatistics(enquireData, isCn = false) {
  if (!Array.isArray(enquireData) || enquireData.length === 0) return {};

  const validated = validateEmails(enquireData);

  return {
    total: enquireData.length,
    validEmails: validated.filter((e) => e.email_valid === "Valid").length,
    invalidEmails: validated.filter((e) => e.email_valid === "Invalid").length,
    statusPending: validated.filter((e) => e.status === "Pending").length,
    statusResponded: validated.filter((e) => e.status === "Responded").length,
    statusClosed: validated.filter((e) => e.status === "Closed").length,
    withMessage: validated.filter((e) => e.message).length,
  };
}

/**
 * Creates a statistics export as an array of rows.
 * @param {Array} enquireData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createEnquireStatisticsExport(enquireData, isCn = false) {
  const stats = getEnquireStatistics(enquireData, isCn);
  if (!stats.total) return [];

  const rows = [
    { metric: isCn ? "总数" : "Total Enquiries", value: stats.total },
    { metric: isCn ? "有效邮箱" : "Valid Emails", value: stats.validEmails },
    { metric: isCn ? "无效邮箱" : "Invalid Emails", value: stats.invalidEmails },
    { metric: isCn ? "待处理状态" : "Pending Status", value: stats.statusPending },
    { metric: isCn ? "已回复状态" : "Responded Status", value: stats.statusResponded },
    { metric: isCn ? "已关闭状态" : "Closed Status", value: stats.statusClosed },
    { metric: isCn ? "包含留言" : "Provided Message", value: stats.withMessage },
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
export function getEnquireExportFilename(isCn = false, exportType = "comprehensive") {
  const timestamp = new Date().toISOString().split("T")[0];
  const prefix = isCn ? "咨询数据" : "enquiry_data";
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

/**
 * Format Enquiry Name (helper function).
 */
export function formatEnquiryName(name, isCn = false) {
  return name || (isCn ? "未知" : "Unknown");
}

/**
 * Validate an email string.
 */
export function isValidEmail(email) {
  if (!email) return false;
  // Basic regex for email validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Normalize an incoming row (from CSV or external source) to match the Prisma model.
 * This version handles both plain objects and those with MongoDB `_id` wrappers.
 */
export const normalizeRow = (row) => {
  let mongoId = row._id?.$oid || row._id || row.id;
  if (mongoId && typeof mongoId === "object") {
    mongoId = mongoId.$oid || JSON.stringify(mongoId);
  }

  return {
    id: mongoId ? String(mongoId) : `temp_${Date.now()}_${Math.random()}`,
    _id: mongoId,
    name: row.name || "",
    email: row.email || "",
    message: row.message || "",
    createdAt: row.createdAt || "",
    status: row.status || "Pending",
    isNew: row.isNew || false,
  };
};
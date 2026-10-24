/**
 * ----------------------------------------------------------------------------
 * ArtistContact Export Utilities – Compatible with Prisma ArtistContact model
 * ----------------------------------------------------------------------------
 * Model fields used:
 *   id,artist_name, opening_time, email, phone, address[], social_media[],
 *   web_url, language, order, updatedAt
 * ----------------------------------------------------------------------------
 */

/**
 * Creates a comprehensive export with all fields from the ArtistContact model.
 * @param {Array} contactData - Array of ArtistContact objects (as per Prisma model)
 * @param {boolean} isCn - If true, uses Chinese column labels; otherwise English
 * @returns {Array} Formatted data for CSV/export
 */
export function createComprehensiveArtistContactExport(contactData, isCn) {
  if (!Array.isArray(contactData)) return [];

  return contactData.map((item) => ({
    ID: item.id || "",
    "Artist Name": item.artist_name || "",
    Email: item.email || "",
    Phone: item.phone || "",
    Address: (item.address || []).join("; "),
    "Social Media": (item.social_media || [])
      .map(s => `${s.platform}: ${s.account} (${s.url})`)
      .join(" | "),
    "Website URL": item.web_url || "",
    Language: item.language || "",
    Order: item.order || "",
    "Last Updated": item.updatedAt
      ? new Date(item.updatedAt).toLocaleDateString(isCn ? "zh-CN" : "en-US")
      : "",
  }));
}

/**
 * Formats ArtistContact data for CSV export with all fields.
 * @param {Array} contactData - Array of ArtistContact objects
 * @param {boolean} isCn - Whether to use Chinese labels
 * @returns {Array} Formatted data
 */
export function formatArtistContactDataForCSV(contactData, isCn = false) {
  if (!Array.isArray(contactData) || contactData.length === 0) return [];

  const fieldMappings = {
    id: isCn ? "ID" : "ID",
   artist_name: isCn ? "艺术家姓名" : "Artist Name",
    email: isCn ? "邮箱" : "Email",
    phone: isCn ? "电话" : "Phone",
    address: isCn ? "地址" : "Address",
    social_media: isCn ? "社交媒体" : "Social Media",
    web_url: isCn ? "网站链接" : "Website URL",
    language: isCn ? "语言" : "Language",
    order: isCn ? "排序" : "Order",
    updatedAt: isCn ? "更新时间" : "Updated At",
  };

  return contactData.map((contact) => {
    const formatted = {};
    for (const [key, label] of Object.entries(fieldMappings)) {
      let value = contact[key];
      if (key === "address" && Array.isArray(value)) {
        value = value.join("; ");
      } else if (key === "social_media" && Array.isArray(value)) {
        value = value.map(s => `${s.platform}: ${s.account} (${s.url})`).join(" | ");
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
 * @param {Array} contactData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createSimplifiedArtistContactExport(contactData, isCn = false) {
  if (!Array.isArray(contactData)) return [];

  const essentialFields = {
   artist_name: isCn ? "艺术家姓名" : "Artist Name",
    email: isCn ? "邮箱" : "Email",
    phone: isCn ? "电话" : "Phone",
    web_url: isCn ? "网站链接" : "Website URL",
    language: isCn ? "语言" : "Language",
  };

  return contactData.map((contact) => {
    const simplified = {};
    for (const [key, label] of Object.entries(essentialFields)) {
      simplified[label] = contact[key] ?? "";
    }
    return simplified;
  });
}

/**
 * Language‑specific export – uses the `language` field.
 * (Caller should filter by language beforehand; this only formats.)
 * @param {Array} contactData - Already filtered by language if needed
 * @param {boolean} isCn - Only affects column labels
 * @returns {Array}
 */
export function createLanguageSpecificArtistContactExport(contactData, isCn = false) {
  if (!Array.isArray(contactData)) return [];

  const fields = isCn
    ? {
       artist_name: "艺术家姓名",
        opening_time: "营业时间",
        email: "邮箱",
        phone: "电话",
        address: "地址",
        social_media: "社交媒体",
        web_url: "网站链接",
      }
    : {
       artist_name: "Artist Name",
        opening_time: "Opening Hours",
        email: "Email",
        phone: "Phone",
        address: "Address",
        social_media: "Social Media",
        web_url: "Website URL",
      };

  return contactData.map((contact) => {
    const result = {};
    for (const [key, label] of Object.entries(fields)) {
      let value = contact[key];
      if (key === "address" && Array.isArray(value)) {
        value = value.join("; ");
      } else if (key === "social_media" && Array.isArray(value)) {
        value = value.map(s => `${s.platform}: ${s.account}`).join(", ");
      } else {
        value = value ?? "";
      }
      result[label] = value;
    }
    return result;
  });
}

/**
 * Validates website URL.
 * @param {Array} contactData
 * @returns {Array} Original data plus validation flag
 */
export function validateWebsiteUrl(contactData) {
  return contactData.map((contact) => ({
    ...contact,
    web_url_valid:
      contact.web_url &&
      (contact.web_url.startsWith("http://") || contact.web_url.startsWith("https://"))
        ? "Valid"
        : "Invalid",
  }));
}

/**
 * Detailed export with URL validation.
 * @param {Array} contactData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createDetailedArtistContactExport(contactData, isCn = false) {
  if (!Array.isArray(contactData)) return [];
  const validated = validateWebsiteUrl(contactData);

  const fieldMappings = {
   artist_name: isCn ? "艺术家姓名" : "Artist Name",
    opening_time: isCn ? "营业时间" : "Opening Hours",
    email: isCn ? "邮箱" : "Email",
    phone: isCn ? "电话" : "Phone",
    address: isCn ? "地址" : "Address",
    social_media: isCn ? "社交媒体" : "Social Media",
    web_url: isCn ? "网站链接" : "Website URL",
    web_url_valid: isCn ? "网站状态" : "Website Status",
    language: isCn ? "语言" : "Language",
    order: isCn ? "排序" : "Order",
    updatedAt: isCn ? "更新时间" : "Updated At",
  };

  return validated.map((contact) => {
    const detailed = {};
    for (const [key, label] of Object.entries(fieldMappings)) {
      let value = contact[key];
      if (key === "web_url_valid") {
        value = value === "Valid" ? (isCn ? "有效" : "Valid") : isCn ? "无效" : "Invalid";
      } else if (key === "address" && Array.isArray(value)) {
        value = value.join("; ");
      } else if (key === "social_media" && Array.isArray(value)) {
        value = value.map(s => `${s.platform}: ${s.account} (${s.url})`).join(" | ");
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
 * Returns statistics based on the ArtistContact model fields.
 * @param {Array} contactData
 * @param {boolean} isCn
 * @returns {Object}
 */
export function getArtistContactStatistics(contactData, isCn = false) {
  if (!Array.isArray(contactData) || contactData.length === 0) return {};

  const validated = validateWebsiteUrl(contactData);

  return {
    total: contactData.length,
    validWebsiteUrls: validated.filter((c) => c.web_url_valid === "Valid").length,
    invalidWebsiteUrls: validated.filter((c) => c.web_url_valid === "Invalid").length,
    withartistName: validated.filter((c) => c.artist_name).length,
    withEmail: validated.filter((c) => c.email).length,
    withPhone: validated.filter((c) => c.phone).length,
    withAddress: validated.filter((c) => c.address && c.address.length > 0).length,
    withSocialMedia: validated.filter((c) => c.social_media && c.social_media.length > 0).length,
    withWebsite: validated.filter((c) => c.web_url).length,
    languages: [...new Set(validated.map((c) => c.language).filter(Boolean))],
  };
}

/**
 * Creates a statistics export as an array of rows.
 * @param {Array} contactData
 * @param {boolean} isCn
 * @returns {Array}
 */
export function createArtistContactStatisticsExport(contactData, isCn = false) {
  const stats = getArtistContactStatistics(contactData, isCn);
  if (!stats.total) return [];

  const rows = [
    { metric: isCn ? "总数" : "Total", value: stats.total },
    { metric: isCn ? "有效网站链接" : "Valid Website URLs", value: stats.validWebsiteUrls },
    { metric: isCn ? "无效网站链接" : "Invalid Website URLs", value: stats.invalidWebsiteUrls },
    { metric: isCn ? "包含艺术家姓名" : "With Artist Name", value: stats.withartistName },
    { metric: isCn ? "包含邮箱" : "With Email", value: stats.withEmail },
    { metric: isCn ? "包含电话" : "With Phone", value: stats.withPhone },
    { metric: isCn ? "包含地址" : "With Address", value: stats.withAddress },
    { metric: isCn ? "包含社交媒体" : "With Social Media", value: stats.withSocialMedia },
    { metric: isCn ? "包含网站" : "With Website", value: stats.withWebsite },
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
export function getArtistContactExportFilename(isCn = false, exportType = "comprehensive") {
  const timestamp = new Date().toISOString().split("T")[0];
  const prefix = isCn ? "联系数据" : "gallery_contact_data";
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
 * Format address array into a readable string.
 * @param {Array} address
 * @param {boolean} isCn (unused, kept for consistency)
 * @returns {string}
 */
export function formatArtistContactAddress(address, isCn = false) {
  return Array.isArray(address) ? address.join("\n") : "";
}

/**
 * Format social_media array into a readable string.
 * @param {Array} socialMedia
 * @param {boolean} isCn (unused)
 * @returns {string}
 */
export function formatArtistContactSocialMedia(socialMedia, isCn = false) {
  if (!Array.isArray(socialMedia)) return "";
  return socialMedia.map(s => `${s.platform}: ${s.account} (${s.url})`).join("\n");
}

/**
 * Validate a single website URL.
 * @param {string} url
 * @returns {boolean}
 */
export function isValidWebsiteUrl(url) {
  return !!(url && (url.startsWith("http://") || url.startsWith("https://")));
}

/**
 * Normalize an incoming row (from CSV or external source) to match the Prisma ArtistContact model.
 * Handles both plain objects and MongoDB `_id` wrappers.
 * @param {Object} row
 * @returns {Object}
 */
export const normalizeArtistContactRow = (row) => {
  let mongoId = row._id?.$oid || row._id || row.id;
  if (mongoId && typeof mongoId === "object") {
    mongoId = mongoId.$oid || JSON.stringify(mongoId);
  }

  // 处理 social_media：可能是数组或字符串，转换为标准对象数组
  let socialMedia = row.social_media || [];
  if (typeof socialMedia === "string") {
    // 尝试解析 JSON 字符串
    try {
      socialMedia = JSON.parse(socialMedia);
    } catch {
      // 若不是 JSON，按分隔符拆分 (例如 "instagram:myacc, facebook:myfb")
      socialMedia = socialMedia.split(",").map(entry => {
        const [platform, account] = entry.split(":").map(s => s.trim());
        return platform && account ? { platform, account, url: "" } : null;
      }).filter(Boolean);
    }
  }
  if (!Array.isArray(socialMedia)) socialMedia = [];

  // 确保每个 social_media 对象有 platform, account, url
  socialMedia = socialMedia.map(s => ({
    platform: s.platform || "",
    account: s.account || "",
    url: s.url || "",
  })).filter(s => s.platform && s.account);

  // 处理 address：可能是数组或字符串
  let address = row.address || [];
  if (typeof address === "string") {
    address = address.split("\n").filter(Boolean);
  }
  if (!Array.isArray(address)) address = [];

  return {
    id: mongoId ? String(mongoId) : `temp_${Date.now()}_${Math.random()}`,
    _id: mongoId,
   artist_name: row.artist_name || "",
    opening_time: row.opening_time || "",
    email: row.email || "",
    phone: row.phone || "",
    address: address,
    social_media: socialMedia,
    web_url: row.web_url || "",
    language: row.language || "",
    order: row.order || "",
    updatedAt: row.updatedAt || "",
    isNew: row.isNew || false,
  };
};
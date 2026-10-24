/**
 * Get field group definitions for About data
 */
export const getAboutFieldGroups = (isCn) => {
  const groupKeyLabels = {
    core: isCn ? "核心信息" : "Core Info",
    content: isCn ? "内容" : "Content",
    classification: isCn ? "分类" : "Classification",
  };

  return {
    core: ["artist", "portrait_image_url", "caption"],
    content: ["introduction", "pdf_url", "web_url"],  // 新增 pdf_url, web_url
    classification: ["language", "order"],
    groupKeyLabels,
  };
};

/**
 * Get all About schema fields for column definitions
 */
export const getAboutSchemaFields = () => [
  { name: "artist", labelKey: "artist", label: "Artist" },
  { name: "portrait_image_url", labelKey: "portraitImageUrl", label: "Portrait Image URL" },
  { name: "caption", labelKey: "caption", label: "Caption" },
  { name: "introduction", labelKey: "introduction", label: "Introduction" },
  { name: "pdf_url", labelKey: "pdfUrl", label: "PDF URL" },      // 新增
  { name: "web_url", labelKey: "webUrl", label: "Website URL" },  // 新增
  { name: "language", labelKey: "language", label: "Language" },
  { name: "order", labelKey: "order", label: "Order" },
];

/**
 * Get field type categories for About data
 */
export const getAboutFieldTypes = () => ({
  arrayFields: ["introduction"],
  multilineFields: ["caption"],
});
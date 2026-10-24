// /components/forms/labels/webFormLabels.js
const WEB_FORM_LABELS = {
  fields: {
    // Basic fields
    web_url: { en: "Web URL", cn: "网站链接" },
    cover_img_url: { en: "Cover Image", cn: "封面图片" },
    type: { en: "Type", cn: "类型" },
    
    // Tag fields
    tag_en: { en: "Tag (English)", cn: "标签（英文）" },
    tag_cn: { en: "Tag (Chinese)", cn: "标签（中文）" },
    tag_source: { en: "Tag Source", cn: "标签来源" },
    
    // Caption fields
    caption_en: { en: "Caption (English)", cn: "说明（英文）" },
    caption_cn: { en: "Caption (Chinese)", cn: "说明（中文）" },
    
    // Metadata fields
    mark: { en: "Mark", cn: "标记" },
    order: { en: "Order", cn: "排序" },
    language: { en: "Language", cn: "语言" },
  },
  
  // Tab labels - these MUST match the schema keys exactly
  tabs: {
    ordering: { en: "Ordering", cn: "排序" },
    basic: { en: "Basic Info", cn: "基本信息" },
    tags: { en: "Tags", cn: "标签" },
    captions: { en: "Captions", cn: "说明" },
  },
  
  // Button labels
  buttons: {
    addWeb: { en: "Add Website", cn: "添加网站" },
    updateWeb: { en: "Update Website", cn: "更新网站" },
  },
  
  // UI Text
  UI_TEXT: {
    uploadError: { en: "Upload failed", cn: "上传失败" },
    uploadSuccess: { en: "Upload successful", cn: "上传成功" },
    updateSuccess: { en: "Updated successfully", cn: "更新成功" },
    updateError: { en: "Update failed", cn: "更新失败" },
    moreInfoSummary: { en: "More Information", cn: "更多信息" },
  },
  
  // Selector labels - add these for consistency
  selectors: {
    type: { en: "Type", cn: "类型" },
    mark: { en: "Mark", cn: "标记" },
    language: { en: "Language", cn: "语言" },
    order: { en: "Order", cn: "排序" },
    selectType: { en: "Select type", cn: "选择类型" },
    selectMark: { en: "Select mark", cn: "选择标记" },
    selectLanguage: { en: "Select language", cn: "选择语言" },
  },
};

export default WEB_FORM_LABELS;
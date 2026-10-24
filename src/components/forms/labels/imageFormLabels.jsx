// /components/forms/labels/imageFormLabels.js
const IMAGE_FORM_LABELS = {
  fields: {
    // Basic fields
    img_url: { en: "Image URL", cn: "图片链接" },
    tag_en: { en: "Tag (English)", cn: "标签（英文）" },
    tag_cn: { en: "Tag (Chinese)", cn: "标签（中文）" },
    type: { en: "Type", cn: "类型" },
    
    // Caption fields
    caption_en: { en: "Caption (English)", cn: "说明（英文）" },
    caption_cn: { en: "Caption (Chinese)", cn: "说明（中文）" },
    
    // Metadata fields
    mark: { en: "Mark", cn: "标记" },
    order: { en: "Order", cn: "排序" },
    "order.rolling_img_order": { en: "Artist Page Order (Rolling Images)", cn: "艺术家页排序（轮播图）" },
    "order.artist_detail_rolling_img_order": { en: "Artist Detail Page Order (Rolling Images)", cn: "艺术家详情页排序（轮播图）" },
    "order.exhibition_page_order": { en: "Exhibition Page Order", cn: "展览页排序" },
    "order.art_fair_page_order": { en: "Art Fair Page Order", cn: "艺博会页排序" },
    "order.artist_page_order": { en: "Artist Page Order (legacy)", cn: "艺术家页排序（旧）" },
  },
  
  // Tab labels - these MUST match the schema keys exactly
  tabs: {
    basic: { en: "Basic Info", cn: "基本信息" },
    captions: { en: "Captions", cn: "说明" },
  },
  
  // Button labels
  buttons: {
    uploadImage: { en: "Upload Image", cn: "上传图片" },
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
    order: { en: "Order", cn: "排序" },
    "order.rolling_img_order": { en: "Artist Page Order (Rolling Images)", cn: "艺术家页排序（轮播图）" },
    "order.artist_detail_rolling_img_order": { en: "Artist Detail Page Order (Rolling Images)", cn: "艺术家详情页排序（轮播图）" },
    "order.exhibition_page_order": { en: "Exhibition Page Order", cn: "展览页排序" },
    "order.art_fair_page_order": { en: "Art Fair Page Order", cn: "艺博会页排序" },
    "order.artist_page_order": { en: "Artist Page Order (legacy)", cn: "艺术家页排序（旧）" },
    selectType: { en: "Select type", cn: "选择类型" },
    selectMark: { en: "Select mark", cn: "选择标记" },
  },
};

export default IMAGE_FORM_LABELS;
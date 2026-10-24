const ABOUT_FORM_LABELS = {
  fields: {
    // 基础字段，与 About Prisma schema 严格对应
    artist: { en: "Artist", cn: "艺术家" },
    portrait_image_url: { en: "Portrait Image", cn: "肖像图片" },
    caption: { en: "Caption", cn: "说明" },
    introductions: { en: "Introduction", cn: "介绍" },
    language: { en: "Language", cn: "语言" },
    mark: { en: "Mark", cn: "标记" },
    order: { en: "Order", cn: "排序" },
  },
  
  // Tab 标签
  tabs: {
    ordering: { en: "Ordering", cn: "排序" },
    content: { en: "Content", cn: "内容" },
    introductions: { en: "Introduction", cn: "介绍" },
  },
  
  // 按钮标签
  buttons: {
    addIntroduction: { en: "Add Introduction", cn: "添加介绍" },
  },
  
  // UI 文案
  UI_TEXT: {
    uploadError: { en: "Upload failed", cn: "上传失败" },
    moreInfoSummary: { en: "More Information", cn: "更多信息" },
  },
  
  // 选择器标签
  selectors: {
    mark: { en: "Mark", cn: "标记" },
    language: { en: "Language", cn: "语言" },
    order: { en: "Order", cn: "排序" },
    selectMark: { en: "Select mark", cn: "选择标记" },
  },
};

export default ABOUT_FORM_LABELS;

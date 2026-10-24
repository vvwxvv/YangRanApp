const WRITING_FORM_LABELS = {
  fields: {
    // Basic fields
    cover_image_url: { en: "Cover Image", cn: "封面图片" },
    title: { en: "Title", cn: "标题" },
    subtitle: { en: "Subtitle", cn: "副标题" },
    author: { en: "Author", cn: "作者" },
    
    // Content fields
    summary: { en: "Summary", cn: "摘要" },
    content: { en: "Content", cn: "正文" },
    paragraphs: { en: "Paragraphs", cn: "段落" },
    caption: { en: "Caption", cn: "说明" },
    
    // Metadata fields
    keywords: { en: "Keywords", cn: "关键词" },
    tags: { en: "Tags", cn: "标签" },
    category: { en: "Category", cn: "分类" },
    type: { en: "Type", cn: "类型" },
    year: { en: "Year", cn: "年份" },
    
    // Publishing fields
    status: { en: "Status", cn: "状态" },
    is_published: { en: "Published", cn: "已发布" },
    read_time: { en: "Read Time (min)", cn: "阅读时长（分钟）" },
    view_count: { en: "View Count", cn: "浏览量" },
    order: { en: "Order", cn: "排序" },
    language: { en: "Language", cn: "语言" },
  },
  
  // Tab labels - these MUST match the schema keys exactly
  tabs: {
    basic: { en: "Basic Information", cn: "基本信息" },
    content: { en: "Content", cn: "内容" },
    metadata: { en: "Metadata", cn: "元数据" },
    tags: { en: "Tags", cn: "标签" },
    paragraphs: { en: "Paragraphs", cn: "段落" },
  },
  
  // Button labels
  buttons: {
    addParagraph: { en: "Add Paragraph", cn: "添加段落" },
    addKeyword: { en: "Add Keyword", cn: "添加关键词" },
    addTag: { en: "Add Tag", cn: "添加标签" },
    updateWriting: { en: "Update Writing", cn: "更新文章" },
    publish: { en: "Publish", cn: "发布" },
    unpublish: { en: "Unpublish", cn: "取消发布" },
  },
  
  // UI Text
  UI_TEXT: {
    uploadError: { en: "Upload failed", cn: "上传失败" },
    uploadSuccess: { en: "Upload successful", cn: "上传成功" },
    updateSuccess: { en: "Updated successfully", cn: "更新成功" },
    updateError: { en: "Update failed", cn: "更新失败" },
    publishSuccess: { en: "Published successfully", cn: "发布成功" },
    unpublishSuccess: { en: "Unpublished successfully", cn: "取消发布成功" },
    moreInfoSummary: { en: "More Information", cn: "更多信息" },
  },
  
  // Selector labels - add these for consistency
  selectors: {
    category: { en: "Category", cn: "分类" },
    type: { en: "Type", cn: "类型" },
    status: { en: "Status", cn: "状态" },
    language: { en: "Language", cn: "语言" },
    order: { en: "Order", cn: "排序" },
    selectCategory: { en: "Select category", cn: "选择分类" },
    selectType: { en: "Select type", cn: "选择类型" },
    selectStatus: { en: "Select status", cn: "选择状态" },
    selectLanguage: { en: "Select language", cn: "选择语言" },
  },
};

export default WRITING_FORM_LABELS;
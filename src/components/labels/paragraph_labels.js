import { L, STATUS_LABELS, F } from "@/components/labels/managerLabels";
export const fieldLabels = {
  pargraph_en: F.paragraph_content.en,
  pargraph_cn: F.paragraph_content.cn,
  mark_en: F.mark.en,
  mark_cn: F.mark.cn,
  tag_source_en: F.tag_source.en,
  tag_source_cn: F.tag_source.cn,
  tag_en_en: F.tag_english.en,
  tag_en_cn: F.tag_english.cn,
  tag_cn_en: F.tag_chinese.en,
  tag_cn_cn: F.tag_chinese.cn,
};

// Action labels
export const actionLabels = {
  create_en: F.create_paragraph.en,
  create_cn: F.create_paragraph.cn,
  edit_en: "Edit Paragraph",
  edit_cn: "编辑段落",
  delete_en: "Delete Paragraph",
  delete_cn: "删除段落",
  export_en: "Export Paragraphs",
  export_cn: "导出段落",
  import_en: "Import Paragraphs",
  import_cn: "导入段落",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Validation labels
export const validationLabels = {
  required_en: F.this_field_is_required.en,
  required_cn: F.this_field_is_required.cn,
  invalid_content_en: "Please enter valid content",
  invalid_content_cn: "请输入有效内容",
};

// Entity labels
export const entityLabels = {
  paragraph_en: "Paragraph",
  paragraph_cn: L.paragraphs.cn,
  paragraphs_en: F.paragraphs.en,
  paragraphs_cn: F.paragraphs.cn,
};

// Form section labels
export const formSectionLabels = {
  basicInfo_en: "Basic Information",
  basicInfo_cn: "基本信息",
};

// Filter labels
export const filterLabels = {
  all_tags_en: F.all_tags.en,
  all_tags_cn: F.all_tags.cn,
  search_en: F.search.en,
  search_cn: F.search.cn,
  search_placeholder_en: "Search paragraphs...",
  search_placeholder_cn: "搜索段落...",
};

// Sort labels
export const sortLabels = {
  sort_by_tag_en: F.sort_by_tag.en,
  sort_by_tag_cn: F.sort_by_tag.cn,
  sort_by_mark_en: F.sort_by_mark.en,
  sort_by_mark_cn: F.sort_by_mark.cn,
};

// Page labels
export const pageLabels = {
  title_cn: L.paragraphs.cn,
  title_en: L.paragraphs.en,
  description_cn: "管理和组织段落内容",
  description_en: "Manage and organize paragraph content",
  page_title_en: F.paragraph_management.en,
  page_title_cn: F.paragraph_management.cn,
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的段落' : 'No paragraphs to display',
  noMatchMessage: (isCn) => isCn ? '未找到匹配的段落' : 'No matching paragraphs found',
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// Control panel labels
export const controlPanelLabels = {
  artwork: L.artworks.cn,
  event: L.event.cn,
  about: L.about.cn,
  custom: '自定义',
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "段落列表" : "PARAGRAPH LIST",
  detailsLabel: (isCn) => isCn ? "段落详情" : "PARAGRAPH DETAILS",
  untitled: (isCn) => isCn ? "无题段落" : "Untitled Paragraph",
  noDescription: (isCn) => isCn ? '暂无描述' : 'No description available',
  back: (isCn) => isCn ? "返回" : "BACK",
};

// Field group labels
export const fieldGroupLabels = {
  basic: {
    title: (isCn) => isCn ? "基本信息" : "Basic Info",
  },
};

// Field labels for components
export const fieldLabelsForComponents = {
  pargraph: L.paragraph_content,
  mark: L.mark,
  tag_source: L.tag_source,
  tag_en: L.tag_en_2,
  tag_cn: L.tag_cn_2,
};

// Multilingual content labels
export const multilingualLabels = {
  tag_en_en: L.tag_en.en,
  tag_en_cn: L.tag_english.cn,
  tag_cn_en: L.tag_cn.en,
  tag_cn_cn: L.tag_chinese.cn,
  tagLabel_en: L.tag_en.en,
  tagLabel_cn: "中文标签",
  instruction_en: "Select a tag to filter and only show paragraphs belonging to that tag (such as artwork, event, etc.)",
  instruction_cn: "请选择标签，筛选后只显示属于该标签的段落（如作品、事件等）",
  // Tag source labels
  artwork_en: F.artwork.en,
  artwork_cn: F.artwork.cn,
  event_en: F.event.en,
  event_cn: F.event.cn,
  about_en: "About Artist",
  about_cn: "关于艺术家",
  custom_en: "Custom Tags",
  custom_cn: "自定义标签",
  // Paragraph labels
  pargraph_en: F.paragraph_content.en,
  pargraph_cn: F.paragraph_content.cn,
  pargraphPlaceholder_en: "Enter paragraph content...",
  pargraphPlaceholder_cn: "请输入段落内容...",
  markPlaceholder_en: "Enter mark...",
  markPlaceholder_cn: "请输入标记...",
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: F.this_paragraph.en,
  delete_dialog_this_item_cn: F.this_paragraph.cn,
  confirmDeleteParagraph_en: "Are you sure you want to delete this paragraph?",
  confirmDeleteParagraph_cn: "确定要删除该段落吗？",
  thisParagraph_en: F.this_paragraph.en,
  thisParagraph_cn: F.this_paragraph.cn,
};

// Paragraph management specific labels
export const paragraphManagementLabels = {
  selectFromBelow_en: "You can select from below",
  selectFromBelow_cn: "你可以从下方选择",
  noDataInputBelow_en: "No data, you can input below",
  noDataInputBelow_cn: "暂无数据，你可以手动输入",
  selectArtworkTag_en: "Select artwork tag...",
  selectArtworkTag_cn: "选择作品标签...",
  selectEventTag_en: "Select event tag...",
  selectEventTag_cn: "选择活动标签...",
  paragraphNotFound_en: "Paragraph not found or missing ID",
  paragraphNotFound_cn: "未找到该内容或ID缺失",
  goBackToList_en: "Please go back to the list and select another item",
  goBackToList_cn: "请返回列表选择其他内容",
};

// Combined labels object for easy access
export const paragraphLabels = {
  ...fieldLabels,
  ...actionLabels,
  ...statusLabels,
  ...validationLabels,
  ...entityLabels,
  ...filterLabels,
  ...sortLabels,
  ...pageLabels,
  ...deleteDialogLabels,
  ...paragraphManagementLabels,
  ...multilingualLabels,
  ...formSectionLabels,
  display: displayLabels,
  controlPanel: controlPanelLabels,
  defaultContent: defaultContentLabels,
  fieldGroups: fieldGroupLabels,
  fieldLabels: fieldLabelsForComponents,
};

// Helper function to get labels
export const getParagraphLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first
  if (fieldLabelsForComponents[key]) {
    return fieldLabelsForComponents[key][language] || fieldLabelsForComponents[key]['en'] || key;
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (paragraphLabels[labelKey]) {
    return paragraphLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (paragraphLabels[englishKey]) {
      return paragraphLabels[englishKey];
    }
  }
  
  return key;
};

// Helper function to get field group labels
export const getParagraphFieldGroupLabel = (groupKey, language = 'en') => {
  if (!groupKey || !fieldGroupLabels[groupKey]) return '';
  
  return fieldGroupLabels[groupKey].title(language === 'cn');
};

// Default export
export default paragraphLabels;

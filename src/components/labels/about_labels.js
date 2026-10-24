import { L, LU, STATUS_LABELS, F, bilingual } from "@/components/labels/managerLabels";
// Field labels based on About Prisma model
export const fieldLabels = {
  // Core fields
  portrait_image_url: bilingual(L.portrait_image),
  artist:" Name / 名称",
  caption: bilingual(L.caption),
  introductions: bilingual(L.introduction),
  pdf_url: bilingual(L.pdf_url),           // 新增
  web_url: bilingual(L.website_url),       // 新增
  language: bilingual(L.language),
  order: bilingual(L.order_sequence),
  mark: bilingual(L.mark),
  
  // Timestamps
  updatedAt: bilingual(L.last_updated),
};

// Page text labels
export const PAGE_TEXT = {
  // Page Title
  pageTitle: LU.about_management,
  
  // Item Name
  itemName: LU.about_entry,
  
  // Create Button Tooltip
  createTooltip: LU.create_new_about_entry,
  
  // Filter Labels
  filters: {
    language: LU.language,
    mark: LU.mark,
  },
  
  // Control Panel
  controlPanel: {
    sortByOrder: LU.sort_by_order,
    sortByOrderTooltip: LU.sort_entries_by_order,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_about_data,
  },
  
  // Field Labels
  fields: {
    portraitImageUrl: LU.portrait_image,
    caption: LU.caption,
    introductions: LU.introduction,
    pdfUrl: LU.pdf_url,          // 新增
    webUrl: LU.website_url,      // 新增
    language: LU.language,
    order: LU.order_sequence,
    mark: LU.mark,
    updatedAt: LU.updated_at,
  },
  
  // Empty State Messages
  emptyState: {
    noData: LU.no_about_entries_found,
    noMatchingEntries: LU.no_matching_entries,
  },
  
  // Delete Dialog
  deleteDialog: {
    title: LU.confirm_delete,
    confirm: LU.delete,
    cancel: LU.cancel,
  },
  
  // Error Messages
  errors: {
    loadingError: LU.error_loading_data,
    systemError: LU.system_error,
    tryAgain: LU.try_again,
    deleteError: LU.delete_failed,
    pleaseRetry: LU.please_try_again,
    ok: LU.ok,
  },
  
  // Export Messages
  export: {
    success: LU.export_success,
    error: LU.export_failed,
    entries: LU.entries,
  },
};

// Action labels
export const actionLabels = {
  create_en: "Create About Entry",
  create_cn: "创建关于条目",
  edit_en: "Edit About Entry",
  edit_cn: "编辑关于条目",
  delete_en: "Delete About Entry",
  delete_cn: "删除关于条目",
  export_en: "Export About Data",
  export_cn: L.export_about_data.cn,
  import_en: "Import About Data",
  import_cn: "导入关于数据",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  aboutEntry_en: L.about_entry.en,
  aboutEntry_cn: L.about_entry.cn,
  aboutEntries_en: "About Entries",
  aboutEntries_cn: L.about_entry.cn,
  untitledEntry_en: F.untitled_entry.en,
  untitledEntry_cn: F.untitled_entry.cn,
};

// Filter labels
export const filterLabels = {
  all_languages_en: F.all_languages.en,
  all_languages_cn: F.all_languages.cn,
  all_marks_en: F.all_marks.en,
  all_marks_cn: F.all_marks.cn,
};

// Sort labels
export const sortLabels = {
  sort_by_order_en: F.sort_by_order.en,
  sort_by_order_cn: F.sort_by_order.cn,
  sort_by_update_en: F.sort_by_update.en,
  sort_by_update_cn: F.sort_by_update.cn,
};

// Page labels
export const pageLabels = {
  title_en: F.about_management.en,
  title_cn: F.about_management.cn,
  description_en: "Manage artist biography and about information",
  description_cn: "管理艺术家传记和关于信息",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.about_index,
  caption: L.caption,
  language: L.language,
  mark: L.mark,
  all: L.all,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noEntriesFound: L.no_about_entries_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  fields: {
    artist: L.artist,
    caption: L.caption,
    language: L.language,
    // 如果需要，可以添加 pdf_url 和 web_url，但 uiTextLabels.fields 主要用于筛选，此处不加也可
  }
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的关于条目' : 'No about entries to display',
  noMatchMessage: (isCn) => isCn ? '未找到匹配的条目' : 'No matching entries found',
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// Control panel labels
export const controlPanelLabels = {
  language: L.language.cn,
  mark: L.mark.cn,
  sortByOrder: L.sort_by_order.cn,
  sortByOrderTooltip: L.sort_by_order.en,
  sortByUpdate: L.sort_by_update.cn,
  sortByUpdateTooltip: L.sort_by_update.en,
  artistLabel_en: F.artist.en,
  artistLabel_cn: F.artist.cn,
  languageLabel_en: F.language.en,
  languageLabel_cn: F.language.cn,
  markLabel_en: F.mark.en,
  markLabel_cn: F.mark.cn,
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "关于列表" : "ABOUT LIST",
  detailsLabel: (isCn) => isCn ? "关于详情" : "ABOUT DETAILS",
  untitled: (isCn) => isCn ? "无标题条目" : "Untitled Entry",
  noDescription: (isCn) => isCn ? '暂无描述' : 'No description available',
  back: (isCn) => isCn ? "返回" : "BACK",
};

// Field group labels
export const fieldGroupLabels = {
  basic: {
    title: (isCn) => isCn ? "基本信息" : "Basic Info",
  },
  media: {
    title: (isCn) => isCn ? "媒体" : "Media",
  },
  content: {
    title: (isCn) => isCn ? "内容" : "Content",
  },
};

// Field labels for components (object with en/cn)
export const fieldLabelsForComponents = {
  portrait_image_url: L.portrait_image,
  caption: L.caption,
  introductions: L.introduction,
  pdf_url: L.pdf_url,          // 新增
  web_url: L.website_url,      // 新增
  language: L.language,
  order: L.order_sequence,
  mark: L.mark,
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: "this about entry",
  delete_dialog_this_item_cn: "该关于条目",
  confirmDeleteEntry_en: "Are you sure you want to delete this about entry?",
  confirmDeleteEntry_cn: "确定要删除该关于条目吗？",
  thisEntry_en: F.this_entry.en,
  thisEntry_cn: F.this_entry.cn,
};

// Additional labels (introductions management, placeholders, etc.)
export const additionalLabels = {
  // Placeholder and description labels
  selectLanguage_en: F.select_language.en,
  selectLanguage_cn: F.select_language.cn,
  selectMark_en: "Select Mark",
  selectMark_cn: "选择标记",
  portraitImageUrlPlaceholder_en: "Enter portrait image URL",
  portraitImageUrlPlaceholder_cn: "输入肖像图片URL",
  captionPlaceholder_en: "Enter a short caption",
  captionPlaceholder_cn: "输入简短说明",
  // 可添加 pdf_url 和 web_url 的占位符（可选）
  pdfUrlPlaceholder_en: F.enter_pdf_url.en,
  pdfUrlPlaceholder_cn: F.enter_pdf_url.cn,
  webUrlPlaceholder_en: F.enter_website_url.en,
  webUrlPlaceholder_cn: F.enter_website_url.cn,
  
  // Introduction labels
  introduction_en: F.introduction.en,
  introduction_cn: F.introduction.cn,
  introductionSummary_en: "Introduction Paragraphs",
  introductionSummary_cn: "介绍段落",
  introductionDescription_en: "Add introductions paragraphs (supports HTML).",
  introductionDescription_cn: "添加介绍段落（支持HTML）。",
  addIntroductionButton_en: F.add_paragraph.en,
  addIntroductionButton_cn: F.add_paragraph.cn,
  removeIntroductionButton_en: F.remove.en,
  removeIntroductionButton_cn: F.remove.cn,
  
  // Entity and collection labels
  no_entries_en: L.no_about_entries_found.en,
  no_entries_cn: "未找到关于条目",
  
  // Search and filter labels
  searchEntries_en: "Search about entries",
  searchEntries_cn: "搜索关于条目",
  
  // Status and error labels
  noFeaturedEntries_en: "No featured about entries available",
  noFeaturedEntries_cn: "暂无精选关于条目",
  noMatchingEntries_en: L.no_matching_about_entries_found.en,
  noMatchingEntries_cn: L.no_about_entries_found_matching_the_criteria.cn,
};

// UI Text Configuration (compact error/message strings)
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  aboutManagement: L.about_management,
  noData: L.no_about_entries_available,
  noMatchingEntries: L.no_matching_about_entries_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const aboutLabels = {
  ...fieldLabels,
  ...actionLabels,
  ...statusLabels,
  ...entityLabels,
  ...filterLabels,
  ...sortLabels,
  ...pageLabels,
  ...deleteDialogLabels,
  ...additionalLabels,
  uiText: uiTextLabels,
  display: displayLabels,
  controlPanel: controlPanelLabels,
  defaultContent: defaultContentLabels,
  fieldLabelsForComponents,
  UI_TEXT: UI_TEXT,
  PAGE_TEXT,
};

// Helper function to get labels
export const getAboutLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first (slash format string)
  if (fieldLabels[key]) {
    // fieldLabels[key] is like bilingual(L.artist)
    if (language === 'en') {
      return fieldLabels[key].split('/')[0].trim();
    } else {
      return fieldLabels[key].split('/')[1]?.trim() || fieldLabels[key];
    }
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (aboutLabels[labelKey]) {
    return aboutLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (aboutLabels[englishKey]) {
      return aboutLabels[englishKey];
    }
  }
  
  return key;
};

// Helper function to get UI text
export const getAboutUIText = (key, language = 'en') => {
  if (!key) return '';
  
  // Try to get from uiText configuration
  if (uiTextLabels[key]) {
    return uiTextLabels[key][language] || uiTextLabels[key]['en'] || key;
  }
  
  // Try nested fields
  if (key.includes('.')) {
    const [parent, child] = key.split('.');
    if (uiTextLabels[parent] && uiTextLabels[parent][child]) {
      return uiTextLabels[parent][child][language] || uiTextLabels[parent][child]['en'] || key;
    }
  }
  
  return key;
};

// Default export
export default aboutLabels;
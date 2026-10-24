import { L, LU, STATUS_LABELS, F, bilingual } from "@/components/labels/managerLabels";
// Field labels based on Bibliography Prisma model
export const fieldLabels = {
  // Core fields
  title: bilingual(L.title),
  subtitle: bilingual(L.subtitle),
  cover_img_url: bilingual(L.cover_image),
  author: bilingual(L.author),
  type: bilingual(L.type),
  year: bilingual(L.year),
  date: bilingual(L.date),
  published_at: bilingual(L.published_at),
  pdf_url: bilingual(L.pdf_url),
  web_url: bilingual(L.website_url),
  video_url: bilingual(L.video_url),
  related_exhibition: bilingual(L.related_exhibitions),
  order: bilingual(L.order_sequence),
  language: bilingual(L.language),          // 新增
  mark: bilingual(L.mark),                  // 新增
  
  // Timestamps
  updatedAt: bilingual(L.last_updated),
};

// Page text labels
export const PAGE_TEXT = {
  // Page Title
  pageTitle: LU.bibliography_management,
  
  // Item Name
  itemName: LU.bibliography_entry,
  
  // Create Button Tooltip
  createTooltip: LU.create_new_bibliography_entry,
  
  // Filter Labels
  filters: {
    type: LU.type,
    year: LU.year,
    author: LU.author,
    language: LU.language,   // 新增
  },
  
  // Control Panel
  controlPanel: {
    sortByOrder: LU.sort_by_order,
    sortByOrderTooltip: LU.sort_entries_by_order,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_bibliography_data,
  },
  
  // Field Labels
  fields: {
    title: LU.title,
    subtitle: LU.subtitle,
    coverImgUrl: LU.cover_image,
    author: LU.author,
    type: LU.type,
    year: LU.year,
    date: LU.date,
    publishedAt: LU.published_at,
    pdfUrl: LU.pdf_url,
    webUrl: LU.website_url,
    videoUrl: LU.video_url,
    relatedGalleryExhibition: LU.related_exhibitions,
    order: LU.order_sequence,
    language: LU.language,      // 新增
    mark: LU.mark,              // 新增
    updatedAt: LU.updated_at,
  },
  
  // Empty State Messages
  emptyState: {
    noData: LU.no_bibliography_entries_found,
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
  create_en: "Create Bibliography Entry",
  create_cn: "创建书目条目",
  edit_en: "Edit Bibliography Entry",
  edit_cn: "编辑书目条目",
  delete_en: "Delete Bibliography Entry",
  delete_cn: "删除书目条目",
  export_en: "Export Bibliography Data",
  export_cn: L.export_bibliography_data.cn,
  import_en: "Import Bibliography Data",
  import_cn: "导入书目数据",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  bibliographyEntry_en: L.bibliography_entry.en,
  bibliographyEntry_cn: L.bibliography_entry.cn,
  bibliographyEntries_en: "Bibliography Entries",
  bibliographyEntries_cn: L.bibliography_entry.cn,
  untitledEntry_en: F.untitled_entry.en,
  untitledEntry_cn: F.untitled_entry.cn,
};

// Filter labels
export const filterLabels = {
  all_types_en: F.all_types.en,
  all_types_cn: F.all_types.cn,
  all_years_en: F.all_years.en,
  all_years_cn: F.all_years.cn,
  all_authors_en: F.all_authors.en,
  all_authors_cn: F.all_authors.cn,
  all_languages_en: "All Languages",    // 新增
  all_languages_cn: "全部语言",         // 新增
};

// Sort labels
export const sortLabels = {
  sort_by_order_en: F.sort_by_order.en,
  sort_by_order_cn: F.sort_by_order.cn,
  sort_by_update_en: F.sort_by_update.en,
  sort_by_update_cn: F.sort_by_update.cn,
  sort_by_title_en: F.sort_by_title.en,
  sort_by_title_cn: F.sort_by_title.cn,
  sort_by_year_en: F.sort_by_year.en,
  sort_by_year_cn: F.sort_by_year.cn,
  sort_by_language_en: "Sort by Language",  // 新增
  sort_by_language_cn: "按语言排序",        // 新增
};

// Page labels
export const pageLabels = {
  title_en: L.bibliography_management.en,
  title_cn: L.bibliography_management.cn,
  description_en: "Manage bibliography entries including books, articles, and other publications",
  description_cn: "管理书目条目，包括书籍、文章和其他出版物",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.bibliography_index,
  title: L.title,
  author: L.author,
  type: L.type,
  year: L.year,
  language: L.language,   // 新增
  mark: L.mark,           // 新增
  all: L.all,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noEntriesFound: L.no_bibliography_entries_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  fields: {
    title: L.title,
    author: L.author,
    type: L.type,
    year: L.year,
    language: L.language,   // 新增
  }
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的书目条目' : 'No bibliography entries to display',
  noMatchMessage: (isCn) => isCn ? '未找到匹配的条目' : 'No matching entries found',
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// Control panel labels
export const controlPanelLabels = {
  type: L.type.cn,
  year: L.year.cn,
  author: L.author.cn,
  language: L.language.cn,        // 新增
  sortByOrder: L.sort_by_order.cn,
  sortByOrderTooltip: L.sort_by_order.en,
  sortByUpdate: L.sort_by_update.cn,
  sortByUpdateTooltip: L.sort_by_update.en,
  sortByTitle: L.sort_by_title.cn,
  sortByTitleTooltip: L.sort_by_title.en,
  sortByYear: L.sort_by_year.cn,
  sortByYearTooltip: L.sort_by_year.en,
  titleLabel_en: F.title.en,
  titleLabel_cn: F.title.cn,
  authorLabel_en: F.author.en,
  authorLabel_cn: F.author.cn,
  typeLabel_en: F.type.en,
  typeLabel_cn: F.type.cn,
  yearLabel_en: F.year.en,
  yearLabel_cn: F.year.cn,
  languageLabel_en: L.language.en,    // 新增
  languageLabel_cn: L.language.cn,        // 新增
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "书目列表" : "BIBLIOGRAPHY LIST",
  detailsLabel: (isCn) => isCn ? "书目详情" : "BIBLIOGRAPHY DETAILS",
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
    title: (isCn) => isCn ? "媒体链接" : "Media Links",
  },
  relations: {
    title: (isCn) => isCn ? "关联信息" : "Relations",
  },
  metadata: {
    title: (isCn) => isCn ? "元数据" : "Metadata",
  },
};

// Field labels for components (object with en/cn)
export const fieldLabelsForComponents = {
  title: L.title,
  subtitle: L.subtitle,
  cover_img_url: L.cover_image,
  author: L.author,
  type: L.type,
  year: L.year,
  date: L.date,
  published_at: L.published_at,
  pdf_url: L.pdf_url,
  web_url: L.website_url,
  video_url: L.video_url,
  related_exhibition: L.related_exhibitions,
  order: L.order_sequence,
  language: L.language,          // 新增
  mark: L.mark,                  // 新增
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: "this bibliography entry",
  delete_dialog_this_item_cn: "该书目条目",
  confirmDeleteEntry_en: "Are you sure you want to delete this bibliography entry?",
  confirmDeleteEntry_cn: "确定要删除该书目条目吗？",
  thisEntry_en: F.this_entry.en,
  thisEntry_cn: F.this_entry.cn,
};

// Additional labels (placeholders, descriptions, etc.)
export const additionalLabels = {
  // Placeholder and description labels
  selectType_en: F.select_type.en,
  selectType_cn: F.select_type.cn,
  selectYear_en: F.select_year.en,
  selectYear_cn: F.select_year.cn,
  selectLanguage_en: "Select Language",      // 新增
  selectLanguage_cn: "选择语言",            // 新增
  titlePlaceholder_en: F.enter_title.en,
  titlePlaceholder_cn: F.enter_title.cn,
  subtitlePlaceholder_en: "Enter subtitle",
  subtitlePlaceholder_cn: "输入副标题",
  coverImageUrlPlaceholder_en: F.enter_cover_image_url.en,
  coverImageUrlPlaceholder_cn: F.enter_cover_image_url.cn,
  authorPlaceholder_en: F.enter_author_name.en,
  authorPlaceholder_cn: F.enter_author_name.cn,
  typePlaceholder_en: "Enter type (e.g., Book, Article)",
  typePlaceholder_cn: "输入类型（如：书籍、文章）",
  yearPlaceholder_en: F.enter_year_e_g_2024.en,
  yearPlaceholder_cn: F.enter_year_e_g_2024.cn,
  datePlaceholder_en: "Enter date",
  datePlaceholder_cn: "输入日期",
  publishedAtPlaceholder_en: "Enter publication date",
  publishedAtPlaceholder_cn: "输入出版时间",
  pdfUrlPlaceholder_en: F.enter_pdf_url.en,
  pdfUrlPlaceholder_cn: F.enter_pdf_url.cn,
  webUrlPlaceholder_en: F.enter_website_url.en,
  webUrlPlaceholder_cn: F.enter_website_url.cn,
  videoUrlPlaceholder_en: "Enter video URL",
  videoUrlPlaceholder_cn: "输入视频链接",
  relatedGalleryExhibitionPlaceholder_en: "Enter related gallery exhibition IDs (comma separated)",
  relatedGalleryExhibitionPlaceholder_cn: "输入相关展览ID（逗号分隔）",
  languagePlaceholder_en: "Enter language (e.g., English, Chinese)",  // 新增
  languagePlaceholder_cn: "输入语言（如：英语、中文）",              // 新增
  markPlaceholder_en: "Enter mark (optional)",                        // 新增
  markPlaceholder_cn: "输入标记（可选）",                            // 新增
  
  // Related Exhibitions labels
  relatedGalleryExhibition_en: L.related_exhibitions.en,
  relatedGalleryExhibition_cn: L.related_gallery_exhibition.cn,
  relatedGalleryExhibitionSummary_en: "Associated Exhibitions",
  relatedGalleryExhibitionSummary_cn: "关联展览",
  relatedGalleryExhibitionDescription_en: "Add related gallery or exhibition IDs.",
  relatedGalleryExhibitionDescription_cn: "添加相关的画廊或展览ID。",
  
  // Entity and collection labels
  no_entries_en: L.no_bibliography_entries_found.en,
  no_entries_cn: "未找到书目条目",
  
  // Search and filter labels
  searchEntries_en: "Search bibliography entries",
  searchEntries_cn: "搜索书目条目",
  
  // Status and error labels
  noFeaturedEntries_en: "No featured bibliography entries available",
  noFeaturedEntries_cn: "暂无精选书目条目",
  noMatchingEntries_en: L.no_matching_bibliography_entries_found.en,
  noMatchingEntries_cn: L.no_bibliography_entries_found_matching_the_criteria.cn,
};

// UI Text Configuration (compact error/message strings)
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  bibliographyManagement: L.bibliography_management,
  noData: L.no_bibliography_entries_available,
  noMatchingEntries: L.no_matching_bibliography_entries_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const bibliographyLabels = {
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
export const getBibliographyLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first (slash format string)
  if (fieldLabels[key]) {
    // fieldLabels[key] is like bilingual(L.title)
    if (language === 'en') {
      return fieldLabels[key].split('/')[0].trim();
    } else {
      return fieldLabels[key].split('/')[1]?.trim() || fieldLabels[key];
    }
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (bibliographyLabels[labelKey]) {
    return bibliographyLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (bibliographyLabels[englishKey]) {
      return bibliographyLabels[englishKey];
    }
  }
  
  return key;
};

// Helper function to get UI text
export const getBibliographyUIText = (key, language = 'en') => {
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
export default bibliographyLabels;
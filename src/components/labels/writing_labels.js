import { L, LU, STATUS_LABELS, F, bilingual } from "@/components/labels/managerLabels";
// Field labels based on Writing Prisma model
export const fieldLabels = {
  // Core fields
  cover_img_url: bilingual(L.cover_image),
  author: bilingual(L.author),
  title: bilingual(L.title),
  subtitle: bilingual(L.subtitle),
  summary: bilingual(L.summary),
  keywords: bilingual(L.keywords),
  category: bilingual(L.category),
  type: bilingual(L.type),
  year: bilingual(L.year),
  paragraphs: bilingual(L.paragraphs),
  caption: bilingual(L.caption),
  status: bilingual(L.status),
  mark: bilingual(L.mark),
  tag: bilingual(L.tag),
  language: bilingual(L.language),
  
  // Timestamps
  createdAt: bilingual(L.created_at),
  updatedAt: bilingual(L.last_updated),
};

// Page text labels
export const PAGE_TEXT = {
  // Page Title
  pageTitle: LU.writing_management,
  
  // Item Name
  itemName: LU.writing,
  
  // Create Button Tooltip
  createTooltip: LU.create_new_writing,
  
  // Filter Labels
  filters: {
    author: LU.author,
    category: LU.category,
    type: LU.type,
    year: LU.year,
    status: LU.status,
    tag: LU.tag,
    language: LU.language,
    mark: LU.mark,
  },
  
  // Control Panel
  controlPanel: {
    sortByDate: LU.sort_by_date,
    sortByDateTooltip: LU.sort_writings_by_date,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_writing_data,
  },
  
  // Field Labels
  fields: {
    coverImageUrl: LU.cover_image,
    author: LU.author,
    title: LU.title,
    subtitle: LU.subtitle,
    summary: LU.summary,
    keywords: LU.keywords,
    category: LU.category,
    type: LU.type,
    year: LU.year,
    paragraphs: LU.paragraphs,
    caption: LU.caption,
    status: LU.status,
    mark: LU.mark,
    tag: LU.tag,
    language: LU.language,
    createdAt: LU.created_at,
    updatedAt: LU.updated_at,
  },
  
  // Empty State Messages
  emptyState: {
    noData: LU.no_writings_found,
    noMatchingWritings: LU.no_matching_writings,
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
    writings: LU.writings_2,
  },
};

// Action labels
export const actionLabels = {
  create_en: "Create Writing",
  create_cn: "创建文章",
  edit_en: "Edit Writing",
  edit_cn: "编辑文章",
  delete_en: L.delete_writing.en,
  delete_cn: L.delete_writing.cn,
  export_en: "Export Writings",
  export_cn: "导出文章",
  import_en: "Import Writings",
  import_cn: "导入文章",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  writing_en: L.writing.en,
  writing_cn: L.writings.cn,
  writings_en: L.writings.en,
  writings_cn: L.writings.cn,
  untitledWriting_en: "Untitled Writing",
  untitledWriting_cn: "无题文章",
};

// Filter labels
export const filterLabels = {
  all_authors_en: F.all_authors.en,
  all_authors_cn: F.all_authors.cn,
  all_types_en: F.all_types.en,
  all_types_cn: F.all_types.cn,
  all_years_en: F.all_years.en,
  all_years_cn: F.all_years.cn,
  all_categories_en: "All Categories",
  all_categories_cn: "全部类别",
  all_statuses_en: F.all_statuses.en,
  all_statuses_cn: F.all_statuses.cn,
  all_tags_en: F.all_tags.en,
  all_tags_cn: F.all_tags.cn,
  all_languages_en: F.all_languages.en,
  all_languages_cn: F.all_languages.cn,
  all_marks_en: F.all_marks.en,
  all_marks_cn: F.all_marks.cn,
};

// Sort labels
export const sortLabels = {
  sort_by_author_en: "Sort by Author",
  sort_by_author_cn: "按作者排序",
  sort_by_title_en: F.sort_by_title.en,
  sort_by_title_cn: F.sort_by_title.cn,
  sort_by_date_en: F.sort_by_date.en,
  sort_by_date_cn: F.sort_by_date.cn,
  sort_by_year_en: F.sort_by_year.en,
  sort_by_year_cn: F.sort_by_year.cn,
  sort_by_type_en: F.sort_by_type.en,
  sort_by_type_cn: F.sort_by_type.cn,
  sort_by_category_en: "Sort by Category",
  sort_by_category_cn: "按类别排序",
  sort_by_update_en: F.sort_by_update.en,
  sort_by_update_cn: F.sort_by_update.cn,
};

// Page labels
export const pageLabels = {
  title_en: L.writing_management.en,
  title_cn: L.writing_management.cn,
  description_en: "Manage and organize writing content",
  description_cn: "管理和组织文章内容",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.writing_index,
  author: L.author,
  title: L.title,
  category: L.category,
  year: L.year,
  type: L.type,
  status: L.status,
  tag: L.tag,
  language: L.language,
  mark: L.mark,
  all: L.all,
  other: L.other,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noWritingsFound: L.no_writings_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  fields: {
    author: L.author,
    title: L.title,
    category: L.category,
    year: L.year,
    type: L.type,
    keywords: L.keywords,
    status: L.status,
  }
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的文章' : 'No writings to display',
  noMatchMessage: (isCn) => isCn ? L.no_matching_writings_found.cn : L.no_matching_writings_found.en,
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// Control panel labels
export const controlPanelLabels = {
  author: L.author.cn,
  category: L.category.cn,
  type: L.type.cn,
  year: L.year.cn,
  status: L.status.cn,
  tag: L.tag.cn,
  language: L.language.cn,
  mark: L.mark.cn,
  sortByDate: L.sort_by_date.cn,
  sortByDateTooltip: L.sort_by_date.en,
  sortByUpdate: L.sort_by_update.cn,
  sortByUpdateTooltip: L.sort_by_update.en,
  authorLabel_en: F.author.en,
  authorLabel_cn: F.author.cn,
  categoryLabel_en: L.category.en,
  categoryLabel_cn: L.category.cn,
  typeLabel_en: F.type.en,
  typeLabel_cn: F.type.cn,
  yearLabel_en: F.year.en,
  yearLabel_cn: F.year.cn,
  statusLabel_en: F.status.en,
  statusLabel_cn: F.status.cn,
  tagLabel_en: F.tag.en,
  tagLabel_cn: F.tag.cn,
  languageLabel_en: F.language.en,
  languageLabel_cn: F.language.cn,
  markLabel_en: F.mark.en,
  markLabel_cn: F.mark.cn,
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "文章列表" : "WRITING LIST",
  detailsLabel: (isCn) => isCn ? "文章详情" : "WRITING DETAILS",
  untitled: (isCn) => isCn ? "无题文章" : "Untitled Writing",
  noDescription: (isCn) => isCn ? '暂无描述' : 'No description available',
  back: (isCn) => isCn ? "返回" : "BACK",
};

// Field group labels
export const fieldGroupLabels = {
  basic: {
    title: (isCn) => isCn ? "基本信息" : "Basic Info",
  },
  content: {
    title: (isCn) => isCn ? "内容" : "Content",
  },
  metadata: {
    title: (isCn) => isCn ? "元数据" : "Metadata",
  },
};

// Field labels for components
export const fieldLabelsForComponents = {
  cover_img_url: L.cover_image,
  author: L.author,
  title: L.title,
  subtitle: L.subtitle,
  summary: L.summary,
  keywords: L.keywords,
  category: L.category,
  type: L.type,
  year: L.year,
  paragraphs: L.paragraphs,
  caption: L.caption,
  status: L.status,
  mark: L.mark,
  tag: L.tag,
  language: L.language,
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: F.this_writing.en,
  delete_dialog_this_item_cn: F.this_writing.cn,
  confirmDeleteWriting_en: "Are you sure you want to delete this writing?",
  confirmDeleteWriting_cn: "确定要删除该文章吗？",
  thisWriting_en: F.this_writing.en,
  thisWriting_cn: F.this_writing.cn,
};

// Additional labels
export const additionalLabels = {
  // Placeholder and description labels
  selectAuthor_en: "Select Author",
  selectAuthor_cn: "选择作者",
  enterAuthorName_en: F.enter_author_name.en,
  enterAuthorName_cn: F.enter_author_name.cn,
  selectCategory_en: "Select Category",
  selectCategory_cn: "选择类别",
  enterCategoryName_en: "Enter category name",
  enterCategoryName_cn: "输入类别名称",
  selectType_en: F.select_type.en,
  selectType_cn: F.select_type.cn,
  enterTypeName_en: F.enter_type_name.en,
  enterTypeName_cn: F.enter_type_name.cn,
  selectStatus_en: F.select_status.en,
  selectStatus_cn: F.select_status.cn,
  selectLanguage_en: F.select_language.en,
  selectLanguage_cn: F.select_language.cn,
  
  // Paragraphs labels
  paragraphs_en: F.paragraphs.en,
  paragraphs_cn: F.paragraphs.cn,
  paragraphsSummary_en: F.paragraphs.en,
  paragraphsSummary_cn: F.paragraphs.cn,
  paragraphsDescription_en: "Add one or more paragraphs for this writing.",
  paragraphsDescription_cn: "为此文章添加一个或多个段落。",
  addParagraphButton_en: F.add_paragraph.en,
  addParagraphButton_cn: F.add_paragraph.cn,
  removeParagraphButton_en: F.remove.en,
  removeParagraphButton_cn: F.remove.cn,
  
  // Entity and collection labels
  no_writings_en: L.no_writings_found.en,
  no_writings_cn: "未找到文章",
  
  // Search and filter labels
  searchWritings_en: "Search writings",
  searchWritings_cn: "搜索文章",
  
  // Status and error labels
  noFeaturedWritings_en: "No featured writings available",
  noFeaturedWritings_cn: "暂无精选文章",
  noMatchingWritings_en: L.no_matching_writings_found.en,
  noMatchingWritings_cn: L.no_writings_found_matching_the_criteria.cn,
  noCategoryFound_en: "No category found",
  noCategoryFound_cn: "暂无类别",
};

// UI Text Configuration
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  writingManagement: L.writing_management,
  noData: L.no_writings_available,
  noMatchingWritings: L.no_matching_writings_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const writingLabels = {
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
  UI_TEXT: UI_TEXT,
  PAGE_TEXT,
};

// Helper function to get labels
export const getWritingLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first
  if (fieldLabels[key]) {
    return fieldLabels[key][language] || fieldLabels[key]['en'] || key;
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (writingLabels[labelKey]) {
    return writingLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (writingLabels[englishKey]) {
      return writingLabels[englishKey];
    }
  }
  
  return key;
};

// Helper function to get UI text
export const getWritingUIText = (key, language = 'en') => {
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
export default writingLabels;
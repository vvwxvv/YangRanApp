import { L, LU, STATUS_LABELS, F, bilingual } from "@/components/labels/managerLabels";
// Field labels based on Series Prisma model
export const fieldLabels = {
  // Core fields
  title: bilingual(L.title),
  artist: bilingual(L.artist),
  cover_img_url: bilingual(L.cover_image),
  type: bilingual(L.type),
  medium: bilingual(L.medium),
  year: bilingual(L.year),
  caption: bilingual(L.caption),
  credits: bilingual(L.credits_ack),
  special_thanks: bilingual(L.special_thanks_thanks),
  introduction: bilingual(L.introduction_preface),
  order: bilingual(L.order_sequence),
  language: bilingual(L.language),
  mark: bilingual(L.mark),
  tag: bilingual(L.tag),

  // Timestamps
  updatedAt: bilingual(L.last_updated),
};

// Page text labels
export const PAGE_TEXT = {
  // Page Title
  pageTitle: LU.series_management,

  // Item Name
  itemName: LU.series_entry,

  // Create Button Tooltip
  createTooltip: LU.create_new_series_entry,

  // Filter Labels
  filters: {
    type: LU.type,
    year: LU.year,
    artist: LU.artist,
    language: LU.language,
  },

  // Control Panel
  controlPanel: {
    sortByOrder: LU.sort_by_order,
    sortByOrderTooltip: LU.sort_entries_by_order,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_series_data,
  },

  // Field Labels
  fields: {
    title: LU.title,
    artist: LU.artist,
    coverImgUrl: LU.cover_image,
    type: LU.type,
    medium: LU.medium,
    year: LU.year,
    caption: LU.caption,
    credits: LU.credits_ack,
    specialThanks: LU.special_thanks_thanks,
    introduction: LU.introduction_preface,
    order: LU.order_sequence,
    language: LU.language,
    mark: LU.mark,
    tag: LU.tag,
    updatedAt: LU.updated_at,
  },

  // Empty State Messages
  emptyState: {
    noData: LU.no_series_entries_found,
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
  create_en: "Create Series Entry",
  create_cn: "创建系列条目",
  edit_en: "Edit Series Entry",
  edit_cn: "编辑系列条目",
  delete_en: "Delete Series Entry",
  delete_cn: "删除系列条目",
  export_en: "Export Series Data",
  export_cn: L.export_series_data.cn,
  import_en: "Import Series Data",
  import_cn: "导入系列数据",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  seriesEntry_en: L.series_entry.en,
  seriesEntry_cn: L.series_entry.cn,
  seriesEntries_en: "Series Entries",
  seriesEntries_cn: L.series_entry.cn,
  untitledEntry_en: F.untitled_entry.en,
  untitledEntry_cn: F.untitled_entry.cn,
};

// Filter labels
export const filterLabels = {
  all_types_en: F.all_types.en,
  all_types_cn: F.all_types.cn,
  all_years_en: F.all_years.en,
  all_years_cn: F.all_years.cn,
  all_artists_en: F.all_artists.en,
  all_artists_cn: F.all_artists.cn,
  all_languages_en: F.all_languages.en,
  all_languages_cn: F.all_languages.cn,
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
  sort_by_language_en: F.sort_by_language.en,
  sort_by_language_cn: F.sort_by_language.cn,
};

// Page labels
export const pageLabels = {
  title_en: L.series_management.en,
  title_cn: L.series_management.cn,
  description_en: "Manage series entries including bodies of work and groupings",
  description_cn: "管理系列条目，包括作品群组",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.series_index,
  title: L.title,
  artist: L.artist,
  type: L.type,
  year: L.year,
  language: L.language,
  mark: L.mark,
  tag: L.tag,
  all: L.all,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noEntriesFound: L.no_series_entries_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  fields: {
    title: L.title,
    artist: L.artist,
    type: L.type,
    year: L.year,
    language: L.language,
  }
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的系列条目' : 'No series entries to display',
  noMatchMessage: (isCn) => isCn ? '未找到匹配的条目' : 'No matching entries found',
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// Control panel labels
export const controlPanelLabels = {
  type: L.type.cn,
  year: L.year.cn,
  artist: L.artist.cn,
  language: L.language.cn,
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
  artistLabel_en: F.artist.en,
  artistLabel_cn: F.artist.cn,
  typeLabel_en: F.type.en,
  typeLabel_cn: F.type.cn,
  yearLabel_en: F.year.en,
  yearLabel_cn: F.year.cn,
  languageLabel_en: F.language.en,
  languageLabel_cn: F.language.cn,
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "系列列表" : "SERIES LIST",
  detailsLabel: (isCn) => isCn ? "系列详情" : "SERIES DETAILS",
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
  artist: L.artist,
  cover_img_url: L.cover_image,
  type: L.type,
  medium: L.medium,
  year: L.year,
  caption: L.caption,
  credits: L.credits_ack,
  special_thanks: L.special_thanks_thanks,
  introduction: L.introduction_preface,
  order: L.order_sequence,
  language: L.language,
  mark: L.mark,
  tag: L.tag,
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: "this series entry",
  delete_dialog_this_item_cn: "该系列条目",
  confirmDeleteEntry_en: "Are you sure you want to delete this series entry?",
  confirmDeleteEntry_cn: "确定要删除该系列条目吗？",
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
  selectLanguage_en: F.select_language.en,
  selectLanguage_cn: F.select_language.cn,
  titlePlaceholder_en: F.enter_title.en,
  titlePlaceholder_cn: F.enter_title.cn,
  artistPlaceholder_en: F.enter_artist_name.en,
  artistPlaceholder_cn: F.enter_artist_name.cn,
  coverImageUrlPlaceholder_en: F.enter_cover_image_url.en,
  coverImageUrlPlaceholder_cn: F.enter_cover_image_url.cn,
  typePlaceholder_en: "Enter type (e.g., Series)",
  typePlaceholder_cn: "输入类型（如：系列）",
  mediumPlaceholder_en: "Enter medium",
  mediumPlaceholder_cn: "输入媒介",
  yearPlaceholder_en: F.enter_year_e_g_2024.en,
  yearPlaceholder_cn: F.enter_year_e_g_2024.cn,
  captionPlaceholder_en: "Enter caption",
  captionPlaceholder_cn: "输入说明",
  creditsPlaceholder_en: "Enter credits",
  creditsPlaceholder_cn: "输入鸣谢",
  specialThanksPlaceholder_en: "Enter special thanks",
  specialThanksPlaceholder_cn: "输入特别感谢",
  languagePlaceholder_en: F.enter_language_e_g_english_chinese.en,
  languagePlaceholder_cn: F.enter_language_e_g_english_chinese.cn,
  markPlaceholder_en: F.enter_mark_optional.en,
  markPlaceholder_cn: F.enter_mark_optional.cn,

  // Entity and collection labels
  no_entries_en: L.no_series_entries_found.en,
  no_entries_cn: "未找到系列条目",

  // Search and filter labels
  searchEntries_en: "Search series entries",
  searchEntries_cn: "搜索系列条目",

  // Status and error labels
  noFeaturedEntries_en: "No featured series entries available",
  noFeaturedEntries_cn: "暂无精选系列条目",
  noMatchingEntries_en: L.no_matching_series_entries_found.en,
  noMatchingEntries_cn: L.no_series_entries_found_matching_the_criteria.cn,
};

// UI Text Configuration (compact error/message strings)
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  seriesManagement: L.series_management,
  noData: L.no_series_entries_available,
  noMatchingEntries: L.no_matching_series_entries_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const seriesLabels = {
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
export const getSeriesLabel = (key, language = 'en') => {
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
  if (seriesLabels[labelKey]) {
    return seriesLabels[labelKey];
  }

  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (seriesLabels[englishKey]) {
      return seriesLabels[englishKey];
    }
  }

  return key;
};

// Helper function to get UI text
export const getSeriesUIText = (key, language = 'en') => {
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
export default seriesLabels;

import { L, LU, STATUS_LABELS, F, bilingual } from "@/components/labels/managerLabels";
// Field labels based on Resume Prisma model
export const fieldLabels = {
  // Core fields
  artist: bilingual(L.artist),
  year: bilingual(L.year),
  start_date: bilingual(L.start_date),
  end_date: bilingual(L.end_date),
  type: bilingual(L.type),
  description: bilingual(L.description),
  introduction: bilingual(L.introduction_preface),
  language: bilingual(L.language),
  mark: bilingual(L.mark),

  // Timestamps
  updatedAt: bilingual(L.last_updated),
};

// Page text labels
export const PAGE_TEXT = {
  // Page Title
  pageTitle: LU.resume_management,

  // Item Name
  itemName: LU.resume_entry,

  // Create Button Tooltip
  createTooltip: LU.create_new_resume_entry,

  // Filter Labels
  filters: {
    type: LU.type,
    year: LU.year,
    artist: LU.artist,
    language: LU.language,
  },

  // Control Panel
  controlPanel: {
    sortByYear: LU.sort_by_year,
    sortByYearTooltip: LU.sort_entries_by_year,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_resume_data,
  },

  // Field Labels
  fields: {
    artist: LU.artist,
    year: LU.year,
    startDate: LU.start_date,
    endDate: LU.end_date,
    type: LU.type,
    description: LU.description,
    introduction: LU.introduction_preface,
    language: LU.language,
    mark: LU.mark,
    updatedAt: LU.updated_at,
  },

  // Empty State Messages
  emptyState: {
    noData: LU.no_resume_entries_found,
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
  create_en: "Create Resume Entry",
  create_cn: "创建履历条目",
  edit_en: "Edit Resume Entry",
  edit_cn: "编辑履历条目",
  delete_en: "Delete Resume Entry",
  delete_cn: "删除履历条目",
  export_en: "Export Resume Data",
  export_cn: L.export_resume_data.cn,
  import_en: "Import Resume Data",
  import_cn: "导入履历数据",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  resumeEntry_en: L.resume_entry.en,
  resumeEntry_cn: L.resume_entry.cn,
  resumeEntries_en: "Resume Entries",
  resumeEntries_cn: L.resume_entry.cn,
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
  sort_by_year_en: F.sort_by_year.en,
  sort_by_year_cn: F.sort_by_year.cn,
  sort_by_update_en: F.sort_by_update.en,
  sort_by_update_cn: F.sort_by_update.cn,
  sort_by_artist_en: F.sort_by_artist.en,
  sort_by_artist_cn: F.sort_by_artist.cn,
  sort_by_language_en: F.sort_by_language.en,
  sort_by_language_cn: F.sort_by_language.cn,
};

// Page labels
export const pageLabels = {
  title_en: L.resume_management.en,
  title_cn: L.resume_management.cn,
  description_en: "Manage resume entries including exhibitions, awards and other career records",
  description_cn: "管理履历条目，包括展览、奖项及其他职业记录",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.resume_index,
  artist: L.artist,
  type: L.type,
  year: L.year,
  language: L.language,
  mark: L.mark,
  all: L.all,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noEntriesFound: L.no_resume_entries_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  fields: {
    artist: L.artist,
    type: L.type,
    year: L.year,
    language: L.language,
  }
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的履历条目' : 'No resume entries to display',
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
  sortByYear: L.sort_by_year.cn,
  sortByYearTooltip: L.sort_by_year.en,
  sortByUpdate: L.sort_by_update.cn,
  sortByUpdateTooltip: L.sort_by_update.en,
  sortByArtist: '按艺术家排序',
  sortByArtistTooltip: 'Sort by Artist',
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
  listTitle: (isCn) => isCn ? "履历列表" : "RESUME LIST",
  detailsLabel: (isCn) => isCn ? "履历详情" : "RESUME DETAILS",
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
  artist: L.artist,
  year: L.year,
  start_date: L.start_date,
  end_date: L.end_date,
  type: L.type,
  description: L.description,
  introduction: L.introduction_preface,
  language: L.language,
  mark: L.mark,
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: "this resume entry",
  delete_dialog_this_item_cn: "该履历条目",
  confirmDeleteEntry_en: "Are you sure you want to delete this resume entry?",
  confirmDeleteEntry_cn: "确定要删除该履历条目吗？",
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
  artistPlaceholder_en: F.enter_artist_name.en,
  artistPlaceholder_cn: F.enter_artist_name.cn,
  typePlaceholder_en: "Enter type (e.g., Exhibition, Award)",
  typePlaceholder_cn: "输入类型（如：展览、奖项）",
  yearPlaceholder_en: F.enter_year_e_g_2024.en,
  yearPlaceholder_cn: F.enter_year_e_g_2024.cn,
  startDatePlaceholder_en: "Enter start date",
  startDatePlaceholder_cn: "输入开始日期",
  endDatePlaceholder_en: "Enter end date",
  endDatePlaceholder_cn: "输入结束日期",
  descriptionPlaceholder_en: "Enter description",
  descriptionPlaceholder_cn: "输入描述",
  languagePlaceholder_en: F.enter_language_e_g_english_chinese.en,
  languagePlaceholder_cn: F.enter_language_e_g_english_chinese.cn,
  markPlaceholder_en: F.enter_mark_optional.en,
  markPlaceholder_cn: F.enter_mark_optional.cn,

  // Entity and collection labels
  no_entries_en: L.no_resume_entries_found.en,
  no_entries_cn: "未找到履历条目",

  // Search and filter labels
  searchEntries_en: "Search resume entries",
  searchEntries_cn: "搜索履历条目",

  // Status and error labels
  noFeaturedEntries_en: "No featured resume entries available",
  noFeaturedEntries_cn: "暂无精选履历条目",
  noMatchingEntries_en: L.no_matching_resume_entries_found.en,
  noMatchingEntries_cn: L.no_resume_entries_found_matching_the_criteria.cn,
};

// UI Text Configuration (compact error/message strings)
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  resumeManagement: L.resume_management,
  noData: L.no_resume_entries_available,
  noMatchingEntries: L.no_matching_resume_entries_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const resumeLabels = {
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
export const getResumeLabel = (key, language = 'en') => {
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
  if (resumeLabels[labelKey]) {
    return resumeLabels[labelKey];
  }

  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (resumeLabels[englishKey]) {
      return resumeLabels[englishKey];
    }
  }

  return key;
};

// Helper function to get UI text
export const getResumeUIText = (key, language = 'en') => {
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
export default resumeLabels;

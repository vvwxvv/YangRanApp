import { L, LU, STATUS_LABELS, F } from "@/components/labels/managerLabels";
// Field labels based on Event Prisma model
export const fieldLabels = {
  // Core fields
  cover_img_url: L.cover_image,
  title: L.title,
  subtitle: L.subtitle,
  year: L.year,
  date_time: L.date_time,
  type: L.type,
  host: L.host,
  support: L.support,
  special_thanks: L.special_thanks_ack,
  venue: L.venue_2,
  address: L.address,
  caption: L.caption,
  introduction: L.introduction,
  related_artist: L.related_artist,
  web_url: L.website_url_2,
  video_url: L.video_url,

  // Metadata fields
  order: L.order_sort,
  mark: L.mark,
  language: L.language,

  // Timestamps
  updatedAt: L.last_updated,
};

// Page text labels
export const PAGE_TEXT = {
  // Page Title
  pageTitle: LU.event_management,

  // Item Name
  itemName: LU.event,

  // Create Button Tooltip
  createTooltip: LU.create_new_event,

  // Filter Labels
  filters: {
    title: LU.title,
    type: LU.type,
    year: LU.year,
    date_time: LU.date_time,
    venue: LU.venue_2,
    language: LU.language,
    mark: LU.mark,
    order: LU.order_sort,
    host: LU.host,
    support: LU.support,
  },

  // Control Panel
  controlPanel: {
    sortByDate: LU.sort_by_date_time,
    sortByDateTooltip: LU.sort_events_by_date_time,
    sortByOrder: LU.sort_by_order,
    sortByOrderTooltip: LU.sort_events_by_order,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date_3,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_event_data,
  },

  // Field Labels
  fields: {
    coverImageUrl: LU.cover_image,
    title: LU.title,
    subtitle: LU.subtitle,
    year: LU.year,
    date_time: LU.date_time,
    type: LU.type,
    host: LU.host,
    support: LU.support,
    special_thanks: LU.special_thanks_ack,
    venue: LU.venue_2,
    address: LU.address,
    caption: LU.caption,
    introduction: LU.introduction,
    related_artist: LU.related_artist,
    web_url: LU.website_url_2,
    video_url: LU.video_url,
    order: LU.order_sort,
    mark: LU.mark,
    language: LU.language,
    updatedAt: LU.updated_at,
  },

  // Empty State Messages
  emptyState: {
    noData: LU.no_events_found,
    noMatchingEvents: LU.no_matching_events,
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
    events: LU.events,
  },
};

// Action labels
export const actionLabels = {
  create_en: "Create Event",
  create_cn: "创建活动",
  edit_en: "Edit Event",
  edit_cn: "编辑活动",
  delete_en: "Delete Event",
  delete_cn: "删除活动",
  export_en: "Export Events",
  export_cn: "导出活动",
  import_en: "Import Events",
  import_cn: "导入活动",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  event_en: F.event.en,
  event_cn: F.event.cn,
  events_en: "Events",
  events_cn: L.event.cn,
  untitledEvent_en: "Untitled Event",
  untitledEvent_cn: "无题活动",
};

// Filter labels
export const filterLabels = {
  all_titles_en: F.all_titles.en,
  all_titles_cn: F.all_titles.cn,
  all_types_en: F.all_types.en,
  all_types_cn: F.all_types.cn,
  all_years_en: F.all_years.en,
  all_years_cn: F.all_years.cn,
  all_venues_en: "All Venues",
  all_venues_cn: "全部场地",
  all_marks_en: F.all_marks.en,
  all_marks_cn: F.all_marks.cn,
  all_languages_en: F.all_languages.en,
  all_languages_cn: F.all_languages.cn,
  all_hosts_en: "All Hosts",
  all_hosts_cn: "全部主办方",
  all_supports_en: "All Support",
  all_supports_cn: "全部支持单位",
};

// Sort labels
export const sortLabels = {
  sort_by_title_en: F.sort_by_title.en,
  sort_by_title_cn: F.sort_by_title.cn,
  sort_by_date_en: F.sort_by_date.en,
  sort_by_date_cn: F.sort_by_date.cn,
  sort_by_year_en: F.sort_by_year.en,
  sort_by_year_cn: F.sort_by_year.cn,
  sort_by_type_en: F.sort_by_type.en,
  sort_by_type_cn: F.sort_by_type.cn,
  sort_by_venue_en: F.sort_by_venue.en,
  sort_by_venue_cn: F.sort_by_venue.cn,
  sort_by_order_en: F.sort_by_order.en,
  sort_by_order_cn: F.sort_by_order.cn,
  sort_by_update_en: F.sort_by_update.en,
  sort_by_update_cn: F.sort_by_update.cn,
};

// Page labels
export const pageLabels = {
  title_en: F.event_management.en,
  title_cn: F.event_management.cn,
  description_en: "Manage and organize event content",
  description_cn: "管理和组织活动内容",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.event_index,
  title: L.title,
  subtitle: L.subtitle,
  type: L.type,
  year: L.year,
  date_time: L.date_time,
  host: L.host,
  support: L.support,
  special_thanks: L.special_thanks_ack,
  venue: L.venue_2,
  address: L.address,
  order: L.order_sort,
  mark: L.mark,
  language: L.language,
  all: L.all,
  other: L.other,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noEventsFound: L.no_events_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  fields: {
    title: L.title,
    subtitle: L.subtitle,
    type: L.type,
    year: L.year,
    date_time: L.date_time,
    host: L.host,
    support: L.support,
    special_thanks: L.special_thanks_ack,
    venue: L.venue_2,
    address: L.address,
    order: L.order_sort,
  }
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的活动' : 'No events to display',
  noMatchMessage: (isCn) => isCn ? L.no_matching_events_found.cn : L.no_matching_events_found.en,
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// Control panel labels
export const controlPanelLabels = {
  title: (isCn) => isCn ? L.title.cn : L.title.en,
  type: (isCn) => isCn ? L.type.cn : L.type.en,
  year: (isCn) => isCn ? L.year.cn : L.year.en,
  date_time: (isCn) => isCn ? L.date_time.cn : L.date_time.en,
  venue: (isCn) => isCn ? '场地' : 'Venue',
  order: (isCn) => isCn ? L.order_sort.cn : L.order_sort.en,
  language: (isCn) => isCn ? L.language.cn : L.language.en,
  mark: (isCn) => isCn ? L.mark.cn : L.mark.en,
  host: (isCn) => isCn ? '主办方' : 'Host',
  support: (isCn) => isCn ? L.support.cn : L.support.en,
  sortByTitle: (isCn) => isCn ? L.sort_by_title.cn : L.sort_by_title.en,
  sortByTitleTooltip: (isCn) => isCn ? '按标题排序活动' : 'Sort events by title',
  sortByDate: (isCn) => isCn ? L.sort_by_date_time.cn : L.sort_by_date_time.en,
  sortByDateTooltip: (isCn) => isCn ? L.sort_events_by_date_time.cn : L.sort_events_by_date_time.en,
  sortByOrder: (isCn) => isCn ? L.sort_by_order.cn : L.sort_by_order.en,
  sortByOrderTooltip: (isCn) => isCn ? L.sort_events_by_order.cn : L.sort_events_by_order.en,
  sortByUpdate: (isCn) => isCn ? L.sort_by_update.cn : L.sort_by_update.en,
  sortByUpdateTooltip: (isCn) => isCn ? L.sort_by_update_date.cn : L.sort_by_update_date.en,
  // Backwards compatibility
  titleLabel_en: F.title.en,
  titleLabel_cn: F.title.cn,
  typeLabel_en: F.type.en,
  typeLabel_cn: F.type.cn,
  yearLabel_en: F.year.en,
  yearLabel_cn: F.year.cn,
  venueLabel_en: F.venue.en,
  venueLabel_cn: F.venue.cn,
  orderLabel_en: F.order.en,
  orderLabel_cn: F.order.cn,
  languageLabel_en: F.language.en,
  languageLabel_cn: F.language.cn,
  markLabel_en: F.mark.en,
  markLabel_cn: F.mark.cn,
  hostLabel_en: L.host.en,
  hostLabel_cn: L.organiser.cn,
  supportLabel_en: L.support.en,
  supportLabel_cn: L.support.cn,
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "活动列表" : "EVENT LIST",
  detailsLabel: (isCn) => isCn ? "活动详情" : "EVENT DETAILS",
  untitled: (isCn) => isCn ? "无题活动" : "Untitled Event",
  noDescription: (isCn) => isCn ? '暂无描述' : 'No description available',
  back: (isCn) => isCn ? "返回" : "BACK",
};

// Field group labels — matches eventConfig fieldGroups: BASIC, ADDITIONAL, IMAGES
export const fieldGroupLabels = {
  basic: {
    title: (isCn) => isCn ? "基本信息" : "Basic Info",
  },
  additional: {
    title: (isCn) => isCn ? "附加信息" : "Additional Info",
  },
  images: {
    title: (isCn) => isCn ? "图片" : "Images",
  },
  // Legacy aliases
  location: {
    title: (isCn) => isCn ? "位置信息" : "Location Details",
  },
  content: {
    title: (isCn) => isCn ? "内容" : "Content",
  },
};

// Field labels for components — all Prisma Event fields
export const fieldLabelsForComponents = {
  cover_img_url: L.cover_image,
  title: L.title,
  subtitle: L.subtitle,
  type: L.type,
  year: L.year,
  date_time: L.date_time,
  host: L.host,
  support: L.support,
  special_thanks: L.special_thanks_ack,
  venue: L.venue_2,
  address: L.address,
  caption: L.caption,
  introduction: L.introduction,
  related_artist: L.related_artist,
  web_url: L.website_url_2,
  video_url: L.video_url,
  order: L.order_sort,
  mark: L.mark,
  language: L.language,
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: F.this_event.en,
  delete_dialog_this_item_cn: F.this_event.cn,
  confirmDeleteEvent_en: "Are you sure you want to delete this event?",
  confirmDeleteEvent_cn: "确定要删除该活动吗？",
  thisEvent_en: F.this_event.en,
  thisEvent_cn: F.this_event.cn,
};

// Additional labels
export const additionalLabels = {
  // Placeholder and description labels
  selectTitle_en: F.select_title.en,
  selectTitle_cn: F.select_title.cn,
  enterTitle_en: "Enter event title",
  enterTitle_cn: "输入活动标题",
  selectType_en: F.select_type.en,
  selectType_cn: F.select_type.cn,
  enterTypeName_en: F.enter_type_name.en,
  enterTypeName_cn: F.enter_type_name.cn,
  selectVenue_en: "Select Venue",
  selectVenue_cn: "选择场地",
  selectOrder_en: F.select_order.en,
  selectOrder_cn: F.select_order.cn,
  selectLanguage_en: F.select_language.en,
  selectLanguage_cn: F.select_language.cn,
  selectHost_en: "Select Host",
  selectHost_cn: "选择主办方",
  selectSupport_en: "Select Support",
  selectSupport_cn: "选择支持单位",

  // Introduction labels
  introduction_en: F.introduction.en,
  introduction_cn: F.introduction.cn,
  introductionSummary_en: F.introduction.en,
  introductionSummary_cn: F.introduction.cn,
  introductionDescription_en: F.add_introduction_paragraphs.en,
  introductionDescription_cn: F.add_introduction_paragraphs.cn,
  addIntroductionButton_en: F.add_paragraph.en,
  addIntroductionButton_cn: F.add_paragraph.cn,
  removeIntroductionButton_en: F.remove.en,
  removeIntroductionButton_cn: F.remove.cn,

  // Entity and collection labels
  no_events_en: L.no_events_found.en,
  no_events_cn: "未找到活动",

  // Search and filter labels
  searchEvents_en: "Search events",
  searchEvents_cn: "搜索活动",

  // Status and error labels
  noFeaturedEvents_en: "No featured events available",
  noFeaturedEvents_cn: "暂无精选活动",
  noMatchingEvents_en: L.no_matching_events_found.en,
  noMatchingEvents_cn: L.no_events_found_matching_the_criteria.cn,

  // Order labels
  order_en: F.order.en,
  order_cn: F.order.cn,
};

// UI Text Configuration
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  eventManagement: L.event_management,
  noData: L.no_events_available,
  noMatchingEvents: L.no_matching_events_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const eventLabels = {
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
export const getEventLabel = (key, language = 'en') => {
  if (!key) return '';

  // Try direct field labels first (now bilingual objects)
  if (fieldLabels[key]) {
    if (typeof fieldLabels[key] === 'object') {
      return fieldLabels[key][language] || fieldLabels[key]['en'] || key;
    }
    return fieldLabels[key];
  }

  // Try fieldLabelsForComponents
  if (fieldLabelsForComponents[key]) {
    return fieldLabelsForComponents[key][language] || fieldLabelsForComponents[key]['en'] || key;
  }

  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (eventLabels[labelKey]) {
    return eventLabels[labelKey];
  }

  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (eventLabels[englishKey]) {
      return eventLabels[englishKey];
    }
  }

  return key;
};

// Helper function to get UI text
export const getEventUIText = (key, language = 'en') => {
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
export default eventLabels;
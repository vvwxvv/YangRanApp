import { L, LU, STATUS_LABELS, F, bilingual } from "@/components/labels/managerLabels";
// Field labels based on Video Prisma model
export const fieldLabels = {
  // Core fields
  video_url: bilingual(L.video_url),
  tag_en: F.tag_en.en,
  tag_cn: F.tag_en.cn,
  type: bilingual(L.type),
  caption_en: F.caption_en.en,
  caption_cn: F.caption_en.cn,
  mark: bilingual(L.mark),
  tag_source: bilingual(L.tag_source),
  order: bilingual(L.order_sequence),
  
  // Timestamps
  updatedAt: bilingual(L.last_updated),
};

// Page text labels
export const PAGE_TEXT = {
  // Page Title
  pageTitle: LU.video_management,
  
  // Item Name
  itemName: LU.video,
  
  // Create Button Tooltip
  createTooltip: LU.create_new_video,
  
  // Filter Labels
  filters: {
    tag: LU.tag,
    type: LU.type,
    tag_source: LU.tag_source,
    mark: LU.mark,
    order: LU.order_sequence,
  },
  
  // Control Panel
  controlPanel: {
    sortByOrder: LU.sort_by_order,
    sortByOrderTooltip: LU.sort_videos_by_order,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_video_data,
  },
  
  // Field Labels
  fields: {
    videoUrl: LU.video_url,
    tagEn: LU.tag_en,
    tagCn: LU.tag_cn,
    tag: LU.tag,
    type: LU.type,
    captionEn: LU.caption_en,
    captionCn: LU.caption_cn,
    caption: LU.caption,
    mark: LU.mark,
    tagSource: LU.tag_source,
    order: LU.order_sequence,
    updatedAt: LU.updated_at,
  },
  
  // Empty State Messages
  emptyState: {
    noData: LU.no_videos_found,
    noMatchingVideos: LU.no_matching_videos,
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
    videos: LU.videos,
  },
};

// Action labels
export const actionLabels = {
  create_en: "Create Video",
  create_cn: "创建视频",
  edit_en: "Edit Video",
  edit_cn: "编辑视频",
  delete_en: "Delete Video",
  delete_cn: "删除视频",
  export_en: "Export Videos",
  export_cn: "导出视频",
  import_en: "Import Videos",
  import_cn: "导入视频",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  video_en: L.video.en,
  video_cn: L.video.cn,
  videos_en: "Videos",
  videos_cn: L.video.cn,
  untitledVideo_en: "Untitled Video",
  untitledVideo_cn: "无题视频",
};

// Filter labels
export const filterLabels = {
  all_tags_en: F.all_tags.en,
  all_tags_cn: F.all_tags.cn,
  all_types_en: F.all_types.en,
  all_types_cn: F.all_types.cn,
  all_tag_sources_en: F.all_tag_sources.en,
  all_tag_sources_cn: F.all_tag_sources.cn,
  all_marks_en: F.all_marks.en,
  all_marks_cn: F.all_marks.cn,
};

// Sort labels
export const sortLabels = {
  sort_by_tag_en: F.sort_by_tag.en,
  sort_by_tag_cn: F.sort_by_tag.cn,
  sort_by_type_en: F.sort_by_type.en,
  sort_by_type_cn: F.sort_by_type.cn,
  sort_by_tag_source_en: F.sort_by_tag_source.en,
  sort_by_tag_source_cn: F.sort_by_tag_source.cn,
  sort_by_order_en: F.sort_by_order.en,
  sort_by_order_cn: F.sort_by_order.cn,
  sort_by_update_en: F.sort_by_update.en,
  sort_by_update_cn: F.sort_by_update.cn,
};

// Page labels
export const pageLabels = {
  title_en: L.video_management.en,
  title_cn: L.video_management.cn,
  description_en: "Manage and organize video content",
  description_cn: "管理和组织视频内容",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.video_index,
  tag: L.tag,
  type: L.type,
  tag_source: L.tag_source,
  mark: L.mark,
  order: L.order_sequence,
  all: L.all,
  other: L.other,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noVideosFound: L.no_videos_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  fields: {
    tag: L.tag,
    type: L.type,
    caption: L.caption,
    tag_source: L.tag_source,
    order: L.order_sequence,
  }
};

// Display labels
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的视频' : 'No videos to display',
  noMatchMessage: (isCn) => isCn ? L.no_matching_videos_found.cn : L.no_matching_videos_found.en,
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// Control panel labels
export const controlPanelLabels = {
  tag: L.tag.cn,
  type: L.type.cn,
  tag_source: L.tag_source.cn,
  mark: L.mark.cn,
  order: L.order_sequence.cn,
  sortByOrder: L.sort_by_order.cn,
  sortByOrderTooltip: L.sort_by_order.en,
  sortByUpdate: L.sort_by_update.cn,
  sortByUpdateTooltip: L.sort_by_update.en,
  tagLabel_en: F.tag.en,
  tagLabel_cn: F.tag.cn,
  typeLabel_en: F.type.en,
  typeLabel_cn: F.type.cn,
  tagSourceLabel_en: F.tag_source.en,
  tagSourceLabel_cn: F.tag_source.cn,
  markLabel_en: F.mark.en,
  markLabel_cn: F.mark.cn,
  orderLabel_en: F.order_2.en,
  orderLabel_cn: F.order_2.cn,
};

// Default content labels
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "视频列表" : "VIDEO LIST",
  detailsLabel: (isCn) => isCn ? "视频详情" : "VIDEO DETAILS",
  untitled: (isCn) => isCn ? "无题视频" : "Untitled Video",
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
};

// Field labels for components
export const fieldLabelsForComponents = {
  video_url: L.video_url,
  tag_en: L.tag_en,
  tag_cn: L.tag_cn,
  type: L.type,
  caption_en: L.caption_en,
  caption_cn: L.caption_cn,
  mark: L.mark,
  tag_source: L.tag_source,
  order: L.order_sequence,
};

// Delete dialog labels
export const deleteDialogLabels = {
  delete_dialog_this_item_en: F.this_video.en,
  delete_dialog_this_item_cn: F.this_video.cn,
  confirmDeleteVideo_en: "Are you sure you want to delete this video?",
  confirmDeleteVideo_cn: "确定要删除该视频吗？",
  thisVideo_en: F.this_video.en,
  thisVideo_cn: F.this_video.cn,
};

// Additional labels
export const additionalLabels = {
  // Placeholder and description labels
  selectTag_en: F.select_tag.en,
  selectTag_cn: F.select_tag.cn,
  enterTag_en: F.enter_tag.en,
  enterTag_cn: F.enter_tag.cn,
  selectType_en: F.select_type.en,
  selectType_cn: F.select_type.cn,
  enterTypeName_en: F.enter_type_name.en,
  enterTypeName_cn: F.enter_type_name.cn,
  selectTagSource_en: F.select_tag_source.en,
  selectTagSource_cn: F.select_tag_source.cn,
  
  // Entity and collection labels
  no_videos_en: L.no_videos_found.en,
  no_videos_cn: "未找到视频",
  
  // Search and filter labels
  searchVideos_en: F.search_videos.en,
  searchVideos_cn: F.search_videos.cn,
  
  // Status and error labels
  noFeaturedVideos_en: "No featured videos available",
  noFeaturedVideos_cn: "暂无精选视频",
  noMatchingVideos_en: L.no_matching_videos_found.en,
  noMatchingVideos_cn: L.no_videos_found_matching_the_criteria.cn,
};

// UI Text Configuration
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  videoManagement: L.video_management,
  noData: L.no_videos_available,
  noMatchingVideos: L.no_matching_videos_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const videoLabels = {
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
export const getVideoLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first
  if (fieldLabels[key]) {
    return fieldLabels[key][language] || fieldLabels[key]['en'] || key;
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (videoLabels[labelKey]) {
    return videoLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (videoLabels[englishKey]) {
      return videoLabels[englishKey];
    }
  }
  
  return key;
};

// Helper function to get UI text
export const getVideoUIText = (key, language = 'en') => {
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
export default videoLabels;
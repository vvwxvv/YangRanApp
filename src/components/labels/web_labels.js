import { L, LU, STATUS_LABELS, F, bilingual } from "@/components/labels/managerLabels";
// Field labels based on Web Prisma model
export const fieldLabels = {
  // Core fields
  web_url: bilingual(L.web_url),
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
  pageTitle: LU.web_management,
  
  // Item Name
  itemName: LU.web,
  
  // Create Button Tooltip
  createTooltip: LU.create_new_web,
  
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
    sortByOrderTooltip: LU.sort_webs_by_order,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_web_data,
  },
  
  // Field Labels
  fields: {
    webUrl: LU.web_url,
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
    noData: LU.no_webs_found,
    noMatchingWebs: LU.no_matching_webs,
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
    webs: LU.webs,
  },
};

// Action labels
export const actionLabels = {
  create_en: "Create Web",
  create_cn: "创建网页",
  edit_en: "Edit Web",
  edit_cn: "编辑网页",
  delete_en: "Delete Web",
  delete_cn: "删除网页",
  export_en: "Export Webs",
  export_cn: "导出网页",
  import_en: "Import Webs",
  import_cn: "导入网页",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  web_en: L.web.en,
  web_cn: L.web.cn,
  webs_en: "Webs",
  webs_cn: L.web.cn,
  untitledWeb_en: "Untitled Web",
  untitledWeb_cn: "无题网页",
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
  title_en: L.web_management.en,
  title_cn: L.web_management.cn,
  description_en: "Manage and organize web content",
  description_cn: "管理和组织网页内容",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.web_index,
  tag: L.tag,
  type: L.type,
  tag_source: L.tag_source,
  mark: L.mark,
  order: L.order_sequence,
  all: L.all,
  other: L.other,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noWebsFound: L.no_webs_found_matching_the_criteria,
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
  emptyMessage: (isCn) => isCn ? '没有可显示的网页' : 'No webs to display',
  noMatchMessage: (isCn) => isCn ? L.no_matching_webs_found.cn : L.no_matching_webs_found.en,
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
  listTitle: (isCn) => isCn ? "网页列表" : "WEB LIST",
  detailsLabel: (isCn) => isCn ? "网页详情" : "WEB DETAILS",
  untitled: (isCn) => isCn ? "无题网页" : "Untitled Web",
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
  web_url: L.web_url,
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
  delete_dialog_this_item_en: F.this_web.en,
  delete_dialog_this_item_cn: F.this_web.cn,
  confirmDeleteWeb_en: "Are you sure you want to delete this web?",
  confirmDeleteWeb_cn: "确定要删除该网页吗？",
  thisWeb_en: F.this_web.en,
  thisWeb_cn: F.this_web.cn,
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
  no_webs_en: L.no_webs_found.en,
  no_webs_cn: "未找到网页",
  
  // Search and filter labels
  searchWebs_en: "Search webs",
  searchWebs_cn: "搜索网页",
  
  // Status and error labels
  noFeaturedWebs_en: "No featured webs available",
  noFeaturedWebs_cn: "暂无精选网页",
  noMatchingWebs_en: L.no_matching_webs_found.en,
  noMatchingWebs_cn: L.no_webs_found_matching_the_criteria.cn,
};

// UI Text Configuration
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  webManagement: L.web_management,
  noData: L.no_webs_available,
  noMatchingWebs: L.no_matching_webs_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const webLabels = {
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
export const getWebLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first
  if (fieldLabels[key]) {
    return fieldLabels[key][language] || fieldLabels[key]['en'] || key;
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (webLabels[labelKey]) {
    return webLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (webLabels[englishKey]) {
      return webLabels[englishKey];
    }
  }
  
  return key;
};

// Helper function to get UI text
export const getWebUIText = (key, language = 'en') => {
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
export default webLabels;
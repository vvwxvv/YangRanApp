import { L, LU, STATUS_LABELS, F, bilingual } from "@/components/labels/managerLabels";
// Field labels based on Image Prisma model
export const fieldLabels = {
  // Core fields
  img_url: bilingual(L.image_url),
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
  pageTitle: LU.image_management,
  
  // Item Name
  itemName: LU.image,
  
  // Create Button Tooltip
  createTooltip: LU.create_new_image,
  
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
    sortByOrderTooltip: LU.sort_images_by_order,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_image_data,
  },
  
  // Field Labels
  fields: {
    imgUrl: LU.image_url,
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
    noData: LU.no_images_found,
    noMatchingImages: LU.no_matching_images,
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
    images: LU.images_2,
  },
};

// Action labels
export const actionLabels = {
  create_en: F.create_image.en,
  create_cn: F.create_image.cn,
  edit_en: "Edit Image",
  edit_cn: "编辑图片",
  delete_en: "Delete Image",
  delete_cn: "删除图片",
  export_en: "Export Images",
  export_cn: "导出图片",
  import_en: "Import Images",
  import_cn: "导入图片",
};

// Status labels
export const statusLabels = { ...STATUS_LABELS };

// Entity labels
export const entityLabels = {
  image_en: F.image.en,
  image_cn: F.image.cn,
  images_en: L.images.en,
  images_cn: L.image.cn,
  untitledImage_en: "Untitled Image",
  untitledImage_cn: "无题图片",
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
  title_en: F.image_management.en,
  title_cn: F.image_management.cn,
  description_en: "Manage and organize image content",
  description_cn: "管理和组织图片内容",
};

// UI Text labels
export const uiTextLabels = {
  pageTitle: L.image_index,
  tag: L.tag,
  type: L.type,
  tag_source: L.tag_source,
  mark: L.mark,
  order: L.order_sequence,
  all: L.all,
  other: L.other,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noImagesFound: L.no_images_found_matching_the_criteria,
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
  emptyMessage: (isCn) => isCn ? '没有可显示的图片' : 'No images to display',
  noMatchMessage: (isCn) => isCn ? L.no_matching_images_found.cn : L.no_matching_images_found.en,
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
  listTitle: (isCn) => isCn ? "图片列表" : "IMAGE LIST",
  detailsLabel: (isCn) => isCn ? "图片详情" : "IMAGE DETAILS",
  untitled: (isCn) => isCn ? "无题图片" : "Untitled Image",
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
  img_url: L.image_url,
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
  delete_dialog_this_item_en: F.this_image.en,
  delete_dialog_this_item_cn: F.this_image.cn,
  confirmDeleteImage_en: L.are_you_sure_you_want_to_delete_this_image.en,
  confirmDeleteImage_cn: "确定要删除该图片吗？",
  thisImage_en: F.this_image.en,
  thisImage_cn: F.this_image.cn,
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
  no_images_en: L.no_images_found.en,
  no_images_cn: "未找到图片",
  
  // Search and filter labels
  searchImages_en: "Search images",
  searchImages_cn: "搜索图片",
  
  // Status and error labels
  noFeaturedImages_en: "No featured images available",
  noFeaturedImages_cn: "暂无精选图片",
  noMatchingImages_en: L.no_matching_images_found.en,
  noMatchingImages_cn: L.no_images_found_matching_the_criteria.cn,
};

// UI Text Configuration
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  imageManagement: L.image_management,
  noData: L.no_images_available,
  noMatchingImages: L.no_matching_images_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// Combined labels object for easy access
export const imageLabels = {
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
export const getImageLabel = (key, language = 'en') => {
  if (!key) return '';
  
  // Try direct field labels first
  if (fieldLabels[key]) {
    return fieldLabels[key][language] || fieldLabels[key]['en'] || key;
  }
  
  // Try labels with language suffix
  const labelKey = `${key}_${language}`;
  if (imageLabels[labelKey]) {
    return imageLabels[labelKey];
  }
  
  // Fallback to English if Chinese not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (imageLabels[englishKey]) {
      return imageLabels[englishKey];
    }
  }
  
  return key;
};

// Helper function to get UI text
export const getImageUIText = (key, language = 'en') => {
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
export default imageLabels;
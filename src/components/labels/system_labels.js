import { L, LU, F } from "@/components/labels/managerLabels";
import { useContext } from 'react';
import { LanguageContext } from '@/components/contexts/LanguageContext';
/**
 * createBasePageText
 * ─────────────────────────────────────────────────────────────
 * Produces the normalised PageText object expected by ManagerStructureLayout,
 * pre-filled with sensible defaults.
 *
 * Each schema only needs to spread-override the keys it cares about.
 *
 * @example
 *   pageText: createBasePageText({
 *     createTooltip: LU.add_writing,
 *     deleteDialog: { title: LU.delete_writing, ... }
 *   })
 *
 * @param {Partial<PageText>} overrides
 * @returns {PageText}
 */
const BASE_PAGE_TEXT = {
  createTooltip: LU.create_new_generic,
  export: {
    success: LU.export_success,
    items: LU.items,
    error: LU.export_failed,
  },
  emptyState: {
    noData: LU.no_items_found,
    noMatchingItems: LU.no_matching_results,
  },
  errors: {
    loadingError: LU.failed_to_load_data,
    systemError: LU.system_error,
    tryAgain: LU.try_again,
    pleaseRetry: LU.please_try_again,
    ok: LU.ok,
  },
  deleteDialog: {
    title: LU.confirm_delete,
    confirm: LU.delete,
    cancel: LU.cancel,
  },
};

/**
 * Merge a schema's partial overrides into the single shared base. Keeping the
 * defaults in BASE_PAGE_TEXT (instead of re-listing them twice) means a new
 * default only has to be added once.
 */
export const createBasePageText = (overrides = {}) => ({
  ...BASE_PAGE_TEXT,
  ...overrides,
  export: { ...BASE_PAGE_TEXT.export, ...(overrides.export ?? {}) },
  emptyState: { ...BASE_PAGE_TEXT.emptyState, ...(overrides.emptyState ?? {}) },
  errors: { ...BASE_PAGE_TEXT.errors, ...(overrides.errors ?? {}) },
  deleteDialog: { ...BASE_PAGE_TEXT.deleteDialog, ...(overrides.deleteDialog ?? {}) },
});

export const systemLabels = {
  // ===========================================
  // COMMON FORM ACTIONS
  // ===========================================
  submitButton_en: "Submit",
  submitButton_cn: "提交",
  submittingButton_en: "Submitting...",
  submittingButton_cn: "提交中...",
  updateButton_en: "Update",
  updateButton_cn: "更新",
  updatingButton_en: "Updating...",
  updatingButton_cn: "更新中...",
  cancel_en: F.cancel.en,
  cancel_cn: F.cancel.cn,
  confirm_en: "Confirm",
  confirm_cn: "确认",
  delete_en: F.delete.en,
  delete_cn: F.delete.cn,
  save_en: "Save All Changes",
  save_cn: "保存所有更改",
  saving_en: "Saving...",
  saving_cn: "保存中...",
  refresh_cn : "刷新",
  refresh_en: "Refresh",
  updateAt_en: "Update At",
  updateAt_cn: L.updated_at.cn,

  // ===========================================
  // UNIVERSAL MANAGEMENT LABELS
  // ===========================================
  page_title_en: "Management",
  page_title_cn: "管理",
  create_en: "Create",
  create_cn: "创建",
  edit_en: F.edit.en,
  edit_cn: F.edit.cn,
  batch_edit_en: F.batch_edit.en,
  batch_edit_cn: F.batch_edit.cn,
  batchPageTitle_en: F.batch_edit.en,
  batchPageTitle_cn: F.batch_edit.cn,
  instructions_en: "Edit data directly in the table. Changes are saved when you click Save.",
  instructions_cn: "直接在表格中编辑数据。点击保存时更改将被保存。",
  addRow_en: "Add Row",
  addRow_cn: "添加行",
  deleteSelected_en: F.delete_selected.en,
  deleteSelected_cn: F.delete_selected.cn,
  noMatchingData_en: "No matching data found",
  noMatchingData_cn: "未找到匹配数据",
  confirmDelete_en: F.confirm_delete.en,
  confirmDelete_cn: F.confirm_delete.cn,
  confirmDeleteMessage_en: "Are you sure you want to delete the selected items? This action cannot be undone.",
  confirmDeleteMessage_cn: "您确定要删除选中的项目吗？此操作无法撤销。",
  untitled_en: F.untitled.en,
  untitled_cn: F.untitled.cn,
  confirmSave_en: F.confirm_save.en,
  confirmSave_cn: F.confirm_save.cn,
  saveSuccess_en: "Data saved successfully",
  saveSuccess_cn: "数据保存成功",
  saveFailed_en: "Failed to save data",
  saveFailed_cn: "保存数据失败",
  export_data_en: F.export_data.en,
  export_data_cn: F.export_data.cn,
  refresh_en: F.refresh.en,
  refresh_cn: F.refresh.cn,

  // ===========================================
  // UNIVERSAL STATUS LABELS
  // ===========================================
  success_en: F.operation_completed_successfully.en,
  success_cn: F.operation_completed_successfully.cn,
  error_en: "An error occurred",
  error_cn: "发生错误",
  loading_en: F.loading.en,
  loading_cn: F.loading.cn,
  no_data_en: F.no_data_available.en,
  no_data_cn: F.no_data_available.cn,
  no_image_en: "No Image",
  no_image_cn: "无图片",

  // ===========================================
  // UNIVERSAL FORM LABELS
  // ===========================================
  required_en: F.this_field_is_required.en,
  required_cn: F.this_field_is_required.cn,

  // ===========================================
  // UNIVERSAL DIALOG LABELS
  // ===========================================
  delete_dialog_title_en: F.confirm_delete.en,
  delete_dialog_title_cn: F.confirm_delete.cn,
  delete_dialog_text_en: "Are you sure you want to delete?",
  delete_dialog_text_cn: "确定要删除吗？",
  delete_dialog_cancel_en: F.cancel.en,
  delete_dialog_cancel_cn: F.cancel.cn,
  delete_dialog_confirm_en: F.delete.en,
  delete_dialog_confirm_cn: F.delete.cn,

  // ===========================================
  // UNIVERSAL FILTER LABELS
  // ===========================================
  all_en: F.all.en,
  all_cn: F.all.cn,
  search_en: F.search.en,
  search_cn: F.search.cn,
  search_placeholder_en: "Search...",
  search_placeholder_cn: "搜索...",
  filter_en: "Filter",
  filter_cn: "筛选",
  reset_filters_en: "Reset Filters",
  reset_filters_cn: "重置筛选",

  // ===========================================
  // UNIVERSAL SORT LABELS
  // ===========================================
  sort_en: F.sort.en,
  sort_cn: F.sort.cn,
  sort_by_title_en: F.sort_by_title.en,
  sort_by_title_cn: F.sort_by_title.cn,
  sort_asc_en: F.ascending.en,
  sort_asc_cn: F.ascending.cn,
  sort_desc_en: F.descending.en,
  sort_desc_cn: F.descending.cn,
  sort_by_en: "Sort by",
  sort_by_cn: "排序方式",

  // ===========================================
  // FORM VALIDATION & MESSAGES
  // ===========================================
  formErrorsMessage_en: "Please fix the form errors before submitting",
  formErrorsMessage_cn: "提交前请修正表单错误",
  saveSuccess_en: "Changes saved successfully",
  saveSuccess_cn: "保存成功",
  saveFailed_en: "Failed to save changes, please try again",
  saveFailed_cn: "保存失败，请重试",
  successMessage_en: "Successfully submitted!",
  successMessage_cn: "提交成功！",
  errorMessage_en: "An error occurred, please try again",
  errorMessage_cn: "发生错误，请重试",
  submissionErrorMessage_en: "Failed to submit form, please try again",
  submissionErrorMessage_cn: "表单提交失败，请重试",
  updateSuccessMessage_en: "Updated successfully!",
  updateSuccessMessage_cn: "更新成功！",
  updateErrorMessage_en: "Failed to update, please try again",
  updateErrorMessage_cn: "更新失败，请重试",
  serverErrorMessage_en: "Server error",
  serverErrorMessage_cn: "服务器错误",

  // ===========================================
  // CRUD OPERATIONS
  // ===========================================
  addButton_en: "Add",
  addButton_cn: "添加",
  removeButton_en: F.remove.en,
  removeButton_cn: F.remove.cn,
  addRow_en: "Add Row",
  addRow_cn: "添加新行",
  deleteSelected_en: F.delete_selected.en,
  deleteSelected_cn: F.delete_selected.cn,

  // ===========================================
  // CREATE OPERATIONS
  // ===========================================
  create_artwork_en: F.create_artwork.en,
  create_artwork_cn: F.create_artwork.cn,
  create_event_en: "Create Event",
  create_event_cn: "创建事件",
  create_video_en: "Create Video",
  create_video_cn: "创建影像",
  create_image_en: F.create_image.en,
  create_image_cn: F.create_image.cn,
  create_paragraph_en: F.create_paragraph.en,
  create_paragraph_cn: F.create_paragraph.cn,
  create_about_en: F.create_about.en,
  create_about_cn: F.create_about.cn,
  about_create_en: F.create_about.en,
  about_create_cn: F.create_about.cn,

  // ===========================================
  // MANAGEMENT PAGE TITLES
  // ===========================================
  artworkManagement_en: F.artwork_management.en,
  artworkManagement_cn: F.artwork_management.cn,
  eventManagement_en: F.event_management.en,
  eventManagement_cn: F.event_management.cn,
  videoManagement_en: L.video_management.en,
  videoManagement_cn: "影像管理",
  imageManagement_en: F.image_management.en,
  imageManagement_cn: F.image_management.cn,
  paragraphManagement_en: F.paragraph_management.en,
  paragraphManagement_cn: F.paragraph_management.cn,
  aboutManagement_en: F.about_management.en,
  aboutManagement_cn: F.about_management.cn,

  // ===========================================
  // TABLE & DATA MANAGEMENT
  // ===========================================
  batchPageTitle_en: "Batch Edit Records",
  batchPageTitle_cn: "批量编辑记录",
  eventBatchEdit_en: "Event Batch Edit",
  eventBatchEdit_cn: "事件批量编辑",
  instructions_en: F.double_click_any_cell_to_edit_click_away_or_press_enter_to_save.en,
  instructions_cn: F.double_click_any_cell_to_edit_click_away_or_press_enter_to_save.cn,
  batchEditInstructions_en: F.double_click_any_cell_to_edit_click_away_or_press_enter_to_save.en,
  batchEditInstructions_cn: F.double_click_any_cell_to_edit_click_away_or_press_enter_to_save.cn,
  exportData_en: F.export_data.en,
  exportData_cn: F.export_data.cn,

  // ===========================================
  // DATA STATES & FEEDBACK
  // ===========================================
  noData_en: F.no_data_available.en,
  noData_cn: F.no_data_available.cn,
  noMatchingData_en: "No matching data found",
  noMatchingData_cn: "没有找到匹配的数据",
  noItemsFound_en: L.no_items_found.en,
  noItemsFound_cn: "未找到项目",

  // ===========================================
  // CONFIRMATION DIALOGS
  // ===========================================
  confirmDelete_en: F.confirm_delete.en,
  confirmDelete_cn: F.confirm_delete.cn,
  confirmDeleteMessage_en: "Are you sure you want to delete the selected records?",
  confirmDeleteMessage_cn: "您确定要删除选中的记录吗？",
  deleteWarning_en: "This action will permanently delete the following records",
  deleteWarning_cn: "此操作将永久删除以下记录",
  confirmSave_en: F.confirm_save.en,
  confirmSave_cn: F.confirm_save.cn,
  confirmSaveMessage_en: "Are you sure you want to save all changes?",
  confirmSaveMessage_cn: "确定要保存所有更改吗？",

  // ===========================================
  // RECORD MANAGEMENT
  // ===========================================
  selectedRecords_en: "Selected Records",
  selectedRecords_cn: "选中的记录",
  recordsToDelete_en: "records will be deleted",
  recordsToDelete_cn: "条记录将被删除",
  changesSummary_en: "Changes Summary",
  changesSummary_cn: "更改摘要",
  newRecords_en: "New Records",
  newRecords_cn: "新增记录",
  modifiedRecords_en: "Modified Records",
  modifiedRecords_cn: "修改记录",

  // ===========================================
  // FORM SECTIONS & SUMMARIES
  // ===========================================
  moreInfoSummary_en: F.more_information.en,
  moreInfoSummary_cn: F.more_information.cn,
  imageInfoSummary_en: "Image Information",
  imageInfoSummary_cn: "图片信息",
  arrayInfoSummary_en: "Multi-item Information",
  arrayInfoSummary_cn: "多列信息",
  urlInfoSummary_en: "URL Information",
  urlInfoSummary_cn: "链接信息",
  basic_info_section_en: "Basic Info",
  basic_info_section_cn: "基本信息",
  additional_info_section_en: "Additional Info",
  additional_info_section_cn: "附加信息",
  array_info_section_en: "Array Info",
  array_info_section_cn: "数组信息",
  moreInformation_en: F.more_information.en,
  moreInformation_cn: F.more_information.cn,

  // ===========================================
  // NAVIGATION
  // ===========================================
  backToListButton_en: F.back_to_list.en,
  backToListButton_cn: F.back_to_list.cn,

  // ===========================================
  // FORM FIELDS - COMMON
  // ===========================================
  formTitle_en: "Form",
  formTitle_cn: "表单",
  image_en: F.image.en,
  image_cn: F.image.cn,
  img_url_en: L.image_url.en,
  img_url_cn: L.image_url.cn,
  manualUrlInput_en: "Manual URL Input",
  manualUrlInput_cn: "手动输入链接",
  untitled_en: F.untitled.en,
  untitled_cn: F.untitled.cn,
  back_to_list_en: F.back_to_list.en,
  back_to_list_cn: F.back_to_list.cn,
  view_details_en: "View Details",
  view_details_cn: "查看详情",
  caption_en: L.caption_english.en,
  caption_cn: "标题 (英文)",
  caption_cn_en: L.caption_chinese.en,
  caption_cn_cn: "标题 (中文)",

  // ===========================================
  // FORM FIELD PLACEHOLDERS & DESCRIPTIONS
  // ===========================================
  none_en: "None",
  none_cn: "无",
  no_en: "No",
  no_cn: "无",
  chooseInstruction_en: "Select Image URL or Upload",
  chooseInstruction_cn: "选择图片URL或上传",
  imageUrlPlaceholder_en: "Enter image URL...",
  imageUrlPlaceholder_cn: "请输入图片URL...",

  // ===========================================
  // FILE UPLOAD LABELS
  // ===========================================
  typeNotAllowed_en: "File type not allowed",
  typeNotAllowed_cn: "不支持的文件类型",
  sizeExceeded_en: "File size exceeds {maxSize}MB (current: {fileSize}MB)",
  sizeExceeded_cn: "文件大小超过 {maxSize}MB (当前: {fileSize}MB)",
  emptyFile_en: "File is empty",
  emptyFile_cn: "文件为空",
  uploadFailed_en: F.upload_failed.en,
  uploadFailed_cn: F.upload_failed.cn,
  uploadTimeout_en: "Upload timeout",
  uploadTimeout_cn: "上传超时",
  uploading_en: "Uploading...",
  uploading_cn: "上传中...",
  uploadSuccessful_en: "Upload successful",
  uploadSuccessful_cn: "上传成功",
  uploadFailedStatus_en: F.upload_failed.en,
  uploadFailedStatus_cn: F.upload_failed.cn,
  dropOrClick_en: "Drop files here or click to select",
  dropOrClick_cn: "拖拽文件到此处或点击选择",
  chooseFile_en: "Choose File",
  chooseFile_cn: "选择文件",
  uploadAnother_en: "Upload Another",
  uploadAnother_cn: "上传其他文件",
  requirements_en: "File Requirements",
  requirements_cn: "文件要求",
  maxSize_en: "Maximum size",
  maxSize_cn: "最大大小",
  allowedFormats_en: "Allowed formats",
  allowedFormats_cn: "允许的格式",
  secureUpload_en: "Secure upload",
  secureUpload_cn: "安全上传",
  dragAndDrop_en: "Drag and drop supported",
  dragAndDrop_cn: "支持拖拽上传",
  file_en: "File",
  file_cn: "文件",
  fileUrl_en: "File URL",
  fileUrl_cn: "文件链接",
  clickToCopy_en: "Click to copy",
  clickToCopy_cn: "点击复制",
  copied_en: "Copied!",
  copied_cn: "已复制！",
  startUpload_en: "Start Upload",
  startUpload_cn: "开始上传",
  cancelSelection_en: "Cancel Selection",
  cancelSelection_cn: "取消选择",
  readyToUpload_en: "Ready to upload",
  readyToUpload_cn: "准备上传",
  clickUploadButton_en: "Click upload button to start",
  clickUploadButton_cn: "点击上传按钮开始",
  multipleFilesSupported_en: "Multiple files supported",
  multipleFilesSupported_cn: "支持多文件上传",
  imageUpload_en: "Image Upload",
  imageUpload_cn: "图片上传",

  // ===========================================
  // TAGS & SELECTIONS
  // ===========================================
  selectTag_en: "Select a tag",
  selectTag_cn: "选择标签",
  selectOption_en: "Select Option",
  selectOption_cn: "选择选项",
  noOptionSelected_en: "No option selected",
  noOptionSelected_cn: "未选择选项",
  customTag_en: "Custom Tag",
  customTag_cn: "自定义标签",
  customTagsDescription_en: "Add custom tags if no existing options are available",
  customTagsDescription_cn: "如无可用选项，可添加自定义标签",
  addCustomTagButton_en: "Add Custom Tag",
  addCustomTagButton_cn: "添加自定义标签",
  removeCustomTagButton_en: F.remove.en,
  removeCustomTagButton_cn: F.remove.cn,
  tagSource_en: F.tag_source.en,
  tagSource_cn: F.tag_source.cn,
  tagSourceLabel_en: "Tag Source:",
  tagSourceLabel_cn: "标签来源：",
  selectTagSource_en: "Select tag source",
  selectTagSource_cn: "选择标签来源",
  tag_en: F.tag_english.en,
  tag_cn: F.tag_english.cn,
  tag_cn_en: F.tag_chinese.en,
  tag_cn_cn: F.tag_chinese.cn,
  tag_en_en: F.tag_english.en,
  tag_en_cn: F.tag_english.cn,

  // ===========================================
  // VIDEO SPECIFIC LABELS
  // ===========================================
  video_url_en: L.video_url.en,
  video_url_cn: L.video_url.cn,
  searchVideos_en: F.search_videos.en,
  searchVideos_cn: F.search_videos.cn,
  reorderVideos_en: "Reorder Videos",
  reorderVideos_cn: "视频排序",

  // ===========================================
  // SERIES & TYPE LABELS
  // ===========================================
  enterSeriesName_en: "Enter series name",
  enterSeriesName_cn: "输入系列名称",
  enterTypeName_en: F.enter_type_name.en,
  enterTypeName_cn: F.enter_type_name.cn,

  // ===========================================
  // INTRODUCTION LABELS
  // ===========================================
  addIntroduction_en: "Add Introduction",
  addIntroduction_cn: "添加介绍",
  introduction_en: F.introduction_2.en,
  introduction_cn: F.introduction_2.cn,

  // ===========================================
  // COMMON FIELD LABELS
  // ===========================================
  artist_en: F.artist.en,
  artist_cn: F.artist.cn,
  type_en: F.type.en,
  type_cn: F.type.cn,
  language_en: F.language.en,
  language_cn: F.language.cn,
  typePlaceholder_en: "Select type...",
  typePlaceholder_cn: "选择类型...",
  caption_en: F.caption.en,
  caption_cn: F.caption.cn,
  order_en: F.order.en,
  order_cn: F.order.cn,
  introduction_en: F.introduction.en,
  introduction_cn: F.introduction.cn,
  author_en: F.author.en,
  author_cn: F.author.cn,
  subtitle_en: L.subtitle.en,
  subtitle_cn: L.subtitle.cn,
  summary_en: L.summary.en,
  summary_cn: L.summary.cn,
  content_en: "Content",
  content_cn: "正文",
  read_time_en: "Read Time",
  read_time_cn: "阅读时长",
  view_count_en: "View Count",
  view_count_cn: "浏览量",
  status_en: F.status.en,
  status_cn: F.status.cn,
  published_at_en: "Published Date",
  published_at_cn: "发布日期",
  is_published_en: "Published",
  is_published_cn: "已发布",
  keywords_en: L.keywords.en,
  keywords_cn: L.keywords.cn,
  addKeyword_en: "Add Keyword",
  addKeyword_cn: "添加关键词",
  addTag_en: "Add Tag",
  addTag_cn: "添加标签",
  addParagraph_en: F.add_paragraph.en,
  addParagraph_cn: F.add_paragraph.cn,
  paragraphs_en: F.paragraphs.en,
  paragraphs_cn: F.paragraphs.cn,
  tags_en: L.tags.en,
  tags_cn: L.tag.cn,
  created_at_en: F.created_at.en,
  created_at_cn: F.created_at.cn,
  updated_at_en: L.updated_at.en,
  updated_at_cn: L.updated_at.cn,
  cover_image_url_en: L.cover_image_url.en,
  cover_image_url_cn: L.cover_image_url.cn,
  mark_en: F.mark.en,
  mark_cn: F.mark.cn,
  orderAutoOrderDescription_en: "Images can be ordered by this number.",
  orderAutoOrderDescription_cn: "图片可以按此数字排序。",
  title_en: F.title.en,
  title_cn: F.title.cn,
  artwork_title_en: "Artwork Title",
  artwork_title_cn: "作品标题",
  year_en: F.year.en,
  year_cn: F.year.cn,
  medium_en: L.medium.en,
  medium_cn: L.medium.cn,
  size_en: L.size.en,
  size_cn: L.size.cn,
  venue_en: F.venue.en,
  venue_cn: F.venue.cn,
  address_en: F.address.en,
  address_cn: F.address.cn,
  city_en: "City",
  city_cn: "城市",
  country_en: "Country",
  country_cn: "国家",
  tag_source_en: F.tag_source.en,
  tag_source_cn: F.tag_source.cn,

  // ===========================================
  // TIMESTAMPS
  // ===========================================
  createdAt_en: F.created_at.en,
  createdAt_cn: F.created_at.cn,

  resume_management_en: L.resume_management.en,
  resume_management_cn: "简历管理",

  // ===========================================
  // GENERIC ACTIONS
  // ===========================================
  general_en: "General",
  general_cn: "一般",
  create_one_en: "Create One",
  create_one_cn: "创建一个",
  unknown_en: "Unknown",
  unknown_cn: "未知",

  // ===========================================
  // VIEW MODE LABELS
  // ===========================================
  grid_view_en: "Grid View",
  grid_view_cn: "网格视图",
  list_view_en: "List View",
  list_view_cn: "列表视图",
  switch_to_grid_en: "Switch to Grid View",
  switch_to_grid_cn: "切换到网格视图",
  switch_to_list_en: "Switch to List View",
  switch_to_list_cn: "切换到列表视图",


  // ===========================================
  // IMAGE REORDER SPECIFIC LABELS
  // ===========================================
  orderSaved_en: "Order saved successfully",
  orderSaved_cn: "排序保存成功",
  pageTitle_en: "Image Reorder",
  pageTitle_cn: "图片排序",
  unsavedTitle_en: "Unsaved Changes",
  unsavedTitle_cn: "未保存的更改",
  unsavedContent_en: "You have unsaved changes. Are you sure you want to leave?",
  unsavedContent_cn: "您有未保存的更改。确定要离开吗？",
  leave_en: "Leave",
  leave_cn: "离开",
  imageOrderManagement_en: F.image_order_management.en,
  imageOrderManagement_cn: F.image_order_management.cn,
  saveOrder_en: "Save Order",
  saveOrder_cn: "保存排序",
  reset_en: "Reset",
  reset_cn: "重置",
  refreshData_en: "Refresh Data",
  refreshData_cn: "刷新数据",
  previous_en: "Previous",
  previous_cn: "上一页",
  next_en: "Next",
  next_cn: "下一页",

  // ===========================================
  // EVENT REORDER SPECIFIC LABELS
  // ===========================================
  eventOrderManagement_en: "Event Order Management",
  eventOrderManagement_cn: "事件排序管理",
  reorderEvents_en: "Reorder Events",
  reorderEvents_cn: "事件排序",
  searchEvents_en: F.search_events.en,
  searchEvents_cn: F.search_events.cn,
  sortByVenue_en: F.sort_by_venue.en,
  sortByVenue_cn: F.sort_by_venue.cn,
  groupByType_en: F.group_by_type.en,
  groupByType_cn: F.group_by_type.cn,
  groupByVenue_en: "Group by Venue",
  groupByVenue_cn: "按场地分组",

  // ===========================================
  // ABOUT SPECIFIC FIELD LABELS
  // ===========================================
  about_management_en: F.about_management.en,
  about_management_cn: F.about_management.cn,
  about_page_title_en: F.about_management.en,
  about_page_title_cn: F.about_management.cn,
  about_create_en: F.create_about.en,
  about_create_cn: F.create_about.cn,
  about_batch_edit_en: F.batch_edit.en,
  about_batch_edit_cn: F.batch_edit.cn,
  about_export_data_en: F.export_data.en,
  about_export_data_cn: F.export_data.cn,
  about_refresh_en: F.refresh.en,
  about_refresh_cn: F.refresh.cn,
  about_no_items_en: "No about items available",
  about_no_items_cn: "暂无关于数据",
  about_no_matching_items_en: "No matching items found",
  about_no_matching_items_cn: "未找到匹配的项目",
  about_system_empty_en: "SYSTEM EMPTY",
  about_system_empty_cn: "系统为空",
  about_artist_en: F.artist.en,
  about_artist_cn: F.artist.cn,
  about_caption_en: F.caption.en,
  about_caption_cn: F.caption.cn,
  about_language_en: F.language.en,
  about_language_cn: F.language.cn,
  about_order_en: F.order.en,
  about_order_cn: F.order.cn,
  about_mark_en: F.mark.en,
  about_mark_cn: F.mark.cn,
  about_introduction_en: F.introduction_2.en,
  about_introduction_cn: F.introduction_2.cn,

  delete_dialog_this_item_en: "this item",
  delete_dialog_this_item_cn: "该项目",

  // Clear filters label
  clear_filters_en: "Clear Filters",
  clear_filters_cn: "清除筛选",

  // ===========================================
  // DELETE ITEM DETAILS LABELS
  // ===========================================
  loading_en: F.loading.en,
  loading_cn: F.loading.cn,

  // ===========================================
  // CONTROL PANEL LABELS
  // ===========================================
  total_en: L.total.en,
  total_cn: "总数",
  select_en: "Select...",
  select_cn: "选择...",

  // ===========================================
  // BUTTON PANEL LABELS
  // ===========================================
  reorderImages_en: "Reorder Images",
  reorderImages_cn: "图片排序",
  searchImages_en: L.search_images.en,
  searchImages_cn: L.search_images.cn,
  searchEvents_en: F.search_events.en,
  searchEvents_cn: F.search_events.cn,
  searchAbout_en: "Search about...",
  searchAbout_cn: "搜索关于...",
  reorderArtwork_en: "Reorder Artwork",
  reorderArtwork_cn: "作品排序",

  // ===========================================
  // ARTWORK DETAIL LABELS
  // ===========================================
  relatedImages_en: "Related Images",
  relatedImages_cn: "相关图片",
  untitledArtwork_en: F.untitled_artwork.en,
  untitledArtwork_cn: F.untitled_artwork.cn,

  // ===========================================
  // EXHIBITION LABELS
  // ===========================================
  noExhibitionsAvailable_en: L.no_exhibitions_available.en,
  noExhibitionsAvailable_cn: "暂无展览活动",

  // ===========================================
  // GENERAL PAGE LABELS
  // ===========================================
  connectionFailed_en: L.connection_failed.en,
  connectionFailed_cn: L.connection_failed.cn,
  systemUnavailable_en: L.system_temporarily_unavailable.en,
  systemUnavailable_cn: L.system_temporarily_unavailable.cn,
  tryAgain_en: L.try_again.en,
  tryAgain_cn: L.try_again.cn,
  noArtworks_en: L.no_artworks_available.en,
  noArtworks_cn: "暂无艺术作品",
  noEvents_en: L.no_events_available.en,
  noEvents_cn: L.no_events_found.cn,
  series_en: L.series.en,
  series_cn: L.series.cn,
  type_en: F.type.en,
  type_cn: F.type.cn,
  all_en: F.all.en,
  all_cn: F.all.cn,
  artworkIndex_en: L.artwork_index.en,
  artworkIndex_cn: L.artwork_index.cn,
  viewArtworkIndex_en: "View Artwork Index",
  viewArtworkIndex_cn: "查看作品索引",
  exhibitions_en: L.exhibitions.en,
  exhibitions_cn: "展览活动",

  // ===========================================
  // SORT NAVIGATION LABELS
  // ===========================================
  sort_en: F.sort.en,
  sort_cn: F.sort.cn,
  sort_by_artist_en: F.sort_by_artist.en,
  sort_by_artist_cn: F.sort_by_artist.cn,
  ascendingClickDescending_en: "Ascending - Click for descending",
  ascendingClickDescending_cn: "升序 - 点击切换为降序",
  descendingClickAscending_en: "Descending - Click for ascending",
  descendingClickAscending_cn: "降序 - 点击切换为升序",

  // ===========================================
  // PREVIEW MODAL LABELS
  // ===========================================
  closePreview_en: "Close preview",
  closePreview_cn: "关闭预览",

  // ===========================================
  // LIST WITH EXPAND INFO LABELS
  // ===========================================
  clickToView_en: "Click to view",
  clickToView_cn: "点击查看",
  imageNotAvailable_en: "Image not available",
  imageNotAvailable_cn: "图片加载失败",
  collapseDetails_en: "Collapse details",
  collapseDetails_cn: "收起详情",
  expandDetails_en: "Expand details",
  expandDetails_cn: "展开详情",
  na_en: "N/A",
  na_cn: "无",
  edit_en: F.edit.en,
  edit_cn: F.edit.cn,
  delete_en: F.delete.en,
  delete_cn: F.delete.cn,

  // ===========================================
  // LAYOUT LABELS
  // ===========================================
  noContentToDisplay_en: "No content to display",
  noContentToDisplay_cn: "没有可显示的内容",
  pieces_en: "pieces",
  pieces_cn: "件",
  noItemsFoundCriteria_en: L.no_items_found_matching_the_criteria.en,
  noItemsFoundCriteria_cn: "没有找到符合条件的内容",

  // ===========================================
  // IMAGE LABELS
  // ===========================================
  imageUnavailable_en: "Image unavailable",
  imageUnavailable_cn: "图片无法加载",
  noImagesAvailable_en: L.no_images_available.en,
  noImagesAvailable_cn: "没有可用的图片",

  // ===========================================
  // FORM ALERT LABELS
  // ===========================================
  operationSuccess_en: F.operation_completed_successfully.en,
  operationSuccess_cn: F.operation_completed_successfully.cn,

  // ===========================================
  // CONTACT MODAL LABELS
  // ===========================================
  contactInformation_en: "Contact Information",
  contactInformation_cn: L.artist_contacts.cn,
  email_en: F.email.en,
  email_cn: F.email.cn,
  instagram_en: "Instagram",
  instagram_cn: "Instagram",
  xiaohongshu_en: "Xiaohongshu",
  xiaohongshu_cn: "小红书",
  facebook_en: "Facebook",
  facebook_cn: "Facebook",
  wechat_en: "WeChat",
  wechat_cn: "微信",
  phone_en: L.phone.en,
  phone_cn: L.phone.cn,
  web_en: "web",
  web_cn: "网站",
  xiaohongshuHomepage_en: "Xiaohongshu Homepage",
  xiaohongshuHomepage_cn: "小红书主页",
  facebookHomepage_en: "Facebook Homepage",
  facebookHomepage_cn: "Facebook主页",
  contact_en: "Contact",
  contact_cn: "联系",
  contactUs_en: "Contact Us",
  contactUs_cn: "联系我们",

  // ===========================================
  // ARTISTS PAGE LABELS
  // ===========================================
  noArtistsFound_en: "No artists data available",
  noArtistsFound_cn: "暂无艺术家数据",
  artist_en: F.artist.en,
  artist_cn: F.artist.cn,

  // ===========================================
  // ARTWORK REORDER SPECIFIC LABELS
  // ===========================================
  artworkReorderManager_en: "Artwork Reorder Manager",
  artworkReorderManager_cn: "作品排序管理器",
  showingLanguageArtworks_en: "Showing {language} artworks only",
  showingLanguageArtworks_cn: "仅显示{language}作品",
  chineseArtworks_en: F.chinese.en,
  chineseArtworks_cn: F.chinese.cn,
  englishArtworks_en: F.english.en,
  englishArtworks_cn: F.english.cn,
  sortByYear_en: F.sort_by_year.en,
  sortByYear_cn: F.sort_by_year.cn,
  sortByType_en: F.sort_by_type.en,
  sortByType_cn: F.sort_by_type.cn,
  sortBySeries_en: "Sort by Series",
  sortBySeries_cn: "按系列排序",
  groupBySeries_en: "Group by Series",
  groupBySeries_cn: "按系列分组",
  oldestFirst_en: "Oldest First",
  oldestFirst_cn: "最早优先",
  newestFirst_en: "Newest First",
  newestFirst_cn: "最新优先",
  aToZ_en: "A-Z",
  aToZ_cn: "A-Z",
  zToA_en: "Z-A",
  zToA_cn: "Z-A",
  dragGroups_en: "Drag groups",
  dragGroups_cn: "拖拽分组",
  resetToOriginalOrder_en: "Reset to Original Order",
  resetToOriginalOrder_cn: "重置为原始顺序",
  groupedBySeries_en: "✓ Grouped by series (drag series groups)",
  groupedBySeries_cn: "✓ 已按系列分组（拖拽系列组）",
  sortedByYearOldest_en: "✓ Sorted by year (oldest to newest)",
  sortedByYearOldest_cn: "✓ 已按年份排序（从早到晚）",
  sortedByYearNewest_en: "✓ Sorted by year (newest to oldest)",
  sortedByYearNewest_cn: "✓ 已按年份排序（从晚到早）",
  sortedByTypeAZ_en: "✓ Sorted by type (A to Z)",
  sortedByTypeAZ_cn: "✓ 已按类型排序（A到Z）",
  sortedByTypeZA_en: "✓ Sorted by type (Z to A)",
  sortedByTypeZA_cn: "✓ 已按类型排序（Z到A）",
  sortedBySeriesAZ_en: "✓ Sorted by series (A to Z)",
  sortedBySeriesAZ_cn: "✓ 已按系列排序（A到Z）",
  sortedBySeriesZA_en: "✓ Sorted by series (Z to A)",
  sortedBySeriesZA_cn: "✓ 已按系列排序（Z到A）",
  orderSavedSuccessfully_en: "Order saved successfully!",
  orderSavedSuccessfully_cn: "排序保存成功！",
  savingOrder_en: "Saving order...",
  savingOrder_cn: "保存排序中...",
  seriesGroups_en: "Series Groups",
  seriesGroups_cn: "系列分组",
  draggableArtworks_en: "Draggable Artworks",
  draggableArtworks_cn: "可拖拽作品",
  seriesArtworksCount_en: "Series: {series} ({count} artworks)",
  seriesArtworksCount_cn: "系列：{series}（{count}件作品）",
  noLanguageArtworksFound_en: "No {language} artworks found. Please add some artworks first.",
  noLanguageArtworksFound_cn: "未找到{language}作品。请先添加一些作品。",
  currentOrder_en: "Current Order:",
  currentOrder_cn: "当前顺序：",
  untitledByArtist_en: "Untitled by {artist}",
  untitledByArtist_cn: "无题作品，作者：{artist}",
  unknownArtist_en: "Unknown Artist",
  unknownArtist_cn: "未知艺术家",
  editArtwork_en: "Edit artwork",
  editArtwork_cn: "编辑作品",

  // ===========================================
  // GENERIC REORDER COMPONENT LABELS
  // ===========================================
  editItem_en: "Edit item",
  editItem_cn: "编辑项目",
  errorLoadingItems_en: "Error Loading Items",
  errorLoadingItems_cn: "加载项目时出错",
  retry_en: "Retry",
  retry_cn: L.try_again.cn,
  showingLanguageItems_en: "Showing {language} items only",
  showingLanguageItems_cn: "仅显示{language}项目",
  chineseItems_en: F.chinese.en,
  chineseItems_cn: F.chinese.cn,
  englishItems_en: F.english.en,
  englishItems_cn: F.english.cn,
  ascending_en: F.ascending.en,
  ascending_cn: F.ascending.cn,
  descending_en: F.descending.en,
  descending_cn: F.descending.cn,
  itemGroups_en: "Item Groups",
  itemGroups_cn: "项目分组",
  draggableItems_en: "Draggable Items",
  draggableItems_cn: "可拖拽项目",
  noLanguageItemsFound_en: "No {language} items found. Please add some items first.",
  noLanguageItemsFound_cn: "未找到{language}项目。请先添加一些项目。",

  // ===========================================
  // IMAGE REORDER SPECIFIC LABELS
  // ===========================================
  imageOrderManagement_en: F.image_order_management.en,
  imageOrderManagement_cn: F.image_order_management.cn,
  sortByType_en: F.sort_by_type.en,
  sortByType_cn: F.sort_by_type.cn,
  sortByTag_en_en: "Sort by Tag (English)",
  sortByTag_en_cn: "按英文标签排序",
  sortByTag_cn_en: "Sort by Tag (Chinese)",
  sortByTag_cn_cn: "按中文标签排序",
  groupByType_en: F.group_by_type.en,
  groupByType_cn: F.group_by_type.cn,

  // ===========================================
  // VIDEO REORDER SPECIFIC LABELS
  // ===========================================
  videoOrderManagement_en: "Video Order Management",
  videoOrderManagement_cn: "视频排序管理",

  // ===========================================
  // SCHEMA FIELD LABELS (batch edit · forms)
  // ===========================================
  cover_img_url_en: L.cover_image_url.en,          cover_img_url_cn: "封面图片链接",
  coverImageUrl_en: L.cover_image_url.en,          coverImageUrl_cn: "封面图片链接",
  portrait_image_url_en: L.portrait_image_url.en,  portrait_image_url_cn: "肖像图片链接",
  duration_en: L.duration.en,                      duration_cn: "时长",
  credits_en: L.credits_thanks.en,                        credits_cn: "鸣谢",
  special_thanks_en: L.special_thanks_ack.en,          special_thanks_cn: "特别鸣谢",
  specialThanks_en: L.special_thanks_ack.en,           specialThanks_cn: "特别鸣谢",
  related_exhibition_en: "Related Gallery/Exhibition",
  related_exhibition_cn: "相关画廊/展览",
  relatedGallery_en: "Related Gallery/Exhibition", relatedGallery_cn: "相关画廊/展览",
  related_artist_en: L.related_artist.en,  related_artist_cn: "相关艺术家",
  related_artwork_title_en: L.related_artwork.en,  related_artwork_title_cn: "相关作品",
  work_value_en: L.work_value.en,                  work_value_cn: "作品价值",
  workValue_en: L.work_value.en,                   workValue_cn: "作品价值",
  sold_en: L.sold.en,                              sold_cn: "已售",
  web_url_en: L.web_url.en,                        web_url_cn: "网页链接",
  webUrl_en: L.web_url.en,                         webUrl_cn: "网页链接",
  videoUrl_en: L.video_url.en,                     videoUrl_cn: "视频链接",
  category_en: L.category.en,                      category_cn: "分类",
  publisher_en: "Publisher",                    publisher_cn: "出版社",
  isbn_en: "ISBN",                              isbn_cn: "ISBN",
  publication_date_en: "Publication Date",      publication_date_cn: "出版日期",
  name_en: L.name.en,                              name_cn: "姓名",
  message_en: L.message.en,                        message_cn: "留言",
  opening_time_en: L.opening_hours.en,             opening_time_cn: "开放时间",
 artist_name_en: L.artist_name.en,             artist_name_cn: "艺术家姓名",

};


/**
 * Helper function to get the current language context
 * Safely retrieves language preference from React Context
 * Falls back to English if not in a React component context
 *
 * @returns {boolean} - Returns true for Chinese, false for English
 */
function getIsCnFromContext() {
  try {
    // Only works within a React component context
    return useContext(LanguageContext)?.isCn;
  } catch {
    // Not in a React component context, fallback to English
    return false;
  }
}

/**
 * Get system label by key and language preference
 *
 * @param {string} key - The label key (without language suffix)
 * @param {boolean} [isCn] - Language preference (true for Chinese, false for English)
 *                           If not provided, will use context or default to English
 * @returns {string} - The localized label text or the key if not found
 */
export const getSystemLabel = (key, isCn) => {
  // Determine language preference
  let lang = isCn;
  if (typeof lang === 'undefined') {
    lang = getIsCnFromContext();
  }

  // Construct the full key with language suffix
  const fullKey = lang ? `${key}_cn` : `${key}_en`;

  // Return the label or fall back to the original key
  return systemLabels[fullKey] || key;
};

// Default export for convenience
export default {
  systemLabels,
  getSystemLabel,
};
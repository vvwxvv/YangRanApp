import { L, LU, STATUS_LABELS, F } from "@/components/labels/managerLabels";
// exhibitionLabels.js — 适配 Prisma Exhibition 模型（related_artwork 为 JSON 对象数组）
// 字段标签（基础）
export const fieldLabels = {
  // 核心字段
  cover_img_url: L.cover_image,
  title: L.title,
  subtitle: L.subtitle,
  type: L.type,
  date_start: L.start_date,
  date_end: L.end_date,
  opening_date: L.opening_date,
  year: L.year,
  venue: L.venue,
  location: L.location,
  curator: L.curator,
  organiser: L.organiser,
  participating_artists: L.participating_artists,
  caption: L.caption,
  description: L.description,
  introduction: L.introduction,
  press_release: L.press_release,
  related_artwork: L.related_artworks,
  related_artist: L.related_gallery_artists,
  video_url: L.video_url,
  web_url: L.web_url,
  // 系统/管理字段
  order: L.order_sort,
  mark: L.mark,
  language: L.language,
  status: L.status,
  // 时间戳
  updatedAt: L.last_updated,
};

// 页面文本
export const PAGE_TEXT = {
  pageTitle: LU.exhibition_management,
  itemName: LU.exhibition,
  createTooltip: LU.create_new_exhibition,
  filters: {
    title: LU.title,
    type: LU.type,
    year: LU.year,
    venue: LU.venue,
    curator: LU.curator,
    organiser: LU.organiser,
    status: LU.status,
    language: LU.language,
    mark: LU.mark,
    order: LU.order_sort,
  },
  controlPanel: {
    sortByDate: LU.sort_by_date,
    sortByDateTooltip: LU.sort_exhibitions_by_start_date,
    sortByOrder: LU.sort_by_order,
    sortByOrderTooltip: LU.sort_exhibitions_by_order,
    sortByUpdate: LU.sort_by_update,
    sortByUpdateTooltip: LU.sort_by_update_date_4,
    exportData: LU.export_data,
    exportDataTooltip: LU.export_exhibition_data,
  },
  fields: {
    cover_img_url: LU.cover_image,
    title: LU.title,
    subtitle: LU.subtitle,
    type: LU.type,
    date_start: LU.start_date,
    date_end: LU.end_date,
    opening_date: LU.opening_date,
    year: LU.year,
    venue: LU.venue,
    location: LU.location,
    curator: LU.curator,
    organiser: LU.organiser,
    participating_artists: LU.participating_artists,
    caption: LU.caption,
    description: LU.description,
    introduction: LU.introduction,
    press_release: LU.press_release,
    related_artwork: LU.related_artworks,
    related_artist: LU.related_gallery_artists,
    video_url: LU.video_url,
    web_url: LU.web_url,
    order: LU.order_sort,
    mark: LU.mark,
    language: LU.language,
    status: LU.status,
    updatedAt: LU.updated_at,
  },
  emptyState: {
    noData: LU.no_exhibitions_found,
    noMatchingEvents: LU.no_matching_exhibitions,
  },
  deleteDialog: {
    title: LU.confirm_delete,
    confirm: LU.delete,
    cancel: LU.cancel,
  },
  errors: {
    loadingError: LU.error_loading_data,
    systemError: LU.system_error,
    tryAgain: LU.try_again,
    deleteError: LU.delete_failed,
    pleaseRetry: LU.please_try_again,
    ok: LU.ok,
  },
  export: {
    success: LU.export_success,
    error: LU.export_failed,
    exhibitions: LU.exhibitions_2,
  },
};

// 操作标签
export const actionLabels = {
  create_en: "Create Exhibition",
  create_cn: "创建展览",
  edit_en: "Edit Exhibition",
  edit_cn: "编辑展览",
  delete_en: "Delete Exhibition",
  delete_cn: "删除展览",
  export_en: "Export Exhibitions",
  export_cn: "导出展览",
  import_en: "Import Exhibitions",
  import_cn: "导入展览",
};

// 状态标签
export const statusLabels = { ...STATUS_LABELS };

// 实体标签
export const entityLabels = {
  exhibition_en: L.exhibition.en,
  exhibition_cn: L.exhibitions.cn,
  exhibitions_en: L.exhibitions.en,
  exhibitions_cn: L.exhibitions.cn,
  untitledExhibition_en: "Untitled Exhibition",
  untitledExhibition_cn: "无题展览",
};

// 过滤器标签
export const filterLabels = {
  all_titles_en: F.all_titles.en,
  all_titles_cn: F.all_titles.cn,
  all_types_en: F.all_types.en,
  all_types_cn: F.all_types.cn,
  all_years_en: F.all_years.en,
  all_years_cn: F.all_years.cn,
  all_venues_en: "All Venues",
  all_venues_cn: "全部场馆",
  all_curators_en: "All Curators",
  all_curators_cn: "全部策展人",
  all_organisers_en: "All Organisers",
  all_organisers_cn: "全部主办方",
  all_statuses_en: F.all_statuses.en,
  all_statuses_cn: F.all_statuses.cn,
  all_marks_en: F.all_marks.en,
  all_marks_cn: F.all_marks.cn,
  all_languages_en: F.all_languages.en,
  all_languages_cn: F.all_languages.cn,
};

// 排序标签
export const sortLabels = {
  sort_by_title_en: F.sort_by_title.en,
  sort_by_title_cn: F.sort_by_title.cn,
  sort_by_date_en: F.sort_by_date.en,
  sort_by_date_cn: F.sort_by_date.cn,
  sort_by_year_en: F.sort_by_year.en,
  sort_by_year_cn: F.sort_by_year.cn,
  sort_by_type_en: F.sort_by_type.en,
  sort_by_type_cn: F.sort_by_type.cn,
  sort_by_venue_en: "Sort by Venue",
  sort_by_venue_cn: "按场馆排序",
  sort_by_order_en: F.sort_by_order.en,
  sort_by_order_cn: F.sort_by_order.cn,
  sort_by_update_en: F.sort_by_update.en,
  sort_by_update_cn: F.sort_by_update.cn,
  sort_by_status_en: F.sort_by_status.en,
  sort_by_status_cn: F.sort_by_status.cn,
};

// 页面标签
export const pageLabels = {
  title_en: L.exhibition_management.en,
  title_cn: L.exhibition_management.cn,
  description_en: "Manage and organize exhibition content",
  description_cn: "管理和组织展览内容",
};

// UI 文本标签（用于 uiText）
export const uiTextLabels = {
  pageTitle: L.exhibition_index,
  title: L.title,
  subtitle: L.subtitle,
  type: L.type,
  year: L.year,
  date_start: L.start_date,
  date_end: L.end_date,
  opening_date: L.opening_date,
  venue: L.venue,
  location: L.location,
  curator: L.curator,
  organiser: L.organiser,
  participating_artists: L.participating_artists,
  related_artwork: L.related_artworks,
  related_artist: L.related_gallery_artists,
  order: L.order_sort,
  mark: L.mark,
  language: L.language,
  status: L.status,
  all: L.all,
  other: L.other,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noExhibitionsFound: L.no_exhibitions_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  fields: {
    title: L.title,
    subtitle: L.subtitle,
    type: L.type,
    year: L.year,
    date_start: L.start_date,
    date_end: L.end_date,
    opening_date: L.opening_date,
    venue: L.venue,
    location: L.location,
    curator: L.curator,
    organiser: L.organiser,
    participating_artists: L.participating_artists,
    order: L.order_sort,
    status: L.status,
  }
};

// 展示标签（函数形式）
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情' : 'See Details',
  emptyMessage: (isCn) => isCn ? '没有可显示的展览' : 'No exhibitions to display',
  noMatchMessage: (isCn) => isCn ? L.no_matching_exhibitions_found.cn : L.no_matching_exhibitions_found.en,
  loadingMessage: (isCn) => isCn ? '加载中...' : 'Loading...',
  errorMessage: (isCn) => isCn ? '加载失败' : 'Failed to load',
};

// 控制面板标签（函数形式）
export const controlPanelLabels = {
  title: (isCn) => isCn ? L.title.cn : L.title.en,
  type: (isCn) => isCn ? L.type.cn : L.type.en,
  year: (isCn) => isCn ? L.year.cn : L.year.en,
  venue: (isCn) => isCn ? L.venue.cn : L.venue.en,
  curator: (isCn) => isCn ? L.curator.cn : L.curator.en,
  organiser: (isCn) => isCn ? L.organiser.cn : L.organiser.en,
  status: (isCn) => isCn ? L.status.cn : L.status.en,
  order: (isCn) => isCn ? L.order_sort.cn : L.order_sort.en,
  language: (isCn) => isCn ? L.language.cn : L.language.en,
  mark: (isCn) => isCn ? L.mark.cn : L.mark.en,
  date_start: (isCn) => isCn ? L.start_date.cn : L.start_date.en,
  date_end: (isCn) => isCn ? L.end_date.cn : L.end_date.en,
  opening_date: (isCn) => isCn ? L.opening_date.cn : L.opening_date.en,
  sortByTitle: (isCn) => isCn ? L.sort_by_title.cn : L.sort_by_title.en,
  sortByTitleTooltip: (isCn) => isCn ? '按标题排序展览' : 'Sort exhibitions by title',
  sortByDate: (isCn) => isCn ? L.sort_by_date.cn : L.sort_by_date.en,
  sortByDateTooltip: (isCn) => isCn ? L.sort_exhibitions_by_start_date.cn : L.sort_exhibitions_by_start_date.en,
  sortByOrder: (isCn) => isCn ? L.sort_by_order.cn : L.sort_by_order.en,
  sortByOrderTooltip: (isCn) => isCn ? L.sort_exhibitions_by_order.cn : L.sort_exhibitions_by_order.en,
  sortByUpdate: (isCn) => isCn ? L.sort_by_update.cn : L.sort_by_update.en,
  sortByUpdateTooltip: (isCn) => isCn ? L.sort_by_update_date.cn : L.sort_by_update_date.en,
  // 向后兼容（保留旧键名）
  titleLabel_en: F.title.en,
  titleLabel_cn: F.title.cn,
  typeLabel_en: F.type.en,
  typeLabel_cn: F.type.cn,
  yearLabel_en: F.year.en,
  yearLabel_cn: F.year.cn,
  venueLabel_en: L.venue.en,
  venueLabel_cn: L.venue.cn,
  orderLabel_en: F.order.en,
  orderLabel_cn: F.order.cn,
  languageLabel_en: F.language.en,
  languageLabel_cn: F.language.cn,
  markLabel_en: F.mark.en,
  markLabel_cn: F.mark.cn,
};

// 默认内容标签
export const defaultContentLabels = {
  listTitle: (isCn) => isCn ? "展览列表" : "EXHIBITION LIST",
  detailsLabel: (isCn) => isCn ? "展览详情" : "EXHIBITION DETAILS",
  untitled: (isCn) => isCn ? "无题展览" : "Untitled Exhibition",
  noDescription: (isCn) => isCn ? '暂无描述' : 'No description available',
  back: (isCn) => isCn ? "返回" : "BACK",
};

// 字段分组标签（用于表单分组）
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
  location: {
    title: (isCn) => isCn ? "位置与组织" : "Location & Organisers",
  },
  content: {
    title: (isCn) => isCn ? "内容" : "Content",
  },
  media: {
    title: (isCn) => isCn ? "媒体" : "Media",
  },
  settings: {
    title: (isCn) => isCn ? "设置" : "Settings",
  },
};

// 字段标签（用于组件，与 fieldLabels 重复但保留）
export const fieldLabelsForComponents = {
  cover_img_url: L.cover_image,
  title: L.title,
  subtitle: L.subtitle,
  type: L.type,
  date_start: L.start_date,
  date_end: L.end_date,
  opening_date: L.opening_date,
  year: L.year,
  venue: L.venue,
  location: L.location,
  curator: L.curator,
  organiser: L.organiser,
  participating_artists: L.participating_artists,
  caption: L.caption,
  description: L.description,
  introduction: L.introduction,
  press_release: L.press_release,
  related_artwork: L.related_artworks,
  related_artist: L.related_gallery_artists,
  video_url: L.video_url,
  web_url: L.web_url,
  order: L.order_sort,
  mark: L.mark,
  language: L.language,
  status: L.status,
};

// 删除对话框标签
export const deleteDialogLabels = {
  delete_dialog_this_item_en: F.this_exhibition.en,
  delete_dialog_this_item_cn: F.this_exhibition.cn,
  confirmDeleteExhibition_en: "Are you sure you want to delete this exhibition?",
  confirmDeleteExhibition_cn: "确定要删除该展览吗？",
  thisExhibition_en: F.this_exhibition.en,
  thisExhibition_cn: F.this_exhibition.cn,
};

// 附加标签（占位符、提示等）
export const additionalLabels = {
  selectTitle_en: F.select_title.en,
  selectTitle_cn: F.select_title.cn,
  enterTitle_en: "Enter exhibition title",
  enterTitle_cn: "输入展览标题",
  selectType_en: F.select_type.en,
  selectType_cn: F.select_type.cn,
  enterTypeName_en: F.enter_type_name.en,
  enterTypeName_cn: F.enter_type_name.cn,
  selectVenue_en: "Select Venue",
  selectVenue_cn: "选择场馆",
  selectCurator_en: "Select Curator",
  selectCurator_cn: "选择策展人",
  selectOrganiser_en: "Select Organiser",
  selectOrganiser_cn: "选择主办方",
  selectStatus_en: F.select_status.en,
  selectStatus_cn: F.select_status.cn,
  selectOrder_en: F.select_order.en,
  selectOrder_cn: F.select_order.cn,
  selectLanguage_en: F.select_language.en,
  selectLanguage_cn: F.select_language.cn,
  // Introduction / Press Release
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
  pressRelease_en: L.press_release.en,
  pressRelease_cn: L.press_release.cn,
  addPressReleaseButton_en: "Add Press Release",
  addPressReleaseButton_cn: "添加新闻稿",
  // 相关作品（对象数组：title / order / mark）和画廊艺术家的占位符/按钮
  addRelatedArtwork_en: "Add Artwork",
  addRelatedArtwork_cn: "添加作品",
  addRelatedGalleryArtist_en: "Add Gallery Artist",
  addRelatedGalleryArtist_cn: "添加画廊艺术家",
  // 实体和集合
  no_exhibitions_en: L.no_exhibitions_found.en,
  no_exhibitions_cn: "未找到展览",
  // 搜索和筛选
  searchExhibitions_en: "Search exhibitions",
  searchExhibitions_cn: "搜索展览",
  // 状态和错误
  noFeaturedExhibitions_en: "No featured exhibitions available",
  noFeaturedExhibitions_cn: "暂无精选展览",
  noMatchingExhibitions_en: L.no_matching_exhibitions_found.en,
  noMatchingExhibitions_cn: L.no_exhibitions_found_matching_the_criteria.cn,
  // 标记
  mark_en: F.mark.en,
  mark_cn: F.mark.cn,
  noMark_en: "No mark",
  noMark_cn: "无标记",
  // 排序
  order_en: F.order.en,
  order_cn: F.order.cn,
};

// UI 文本（用于通用界面）
export const UI_TEXT = {
  loadingError: L.connection_failed,
  systemError: L.system_temporarily_unavailable,
  tryAgain: L.try_again,
  exhibitionManagement: L.exhibition_management,
  noData: L.no_exhibitions_available,
  noMatchingExhibitions: L.no_matching_exhibitions_found,
  all: L.all,
  totalCount: L.total,
  exportSuccess: L.export_success,
  exportError: L.export_failed,
  exportInProgress: L.exporting
};

// 合并所有标签（用于便捷访问）
export const exhibitionLabels = {
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

// 辅助函数：获取字段标签
export const getExhibitionLabel = (key, language = 'en') => {
  if (!key) return '';

  // 尝试直接从 fieldLabels 获取
  if (fieldLabels[key]) {
    if (typeof fieldLabels[key] === 'object') {
      return fieldLabels[key][language] || fieldLabels[key]['en'] || key;
    }
    return fieldLabels[key];
  }

  // 尝试从 fieldLabelsForComponents 获取
  if (fieldLabelsForComponents[key]) {
    return fieldLabelsForComponents[key][language] || fieldLabelsForComponents[key]['en'] || key;
  }

  // 尝试带语言后缀的键
  const labelKey = `${key}_${language}`;
  if (exhibitionLabels[labelKey]) {
    return exhibitionLabels[labelKey];
  }

  // 如果中文没找到，尝试英文
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (exhibitionLabels[englishKey]) {
      return exhibitionLabels[englishKey];
    }
  }

  return key;
};

// 辅助函数：获取 UI 文本
export const getExhibitionUIText = (key, language = 'en') => {
  if (!key) return '';

  // 尝试从 uiTextLabels 获取
  if (uiTextLabels[key]) {
    return uiTextLabels[key][language] || uiTextLabels[key]['en'] || key;
  }

  // 尝试嵌套路径（例如 'fields.title'）
  if (key.includes('.')) {
    const [parent, child] = key.split('.');
    if (uiTextLabels[parent] && uiTextLabels[parent][child]) {
      return uiTextLabels[parent][child][language] || uiTextLabels[parent][child]['en'] || key;
    }
  }

  return key;
};

// 默认导出
export default exhibitionLabels;
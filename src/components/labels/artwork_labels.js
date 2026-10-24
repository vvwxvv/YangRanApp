import { L, LU, STATUS_LABELS, F } from "@/components/labels/managerLabels";
// ─────────────────────────────────────────────
// artwork_labels.js
// Matches Prisma Artwork model fields exactly
// ─────────────────────────────────────────────


// Core field labels (bilingual objects)
export const fieldLabels = {
  cover_img_url:  L.cover_image,
  related_exhibition: L.related_gallery_exhibition, // 新增
  artist:         L.artist,
  title:          L.title,
  type:           L.type,
  medium:         L.medium,
  year:           L.year,
  size:           L.size,
  series:         L.series,
  caption:        L.caption,
  duration:       L.duration,
  credits:        L.credits_thanks,
  special_thanks: L.special_thanks_ack,
  introduction:   L.introduction,
  video_url:      L.video_url,
  web_url:        L.web_url,
  work_value:     L.work_value,
  sold:           L.sold,
  order:          L.order_sort,
  'order.artist_page_order': L.artist_page_order,
  'order.exhibition_page_order': L.exhibition_page_order,
  'order.art_fair_page_order': L.art_fair_page_order,
  mark:           L.mark,
  tag:            L.tag,
  language:       L.language,
  updatedAt:      L.last_updated,
};

// ─────────────────────────────────────────────
// Page text labels
// ─────────────────────────────────────────────
export const PAGE_TEXT = {
  pageTitle: LU.artwork_management,

  itemName: LU.artwork,

  createTooltip: LU.create_new_artwork,

  filters: {
    title:    LU.title,
    type:     LU.type,
    medium:   LU.medium,
    year:     LU.year,
    series:   LU.series,
    artist:   LU.artist,
    sold:     LU.sold,
    language: LU.language,
    mark:     LU.mark,
    tag:      LU.tag,
    order:    LU.order_sort,
    'order.artist_page_order': LU.artist_page_order,
    'order.exhibition_page_order': LU.exhibition_page_order,
    'order.art_fair_page_order': LU.art_fair_page_order,
  },

  controlPanel: {
    sortByTitle:        LU.sort_by_title,
    sortByTitleTooltip: LU.sort_artworks_by_title,
    sortByYear:         LU.sort_by_year,
    sortByYearTooltip:  LU.sort_artworks_by_year,
    sortByOrder:        LU.sort_by_order,
    sortByOrderTooltip: LU.sort_artworks_by_order,
    sortByUpdate:       LU.sort_by_update,
    sortByUpdateTooltip:LU.sort_by_update_date_2,
    exportData:         LU.export_data,
    exportDataTooltip:  LU.export_artwork_data,
  },

  fields: {
    cover_img_url:  LU.cover_image,
    related_exhibition: LU.related_gallery_exhibition, // 新增
    artist:         LU.artist,
    title:          LU.title,
    type:           LU.type,
    medium:         LU.medium,
    year:           LU.year,
    size:           LU.size,
    series:         LU.series,
    caption:        LU.caption,
    duration:       LU.duration,
    credits:        LU.credits_thanks,
    special_thanks: LU.special_thanks_ack,
    introduction:   LU.introduction,
    video_url:      LU.video_url,
    web_url:        LU.web_url,
    work_value:     LU.work_value,
    sold:           LU.sold,
    order:          LU.order_sort,
    'order.artist_page_order': LU.artist_page_order,
    'order.exhibition_page_order': LU.exhibition_page_order,
    'order.art_fair_page_order': LU.art_fair_page_order,
    mark:           LU.mark,
    tag:            LU.tag,
    language:       LU.language,
    updatedAt:      LU.updated_at,
  },

  emptyState: {
    noData:            LU.no_artworks_found,
    noMatchingArtworks:LU.no_matching_artworks,
  },

  deleteDialog: {
    title:   LU.confirm_delete,
    confirm: LU.delete,
    cancel:  LU.cancel,
  },

  errors: {
    loadingError: LU.error_loading_data,
    systemError:  LU.system_error,
    tryAgain:     LU.try_again,
    deleteError:  LU.delete_failed,
    pleaseRetry:  LU.please_try_again,
    ok:           LU.ok,
  },

  export: {
    success:  LU.export_success,
    error:    LU.export_failed,
    artworks: LU.artworks_2,
  },
};

// ─────────────────────────────────────────────
// Action labels
// ─────────────────────────────────────────────
export const actionLabels = {
  create_en: F.create_artwork.en,
  create_cn: F.create_artwork.cn,
  edit_en:   'Edit Artwork',
  edit_cn:   '编辑作品',
  delete_en: 'Delete Artwork',
  delete_cn: '删除作品',
  export_en: 'Export Artworks',
  export_cn: '导出作品',
  import_en: 'Import Artworks',
  import_cn: '导入作品',
};

// ─────────────────────────────────────────────
// Status labels
// ─────────────────────────────────────────────
export const statusLabels = { ...STATUS_LABELS };

// ─────────────────────────────────────────────
// Entity labels
// ─────────────────────────────────────────────
export const entityLabels = {
  artwork_en: F.artwork.en,
  artwork_cn: F.artwork.cn,
  artworks_en: L.artworks.en,
  artworks_cn: L.artworks.cn,
  untitledArtwork_en: F.untitled_artwork.en,
  untitledArtwork_cn: F.untitled_artwork.cn,
};

// ─────────────────────────────────────────────
// Filter labels
// ─────────────────────────────────────────────
export const filterLabels = {
  all_titles_en:   'All Titles',   all_titles_cn:   '全部标题',
  all_types_en:    'All Types',    all_types_cn:    '全部类型',
  all_mediums_en:  'All Mediums',  all_mediums_cn:  '全部媒介',
  all_years_en:    'All Years',    all_years_cn:    '全部年份',
  all_series_en:   'All Series',   all_series_cn:   '全部系列',
  all_artists_en: F.all_artists.en,
  all_artists_cn: F.all_artists.cn,
  all_marks_en:    'All Marks',    all_marks_cn:    '全部标记',
  all_tags_en:     'All Tags',     all_tags_cn:     '全部标签',
  all_languages_en:'All Languages',all_languages_cn:'全部语言',
  all_sold_en: L.all.en,          all_sold_cn:     '全部',
};

// ─────────────────────────────────────────────
// Sort labels
// ─────────────────────────────────────────────
export const sortLabels = {
  sort_by_title_en: L.sort_by_title.en,  sort_by_title_cn:  '按标题排序',
  sort_by_year_en: L.sort_by_year.en,   sort_by_year_cn:   '按年份排序',
  sort_by_type_en: L.sort_by_type.en,   sort_by_type_cn:   '按类型排序',
  sort_by_medium_en: 'Sort by Medium', sort_by_medium_cn: '按媒介排序',
  sort_by_series_en: 'Sort by Series', sort_by_series_cn: '按系列排序',
  sort_by_order_en: L.sort_by_order.en,  sort_by_order_cn:  '按顺序排序',
  sort_by_update_en: L.sort_by_update.en, sort_by_update_cn: '按更新排序',
};

// ─────────────────────────────────────────────
// Page labels
// ─────────────────────────────────────────────
export const pageLabels = {
  title_en: F.artwork_management.en,
  title_cn: F.artwork_management.cn,
  description_en:'Manage and organize artwork content',
  description_cn:'管理和组织作品内容',
};

// ─────────────────────────────────────────────
// UI Text labels
// ─────────────────────────────────────────────
export const uiTextLabels = {
  pageTitle:      L.artwork_index,
  title:          L.title,
  artist:         L.artist,
  type:           L.type,
  medium:         L.medium,
  year:           L.year,
  size:           L.size,
  series:         L.series,
  caption:        L.caption,
  duration:       L.duration,
  credits:        L.credits_thanks,
  special_thanks: L.special_thanks_ack,
  video_url:      L.video_url,
  web_url:        L.web_url,
  work_value:     L.work_value,
  sold:           L.sold,
  order:          L.order_sort,
  'order.artist_page_order': L.artist_page_order,
  'order.exhibition_page_order': L.exhibition_page_order,
  'order.art_fair_page_order': L.art_fair_page_order,
  mark:           L.mark,
  tag:            L.tag,
  language:       L.language,
  all:            L.all,
  other:          L.other,
  noItemsFound: L.no_items_found_matching_the_criteria,
  noArtworksFound: L.no_artworks_found_matching_the_criteria,
  loadingError: L.connection_failed,
  systemError:  L.system_temporarily_unavailable,
  tryAgain:     L.try_again,
  fields: {
    title:          L.title,
    related_exhibition: L.related_gallery_exhibition, // 新增
    artist:         L.artist,
    type:           L.type,
    medium:         L.medium,
    year:           L.year,
    size:           L.size,
    series:         L.series,
    caption:        L.caption,
    duration:       L.duration,
    credits:        L.credits_thanks,
    special_thanks: L.special_thanks_ack,
    video_url:      L.video_url,
    web_url:        L.web_url,
    work_value:     L.work_value,
    sold:           L.sold,
    order:          L.order_sort,
    'order.artist_page_order': L.artist_page_order,
    'order.exhibition_page_order': L.exhibition_page_order,
    'order.art_fair_page_order': L.art_fair_page_order,
  },
};

// ─────────────────────────────────────────────
// Display labels
// ─────────────────────────────────────────────
export const displayLabels = {
  detailButtonText: (isCn) => isCn ? '查看详情'    : 'See Details',
  emptyMessage:     (isCn) => isCn ? '没有可显示的作品' : 'No artworks to display',
  noMatchMessage:   (isCn) => isCn ? L.no_matching_artworks_found.cn : L.no_matching_artworks_found.en,
  loadingMessage:   (isCn) => isCn ? '加载中...'   : 'Loading...',
  errorMessage:     (isCn) => isCn ? '加载失败'    : 'Failed to load',
};

// ─────────────────────────────────────────────
// Control panel labels
// ─────────────────────────────────────────────
export const controlPanelLabels = {
  title:          (isCn) => isCn ? L.title.cn : L.title.en,
  artist:         (isCn) => isCn ? L.artist.cn : L.artist.en,
  type:           (isCn) => isCn ? L.type.cn : L.type.en,
  medium:         (isCn) => isCn ? L.medium.cn : L.medium.en,
  year:           (isCn) => isCn ? L.year.cn : L.year.en,
  size:           (isCn) => isCn ? L.size.cn : L.size.en,
  series:         (isCn) => isCn ? L.series.cn : L.series.en,
  sold:           (isCn) => isCn ? L.sold.cn : L.sold.en,
  order:          (isCn) => isCn ? L.order_sort.cn : L.order_sort.en,
  language:       (isCn) => isCn ? L.language.cn : L.language.en,
  mark:           (isCn) => isCn ? L.mark.cn : L.mark.en,
  related_exhibition: (isCn) => isCn ? L.related_gallery_exhibition.cn : L.related_gallery_exhibition.en, // 新增

  sortByTitle:         (isCn) => isCn ? L.sort_by_title.cn : L.sort_by_title.en,
  sortByTitleTooltip:  (isCn) => isCn ? L.sort_artworks_by_title.cn : L.sort_artworks_by_title.en,
  sortByYear:          (isCn) => isCn ? L.sort_by_year.cn : L.sort_by_year.en,
  sortByYearTooltip:   (isCn) => isCn ? L.sort_artworks_by_year.cn : L.sort_artworks_by_year.en,
  sortByOrder:         (isCn) => isCn ? L.sort_by_order.cn : L.sort_by_order.en,
  sortByOrderTooltip:  (isCn) => isCn ? L.sort_artworks_by_order.cn : L.sort_artworks_by_order.en,
  sortByUpdate:        (isCn) => isCn ? L.sort_by_update.cn : L.sort_by_update.en,
  sortByUpdateTooltip: (isCn) => isCn ? L.sort_by_update_date.cn : L.sort_by_update_date.en,

  // Backwards compatibility flat strings
  titleLabel_en: L.title.en,    titleLabel_cn:   '标题',
  artistLabel_en: L.artist.en,   artistLabel_cn:  '艺术家',
  typeLabel_en: L.type.en,     typeLabel_cn:    '类型',
  mediumLabel_en: L.medium.en,   mediumLabel_cn:  '媒介',
  yearLabel_en: L.year.en,     yearLabel_cn:    '年份',
  seriesLabel_en: L.series.en,   seriesLabel_cn:  '系列',
  soldLabel_en: L.sold.en,     soldLabel_cn:    '已售',
  orderLabel_en: L.order_sort.en,    orderLabel_cn:   '排序',
  languageLabel_en: L.language.en, languageLabel_cn:'语言',
  markLabel_en: L.mark.en,     markLabel_cn:    '标记',
  tagLabel_en: L.tag.en,      tagLabel_cn:     '标签',
};

// ─────────────────────────────────────────────
// Default content labels
// ─────────────────────────────────────────────
export const defaultContentLabels = {
  listTitle:     (isCn) => isCn ? '作品列表'  : 'ARTWORK LIST',
  detailsLabel:  (isCn) => isCn ? '作品详情'  : 'ARTWORK DETAILS',
  untitled:      (isCn) => isCn ? '无题作品'  : 'Untitled Artwork',
  noDescription: (isCn) => isCn ? '暂无描述'  : 'No description available',
  back:          (isCn) => isCn ? '返回'      : 'BACK',
};

// ─────────────────────────────────────────────
// Field group labels
// ─────────────────────────────────────────────
export const fieldGroupLabels = {
  basic: {
    title: (isCn) => isCn ? '基本信息' : 'Basic Info',
  },
  additional: {
    title: (isCn) => isCn ? '附加信息' : 'Additional Info',
  },
  images: {
    title: (isCn) => isCn ? '图片' : 'Images',
  },
  // Legacy aliases
  media: {
    title: (isCn) => isCn ? '媒体' : 'Media',
  },
  content: {
    title: (isCn) => isCn ? '内容' : 'Content',
  },
  commerce: {
    title: (isCn) => isCn ? '商业信息' : 'Commerce',
  },
};

// ─────────────────────────────────────────────
// Field labels for components — all Prisma Artwork fields
// ─────────────────────────────────────────────
export const fieldLabelsForComponents = {
  cover_img_url:  L.cover_image,
  related_exhibition: L.related_gallery_exhibition, // 新增
  artist:         L.artist,
  title:          L.title,
  type:           L.type,
  medium:         L.medium,
  year:           L.year,
  size:           L.size,
  series:         L.series,
  caption:        L.caption,
  duration:       L.duration,
  credits:        L.credits_thanks,
  special_thanks: L.special_thanks_ack,
  introduction:   L.introduction,
  video_url:      L.video_url,
  web_url:        L.web_url,
  work_value:     L.work_value,
  sold:           L.sold,
  order:          L.order_sort,
  'order.artist_page_order': L.artist_page_order,
  'order.exhibition_page_order': L.exhibition_page_order,
  'order.art_fair_page_order': L.art_fair_page_order,
  mark:           L.mark,
  tag:            L.tag,
  language:       L.language,
};

// ─────────────────────────────────────────────
// Delete dialog labels
// ─────────────────────────────────────────────
export const deleteDialogLabels = {
  delete_dialog_this_item_en: F.this_artwork.en,
  delete_dialog_this_item_cn: F.this_artwork.cn,
  confirmDeleteArtwork_en:    'Are you sure you want to delete this artwork?',
  confirmDeleteArtwork_cn:    '确定要删除该作品吗？',
  thisArtwork_en: F.this_artwork.en,
  thisArtwork_cn: F.this_artwork.cn,
};

// ─────────────────────────────────────────────
// Additional labels
// ─────────────────────────────────────────────
export const additionalLabels = {
  // Placeholder and description labels
  selectTitle_en:      'Select Title',      selectTitle_cn:      '选择标题',
  enterTitle_en:       'Enter artwork title',enterTitle_cn:       '输入作品标题',
  selectType_en:       'Select Type',       selectType_cn:       '选择类型',
  enterTypeName_en:    'Enter type name',   enterTypeName_cn:    '输入类型名称',
  selectMedium_en:     'Select Medium',     selectMedium_cn:     '选择媒介',
  selectSeries_en:     'Select Series',     selectSeries_cn:     '选择系列',
  selectArtist_en:     'Select Artist',     selectArtist_cn:     '选择艺术家',
  selectSold_en:       'Select Sold Status',selectSold_cn:       '选择销售状态',
  selectOrder_en:      'Select Order',      selectOrder_cn:      '选择排序',
  selectLanguage_en:   'Select Language',   selectLanguage_cn:   '选择语言',

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

  // Entity / collection
  no_artworks_en: L.no_artworks_found.en,
  no_artworks_cn: '未找到作品',

  // Search and filter
  searchArtworks_en: 'Search artworks',
  searchArtworks_cn: '搜索作品',

  // Status and error
  noFeaturedArtworks_en:  'No featured artworks available',
  noFeaturedArtworks_cn:  '暂无精选作品',
  noMatchingArtworks_en: L.no_matching_artworks_found.en,
  noMatchingArtworks_cn: L.no_artworks_found_matching_the_criteria.cn,

  // Commerce
  work_value_en: L.work_value.en,    work_value_cn:     '作品价值',
  sold_en: L.sold.en,          sold_cn:           '已售',
  noWorkValue_en:    'No value set',  noWorkValue_cn:    '未设置价值',

  // Order
  order_en: F.order.en,
  order_cn: F.order.cn,
};

// ─────────────────────────────────────────────
// UI Text Configuration
// ─────────────────────────────────────────────
export const UI_TEXT = {
  loadingError:     L.connection_failed,
  systemError:      L.system_temporarily_unavailable,
  tryAgain:         L.try_again,
  artworkManagement:L.artwork_management,
  noData:           L.no_artworks_available,
  noMatchingArtworks:L.no_matching_artworks_found,
  all:              L.all,
  totalCount:       L.total,
  exportSuccess:    L.export_success,
  exportError:      L.export_failed,
  exportInProgress: L.exporting,
};

// ─────────────────────────────────────────────
// Combined labels object
// ─────────────────────────────────────────────
export const artworkLabels = {
  ...fieldLabels,
  ...actionLabels,
  ...statusLabels,
  ...entityLabels,
  ...filterLabels,
  ...sortLabels,
  ...pageLabels,
  ...deleteDialogLabels,
  ...additionalLabels,
  uiText:         uiTextLabels,
  display:        displayLabels,
  controlPanel:   controlPanelLabels,
  defaultContent: defaultContentLabels,
  UI_TEXT,
  PAGE_TEXT,
};

// ─────────────────────────────────────────────
// Helper: get field label
// ─────────────────────────────────────────────
export const getArtworkLabel = (key, language = 'en') => {
  if (!key) return '';

  // Try direct fieldLabels first (bilingual objects)
  if (fieldLabels[key]) {
    if (typeof fieldLabels[key] === 'object') {
      return fieldLabels[key][language] || fieldLabels[key]['en'] || key;
    }
    return fieldLabels[key];
  }

  // Try fieldLabelsForComponents
  if (fieldLabelsForComponents[key]) {
    return fieldLabelsForComponents[key][language]
      || fieldLabelsForComponents[key]['en']
      || key;
  }

  // Try flat key with language suffix
  const labelKey = `${key}_${language}`;
  if (artworkLabels[labelKey]) return artworkLabels[labelKey];

  // Fallback: English when CN not found
  if (language === 'cn') {
    const englishKey = `${key}_en`;
    if (artworkLabels[englishKey]) return artworkLabels[englishKey];
  }

  return key;
};

// ─────────────────────────────────────────────
// Helper: get UI text
// ─────────────────────────────────────────────
export const getArtworkUIText = (key, language = 'en') => {
  if (!key) return '';

  if (uiTextLabels[key]) {
    return uiTextLabels[key][language] || uiTextLabels[key]['en'] || key;
  }

  if (key.includes('.')) {
    const [parent, child] = key.split('.');
    if (uiTextLabels[parent]?.[child]) {
      return uiTextLabels[parent][child][language]
        || uiTextLabels[parent][child]['en']
        || key;
    }
  }

  return key;
};

export default artworkLabels;
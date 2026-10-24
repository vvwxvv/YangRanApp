import { L } from "@/components/labels/managerLabels";
// exhibitionConfig.js — matches updated Prisma Exhibition model (related_artwork = JSON 对象数组)
import { ANIMATION_VARIANTS } from './general_config';

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const exhibitionLabels = {
  page: {
    title: L.exhibitions,
    subtitle: L.exhibition_management,
    description: L.manage_exhibition_collection,
  },

  fields: {
    cover_img_url:          L.cover_image,
    title:                  L.title,
    subtitle:               L.subtitle,
    type:                   L.type,
    date_start:             L.start_date,
    date_end:               L.end_date,
    opening_date:           L.opening_date,
    year:                   L.year,
    venue:                  L.venue,
    location:               L.location,
    curator:                L.curator,
    organiser:              L.organiser,
    participating_artists:  L.participating_artists,
    caption:                L.caption,
    description:            L.description,
    introduction:           L.introduction,
    press_release:          L.press_release,
    related_artwork:        L.related_artworks,
    related_artist: L.related_gallery_artists,
    video_url:              L.video_url,
    web_url:                L.web_url,
    order:                  L.order_sort,
    mark:                   L.mark,
    language:               L.language,
    status:                 L.status,
  },

  UI_TEXT: {
    exhibitionManagement: L.exhibition_management,
    create:   L.create_new_exhibition,
    edit:     L.edit,
    delete:   L.delete,
    save:     L.save,
    cancel:   L.cancel,
    confirmDelete: L.confirm_delete,
    noData:   L.no_exhibitions_available,
  },
};

export const getExhibitionLabel = (key, language = 'en') => {
  const lang = language === 'cn' ? 'cn' : 'en';
  if (exhibitionLabels.fields[key]) return exhibitionLabels.fields[key][lang];
  if (exhibitionLabels.UI_TEXT[key]) return exhibitionLabels.UI_TEXT[key][lang];
  if (exhibitionLabels.page[key]) return exhibitionLabels.page[key][lang];
  return key;
};

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const exhibitionConfig = {
  itemUrl: "exhibition",
  schemaName: "Exhibition",

  api: {
    endpoints: {
      base: '/api/exhibition',
      create: '/api/exhibition',
      update: (id) => `/api/exhibition/${id}`,
      delete: (id) => `/api/exhibition/${id}`,
      list: '/api/exhibition',
      detail: (id) => `/api/exhibition/${id}`,
      upload: '/api/upload',
      bulk: '/api/exhibition/bulk',
      reorder: '/api/exhibition/reorder',
    },
    methods: {
      create: 'POST', update: 'PUT', delete: 'DELETE',
      list: 'GET', detail: 'GET', upload: 'POST',
      bulk: 'POST', reorder: 'PUT',
    },
    headers: { 'Content-Type': 'application/json' },
    uploadHeaders: {},
    languageParam: 'language',
    defaultLimit: 10000,
    config: {
      enableSoftDelete: false,
      enablePagination: false,
      enableSearch: true,
      enableSorting: true,
      defaultPageSize: 10000,
      maxPageSize: 10000,
      defaultSortOrder: 1,
      defaultSortField: 'order',
      collectionName: 'Exhibition',
    },
  },

  page: {
    title: exhibitionLabels.page.title,
    subtitle: exhibitionLabels.page.subtitle,
    description: exhibitionLabels.page.description,
    animationVariants: ANIMATION_VARIANTS?.container || {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1, y: 0,
        transition: { delayChildren: 0.15, staggerChildren: 0.08 },
      },
    },
  },

  fields: {
    imagesField: ['cover_img_url'],
    urlField: ['cover_img_url', 'video_url', 'web_url'],
    // 普通字符串数组字段。related_artwork 不在此列 —— 它是 JSON 对象数组，
    // 由 API config 的 before hooks inline 清洗，不走通用字符串数组处理。
    arrayFields: ['introduction', 'press_release', 'related_artist'],
    requiredFields: [],
    // related_artwork 移除 —— 对象数组无法作为字符串搜索。
    searchableFields: [
      'title', 'subtitle', 'venue', 'curator', 'organiser',
      'participating_artists', 'caption', 'description',
      'related_artist'
    ],
    sortableFields: ['order', 'year', 'date_start', 'title'],
    filterableFields: ['type', 'status', 'mark', 'language'],
    mainFields: ['title', 'type', 'year', 'venue'],
    expandedFields: [
      'caption', 'description', 'introduction', 'press_release',
      'participating_artists', 'curator', 'organiser',
      'related_artwork', 'related_artist'
    ],
    // 所有数据字段（包含全部 Prisma 字段）
    dataField: [
      'cover_img_url', 'title', 'subtitle', 'type', 'date_start', 'date_end',
      'opening_date', 'year', 'venue', 'location', 'curator', 'organiser',
      'participating_artists', 'caption', 'description', 'introduction',
      'press_release', 'related_artwork', 'related_artist',
      'video_url', 'web_url', 'order', 'mark', 'language', 'status',
    ],
    fieldShowOrder: [
      'cover_img_url', 'title', 'subtitle', 'type', 'date_start', 'date_end',
      'opening_date', 'year', 'venue', 'location', 'curator', 'organiser',
      'participating_artists', 'caption', 'description', 'introduction',
      'press_release', 'related_artwork', 'related_artist',
      'video_url', 'web_url', 'order', 'mark', 'language', 'status',
    ],
    validFields: [
      '_id', 'id', 'cover_img_url', 'title', 'subtitle', 'type', 'date_start',
      'date_end', 'opening_date', 'year', 'venue', 'location', 'curator',
      'organiser', 'participating_artists', 'caption', 'description',
      'introduction', 'press_release', 'related_artwork',
      'related_artist', 'video_url', 'web_url', 'order',
      'mark', 'language', 'status', 'updatedAt',
    ],
  },

  components: {},

  settings: {
    useLanguage: true,
    languageField: 'language',
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
    },
    upload: {
      maxFileSize: 10 * 1024 * 1024,
      acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      uploadPath: '/uploads/exhibitions/',
    },
    validation: {
      maxDescriptionLength: 2000,
    },
    display: {
      cardImageAspectRatio: 'aspect-square',
      defaultImagePlaceholder: '/placeholder.png',
      showFieldLabels: true,
      showExpandArrow: true,
      showDetailButton: true,
    },
  },

  labels: exhibitionLabels,

  // 展览类型选项（可根据实际业务扩展）
  typeOptions: [
    { value: 'solo', label_en: 'Solo Exhibition', label_cn: '个展' },
    { value: 'group', label_en: 'Group Exhibition', label_cn: '群展' },
    { value: 'biennale', label_en: 'Biennale', label_cn: '双年展' },
    { value: 'retrospective', label_en: 'Retrospective', label_cn: '回顾展' },
    { value: 'thematic', label_en: 'Thematic Exhibition', label_cn: '主题展' },
    { value: 'online', label_en: 'Online Exhibition', label_cn: '线上展览' },
  ],

  languageOptions: [
    { value: 'CN', label_en: 'Chinese', label_cn: '中文' },
    { value: 'EN', label_en: 'English', label_cn: '英文' },
  ],

  statusOptions: [
    { value: 'upcoming', label_en: 'Upcoming', label_cn: '即将展出' },
    { value: 'ongoing',  label_en: 'Ongoing',  label_cn: '正在展出' },
    { value: 'past',     label_en: 'Past',     label_cn: '已结束' },
    { value: 'draft',    label_en: 'Draft',    label_cn: '草稿' },
  ],
};

export default exhibitionConfig;
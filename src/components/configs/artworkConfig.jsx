import { L } from "@/components/labels/managerLabels";
// artworkConfig.js — fully matches Prisma Artwork model
import { ANIMATION_VARIANTS } from './general_config';

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const artworkLabels = {
  page: {
    title: L.artworks,
    subtitle: L.artwork_management,
    description: L.manage_artwork_collection,
  },

  fields: {
    cover_img_url: L.cover_image,
    related_exhibition: L.related_gallery_exhibition, // 新增
    artist: L.artist,
    title: L.title,
    type: L.type,
    medium: L.medium,
    year: L.year,
    size: L.size,
    series: L.series,
    caption: L.caption,
    duration: L.duration,
    credits: L.credits_ack,
    special_thanks: L.special_thanks_thanks,
    introduction: L.introduction,
    video_url: L.video_url,
    web_url: L.web_url,
    work_value: L.value,
    sold: L.sold_status,
    order: L.order_sort,
    'order.artist_page_order': L.artist_page_order,
    'order.exhibition_page_order': L.exhibition_page_order,
    'order.art_fair_page_order': L.art_fair_page_order,
    mark: L.mark,
    tag: L.tag,
    language: L.language,
  },

  UI_TEXT: {
    artworkManagement: L.artwork_management,
    create: L.create_new_artwork,
    edit: L.edit,
    delete: L.delete,
    save: L.save,
    cancel: L.cancel,
    confirmDelete: L.confirm_delete,
    noData: L.no_artworks_available,
  },
};

export const getArtworkLabel = (key, language = 'en') => {
  const lang = language === 'cn' ? 'cn' : 'en';
  if (artworkLabels.fields[key]) return artworkLabels.fields[key][lang];
  if (artworkLabels.UI_TEXT[key]) return artworkLabels.UI_TEXT[key][lang];
  if (artworkLabels.page[key]) return artworkLabels.page[key][lang];
  return key;
};

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const artworkConfig = {
  itemUrl: "artwork",
  schemaName: "Artwork",

  api: {
    endpoints: {
      base: '/api/artwork',
      create: '/api/artwork',
      update: (id) => `/api/artwork/${id}`,
      delete: (id) => `/api/artwork/${id}`,
      list: '/api/artwork',
      detail: (id) => `/api/artwork/${id}`,
      upload: '/api/upload',
      bulk: '/api/artwork/bulk',
      reorder: '/api/artwork/reorder',
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
      defaultSortField: 'order.artist_page_order',
      collectionName: 'Artwork',
    },
  },

  page: {
    title: artworkLabels.page.title,
    subtitle: artworkLabels.page.subtitle,
    description: artworkLabels.page.description,
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
    arrayFields: ['introduction', 'related_exhibition'],               // 添加 related_exhibition
    requiredFields: [],
    searchableFields: ['title', 'artist', 'caption', 'type', 'medium', 'series','tag'],
    sortableFields: ['order.artist_page_order', 'year', 'title', 'artist'],
    filterableFields: ['type', 'medium', 'series', 'mark','tag', 'language'],
    mainFields: ['title', 'artist', 'year', 'type'],
    expandedFields: ['caption', 'introduction', 'credits', 'size', 'medium'],
    dataField: [
      'cover_img_url', 'related_exhibition',  // 新增
      'artist', 'title', 'type', 'medium', 'year',
      'size', 'series', 'caption', 'duration', 'credits', 'special_thanks',
      'introduction', 'video_url', 'web_url', 'work_value', 'sold',
      'order', 'mark', 'tag','language',
    ],
    fieldShowOrder: [
      'cover_img_url', 'related_exhibition',  // 新增，位置可根据需要调整
      'title', 'artist', 'type', 'medium', 'year',
      'size', 'series', 'caption', 'duration', 'credits', 'special_thanks',
      'introduction', 'video_url', 'web_url', 'work_value', 'sold',
      'order', 'mark', 'tag','language',
    ],
    validFields: [
      'id',                  // 仅保留 Prisma 字段名，移除 _id
      'cover_img_url',
      'related_exhibition',  // 新增
      'artist', 'title', 'type', 'medium', 'year',
      'size', 'series', 'caption', 'duration', 'credits',
      'special_thanks', 'introduction', 'video_url', 'web_url',
      'work_value', 'sold', 'order', 'mark','tag','language', 'updatedAt',
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
      uploadPath: '/uploads/artworks/',
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

  labels: artworkLabels,
  typeOptions: [],
  languageOptions: [
    { value: 'CN', label_en: 'Chinese', label_cn: '中文' },
    { value: 'EN', label_en: 'English', label_cn: '英文' },
  ],
};

export default artworkConfig;
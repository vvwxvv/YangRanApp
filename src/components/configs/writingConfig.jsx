import { L } from "@/components/labels/managerLabels";
// writingConfig.jsx — fully matches the Prisma Writing model,
// same structure & conventions as artworkConfig.jsx.
import { ANIMATION_VARIANTS } from './general_config';

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const writingLabels = {
  page: {
    title: L.writings,
    subtitle: L.writing_management,
    description: L.manage_writings_texts,
  },

  fields: {
    cover_img_url: L.cover_image,
    author: L.author,
    title: L.title,
    subtitle: L.subtitle,
    summary: L.summary,
    keywords: L.keywords,
    category: L.category,
    type: L.type,
    year: L.year,
    paragraphs: L.paragraphs,
    caption: L.caption,
    status: L.status,
    tag: L.tag,
    mark: L.mark,
    tags: L.tags,
    language: L.language,
    createdAt: L.created_at,
    updatedAt: L.last_updated,
  },

  UI_TEXT: {
    writingManagement: L.writing_management,
    create: L.create_new_writing,
    edit: L.edit,
    delete: L.delete,
    save: L.save,
    cancel: L.cancel,
    confirmDelete: L.confirm_delete,
    noData: L.no_writings_available,
  },
};

export const getWritingLabel = (key, language = 'en') => {
  const lang = language === 'cn' ? 'cn' : 'en';
  if (writingLabels.fields[key]) return writingLabels.fields[key][lang];
  if (writingLabels.UI_TEXT[key]) return writingLabels.UI_TEXT[key][lang];
  if (writingLabels.page[key]) return writingLabels.page[key][lang];
  return key;
};

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const writingConfig = {
  itemUrl: "writing",
  schemaName: "Writing",

  api: {
    endpoints: {
      base: '/api/writing',
      create: '/api/writing',
      update: (id) => `/api/writing/${id}`,
      delete: (id) => `/api/writing/${id}`,
      list: '/api/writing',
      detail: (id) => `/api/writing/${id}`,
      upload: '/api/upload',
      bulk: '/api/writing/batch_edit',
      // The Writing model has no `order` field (no per-page ordering), so
      // there is no reorder endpoint — kept as null for structural parity.
      reorder: null,
    },
    methods: {
      create: 'POST', update: 'PUT', delete: 'DELETE',
      list: 'GET', detail: 'GET', upload: 'POST',
      bulk: 'PUT', reorder: 'PUT',
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
      // Newest first — the Writing model's own default (see writing_api_config).
      defaultSortOrder: -1,
      defaultSortField: 'createdAt',
      collectionName: 'Writing',
    },
  },

  page: {
    title: writingLabels.page.title,
    subtitle: writingLabels.page.subtitle,
    description: writingLabels.page.description,
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
    urlField: ['cover_img_url'],
    arrayFields: ['paragraphs'],
    requiredFields: [],
    searchableFields: ['title', 'subtitle', 'author', 'summary', 'keywords','tag', 'mark'],
    sortableFields: ['createdAt', 'updatedAt', 'year', 'title', 'author'],
    filterableFields: ['type', 'category', 'status', 'tag', 'mark','tag','language'],
    mainFields: ['title', 'author', 'year', 'type'],
    expandedFields: ['summary', 'caption', 'category', 'status', 'tag'],
    dataField: [
      'cover_img_url', 'author', 'title', 'subtitle', 'summary',
      'keywords', 'category', 'type', 'year', 'paragraphs',
      'caption', 'status', 'tag', 'mark', 'tag','language',
    ],
    fieldShowOrder: [
      'cover_img_url', 'title', 'subtitle', 'author', 'type',
      'category', 'year', 'summary', 'keywords', 'paragraphs',
      'caption', 'status', 'tag', 'mark', 'tag','language',
    ],
    validFields: [
      'id',                  // 仅保留 Prisma 字段名，移除 _id
      'cover_img_url', 'author', 'title', 'subtitle', 'summary',
      'keywords', 'category', 'type', 'year', 'paragraphs',
      'caption', 'status', 'tag', 'mark','tag', 'language', 'updatedAt',
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
      uploadPath: '/uploads/writings/',
    },
    validation: {
      maxSummaryLength: 2000,
      maxParagraphLength: 4000,
    },
    display: {
      cardImageAspectRatio: 'aspect-square',
      defaultImagePlaceholder: '/placeholder.png',
      showFieldLabels: true,
      showExpandArrow: true,
      showDetailButton: true,
    },
  },

  labels: writingLabels,
  typeOptions: [],
  languageOptions: [
    { value: 'CN', label_en: 'Chinese', label_cn: '中文' },
    { value: 'EN', label_en: 'English', label_cn: '英文' },
  ],
};

export default writingConfig;

import { L } from "@/components/labels/managerLabels";
// bibliographyConfig.js
import BibliographyEditForm from "@/components/forms/BibliographyEditForm";
import BibliographyForm from "@/components/forms/BibliographyForm";
import { ANIMATION_VARIANTS } from './general_config';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const bibliographyLabels = {
  // Page labels
  page: {
    title: L.bibliography,
    subtitle: L.bibliography_information,
    description: L.manage_bibliography_entries,
  },

  // Field labels — one entry per editable Prisma field
  fields: {
    title: L.title,
    subtitle: L.subtitle,
    cover_img_url: L.cover_image_url,
    author: L.author,
    type: L.type,
    year: L.year,
    date: L.date,
    published_at: L.published_at,
    pdf_url: L.pdf_url,
    web_url: L.website_url,
    video_url: L.video_url,
    related_exhibition: L.related_exhibitions,
    related_artist: L.related_artists,
    order: L.order_sort,
    language: L.language,          // 新增
    mark: L.mark,                  // 新增
  },

  // UI Text
  UI_TEXT: {
    bibliographyManagement: L.bibliography_management,
    create: L.create_item,
    edit: L.edit,
    delete: L.delete,
    save: L.save,
    cancel: L.cancel,
    confirmDelete: L.confirm_delete,
    noData: L.no_data_available,
  },
};

// Helper function to get labels
export const getBibliographyLabel = (key, language = 'en') => {
  if (bibliographyLabels.fields[key]) {
    return bibliographyLabels.fields[key][language] || bibliographyLabels.fields[key]['en'];
  }
  if (bibliographyLabels.UI_TEXT[key]) {
    return bibliographyLabels.UI_TEXT[key][language] || bibliographyLabels.UI_TEXT[key]['en'];
  }
  if (bibliographyLabels.page[key]) {
    return bibliographyLabels.page[key][language] || bibliographyLabels.page[key]['en'];
  }
  return key;
};

// ============================================================
// FIELD GROUPS CONFIGURATION
// ============================================================
export const getFieldGroupsBibliography = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: isCn ? '基本信息' : 'Basic Information',
      fields: [
        { key: "title" },
        { key: "subtitle" },
        { key: "cover_img_url" },
        { key: "author" },
        { key: "type" },
        { key: "year" },
        { key: "date" },
        { key: "published_at" },
        { key: "language" },        // 新增
      ]
    },
    MEDIA: {
      title: isCn ? '媒体链接' : 'Media Links',
      fields: [
        { key: "pdf_url" },
        { key: "web_url" },
        { key: "video_url" },
      ]
    },
    RELATIONS: {
      title: isCn ? '关联信息' : 'Relations',
      fields: [
        { key: "related_exhibition" },
        { key: "related_artist" },
      ]
    },
    META: {
      title: isCn ? '元数据' : 'Metadata',
      fields: [
        { key: "order" },
        { key: "mark" },           // 新增
      ]
    }
  };
  
  return getFieldGroupsWithLabels('bibliography', fieldGroups, isCn);
};

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const bibliographyConfig = {
  // Schema identifier
  itemUrl: "bibliography",
  schemaName: "Bibliography",

  // API Configuration
  api: {
    endpoints: {
      base: '/api/bibliography',
      create: '/api/bibliography',
      update: (id) => `/api/bibliography/${id}`,
      delete: (id) => `/api/bibliography/${id}`,
      list: '/api/bibliography',
      detail: (id) => `/api/bibliography/${id}`,
    },
    methods: {
      create: 'POST',
      update: 'PUT',
      delete: 'DELETE',
      list: 'GET',
      detail: 'GET',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    config: {
      enablePagination: true,
      enableSearch: true,
      enableSorting: true,
      defaultSortField: 'order',
      defaultSortOrder: -1,
      collectionName: 'Bibliography',
    },
  },

  // Page Configuration
  page: {
    title: bibliographyLabels.page.title,
    subtitle: bibliographyLabels.page.subtitle,
    description: bibliographyLabels.page.description,
    animationVariants: ANIMATION_VARIANTS?.container || {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delayChildren: 0.15,
          staggerChildren: 0.08,
        },
      },
    },
  },

  // Field Configuration
  fields: {
    searchableFields: ['title', 'subtitle', 'author', 'type', 'year', 'date', 'published_at', 'language', 'mark'], // 新增 language, mark
    sortableFields: ['order', 'year', 'title', 'language'], // 新增 language（可按语言排序）
    filterableFields: ['type', 'language'],                // 新增 language 筛选
    mainFields: ['title', 'author', 'year'],
    expandedFields: ['subtitle', 'cover_img_url', 'pdf_url', 'web_url', 'video_url'],
    arrayFields: ['related_exhibition', 'related_artist'],
    validFields: [
      'id', 'title', 'subtitle', 'cover_img_url', 'author', 'type',
      'year', 'date', 'published_at', 'pdf_url', 'web_url', 'video_url',
      'related_exhibition', 'related_artist', 'order', 'language', 'mark' // 新增 language, mark
    ],
  },

  // Component Configuration
  components: {
    createFormComponent: BibliographyForm,
    editFormComponent: BibliographyEditForm,
  },

  // Labels Configuration
  labels: bibliographyLabels,

  // Language Options (if needed)
  languageOptions: [
    { value: 'CN', label_en: 'Chinese', label_cn: '中文' },
    { value: 'EN', label_en: 'English', label_cn: '英文' },
  ],
};

// Export default
export default bibliographyConfig;
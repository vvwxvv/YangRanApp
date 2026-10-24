import { L } from "@/components/labels/managerLabels";
// seriesConfig.js
import SeriesEditForm from "@/components/forms/SeriesEditForm";
import SeriesForm from "@/components/forms/SeriesForm";
import { ANIMATION_VARIANTS } from './general_config';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';
import { Tag } from "antd";

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const seriesLabels = {
  // Page labels
  page: {
    title: L.series,
    subtitle: L.series_information,
    description: L.manage_series_entries,
  },

  // Field labels — one entry per editable Prisma field
  fields: {
    artist: L.artist,
    title: L.title,
    type: L.type,
    medium: L.medium,
    year: L.year,
    caption: L.caption,
    credits: L.credits_ack,
    special_thanks: L.special_thanks_thanks,
    cover_img_url: L.cover_image_url,
    introduction: L.introduction_preface,
    order: L.order_sort,
    language: L.language,
    mark: L.mark,
    Tag: L.tag,
  },

  // UI Text
  UI_TEXT: {
    seriesManagement: L.series_management,
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
export const getSeriesLabel = (key, language = 'en') => {
  if (seriesLabels.fields[key]) {
    return seriesLabels.fields[key][language] || seriesLabels.fields[key]['en'];
  }
  if (seriesLabels.UI_TEXT[key]) {
    return seriesLabels.UI_TEXT[key][language] || seriesLabels.UI_TEXT[key]['en'];
  }
  if (seriesLabels.page[key]) {
    return seriesLabels.page[key][language] || seriesLabels.page[key]['en'];
  }
  return key;
};

// ============================================================
// FIELD GROUPS CONFIGURATION
// ============================================================
export const getFieldGroupsSeries = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: isCn ? '基本信息' : 'Basic Information',
      fields: [
        { key: "artist" },
        { key: "title" },
        { key: "type" },
        { key: "medium" },
        { key: "year" },
        { key: "language" },
      ]
    },
    CONTENT: {
      title: isCn ? '内容' : 'Content',
      fields: [
        { key: "caption" },
      ]
    },
    CREDITS: {
      title: isCn ? '鸣谢' : 'Credits',
      fields: [
        { key: "credits" },
        { key: "special_thanks" },
      ]
    },
    META: {
      title: isCn ? '元数据' : 'Metadata',
      fields: [
        { key: "order" },
        { key: "mark" },
      ]
    }
  };

  return getFieldGroupsWithLabels('series', fieldGroups, isCn);
};

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const seriesConfig = {
  // Schema identifier
  itemUrl: "series",
  schemaName: "Series",

  // API Configuration
  api: {
    endpoints: {
      base: '/api/series',
      create: '/api/series',
      update: (id) => `/api/series/${id}`,
      delete: (id) => `/api/series/${id}`,
      list: '/api/series',
      detail: (id) => `/api/series/${id}`,
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
      collectionName: 'Series',
    },
  },

  // Page Configuration
  page: {
    title: seriesLabels.page.title,
    subtitle: seriesLabels.page.subtitle,
    description: seriesLabels.page.description,
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
    searchableFields: ['artist', 'title', 'type', 'medium', 'year', 'language', 'mark','tag'],
    sortableFields: ['order', 'year', 'title', 'language'],
    filterableFields: ['type', 'language','tag'],
    mainFields: ['title', 'artist', 'year'],
    expandedFields: ['type', 'medium', 'cover_img_url'],
    arrayFields: ['introduction'],
    validFields: [
      'id', 'cover_img_url', 'artist', 'title', 'type', 'medium',
      'year', 'caption', 'credits', 'special_thanks', 'introduction',
      'order', 'language', 'mark','tag'
    ],
  },

  // Component Configuration
  components: {
    createFormComponent: SeriesForm,
    editFormComponent: SeriesEditForm,
  },

  // Labels Configuration
  labels: seriesLabels,

  // Language Options (if needed)
  languageOptions: [
    { value: 'CN', label_en: 'Chinese', label_cn: '中文' },
    { value: 'EN', label_en: 'English', label_cn: '英文' },
  ],
};

// Export default
export default seriesConfig;

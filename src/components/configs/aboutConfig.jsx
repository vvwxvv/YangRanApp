import { L } from "@/components/labels/managerLabels";
// aboutConfig.js
import AboutEditForm from "@/components/forms/AboutEditForm";
import AboutForm from "@/components/forms/AboutForm";
import { 
  ANIMATION_VARIANTS, 
} from './general_config';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const aboutLabels = {
  // Page labels
  page: {
    title: L.about,
    subtitle: L.about_information,
    description: L.manage_about_information,
  },

  // Field labels — one entry per editable Prisma field
  fields: {
    portrait_image_url: L.portrait_image_url,
    artist: L.artist,
    caption: L.caption,
    introductions: L.introduction,
    pdf_url: L.pdf_url,           // 新增
    web_url: L.website_url,       // 新增
    language: L.language,
    order: L.order_sort,
    mark: L.mark,
  },

  // UI Text
  UI_TEXT: {
    aboutManagement: L.about_management,
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
export const getAboutLabel = (key, language = 'en') => {
  if (aboutLabels.fields[key]) {
    return aboutLabels.fields[key][language] || aboutLabels.fields[key]['en'];
  }
  if (aboutLabels.UI_TEXT[key]) {
    return aboutLabels.UI_TEXT[key][language] || aboutLabels.UI_TEXT[key]['en'];
  }
  if (aboutLabels.page[key]) {
    return aboutLabels.page[key][language] || aboutLabels.page[key]['en'];
  }
  return key;
};

// ============================================================
// FIELD GROUPS CONFIGURATION
// ============================================================
export const getFieldGroupsAbout = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: isCn ? '基本信息' : 'Basic Information',
      fields: [
        { key: "portrait_image_url" },
        { key: "artist" },
        { key: "caption" },
        { key: "introductions" },
        { key: "pdf_url" },        // 新增
        { key: "web_url" },        // 新增
        { key: "language" },
        { key: "order" },
        { key: "mark" },
      ]
    }
  };
  
  return getFieldGroupsWithLabels('about', fieldGroups, isCn);
};

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const aboutConfig = {
  // Schema identifier
  itemUrl: "about",
  schemaName: "About",

  // API Configuration
  api: {
    endpoints: {
      base: '/api/about',
      create: '/api/about',
      update: (id) => `/api/about/${id}`,
      delete: (id) => `/api/about/${id}`,
      list: '/api/about',
      detail: (id) => `/api/about/${id}`,
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
      enablePagination: false,
      enableSearch: true,
      enableSorting: true,
      defaultSortField: 'order',
      defaultSortOrder: -1,
      collectionName: 'About',
    },
  },

  // Page Configuration
  page: {
    title: aboutLabels.page.title,
    subtitle: aboutLabels.page.subtitle,
    description: aboutLabels.page.description,
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
    searchableFields: ['artist', 'caption', 'pdf_url', 'web_url'],  // 新增 pdf_url, web_url
    sortableFields: ['order'],
    filterableFields: ['language'],
    mainFields: ['artist', 'caption', 'language'],
    expandedFields: ['introductions', 'mark'],
    arrayFields: ['introductions'],
    validFields: [
      'id', 'portrait_image_url', 'artist', 'caption',
      'introductions', 'pdf_url', 'web_url',          // 新增
      'language', 'order', 'mark'
    ],
  },

  // Component Configuration
  components: {
    createFormComponent: AboutForm,
    editFormComponent: AboutEditForm,
  },

  // Labels Configuration
  labels: aboutLabels,

  // Language Options
  languageOptions: [
    { value: 'CN', label_en: 'Chinese', label_cn: '中文' },
    { value: 'EN', label_en: 'English', label_cn: '英文' },
  ],
};

// Export default
export default aboutConfig;
import { L } from "@/components/labels/managerLabels";
// resumeConfig.js
import ResumeEditForm from "@/components/forms/ResumeEditForm";
import ResumeForm from "@/components/forms/ResumeForm";
import { ANIMATION_VARIANTS } from './general_config';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const resumeLabels = {
  // Page labels
  page: {
    title: L.resume,
    subtitle: L.resume_information,
    description: L.manage_resume_entries,
  },

  // Field labels — one entry per editable Prisma field
  fields: {
    artist: L.artist,
    year: L.year,
    start_date: L.start_date,
    end_date: L.end_date,
    type: L.type,
    description: L.description,
    introduction: L.introduction_preface,
    language: L.language,
    mark: L.mark,
  },

  // UI Text
  UI_TEXT: {
    resumeManagement: L.resume_management,
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
export const getResumeLabel = (key, language = 'en') => {
  if (resumeLabels.fields[key]) {
    return resumeLabels.fields[key][language] || resumeLabels.fields[key]['en'];
  }
  if (resumeLabels.UI_TEXT[key]) {
    return resumeLabels.UI_TEXT[key][language] || resumeLabels.UI_TEXT[key]['en'];
  }
  if (resumeLabels.page[key]) {
    return resumeLabels.page[key][language] || resumeLabels.page[key]['en'];
  }
  return key;
};

// ============================================================
// FIELD GROUPS CONFIGURATION
// ============================================================
export const getFieldGroupsResume = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: isCn ? '基本信息' : 'Basic Information',
      fields: [
        { key: "artist" },
        { key: "type" },
        { key: "year" },
        { key: "start_date" },
        { key: "end_date" },
        { key: "language" },
      ]
    },
    CONTENT: {
      title: isCn ? '内容' : 'Content',
      fields: [
        { key: "description" },
      ]
    },
    META: {
      title: isCn ? '元数据' : 'Metadata',
      fields: [
        { key: "mark" },
      ]
    }
  };

  return getFieldGroupsWithLabels('resume', fieldGroups, isCn);
};

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const resumeConfig = {
  // Schema identifier
  itemUrl: "resume",
  schemaName: "Resume",

  // API Configuration
  api: {
    endpoints: {
      base: '/api/resume',
      create: '/api/resume',
      update: (id) => `/api/resume/${id}`,
      delete: (id) => `/api/resume/${id}`,
      list: '/api/resume',
      detail: (id) => `/api/resume/${id}`,
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
      defaultSortField: 'year',
      defaultSortOrder: -1,
      collectionName: 'Resume',
    },
  },

  // Page Configuration
  page: {
    title: resumeLabels.page.title,
    subtitle: resumeLabels.page.subtitle,
    description: resumeLabels.page.description,
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
    searchableFields: ['artist', 'year', 'start_date', 'end_date', 'type', 'description', 'language', 'mark'],
    sortableFields: ['year', 'artist', 'language'],
    filterableFields: ['type', 'language'],
    mainFields: ['artist', 'type', 'year'],
    expandedFields: ['start_date', 'end_date', 'description'],
    arrayFields: ['introduction'],
    validFields: [
      'id', 'artist', 'year', 'start_date', 'end_date', 'type',
      'description', 'introduction', 'language', 'mark'
    ],
  },

  // Component Configuration
  components: {
    createFormComponent: ResumeForm,
    editFormComponent: ResumeEditForm,
  },

  // Labels Configuration
  labels: resumeLabels,

  // Language Options (if needed)
  languageOptions: [
    { value: 'CN', label_en: 'Chinese', label_cn: '中文' },
    { value: 'EN', label_en: 'English', label_cn: '英文' },
  ],
};

// Export default
export default resumeConfig;

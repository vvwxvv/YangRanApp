import { L } from "@/components/labels/managerLabels";
// enquireConfig.js — matches Prisma Enquire model
import { ANIMATION_VARIANTS } from './general_config';

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const enquireLabels = {
  page: {
    title: L.enquiries,
    subtitle: L.enquiry_management,
    description: L.manage_customer_enquiries_and_requests,
  },

  fields: {
    name: L.name,
    email: L.email,
    message: L.message,
    createdAt: L.created_at,
    status: L.status,
  },

  UI_TEXT: {
    enquireManagement: L.enquiry_management,
    create: L.create_new_enquiry,
    edit: L.edit,
    delete: L.delete,
    save: L.save,
    cancel: L.cancel,
    confirmDelete: L.confirm_delete,
    noData: L.no_enquiries_available,
    statusPending: L.pending,
    statusResponded: L.responded,
    statusClosed: L.closed,
  },
};

export const getEnquireLabel = (key, language = 'en') => {
  const lang = language === 'cn' ? 'cn' : 'en';
  if (enquireLabels.fields[key]) return enquireLabels.fields[key][lang];
  if (enquireLabels.UI_TEXT[key]) return enquireLabels.UI_TEXT[key][lang];
  if (enquireLabels.page[key]) return enquireLabels.page[key][lang];
  return key;
};

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const enquireConfig = {
  itemUrl: "enquire",
  schemaName: "Enquire",

  api: {
    endpoints: {
      base: '/api/enquire',
      create: '/api/enquire',
      update: (id) => `/api/enquire/${id}`,
      delete: (id) => `/api/enquire/${id}`,
      list: '/api/enquire',
      detail: (id) => `/api/enquire/${id}`,
      bulk: '/api/enquire/bulk',
    },
    methods: {
      create: 'POST', update: 'PUT', delete: 'DELETE',
      list: 'GET', detail: 'GET', bulk: 'POST',
    },
    headers: { 'Content-Type': 'application/json' },
    languageParam: 'language',
    defaultLimit: 50,
    config: {
      enableSoftDelete: false,
      enablePagination: true,
      enableSearch: true,
      enableSorting: true,
      defaultPageSize: 50,
      maxPageSize: 1000,
      defaultSortOrder: -1, // -1 for descending (newest first)
      defaultSortField: 'createdAt',
      collectionName: 'Enquire',
    },
  },

  page: {
    title: enquireLabels.page.title,
    subtitle: enquireLabels.page.subtitle,
    description: enquireLabels.page.description,
    animationVariants: ANIMATION_VARIANTS?.container || {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1, y: 0,
        transition: { delayChildren: 0.15, staggerChildren: 0.08 },
      },
    },
  },

  fields: {
    imagesField: [],
    urlField: [],
    arrayFields: [],
    requiredFields: ['name', 'email'],
    searchableFields: ['name', 'email', 'message', 'status'],
    sortableFields: ['createdAt', 'status', 'name'],
    filterableFields: ['status'],
    mainFields: ['name', 'email', 'status', 'createdAt'],
    expandedFields: ['message'],
    dataField: [
      'name', 'email', 'message', 'status'
    ],
    fieldShowOrder: [
      'name', 'email', 'status', 'message', 'createdAt'
    ],
    validFields: [
      '_id', 'id', 'name', 'email', 'message', 'createdAt', 'status'
    ],
  },

  components: {},

  settings: {
    useLanguage: false, // Enquiries typically don't need multi-language toggles for the data itself
    pagination: {
      defaultPageSize: 50,
      pageSizeOptions: [20, 50, 100, 200],
    },
    validation: {
      maxMessageLength: 5000,
    },
    display: {
      showFieldLabels: true,
      showExpandArrow: true,
      showDetailButton: true,
    },
  },

  labels: enquireLabels,
  statusOptions: [
    { value: 'Pending', label_en: 'Pending', label_cn: '待处理' },
    { value: 'Responded', label_en: 'Responded', label_cn: '已回复' },
    { value: 'Closed', label_en: 'Closed', label_cn: '已关闭' },
  ],
};

export default enquireConfig;
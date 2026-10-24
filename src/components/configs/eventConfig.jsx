import { F } from "@/components/labels/managerLabels";
import { ArrowUpDown } from 'lucide-react';
import { 
  eventLabels, 
  getEventLabel, 
  pageLabels,
  displayLabels,
  controlPanelLabels,
  defaultContentLabels,
  fieldGroupLabels,
  fieldLabelsForComponents
} from '@/components/labels/event_labels';
import { eventTypes, languageOptions } from '@/components/forms/utils/formTypeUtils';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';

export const getFieldGroupsEvent = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: fieldGroupLabels.basic.title(isCn),
      fields: [
        { key: "title" },
        { key: "subtitle" },
        { key: "year" },
        { key: "date_time" },
        { key: "type" },
        { key: "caption" },
        { key: "introduction" },
      ]
    },
    ADDITIONAL: {
      title: fieldGroupLabels.additional.title(isCn),
      fields: [
        { key: "venue" },
        { key: "address" },
        { key: "host" },
        { key: "support" },
        { key: "special_thanks" },
        { key: "related_artist" },
        { key: "web_url" },
        { key: "video_url" },
        { key: "mark" },
        { key: "order" },
        { key: "language" },
      ]
    },
    IMAGES: {
      title: fieldGroupLabels.images.title(isCn),
      fields: [
        { key: "cover_img_url" },
      ]
    }
  };
  
  return getFieldGroupsWithLabels('event', fieldGroups, isCn);
};

export const eventConfig = {
  // Schema identifier
  itemUrl: "event",
  schemaName: "Event",

  // API Configuration (matches Prisma model routes)
  api: {
    endpoints: {
      base: '/api/event',
      create: '/api/event',
      update: (id) => `/api/event?id=${id}`,
      delete: (id) => `/api/event?id=${id}`,
      list: '/api/event',
      detail: (id) => `/api/event?id=${id}`,
      upload: '/api/upload',
      bulk: '/api/event/bulk',
      reorder: '/api/event/reorder',
    },
    methods: {
      create: 'POST',
      update: 'PUT',
      delete: 'DELETE',
      list: 'GET',
      detail: 'GET',
      upload: 'POST',
      bulk: 'POST',
      reorder: 'PUT',
    },
    headers: {
      'Content-Type': 'application/json',
    },
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
      defaultSortOrder: -1,
      defaultSortField: 'order',
      collectionName: 'Event'
    }
  },

  // Page Configuration
  page: {
    ...pageLabels,
    animationVariants: {
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

  // Field Configuration (aligned with Prisma Event model)
  fields: {
    imagesField: ["cover_img_url"],
    requiredFields: [],
    searchableFields: [
      "title", "subtitle", "caption", "introduction",
      "venue", "address", "type", "host", "support", 
      "special_thanks", "related_artist", "web_url", "video_url"
    ],
    sortableFields: ["title", "year", "date_time", "type", "venue", "order", "updatedAt"],
    dataField: [
      "cover_img_url", "title", "subtitle", "year", "date_time",
      "type", "host", "support", "special_thanks", "venue", "address",
      "caption", "introduction", "related_artist", "web_url", "video_url",
      "mark", "order", "language", "updatedAt"
    ],
    fieldShowOrder: [
      "cover_img_url", "title", "subtitle", "year", "date_time",
      "type", "host", "support", "special_thanks", "venue", "address",
      "caption", "introduction", "related_artist", "web_url", "video_url",
      "mark", "order", "language"
    ],
    urlField: ["cover_img_url", "web_url", "video_url"],
    arrayFields: ["introduction", "related_artist"],
    validFields: [
      '_id', 'id', 'cover_img_url', 'title', 'subtitle',
      'year', 'date_time', 'type', 'host', 'support',
      'special_thanks', 'venue', 'address', 'caption', 'introduction',
      'related_artist', 'web_url', 'video_url', 'mark', 'order', 
      'language', 'updatedAt'
    ],
    filterableFields: ["type", "year", "venue", "language", "host", "mark"],
    mainFields: ["type", "year", "venue"],
    expandedFields: ["caption", "introduction", "address", "host", "support", "special_thanks", "related_artist"],
  },

  // Component Configuration
  components: {
    createFormPath: '@/components/forms/EventForm',
    editFormPath: '@/components/forms/EventEditForm',
  },

  // Settings Configuration
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
      uploadPath: '/uploads/events/',
    },
    validation: {
      maxDescriptionLength: 1000,
      maxIntroductionLength: 1000,
      maxCreditLength: 500,
      numberRange: { min: 1900, max: 2100 },
      urlPattern: /^https?:\/\/.+/,
    },
    display: {
      cardImageAspectRatio: 'aspect-square',
      defaultImagePlaceholder: '/placeholder.png',
      showFieldLabels: true,
      showExpandArrow: true,
      showDetailButton: true,
    },
  },

  labels: eventLabels,
  typeOptions: eventTypes,
  languageOptions: languageOptions,
  getFieldGroups: getFieldGroupsEvent,

  fieldMappings: {
    id: '_id',
    cover_img_url: 'cover_img_url',
    title: 'title',
    subtitle: 'subtitle',
    year: 'year',
    date_time: 'date_time',
    type: 'type',
    host: 'host',
    support: 'support',
    special_thanks: 'special_thanks',
    venue: 'venue',
    address: 'address',
    caption: 'caption',
    introduction: 'introduction',
    related_artist: 'related_artist',
    web_url: 'web_url',
    video_url: 'video_url',
    mark: 'mark',
    order: 'order',
    language: 'language',
    updatedAt: 'updatedAt'
  },

  fieldLabels: fieldLabelsForComponents,

  display: {
    ...displayLabels,
    columnSpacing: 20,
    imageClassName: 'aspect-square',
    minImageHeight: 180,
    imagePlaceholderColor: '#f4f4f4',
    imageErrorColor: '#f0f0f0',
    showExpandArrow: true,
    showDetailButton: true,
    showFieldLabels: false,
  },

  sortOptions: {
    title: {
      label_en: F.sort_by_title.en,
      label_cn: F.sort_by_title.cn,
      compareFn: (a, b) => (a.title || '').localeCompare(b.title || ''),
      defaultOrder: 'asc'
    },
    year: {
      label_en: F.sort_by_year.en,
      label_cn: F.sort_by_year.cn,
      compareFn: (a, b) => {
        const yearA = parseInt(a.year || '0') || 0;
        const yearB = parseInt(b.year || '0') || 0;
        return yearA - yearB;
      },
      defaultOrder: 'desc'
    },
    date_time: {
      label_en: "Sort by Date & Time",
      label_cn: "按日期时间排序",
      compareFn: (a, b) => {
        const dateA = new Date(a.date_time || 0);
        const dateB = new Date(b.date_time || 0);
        return dateA - dateB;
      },
      defaultOrder: 'desc'
    },
    venue: {
      label_en: F.sort_by_venue.en,
      label_cn: F.sort_by_venue.cn,
      compareFn: (a, b) => (a.venue || '').localeCompare(b.venue || ''),
      defaultOrder: 'asc'
    },
    order: {
      label_en: F.sort_by_order.en,
      label_cn: F.sort_by_order.cn,
      compareFn: (a, b) => {
        const orderA = parseInt(a.order) || 0;
        const orderB = parseInt(b.order) || 0;
        return orderA - orderB;
      },
      defaultOrder: 'asc'
    },
    updatedAt: {
      label_en: "Sort by Last Updated",
      label_cn: "按最后更新排序",
      compareFn: (a, b) => {
        const dateA = new Date(a.updatedAt || 0);
        const dateB = new Date(b.updatedAt || 0);
        return dateA - dateB;
      },
      defaultOrder: 'desc'
    }
  },
};

// Configuration validation helper
export const validateEventConfig = () => {
  const requiredFields = ['itemUrl', 'api', 'fields', 'components', 'labels'];
  const missing = requiredFields.filter(field => !eventConfig[field]);
  if (missing.length > 0) {
    console.log(`Missing required configuration fields: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// Get type option helper
export const getEventTypeOption = (value, language = 'en') => {
  if (!value) return '';
  const option = eventConfig.typeOptions.find(opt => 
    (language === 'cn' ? opt.label_cn : opt.label_en) === value
  );
  if (!option) return value;
  return language === 'cn' ? option.label_cn : option.label_en;
};

// Get language option helper
export const getEventLanguageOption = (value, language = 'en') => {
  if (!value) return '';
  const option = eventConfig.languageOptions.find(opt => opt.value === value);
  if (!option) return value;
  return language === 'cn' ? option.label_cn : option.label_en;
};

// API helpers
export const eventAPI = {
  create: async (data) => {
    const response = await fetch(eventConfig.api.endpoints.create, {
      method: eventConfig.api.methods.create,
      headers: eventConfig.api.headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  update: async (id, data) => {
    const response = await fetch(eventConfig.api.endpoints.update(id), {
      method: eventConfig.api.methods.update,
      headers: eventConfig.api.headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(eventConfig.api.endpoints.delete(id), {
      method: eventConfig.api.methods.delete,
      headers: eventConfig.api.headers,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  list: async (params = {}) => {
    try {
      const queryParams = { limit: eventConfig.api.defaultLimit, ...params };
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined || queryParams[key] === null) delete queryParams[key];
      });
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString ? `${eventConfig.api.endpoints.list}?${queryString}` : eventConfig.api.endpoints.list;
      const response = await fetch(url, { headers: eventConfig.api.headers });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      if (data.data) return data.data;
      if (Array.isArray(data)) return data;
      if (data.events) return data.events;
      return data;
    } catch (error) {
      console.log('Error fetching event list:', error);
      return [];
    }
  },
  detail: async (id) => {
    const response = await fetch(eventConfig.api.endpoints.detail(id), {
      headers: eventConfig.api.headers,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', eventConfig.settings.upload.uploadPath);
    const response = await fetch(eventConfig.api.endpoints.upload, {
      method: eventConfig.api.methods.upload,
      body: formData,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  bulk: async (operation, ids, data = {}) => {
    const response = await fetch(eventConfig.api.endpoints.bulk, {
      method: eventConfig.api.methods.bulk,
      headers: eventConfig.api.headers,
      body: JSON.stringify({ operation, ids, data }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  reorder: async (reorderData) => {
    const response = await fetch(eventConfig.api.endpoints.reorder, {
      method: eventConfig.api.methods.reorder,
      headers: eventConfig.api.headers,
      body: JSON.stringify(reorderData),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
};

// Enhanced field details
export const eventDetailFields = eventConfig.fields.dataField.map(key => ({
  key,
  label: (isCn) => getEventLabel(key, isCn ? 'cn' : 'en'),
  type: eventConfig.fields.urlField.includes(key) ? 'url' : 
        eventConfig.fields.imagesField.includes(key) ? 'image' :
        eventConfig.fields.arrayFields.includes(key) ? 'array' : 'text'
}));

// Utility functions for event handling
export const getDefaultContent = (isCn) => ({
  title: getEventLabel('event', isCn ? 'cn' : 'en'),
  description: eventConfig.display.emptyMessage(isCn),
  listTitle: defaultContentLabels.listTitle(isCn),
  detailsLabel: defaultContentLabels.detailsLabel(isCn),
  viewDetails: eventConfig.display.detailButtonText(isCn),
  type: getEventLabel('type', isCn ? 'cn' : 'en'),
  year: getEventLabel('year', isCn ? 'cn' : 'en'),
  date_time: getEventLabel('date_time', isCn ? 'cn' : 'en'),
  host: getEventLabel('host', isCn ? 'cn' : 'en'),
  venue: getEventLabel('venue', isCn ? 'cn' : 'en'),
  address: getEventLabel('address', isCn ? 'cn' : 'en'),
  caption: getEventLabel('caption', isCn ? 'cn' : 'en'),
  untitled: defaultContentLabels.untitled(isCn),
  noDescription: defaultContentLabels.noDescription(isCn),
  noEvents: eventConfig.display.noMatchMessage(isCn),
  back: defaultContentLabels.back(isCn)
});

export const getMatchedImageUrl = (event, events) => {
  try {
    if (!events || !Array.isArray(events)) return null;
    const matched = events.find(ev => ev.title === event.title);
    return matched ? matched.cover_img_url : null;
  } catch (error) {
    console.log('Error matching image URL:', error);
    return null;
  }
};

export const getMatchedVideoUrl = (event, videos) => {
  // Legacy function - not used in event context
  return null;
};

// Filter and sort events according to Prisma model
export const filterAndSortEvents = (events, isCn, search) => {
  if (!events || !Array.isArray(events)) return [];
  
  return events
    .filter(event => {
      if (!event) return false;
      // Language filtering
      if (eventConfig.settings.useLanguage) {
        const eventLanguage = (event.language || '').toUpperCase();
        const matchesLang = isCn ? eventLanguage === 'CN' : eventLanguage === 'EN';
        if (!matchesLang) return false;
      }
      // Search filtering
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = eventConfig.fields.searchableFields.some(field => {
          const value = event[field];
          if (Array.isArray(value)) {
            return value.some(v => (v || '').toLowerCase().includes(searchLower));
          }
          return (value || '').toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      if (yearA !== yearB) return yearB - yearA;
      // Secondary sort by date_time if available, otherwise by title
      if (a.date_time && b.date_time) {
        const dateA = new Date(a.date_time);
        const dateB = new Date(b.date_time);
        if (!isNaN(dateA) && !isNaN(dateB) && dateA.getTime() !== dateB.getTime()) {
          return dateB - dateA; // descending
        }
      }
      return (a.title || '').localeCompare(b.title || '');
    });
};

// Sort helpers
const sortAlphabetically = (a, b) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
};

const sortYearsDescending = (a, b) => {
  const yearA = parseInt(a) || 0;
  const yearB = parseInt(b) || 0;
  return yearB - yearA;
};

const transformVenue = (item, isCn) => {
  return item.venue || '';
};

export const eventControlPanelConfig = {
  filters: [
    {
      field: 'type',
      label: controlPanelLabels.type,
      sortFunction: sortAlphabetically,
    },
    {
      field: 'year',
      label: controlPanelLabels.year,
      sortFunction: sortYearsDescending,
    },
    {
      field: 'venue',
      label: controlPanelLabels.venue,
      transformFunction: transformVenue,
      sortFunction: sortAlphabetically,
    },
    {
      field: 'host',
      label: controlPanelLabels.host || ((isCn) => isCn ? '主办方' : 'Host'),
      sortFunction: sortAlphabetically,
    },
  ],
  controls: [
    {
      type: 'button',
      label: controlPanelLabels.sortByTitle,
      action: 'sortByTitle',
      tooltip: controlPanelLabels.sortByTitleTooltip,
      icon: <ArrowUpDown size={20} />,
    },
  ],
};

// Attach getLabel to eventConfig
eventConfig.getLabel = getEventLabel;

export default eventConfig;
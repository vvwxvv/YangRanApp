import ParagraphForm from "@/components/forms/ParagraphForm";
import { 
  paragraphLabels, 
  getParagraphLabel, 
  pageLabels,
  displayLabels,
  controlPanelLabels,
  fieldGroupLabels,
  fieldLabelsForComponents,
} from '@/components/labels/paragraph_labels';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';

// Define the field groups function using JSON data
export const getFieldGroupsParagraph = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: fieldGroupLabels.basic.title(isCn),
      fields: [
        { key: "pargraph" },
        { key: "tag_en" },
        { key: "tag_cn" },
        { key: "mark" },
      ]
    },
  };
  
  return getFieldGroupsWithLabels('paragraph', fieldGroups, isCn);
};

export const paragraphConfig = {
  itemUrl: "paragraph",
  
  // API Configuration
  api: {
    endpoints: {
      base: '/api/pargraph',
      create: '/api/pargraph',
      update: (id) => `/api/pargraph/${id}`,
      delete: (id) => `/api/pargraph/${id}`,
      list: '/api/pargraph',
      detail: (id) => `/api/pargraph/${id}`,
      bulk: '/api/pargraph/bulk_edit',
    },
    methods: {
      create: 'POST',
      update: 'PUT',
      delete: 'DELETE',
      list: 'GET',
      detail: 'GET',
      bulk: 'POST',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    // API route configuration constants
    config: {
      enableSoftDelete: false,
      enablePagination: false,
      enableSearch: true,
      enableSorting: true,
      defaultPageSize: 10000,
      maxPageSize: 10000,
      defaultSortOrder: -1,
      defaultSortField: 'updatedAt',
      collectionName: 'Pargraph'
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

  // Field Configuration
  fields: {
    requiredFields: [],
    searchableFields: ['tag_en', 'tag_cn', 'mark'],
    sortableFields: ['tag_en', 'tag_cn', 'mark', 'updatedAt'],
    dataField: [
      'id',
      'pargraph', 
      'tag_en', 
      'tag_cn', 
      'mark'
    ],
    fieldShowOrder: [
      'pargraph',
      'tag_en',
      'tag_cn', 
      'mark'
    ],
    // Valid fields for API operations
    validFields: [
      '_id',
      'pargraph', 'tag_en', 'tag_cn', 'mark', 'updatedAt'
    ],
    arrayFields: ['pargraph']
  },

  // Filter Configuration
  filters: {
    // Function to generate filter configurations
    getFilterConfigs: function(getLabel) {
      return [
        {
          type: 'select',
          field: 'tagFilter',
          dataSource: 'tag_en',
          label: getLabel('tag'),
          style: { minWidth: 120 }
        },
        {
          type: 'search',
          field: 'searchTerm',
          searchFields: ['tag_en', 'tag_cn', 'mark'],
          label: getLabel('search'),
          placeholder: getLabel('search_placeholder'),
          style: { minWidth: 200 }
        }
      ];
    },
    
    // Default filter values
    defaultValues: {
      tagFilter: '',
      searchTerm: ''
    },

    // Filter validation rules
    validation: {
      searchTerm: {
        minLength: 0,
        maxLength: 100
      }
    }
  },

  // Component Configuration
  components: {
    createFormComponent: ParagraphForm,
    editFormComponent: ParagraphForm, // Using same form for create and edit
  },

  // Settings Configuration
  settings: {
    filterAttribute: null,
    useLanguage: true,
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
    },
    validation: {
      maxParagraphLength: 5000,
      maxMarkLength: 100,
    },
  },

  // Labels Configuration - Imported from paragraph_labels.js
  labels: paragraphLabels,

  // Helper function to get labels - now uses system labels as fallback
  getLabel: function(key, language = 'en') {
    return getParagraphLabel(key, language);
  },

  // Helper function to get filter configurations
  getFilterConfigs: function(getLabel) {
    return this.filters.getFilterConfigs(getLabel);
  },

  // Add the getFieldGroups method to the config object
  getFieldGroups: getFieldGroupsParagraph,

  // Card Grid Related Properties
  mainFields: ['tag_en', 'tag_cn'],
  expandedFields: ['pargraph', 'mark'],
  fieldMappings: {
    pargraph: 'pargraph',
    tag_en: 'tag_en',
    tag_cn: 'tag_cn',
    mark: 'mark'
  },
  fieldLabels: fieldLabelsForComponents,
  ...displayLabels,
  columnSpacing: 20,
  showExpandArrow: true,
  showDetailButton: true,
  showFieldLabels: false,
};

// API helpers for paragraph
export const paragraphAPI = {
  // Create paragraph
  create: async (data) => {
    const now = new Date();
    const timestamps = {
      updatedAt: now.toISOString(),
    };
    const document = { ...data, ...timestamps };
    const response = await fetch(paragraphConfig.api.endpoints.create, {
      method: paragraphConfig.api.methods.create,
      headers: paragraphConfig.api.headers,
      body: JSON.stringify(document),
    });
    return response.json();
  },

  // Update paragraph
  update: async (id, data) => {
    const now = new Date();
    const updateData = { ...data, updatedAt: now.toISOString() };
    const response = await fetch(paragraphConfig.api.endpoints.update(id), {
      method: paragraphConfig.api.methods.update,
      headers: paragraphConfig.api.headers,
      body: JSON.stringify(updateData),
    });
    return response.json();
  },

  // Delete paragraph
  delete: async (id) => {
    const response = await fetch(paragraphConfig.api.endpoints.delete(id), {
      method: paragraphConfig.api.methods.delete,
      headers: paragraphConfig.api.headers,
    });
    return response.json();
  },

  // Get paragraph list
  list: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${paragraphConfig.api.endpoints.list}?${queryString}`
      : paragraphConfig.api.endpoints.list;
    
    const response = await fetch(url, {
      method: paragraphConfig.api.methods.list,
      headers: paragraphConfig.api.headers,
    });
    return response.json();
  },

  // Get paragraph detail
  detail: async (id) => {
    const response = await fetch(paragraphConfig.api.endpoints.detail(id), {
      method: paragraphConfig.api.methods.detail, 
      headers: paragraphConfig.api.headers,
    });
    return response.json();
  },

  // Bulk operations
  bulk: async (operation, ids) => {
    const response = await fetch(paragraphConfig.api.endpoints.bulk, {
      method: paragraphConfig.api.methods.bulk,
      headers: paragraphConfig.api.headers,
      body: JSON.stringify({ operation, ids }),
    });
    return response.json();
  },
};

// Configuration validation helper
export const validateParagraphConfig = () => {
  const requiredFields = ['itemUrl', 'api', 'fields', 'components', 'labels', 'filters'];
  const missing = requiredFields.filter(field => !paragraphConfig[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required configuration fields: ${missing.join(', ')}`);
  }
  
  return true;
};

// Common sort functions
const sortAlphabetically = (a, b) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
};

// Transform functions for special cases
const transformArtworkTitle = (item, isCn) => {
  return item.title || `Artwork ${item._id || item.id}`;
};

const transformEventTitle = (item, isCn) => {
  return item.title || `Event ${item._id || item.id}`;
};

export const paragraphControlPanelConfig = {
  searchConfig: {
    placeholder: '搜索段落...',
  },
  filters: [
    {
      field: 'artworkId',
      label: controlPanelLabels.artwork,
      transformFunction: transformArtworkTitle,
      sortFunction: sortAlphabetically,
    },
    {
      field: 'eventId',
      label: controlPanelLabels.event,
      transformFunction: transformEventTitle,
      sortFunction: sortAlphabetically,
    },
  ],
  controls: [],
};

// Helper function to prepare related data for paragraph management
export const prepareParagraphRelatedData = (artworks = [], events = [], isCn) => {
  const filteredArtworks = artworks.filter(artwork => 
    artwork.language === (isCn ? 'CN':'EN') || !artwork.language
  );
  
  const filteredEvents = events.filter(event => 
    event.language === (isCn ? 'CN':'EN') || !event.language
  );
  
  return {
    artworks: filteredArtworks,
    events: filteredEvents,
  };
};

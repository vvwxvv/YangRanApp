import { F } from "@/components/labels/managerLabels";
import WebEditForm from "@/components/forms/WebEditForm";
import { getMarkValue, hasMarkValue } from "@/utils/mediaMarks";
import WebForm from "@/components/forms/WebForm";
import { 
  webLabels, 
  getWebLabel, 
  pageLabels,
  displayLabels,
  controlPanelLabels,
  defaultContentLabels,
  fieldGroupLabels,
} from '@/components/labels/web_labels';
import { ArrowUpDown } from 'lucide-react';
import { 
  getFormTypes,
  getFormTypeByValue 
} from '@/components/forms/utils/formOptionsUtils';
import { 
  ANIMATION_VARIANTS, 
  sortAlphabetically, 
} from './general_config';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';

// Field groupings
export const getFieldGroupsWeb = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: fieldGroupLabels.basic.title(isCn),
      fields: [
        { key: "web_url" },
        { key: "tag_en" },
        { key: "tag_cn" },
        { key: "type" },
        { key: "order" },
      ]
    },
    ADDITIONAL: {
      title: fieldGroupLabels.additional.title(isCn),
      fields: [
        { key: "caption_en" },
        { key: "caption_cn" },
        { key: "mark" },
        { key: "tag_source" },
      ]
    }
  };
  
  return getFieldGroupsWithLabels('web', fieldGroups, isCn);
};

// Web-specific constants
export const FALLBACK_WEB_THUMBNAIL = "/web-placeholder.png";

// Icon components for controls
const WebIcon = () => (
  <svg 
    width="20" 
    height="20" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
    />
  </svg>
);

export const webConfig = {
  // Schema identifier
  itemUrl: "web",
  schemaName: "Web",

  // API Configuration
  api: {
    endpoints: {
      base: '/api/web',
      create: '/api/web',
      update: (id) => `/api/web/${id}`,
      delete: (id) => `/api/web/${id}`,
      list: '/api/web',
      detail: (id) => `/api/web/${id}`,
      upload: '/api/upload',
      bulk: '/api/web/bulk',
      reorder: '/api/web/reorder',
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
    // Language parameter for API calls
    languageParam: 'language',
    // Data limit for list requests
    defaultLimit: 10000,
    // API route configuration constants
    config: {
      enableSoftDelete: false,
      enablePagination: false,
      enableSearch: true,
      enableSorting: true,
      defaultPageSize: 10000,
      maxPageSize: 10000,
      defaultSortOrder: -1,
      defaultSortField: 'order',
      collectionName: 'Web'
    }
  },

  // Page Configuration
  page: {
    ...pageLabels,
    animationVariants: ANIMATION_VARIANTS.container,
  },

  // Field Configuration
  fields: {
    // Fields that can be searched through
    searchableFields: ['tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn', 'mark', 'tag_source'],
    
    // Fields that can be sorted
    sortableFields: ['order', 'type', 'tag_en', 'tag_cn', 'updatedAt', 'mark'],
    
    // Fields for filtering
    filterableFields: ["type", "tag_en", "tag_cn", "mark"],
    
    // Main fields for card display
    mainFields: ["type", "mark", "order"],
    
    // Extended fields for detailed view
    expandedFields: ["caption_en", "caption_cn", "tag_source"],
    
    // Image fields for upload and display
    imagesField: [],
    
    // URL fields for link rendering
    urlField: ["web_url"],
    
    // Required fields for validation (all fields are optional per Prisma schema)
    requiredFields: [],
    
    // All data fields available (matching Prisma schema)
    dataField: [
      'id', '_id',
      'web_url', 'tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn', 
      'mark', 'tag_source', 'order', 'updatedAt'
    ],
    
    // Display order for fields
    fieldShowOrder: [
      'web_url', 'tag_en', 'tag_cn', 'type', 'order', 
      'caption_en', 'caption_cn', 'mark', 'tag_source', 'updatedAt'
    ],
    
    // Array fields for special handling
    arrayFields: [],
    
    // Valid fields for API operations
    validFields: [
      '_id', 'id',
      'web_url', 'tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn', 
      'mark', 'tag_source', 'order', 'updatedAt'
    ],
  },

  // Component Configuration
  components: {
    createFormComponent: WebForm,
    editFormComponent: WebEditForm,
  },

  // Settings Configuration
  settings: {
    // Language filtering (webs don't have language field but use tag_en/tag_cn)
    useLanguage: false,
    languageField: null,
    
    // Pagination settings
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
    },
    
    // Upload settings
    upload: {
      maxFileSize: 10 * 1024 * 1024, // 10MB for web assets
      acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      uploadPath: '/uploads/webs/',
    },
    
    // Validation settings
    validation: {
      maxCaptionLength: 500,
      maxMarkLength: 100,
      orderRange: { min: 1, max: 999 },
      urlPattern: /^https?:\/\/.+/,
    },
    
    // Display settings
    display: {
      cardImageAspectRatio: 'aspect-square',
      defaultImagePlaceholder: FALLBACK_WEB_THUMBNAIL,
      showFieldLabels: true,
      showExpandArrow: true,
      showDetailButton: true,
    },
  },

  // Labels Configuration - Imported from web_labels.js
  labels: webLabels,


  // Display Configuration
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

  // Sort Configuration
  sortOptions: {
    tag: {
      label_en: F.sort_by_tag.en,
      label_cn: F.sort_by_tag.cn,
      compareFn: (a, b) => {
        const tagA = a.tag || a.tag_en || '';
        const tagB = b.tag || b.tag_en || '';
        return tagA.localeCompare(tagB);
      },
      defaultOrder: 'asc'
    },
    type: {
      label_en: F.sort_by_type.en,
      label_cn: F.sort_by_type.cn,
      compareFn: (a, b) => (a.type || '').localeCompare(b.type || ''),
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
    mark: {
      label_en: F.sort_by_mark.en,
      label_cn: F.sort_by_mark.cn,
      compareFn: (a, b) => getMarkValue(a).localeCompare(getMarkValue(b)),
      defaultOrder: 'asc'
    },
    updatedAt: {
      label_en: F.sort_by_updated_date.en,
      label_cn: F.sort_by_updated_date.cn,
      compareFn: (a, b) => {
        const dateA = new Date(a.updatedAt || 0);
        const dateB = new Date(b.updatedAt || 0);
        return dateA - dateB;
      },
      defaultOrder: 'desc'
    }
  },

  // Filter Configuration (enhanced from original)
  filters: {
    // Function to generate filter configurations
    getFilterConfigs: function(getLabel) {
      return [
        {
          type: 'select',
          field: 'typeFilter',
          dataSource: 'type',
          label: getLabel('type'),
          style: { minWidth: 120 }
        },
        {
          type: 'select',
          field: 'tagFilter',
          dataSource: 'tag',
          label: getLabel('tag'),
          style: { minWidth: 120 }
        },
        {
          type: 'select',
          field: 'markFilter',
          dataSource: 'mark',
          label: getLabel('mark'),
          style: { minWidth: 120 }
        },
        {
          type: 'search',
          field: 'searchTerm',
          searchFields: ['tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn', 'mark', 'tag_source'],
          label: getLabel('search'),
          placeholder: getLabel('search_placeholder'),
          style: { minWidth: 200 }
        }
      ];
    },
    
    // Default filter values
    defaultValues: {
      typeFilter: '',
      tagFilter: '',
      markFilter: '',
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

  // Helper function to get labels
  getLabel: function(key, language = 'en') {
    return getWebLabel(key, language);
  },

  // Helper function to get filter configurations
  getFilterConfigs: function(getLabel) {
    return this.filters.getFilterConfigs(getLabel);
  },

  // Attach to config for unified access
  getFieldGroups: getFieldGroupsWeb,
};

// Configuration validation helper
export const validateWebConfig = () => {
  const requiredFields = ['itemUrl', 'api', 'fields', 'components', 'labels'];
  const missing = requiredFields.filter(field => !webConfig[field]);
  
  if (missing.length > 0) {
    console.log(`Missing required configuration fields: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};

// Get type option helper - use either the imported one or the new implementation
export const getWebTypeOption = (value, language = 'en') => {
  // Try using the imported function first
  if (typeof importedGetWebTypeOption === 'function') {
    return importedGetWebTypeOption(value, language);
  }
  // Fallback to the new implementation
  return getFormTypeByValue('web', value, language);
};

// Enhanced API helpers for web
export const webAPI = {
  // Create web
  create: async (data) => {
    try {
      const response = await fetch(webConfig.api.endpoints.create, {
        method: webConfig.api.methods.create,
        headers: webConfig.api.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error creating web:', error);
      throw error;
    }
  },

  // Update web
  update: async (id, data) => {
    try {
      const response = await fetch(webConfig.api.endpoints.update(id), {
        method: webConfig.api.methods.update,
        headers: webConfig.api.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error updating web:', error);
      throw error;
    }
  },

  // Delete web
  delete: async (id) => {
    try {
      const response = await fetch(webConfig.api.endpoints.delete(id), {
        method: webConfig.api.methods.delete,
        headers: webConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error deleting web:', error);
      throw error;
    }
  },

  // Get web list with enhanced parameters
  list: async (params = {}) => {
    try {
      const queryParams = {
        limit: webConfig.api.defaultLimit,
        ...params
      };
      
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString 
        ? `${webConfig.api.endpoints.list}?${queryString}`
        : webConfig.api.endpoints.list;
        
      const response = await fetch(url, {
        method: webConfig.api.methods.list,
        headers: webConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error fetching web list:', error);
      throw error;
    }
  },

  // Get web detail
  detail: async (id) => {
    try {
      const response = await fetch(webConfig.api.endpoints.detail(id), {
        method: webConfig.api.methods.detail, 
        headers: webConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error fetching web detail:', error);
      throw error;
    }
  },

  // Upload web file
  upload: async (file, progressCallback) => {
    try {
      // Validate file
      if (!webConfig.settings.upload.acceptedFormats.includes(file.type)) {
        throw new Error('File type not supported');
      }
      
      if (file.size > webConfig.settings.upload.maxFileSize) {
        throw new Error('File size exceeds limit');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', webConfig.settings.upload.uploadPath);
      
      const response = await fetch(webConfig.api.endpoints.upload, {
        method: webConfig.api.methods.upload,
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error uploading file:', error);
      throw error;
    }
  },

  // Bulk operations
  bulk: async (operation, ids, data = {}) => {
    try {
      const response = await fetch(webConfig.api.endpoints.bulk, {
        method: webConfig.api.methods.bulk,
        headers: webConfig.api.headers,
        body: JSON.stringify({ operation, ids, data }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error performing bulk operation:', error);
      throw error;
    }
  },

  // Reorder webs
  reorder: async (reorderData) => {
    try {
      const response = await fetch(webConfig.api.endpoints.reorder, {
        method: webConfig.api.methods.reorder,
        headers: webConfig.api.headers,
        body: JSON.stringify(reorderData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error reordering webs:', error);
      throw error;
    }
  },
};

// Enhanced field details for consistent usage across components
export const webDetailFields = webConfig.fields.dataField.map(key => ({
  key,
  label: (isCn) => getWebLabel(key, isCn ? 'cn' : 'en'),
  type: webConfig.fields.urlField.includes(key) ? 'url' : 
        webConfig.fields.imagesField.includes(key) ? 'image' :
        webConfig.fields.arrayFields.includes(key) ? 'array' : 'text'
}));

// Utility functions for web handling
export const getDefaultContent = (isCn) => ({
  title: getWebLabel('web', isCn ? 'cn' : 'en'),
  description: webConfig.display.emptyMessage(isCn),
  listTitle: defaultContentLabels.listTitle(isCn),
  detailsLabel: defaultContentLabels.detailsLabel(isCn),
  viewDetails: webConfig.display.detailButtonText(isCn),
  tag: getWebLabel('tag', isCn ? 'cn' : 'en'),
  type: getWebLabel('type', isCn ? 'cn' : 'en'),
  order: getWebLabel('order', isCn ? 'cn' : 'en'),
  tag_en: getWebLabel('tag_en', isCn ? 'cn' : 'en'),
  tag_cn: getWebLabel('tag_cn', isCn ? 'cn' : 'en'),
  tag_source: getWebLabel('tag_source', isCn ? 'cn' : 'en'),
  caption_en: getWebLabel('caption_en', isCn ? 'cn' : 'en'),
  caption_cn: getWebLabel('caption_cn', isCn ? 'cn' : 'en'),
  mark: getWebLabel('mark', isCn ? 'cn' : 'en'),
  untitled: defaultContentLabels.untitled(isCn),
  noDescription: defaultContentLabels.noDescription(isCn),
  noWebs: webConfig.display.noMatchMessage(isCn),
  back: defaultContentLabels.back(isCn)
});

// Helper to match a web's URL by a subject's title or provided title
export const getMatchedWebUrl = (subjectOrTitle, webs) => {
  try {
    if (!webs || !Array.isArray(webs)) return null;
    const title = typeof subjectOrTitle === 'string' 
      ? (subjectOrTitle || '') 
      : (subjectOrTitle?.title || '');
    const matched = webs.find(w => w?.title === title || w?.tag_en === title || w?.tag_cn === title);
    return matched ? matched.web_url : null;
  } catch (error) {
    return null;
  }
};

export const filterAndSortWebs = (webs, isCn, search, typeFilter, tagFilter) => {
  if (!webs || !Array.isArray(webs)) return [];
  
  return webs
    .filter(web => {
      if (!web) return false;
      
      // Type filtering
      if (typeFilter && web.type !== typeFilter) return false;
      
      // Tag filtering
      if (tagFilter) {
        const tagMatches = (web.tag_en && web.tag_en.includes(tagFilter)) ||
                          (web.tag_cn && web.tag_cn.includes(tagFilter));
        if (!tagMatches) return false;
      }
      
      // Search filtering
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = webConfig.fields.searchableFields.some(field => 
          (web[field] || '').toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Default sort by order (ascending) then by type
      const orderA = parseInt(a.order) || 0;
      const orderB = parseInt(b.order) || 0;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      return (a.type || '').localeCompare(b.type || '');
    });
};

export const webControlPanelConfig = {
  filters: [
    {
      field: 'tag',
      label: controlPanelLabels.tag,
      sortFunction: sortAlphabetically,
    },
    {
      field: 'type',
      label: controlPanelLabels.type,
      sortFunction: sortAlphabetically,
    },
  ],
  controls: [
    {
      type: 'toggle',
      label: controlPanelLabels.toggleWebOnly,
      action: 'toggleWebOnly',
      tooltip: controlPanelLabels.toggleWebOnlyTooltip,
      activeColor: 'blue',
      inactiveColor: 'var(--text-primary, #000000)',
      icon: <WebIcon />,
    },
    {
      type: 'button',
      label: controlPanelLabels.sortByTag,
      action: 'sortByTag',
      tooltip: controlPanelLabels.sortByTagTooltip,
      icon: <ArrowUpDown size={20} />,
    },
  ],
};



// Export default webConfig
export default webConfig;
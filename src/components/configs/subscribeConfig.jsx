import { 
  subscribeLabels, 
  getSubscribeLabel, 
  getSubscribeFieldGroupLabel,
  getStaticFilterOptions,
  pageLabels,
  displayLabels,
  defaultContentLabels,
  fieldGroupLabels,
  fieldLabelsForComponents,
  statusOptions
} from '@/components/labels/subscribe_labels';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';

// Field groupings
export function getFieldGroupsSubscribe(isCn = false) {
  const fieldGroups = {
    BASIC: {
      title: fieldGroupLabels.basic.title(isCn),
      fields: [
        { key: "name" },
        { key: "email" },
        { key: "isActive" },
        { key: "createdAt" },
      ]
    }
  };
  
  return getFieldGroupsWithLabels('subscribe', fieldGroups, isCn);
}

export const subscribeConfig = {
  // Schema identifier
  itemUrl: "subscribe",
  schemaName: "Subscribe",

  // API Configuration
  api: {
    endpoints: {
      base: '/api/subscribe',
      create: '/api/subscribe',
      update: (id) => `/api/subscribe/${id}`,
      delete: (id) => `/api/subscribe/${id}`,
      list: '/api/subscribe',
      detail: (id) => `/api/subscribe/${id}`,
      bulk: '/api/subscribe/bulk',
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
    // Data limit for list requests
    defaultLimit: 10000,
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
    // Required fields for validation
    requiredFields: [],
    
    // Fields that can be searched through
    searchableFields: ["name", "email"],
    
    // Fields that can be sorted
    sortableFields: ["createdAt", "name", "email", "isActive"],
    
    // All data fields available
    dataField: ["id", "name", "email", "isActive", "createdAt"],
    
    // Display order for fields
    fieldShowOrder: ["id", "name", "email", "isActive", "createdAt"],
    
    // Array fields for special handling
    arrayFields: [],
    
    // Valid fields for API operations
    validFields: [
      '_id',
      'name', 'email', 'isActive', 'createdAt'
    ],
    
    // Fields for filtering
    filterableFields: ["isActive"],
    
    // Main fields for card display
    mainFields: ['email', 'isActive'],
    
    // Extended fields for detailed view
    expandedFields: ['createdAt'],
  },

  // Settings Configuration
  settings: {
    // Language filtering
    useLanguage: false,
    
    // Pagination settings
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
    },
    
    // Validation settings
    validation: {
      maxNameLength: 100,
      maxEmailLength: 255,
    },
    
    // Display settings
    display: {
      showFieldLabels: true,
      showExpandArrow: true,
      showDetailButton: true,
    },
  },

  // Labels Configuration - Imported from subscribe_labels.js
  labels: subscribeLabels,

  // Enhanced Field Mappings
  fieldMappings: {
    id: '_id',
    name: 'name',
    email: 'email',
    isActive: 'isActive',
    createdAt: 'createdAt'
  },

  // Enhanced Field Labels for components
  fieldLabels: fieldLabelsForComponents,

  // Display Configuration
  display: {
    ...displayLabels,
    columnSpacing: 20,
    imageClassName: '',
    minImageHeight: 0,
    imagePlaceholderColor: '#f4f4f4',
    imageErrorColor: '#f0f0f0',
    showExpandArrow: true,
    showDetailButton: true,
    showFieldLabels: false,
  },

  // Attach to config for unified access
  getFieldGroups: getFieldGroupsSubscribe,
};

// Backward compatibility - keeping the old API_ENDPOINTS export
export const API_ENDPOINTS = {
  SUBSCRIBE: subscribeConfig.api.endpoints.base,
  SUBSCRIBE_LIST: subscribeConfig.api.endpoints.list,
  SUBSCRIBE_CREATE: subscribeConfig.api.endpoints.create,
  SUBSCRIBE_UPDATE: subscribeConfig.api.endpoints.update,
  SUBSCRIBE_DELETE: subscribeConfig.api.endpoints.delete,
  SUBSCRIBE_DETAIL: subscribeConfig.api.endpoints.detail,
  SUBSCRIBE_BULK: subscribeConfig.api.endpoints.bulk,
};

// Enhanced API helpers for subscribe
export const subscribeAPI = {
  // Create subscribe
  create: async (data) => {
    try {
      const response = await fetch(subscribeConfig.api.endpoints.create, {
        method: subscribeConfig.api.methods.create,
        headers: subscribeConfig.api.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error creating subscribe:', error);
      throw error;
    }
  },

  // Update subscribe
  update: async (id, data) => {
    try {
      const response = await fetch(subscribeConfig.api.endpoints.update(id), {
        method: subscribeConfig.api.methods.update,
        headers: subscribeConfig.api.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error updating subscribe:', error);
      throw error;
    }
  },

  // Delete subscribe
  delete: async (id) => {
    try {
      const response = await fetch(subscribeConfig.api.endpoints.delete(id), {
        method: subscribeConfig.api.methods.delete,
        headers: subscribeConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error deleting subscribe:', error);
      throw error;
    }
  },

  // Get subscribe list with enhanced parameters
  list: async (params = {}) => {
    try {
      const queryParams = {
        limit: subscribeConfig.api.defaultLimit,
        ...params
      };
      
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString 
        ? `${subscribeConfig.api.endpoints.list}?${queryString}`
        : subscribeConfig.api.endpoints.list;
        
      const response = await fetch(url, {
        method: subscribeConfig.api.methods.list,
        headers: subscribeConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error fetching subscribe list:', error);
      throw error;
    }
  },

  // Get subscribe detail
  detail: async (id) => {
    try {
      const response = await fetch(subscribeConfig.api.endpoints.detail(id), {
        method: subscribeConfig.api.methods.detail, 
        headers: subscribeConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error fetching subscribe detail:', error);
      throw error;
    }
  },

  // Bulk operations
  bulk: async (operation, ids, data = {}) => {
    try {
      const response = await fetch(subscribeConfig.api.endpoints.bulk, {
        method: subscribeConfig.api.methods.bulk,
        headers: subscribeConfig.api.headers,
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
};

// Configuration validation helper
export const validateSubscribeConfig = () => {
  const requiredFields = ['itemUrl', 'api', 'fields', 'labels'];
  const missing = requiredFields.filter(field => !subscribeConfig[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required configuration fields: ${missing.join(', ')}`);
  }
  return true;
};



// Enhanced field details for consistent usage across components
export const subscribeDetailFields = subscribeConfig.fields.dataField.map(key => ({
  key,
  label: (isCn) => getSubscribeLabel(key, isCn ? 'CN':'EN'),
  type: subscribeConfig.fields.arrayFields.includes(key) ? 'array' : 'text'
}));

// Utility functions for subscribe handling
export const getDefaultContent = (isCn) => ({
  title: getSubscribeLabel('subscribe', isCn ? 'CN':'EN'),
  description: subscribeConfig.display.emptyMessage(isCn),
  listTitle: defaultContentLabels.listTitle(isCn),
  detailsLabel: defaultContentLabels.detailsLabel(isCn),
  viewDetails: subscribeConfig.display.detailButtonText(isCn),
  name: getSubscribeLabel('name', isCn ? 'CN':'EN'),
  email: getSubscribeLabel('email', isCn ? 'CN':'EN'),
  isActive: getSubscribeLabel('isActive', isCn ? 'CN':'EN'),
  createdAt: getSubscribeLabel('createdAt', isCn ? 'CN':'EN'),
  noName: defaultContentLabels.noName(isCn),
  noEmail: defaultContentLabels.noEmail(isCn),
  noSubscribes: subscribeConfig.display.noMatchMessage(isCn),
  back: defaultContentLabels.back(isCn)
});

// Add getLabel function to subscribeConfig
subscribeConfig.getLabel = getSubscribeLabel;

// Export default subscribeConfig
export default subscribeConfig;
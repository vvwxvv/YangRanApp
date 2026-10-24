import UsersEditForm from "@/components/forms/UsersEditForm";
import SignupForm from "@/components/forms/SignupForm";
import { 
  userLabels, 
  getUserLabel,
  pageLabels,
  fieldGroupLabels,
} from '@/components/labels/user_labels';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';

// Field groupings
export const getFieldGroupsUsers = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: fieldGroupLabels.basic.title(isCn),
      fields: [
        { key: "username" },
        { key: "email" },
        { key: "password" },
      ]
    },
    ADDITIONAL: {
      title: fieldGroupLabels.additional.title(isCn),
      fields: [
        { key: "lastLoginAt" },
        { key: "createdAt" },
      ]
    }
  };
  
  return getFieldGroupsWithLabels('users', fieldGroups, isCn);
};

export const usersConfig = {
  itemUrl: "users",
  
  // API Configuration
  api: {
    endpoints: {
      base: '/api/users',
      create: '/api/users',
      update: (id) => `/api/users/${id}`,
      delete: (id) => `/api/users/${id}`,
      list: '/api/users',
      detail: (id) => `/api/users/${id}`,
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
    imagesField: [],
    requiredFields: [],
    searchableFields: ["username", "email"],
    sortableFields: ["createdAt", "lastLoginAt", "username", "email"],
    dataField: ["id", "username", "email", "lastLoginAt", "createdAt"],
    fieldShowOrder: ["username", "email", "lastLoginAt", "createdAt"],
    urlField: [],
    arrayFields: [],
    
    // Valid fields for API operations
    validFields: [
      '_id',
      'username', 'email', 'password', 'lastLoginAt', 'createdAt'
    ],
  },

  // Component Configuration
  components: {
    createFormComponent: SignupForm,
    editFormComponent: UsersEditForm,
  },

  // Settings Configuration
  settings: {
    filterAttribute: "username",
    useLanguage: false,
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
    },
  },

  // Labels Configuration - Imported from user_labels.js
  labels: userLabels,

  // Helper function to get labels
  getLabel: function(key, language = 'en') {
    return getUserLabel(key, language);
  },

  // Attach to config for unified access
  getFieldGroups: getFieldGroupsUsers,
};
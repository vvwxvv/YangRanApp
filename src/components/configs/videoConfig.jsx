import { F } from "@/components/labels/managerLabels";
import VideoEditForm from "@/components/forms/VideoEditForm";
import { getMarkValue, hasMarkValue } from "@/utils/mediaMarks";
import VideoForm from "@/components/forms/VideoForm";
import { 
  videoLabels, 
  getVideoLabel, 
  pageLabels,
  displayLabels,
  controlPanelLabels,
  defaultContentLabels,
  fieldGroupLabels,
} from '@/components/labels/video_labels';
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

// Get video types from formTypesData
const videoTypes = getFormTypes('video');

// Field groupings
export const getFieldGroupsVideo = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: fieldGroupLabels.basic.title(isCn),
      fields: [
        { key: "video_url" },
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
  
  return getFieldGroupsWithLabels('video', fieldGroups, isCn);
};

// Video-specific constants
export const FALLBACK_VIDEO_THUMBNAIL = "/video-placeholder.png";

// Icon components for controls
const SliderIcon = () => (
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
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
    />
  </svg>
);

export const videoConfig = {
  // Schema identifier
  itemUrl: "video",
  schemaName: "Video",

  // API Configuration
  api: {
    endpoints: {
      base: '/api/video',
      create: '/api/video',
      update: (id) => `/api/video/${id}`,
      delete: (id) => `/api/video/${id}`,
      list: '/api/video',
      detail: (id) => `/api/video/${id}`,
      upload: '/api/upload',
      bulk: '/api/video/bulk',
      reorder: '/api/video/reorder',
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
      collectionName: 'Video'
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
    
    // Image fields for upload and display (videos use thumbnail_url)
    imagesField: ["thumbnail_url"],
    
    // URL fields for link rendering
    urlField: ["video_url"],
    
    // Required fields for validation (all fields are optional per Prisma schema)
    requiredFields: [],
    
    // All data fields available (matching Prisma schema)
    dataField: [
      'id', '_id',
      'video_url', 'tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn', 
      'mark', 'tag_source', 'order', 'updatedAt'
    ],
    
    // Display order for fields
    fieldShowOrder: [
      'video_url', 'tag_en', 'tag_cn', 'type', 'order', 
      'caption_en', 'caption_cn', 'mark', 'tag_source', 'updatedAt'
    ],
    
    // Array fields for special handling
    arrayFields: [],
    
    // Valid fields for API operations
    validFields: [
      '_id', 'id',
      'video_url', 'tag_en', 'tag_cn', 'type', 'caption_en', 'caption_cn', 
      'mark', 'tag_source', 'order', 'updatedAt'
    ],
  },

  // Component Configuration
  components: {
    createFormComponent: VideoForm,
    editFormComponent: VideoEditForm,
  },

  // Settings Configuration
  settings: {
    // Language filtering (videos don't have language field but use tag_en/tag_cn)
    useLanguage: false,
    languageField: null,
    
    // Pagination settings
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
    },
    
    // Upload settings
    upload: {
      maxFileSize: 500 * 1024 * 1024, // 500MB for videos
      acceptedFormats: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
      uploadPath: '/uploads/videos/',
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
      cardImageAspectRatio: 'aspect-video',
      defaultImagePlaceholder: FALLBACK_VIDEO_THUMBNAIL,
      showFieldLabels: true,
      showExpandArrow: true,
      showDetailButton: true,
    },
  },

  // Labels Configuration - Imported from video_labels.js
  labels: videoLabels,

  // Enhanced Type Options
  typeOptions: videoTypes,

  // Display Configuration
  display: {
    ...displayLabels,
    columnSpacing: 20,
    imageClassName: 'aspect-video',
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
    return getVideoLabel(key, language);
  },

  // Helper function to get filter configurations
  getFilterConfigs: function(getLabel) {
    return this.filters.getFilterConfigs(getLabel);
  },

  // Attach to config for unified access
  getFieldGroups: getFieldGroupsVideo,
};

// Configuration validation helper
export const validateVideoConfig = () => {
  const requiredFields = ['itemUrl', 'api', 'fields', 'components', 'labels'];
  const missing = requiredFields.filter(field => !videoConfig[field]);
  
  if (missing.length > 0) {
    console.log(`Missing required configuration fields: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};

// Get type option helper - use either the imported one or the new implementation
export const getVideoTypeOption = (value, language = 'en') => {
  // Try using the imported function first
  if (typeof importedGetVideoTypeOption === 'function') {
    return importedGetVideoTypeOption(value, language);
  }
  // Fallback to the new implementation
  return getFormTypeByValue('video', value, language);
};

// Enhanced API helpers for video
export const videoAPI = {
  // Create video
  create: async (data) => {
    try {
      const response = await fetch(videoConfig.api.endpoints.create, {
        method: videoConfig.api.methods.create,
        headers: videoConfig.api.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error creating video:', error);
      throw error;
    }
  },

  // Update video
  update: async (id, data) => {
    try {
      const response = await fetch(videoConfig.api.endpoints.update(id), {
        method: videoConfig.api.methods.update,
        headers: videoConfig.api.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error updating video:', error);
      throw error;
    }
  },

  // Delete video
  delete: async (id) => {
    try {
      const response = await fetch(videoConfig.api.endpoints.delete(id), {
        method: videoConfig.api.methods.delete,
        headers: videoConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error deleting video:', error);
      throw error;
    }
  },

  // Get video list with enhanced parameters
  list: async (params = {}) => {
    try {
      const queryParams = {
        limit: videoConfig.api.defaultLimit,
        ...params
      };
      
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString 
        ? `${videoConfig.api.endpoints.list}?${queryString}`
        : videoConfig.api.endpoints.list;
        
      const response = await fetch(url, {
        method: videoConfig.api.methods.list,
        headers: videoConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error fetching video list:', error);
      throw error;
    }
  },

  // Get video detail
  detail: async (id) => {
    try {
      const response = await fetch(videoConfig.api.endpoints.detail(id), {
        method: videoConfig.api.methods.detail, 
        headers: videoConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error fetching video detail:', error);
      throw error;
    }
  },

  // Upload video file
  upload: async (file, progressCallback) => {
    try {
      // Validate file
      if (!videoConfig.settings.upload.acceptedFormats.includes(file.type)) {
        throw new Error('File type not supported');
      }
      
      if (file.size > videoConfig.settings.upload.maxFileSize) {
        throw new Error('File size exceeds limit');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', videoConfig.settings.upload.uploadPath);
      
      const response = await fetch(videoConfig.api.endpoints.upload, {
        method: videoConfig.api.methods.upload,
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
      const response = await fetch(videoConfig.api.endpoints.bulk, {
        method: videoConfig.api.methods.bulk,
        headers: videoConfig.api.headers,
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

  // Reorder videos
  reorder: async (reorderData) => {
    try {
      const response = await fetch(videoConfig.api.endpoints.reorder, {
        method: videoConfig.api.methods.reorder,
        headers: videoConfig.api.headers,
        body: JSON.stringify(reorderData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error reordering videos:', error);
      throw error;
    }
  },
};

// Enhanced field details for consistent usage across components
export const videoDetailFields = videoConfig.fields.dataField.map(key => ({
  key,
  label: (isCn) => getVideoLabel(key, isCn ? 'CN':'EN'),
  type: videoConfig.fields.urlField.includes(key) ? 'url' : 
        videoConfig.fields.imagesField.includes(key) ? 'image' :
        videoConfig.fields.arrayFields.includes(key) ? 'array' : 'text'
}));

// Utility functions for video handling
export const getDefaultContent = (isCn) => ({
  title: getVideoLabel('video', isCn ? 'CN':'EN'),
  description: videoConfig.display.emptyMessage(isCn),
  listTitle: defaultContentLabels.listTitle(isCn),
  detailsLabel: defaultContentLabels.detailsLabel(isCn),
  viewDetails: videoConfig.display.detailButtonText(isCn),
  tag: getVideoLabel('tag', isCn ? 'CN':'EN'),
  type: getVideoLabel('type', isCn ? 'CN':'EN'),
  order: getVideoLabel('order', isCn ? 'CN':'EN'),
  tag_en: getVideoLabel('tag_en', isCn ? 'CN':'EN'),
  tag_cn: getVideoLabel('tag_cn', isCn ? 'CN':'EN'),
  tag_source: getVideoLabel('tag_source', isCn ? 'CN':'EN'),
  caption_en: getVideoLabel('caption_en', isCn ? 'CN':'EN'),
  caption_cn: getVideoLabel('caption_cn', isCn ? 'CN':'EN'),
  mark: getVideoLabel('mark', isCn ? 'CN':'EN'),
  untitled: defaultContentLabels.untitled(isCn),
  noDescription: defaultContentLabels.noDescription(isCn),
  noVideos: videoConfig.display.noMatchMessage(isCn),
  back: defaultContentLabels.back(isCn)
});

// Helper to match a video's URL by a subject's title or provided title
export const getMatchedVideoUrl = (subjectOrTitle, videos) => {
  try {
    if (!videos || !Array.isArray(videos)) return null;
    const title = typeof subjectOrTitle === 'string' 
      ? (subjectOrTitle || '') 
      : (subjectOrTitle?.title || '');
    const matched = videos.find(v => v?.title === title || v?.tag_en === title || v?.tag_cn === title);
    return matched ? matched.video_url : null;
  } catch (error) {
    return null;
  }
};

export const filterAndSortVideos = (videos, isCn, search, typeFilter, tagFilter) => {
  if (!videos || !Array.isArray(videos)) return [];
  
  return videos
    .filter(video => {
      if (!video) return false;
      
      // Type filtering
      if (typeFilter && video.type !== typeFilter) return false;
      
      // Tag filtering
      if (tagFilter) {
        const tagMatches = (video.tag_en && video.tag_en.includes(tagFilter)) ||
                          (video.tag_cn && video.tag_cn.includes(tagFilter));
        if (!tagMatches) return false;
      }
      
      // Search filtering
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = videoConfig.fields.searchableFields.some(field => 
          (video[field] || '').toLowerCase().includes(searchLower)
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

export const videoControlPanelConfig = {
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
      label: controlPanelLabels.toggleSliderOnly,
      action: 'toggleSliderOnly',
      tooltip: controlPanelLabels.toggleSliderOnlyTooltip,
      activeColor: 'red',
      inactiveColor: 'var(--text-primary, #000000)',
      icon: <SliderIcon />,
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

// Export videoTypes for other components that might need it
export { videoTypes };

// Export default videoConfig
export default videoConfig;
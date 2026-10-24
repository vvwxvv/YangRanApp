import { L, F } from "@/components/labels/managerLabels";
// imageConfig.js
import ImageEditForm from "@/components/forms/ImageEditForm";
import { getMarkValue, hasMarkValue } from "@/utils/mediaMarks";
import ImageForm from "@/components/forms/ImageForm";
import { ArrowUpDown } from 'lucide-react';
import { 
  ANIMATION_VARIANTS, 
  sortAlphabetically, 
} from './general_config';
import { getFieldGroupsWithLabels } from '@/components/forms/utils/formFieldsUtils';
import { ORDER_KEY_LABELS } from '@/utils/mediaOrder';

// ============================================================
// LABELS CONFIGURATION
// ============================================================
export const imageLabels = {
  // Page labels
  page: {
    title: L.images,
    subtitle: L.image_management,
    description: L.manage_image_gallery,
  },

  // Field labels
  fields: {
    img_url: L.image_url,
    tag_en: L.tag_english,
    tag_cn: L.tag_chinese,
    tag: L.tag,
    type: L.type,
    caption_en: L.caption_english,
    caption_cn: L.caption_chinese,
    caption: L.caption,
    mark: L.mark,
    tag_source: L.tag_source,
    order: L.order_sort,
    'order.artist_page_order': L.artist_page_order_legacy,
    'order.exhibition_page_order': ORDER_KEY_LABELS.exhibition_page_order,
    'order.art_fair_page_order': ORDER_KEY_LABELS.art_fair_page_order,
    'order.rolling_img_order': ORDER_KEY_LABELS.rolling_img_order,
    'order.artist_detail_rolling_img_order': ORDER_KEY_LABELS.artist_detail_rolling_img_order,
  },

  // UI Text
  UI_TEXT: {
    imageManagement: L.image_management,
    create: L.create_new_image,
    edit: L.edit,
    delete: L.delete,
    save: L.save,
    cancel: L.cancel,
    confirmDelete: L.confirm_delete,
    confirmDeleteImage: L.are_you_sure_you_want_to_delete_this_image,
    exportSuccess: L.export_successful,
    exportError: L.export_failed_2,
    loadingError: L.loading_failed,
    systemError: L.system_error_2,
    tryAgain: L.try_again,
    noData: L.no_images_available,
    noMatchingImages: L.no_matching_images_found,
    noSliderImages: L.no_slider_images_available,
    itemName: L.image,
    search: L.search,
    search_placeholder: L.search_images,
  },

  // Control Panel labels
  controlPanel: {
    toggleSliderOnly: L.slider_only,
    toggleSliderOnlyTooltip: L.show_only_slider_images,
    sortByTag: L.sort_by_tag,
    sortByTagTooltip: L.sort_images_by_tag,
    sortByType: L.sort_by_type,
    sortByTypeTooltip: L.sort_images_by_type,
  },

  // Display labels
  display: {
    emptyMessage: (isCn) => isCn ? '暂无图片' : 'No images available',
    noMatchMessage: (isCn) => isCn ? '未找到匹配的图片' : 'No matching images found',
    detailButtonText: (isCn) => isCn ? '查看详情' : 'View Details',
  },
};

// Helper function to get labels
export const getImageLabel = (key, language = 'en') => {
  // Check field labels first
  if (imageLabels.fields[key]) {
    return imageLabels.fields[key][language] || imageLabels.fields[key]['en'];
  }
  
  // Check UI_TEXT
  if (imageLabels.UI_TEXT[key]) {
    return imageLabels.UI_TEXT[key][language] || imageLabels.UI_TEXT[key]['en'];
  }
  
  // Check control panel
  if (imageLabels.controlPanel[key]) {
    return imageLabels.controlPanel[key][language] || imageLabels.controlPanel[key]['en'];
  }
  
  // Check page labels
  if (imageLabels.page[key]) {
    return imageLabels.page[key][language] || imageLabels.page[key]['en'];
  }
  
  // Return key as fallback
  return key;
};

// ============================================================
// FIELD GROUPS CONFIGURATION
// ============================================================
export const getFieldGroupsImage = (isCn = false) => {
  const fieldGroups = {
    BASIC: {
      title: isCn ? '基本信息' : 'Basic Information',
      fields: [
        { key: "img_url" },
        { key: "tag_en" },
        { key: "tag_cn" },
        { key: "type" },
        { key: "order.artist_page_order" },
        { key: "order.exhibition_page_order" },
        { key: "order.art_fair_page_order" },
        { key: "order.rolling_img_order" },
        { key: "order.artist_detail_rolling_img_order" },
      ]
    },
    ADDITIONAL: {
      title: isCn ? '附加信息' : 'Additional Information',
      fields: [
        { key: "caption_en" },
        { key: "caption_cn" },
        { key: "mark" },
        { key: "tag_source" }
      ]
    }
  };
  
  return getFieldGroupsWithLabels('image', fieldGroups, isCn);
};

// ============================================================
// TYPE OPTIONS
// ============================================================
export const imageTypes = [
  { value: 'Gallery', label_en: 'Gallery', label_cn: '图库' },
  { value: 'Slider', label_en: 'Slider', label_cn: '轮播' },
  { value: 'Cover', label_en: 'Cover', label_cn: '封面' },
  { value: 'Thumbnail', label_en: 'Thumbnail', label_cn: '缩略图' },
  { value: 'Other', label_en: 'Other', label_cn: '其他' },
];

// ============================================================
// MAIN CONFIGURATION
// ============================================================
export const imageConfig = {
  // Schema identifier
  itemUrl: "image",
  schemaName: "Image",

  // API Configuration
  api: {
    endpoints: {
      base: '/api/image',
      create: '/api/image',
      update: (id) => `/api/image/${id}`,
      delete: (id) => `/api/image/${id}`,
      list: '/api/image',
      detail: (id) => `/api/image/${id}`,
      upload: '/api/upload',
      bulk: '/api/image/bulk',
      reorder: '/api/image/reorder'
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
      defaultSortOrder: 1,
      defaultSortField: 'order.rolling_img_order',
      collectionName: 'Image'
    }
  },

  // Page Configuration
  page: {
    title: imageLabels.page.title,
    subtitle: imageLabels.page.subtitle,
    description: imageLabels.page.description,
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
    searchableFields: ['tag_en', 'tag_cn', 'caption_en', 'caption_cn', 'type'],
    sortableFields: ['order.artist_page_order', 'order.exhibition_page_order', 'order.art_fair_page_order', 'order.rolling_img_order', 'order.artist_detail_rolling_img_order', 'type', 'tag_en', 'tag_cn'],
    filterableFields: ['type', 'mark', 'tag_source'],
    mainFields: ['type', 'order.artist_page_order', 'mark'],
    expandedFields: ['caption_en', 'caption_cn', 'tag_source'],
    imagesField: ['img_url'],
    urlField: ['img_url'],
    requiredFields: [],
    dataField: [
      'id', 'img_url', 'tag_en', 'tag_cn', 'type', 
      'caption_en', 'caption_cn', 'mark', 'tag_source',
      'order.artist_page_order', 'order.exhibition_page_order', 'order.art_fair_page_order', 'order.rolling_img_order',
      'order.artist_detail_rolling_img_order'
    ],
    fieldShowOrder: [
      'img_url', 'tag_en', 'tag_cn', 'type', 'caption_en', 
      'caption_cn', 'mark', 'tag_source',
      'order.artist_page_order', 'order.exhibition_page_order', 'order.art_fair_page_order', 'order.rolling_img_order',
      'order.artist_detail_rolling_img_order'
    ],
    arrayFields: [],
    validFields: [
      '_id', 'img_url', 'tag_en', 'tag_cn', 'type', 
      'caption_en', 'caption_cn', 'mark', 'tag_source', 
      'order'
    ],
  },

  // Component Configuration
  components: {
    createFormComponent: ImageForm,
    editFormComponent: ImageEditForm,
  },

  // Settings Configuration
  settings: {
    useLanguage: false, // Images don't use language field like other models
    pagination: {
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
    },
    upload: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      uploadPath: '/uploads/images/',
    },
    validation: {
      maxCaptionLength: 500,
      maxMarkLength: 100,
    },
    display: {
      cardImageAspectRatio: 'aspect-square',
      defaultImagePlaceholder: '/placeholder.png',
      showFieldLabels: true,
      showExpandArrow: true,
      showDetailButton: true,
    },
  },

  // Labels Configuration
  labels: imageLabels,

  // Type Options
  typeOptions: imageTypes,

  // Language Options (for bilingual fields)
  languageOptions: [
    { value: 'EN', label_en: 'English', label_cn: '英文' },
    { value: 'CN', label_en: 'Chinese', label_cn: '中文' },
  ],

  // Display Configuration
  display: {
    ...imageLabels.display,
    columnSpacing: 20,
    imageClassName: 'aspect-square',
    minImageHeight: 180,
    imagePlaceholderColor: '#f4f4f4',
    imageErrorColor: '#f0f0f0',
    showExpandArrow: true,
    showDetailButton: true,
    showFieldLabels: false,
  },

  // Sort Options
  sortOptions: {
    tag: {
      label_en: F.sort_by_tag.en,
      label_cn: F.sort_by_tag.cn,
      compareFn: (a, b, isCn) => {
        const tagA = isCn ? (a.tag_cn || '') : (a.tag_en || '');
        const tagB = isCn ? (b.tag_cn || '') : (b.tag_en || '');
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
        const av = (a.order && typeof a.order === 'object' ? a.order.artist_page_order : a.order) ?? null;
        const bv = (b.order && typeof b.order === 'object' ? b.order.artist_page_order : b.order) ?? null;
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        return parseInt(av) - parseInt(bv);
      },
      defaultOrder: 'asc'
    }
  },

  // Filter Configuration
  filters: {
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
          field: 'markFilter',
          dataSource: 'mark',
          label: getLabel('mark'),
          style: { minWidth: 120 }
        },
        {
          type: 'select',
          field: 'tagSourceFilter',
          dataSource: 'tag_source',
          label: getLabel('tag_source'),
          style: { minWidth: 120 }
        },
        {
          type: 'search',
          field: 'searchTerm',
          searchFields: ['tag_en', 'tag_cn', 'caption_en', 'caption_cn', 'type'],
          label: getLabel('search'),
          placeholder: getLabel('search_placeholder'),
          style: { minWidth: 200 }
        }
      ];
    },
    defaultValues: {
      typeFilter: '',
      markFilter: '',
      tagSourceFilter: '',
      searchTerm: ''
    },
    validation: {
      searchTerm: {
        minLength: 0,
        maxLength: 100
      }
    }
  },

  // Helper function to get labels
  getLabel: function(key, language = 'en') {
    return getImageLabel(key, language);
  },

  // Helper function to get filter configurations
  getFilterConfigs: function(getLabel) {
    return this.filters.getFilterConfigs(getLabel);
  },

  // Attach to config for unified access
  getFieldGroups: getFieldGroupsImage,
};

// ============================================================
// CONTROL PANEL CONFIGURATION
// ============================================================
export const imageControlPanelConfig = {
  filters: [
    {
      field: 'type',
      label: imageLabels.fields.type,
      sortFunction: sortAlphabetically,
    },
    {
      field: 'mark',
      label: imageLabels.fields.mark,
      sortFunction: sortAlphabetically,
    },
    {
      field: 'tag_source',
      label: imageLabels.fields.tag_source,
      sortFunction: sortAlphabetically,
    },
  ],
  controls: [
    {
      type: 'toggle',
      label: imageLabels.controlPanel.toggleSliderOnly,
      action: 'toggleSliderOnly',
      tooltip: imageLabels.controlPanel.toggleSliderOnlyTooltip,
      activeColor: 'blue',
      inactiveColor: 'var(--text-primary, #000000)',
    },
    {
      type: 'button',
      label: imageLabels.controlPanel.sortByTag,
      action: 'sortByTag',
      tooltip: imageLabels.controlPanel.sortByTagTooltip,
      icon: <ArrowUpDown size={20} />,
    },
  ],
};

// ============================================================
// API HELPERS
// ============================================================
export const imageAPI = {
  create: async (data) => {
    try {
      const response = await fetch(imageConfig.api.endpoints.create, {
        method: imageConfig.api.methods.create,
        headers: imageConfig.api.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error creating image:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(imageConfig.api.endpoints.update(id), {
        method: imageConfig.api.methods.update,
        headers: imageConfig.api.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error updating image:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(imageConfig.api.endpoints.delete(id), {
        method: imageConfig.api.methods.delete,
        headers: imageConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error deleting image:', error);
      throw error;
    }
  },

  list: async (params = {}) => {
    try {
      const queryParams = {
        limit: imageConfig.api.defaultLimit,
        ...params
      };
      
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString 
        ? `${imageConfig.api.endpoints.list}?${queryString}`
        : imageConfig.api.endpoints.list;
        
      const response = await fetch(url, {
        method: imageConfig.api.methods.list,
        headers: imageConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error fetching image list:', error);
      throw error;
    }
  },

  detail: async (id) => {
    try {
      const response = await fetch(imageConfig.api.endpoints.detail(id), {
        method: imageConfig.api.methods.detail,
        headers: imageConfig.api.headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error fetching image detail:', error);
      throw error;
    }
  },

  upload: async (file) => {
    try {
      if (!imageConfig.settings.upload.acceptedFormats.includes(file.type)) {
        throw new Error('File type not supported');
      }
      
      if (file.size > imageConfig.settings.upload.maxFileSize) {
        throw new Error('File size exceeds limit');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', imageConfig.settings.upload.uploadPath);
      
      const response = await fetch(imageConfig.api.endpoints.upload, {
        method: imageConfig.api.methods.upload,
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

  bulk: async (operation, ids, data = {}) => {
    try {
      const response = await fetch(imageConfig.api.endpoints.bulk, {
        method: imageConfig.api.methods.bulk,
        headers: imageConfig.api.headers,
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

  reorder: async (reorderData) => {
    try {
      const response = await fetch(imageConfig.api.endpoints.reorder, {
        method: imageConfig.api.methods.reorder,
        headers: imageConfig.api.headers,
        body: JSON.stringify(reorderData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error reordering images:', error);
      throw error;
    }
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
export const getSliderImageCount = (images) => {
  return images.filter(image => hasMarkValue(image, 'Slider')).length;
};

export const filterImagesByMark = (images, mark) => {
  return images.filter((image) => hasMarkValue(image, mark));
};

export const getImageTypeOption = (value, language = 'en') => {
  const option = imageConfig.typeOptions.find(opt => opt.value === value);
  if (!option) return value;
  return language === 'cn' ? option.label_cn : option.label_en;
};

// Configuration validation helper
export const validateImageConfig = () => {
  const requiredFields = ['itemUrl', 'api', 'fields', 'components', 'labels'];
  const missing = requiredFields.filter(field => !imageConfig[field]);
  
  if (missing.length > 0) {
    console.log(`Missing required configuration fields: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};

// Export default
export default imageConfig;
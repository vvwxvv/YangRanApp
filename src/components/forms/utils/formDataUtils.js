import { FORM_TYPE_OPTIONS as formTypesData } from '@/utils/siteMetaDefaults';
import { FORM_FIELD_OPTIONS as formOptionsData } from '@/components/forms/utils/formOptionsUtils';

// ============================================================
// NOTE: Schema-specific options have been moved to form files:
// - WritingForm.jsx: writingCategories, publishStatusOptions
// - WebForm.jsx: webTypes
// ============================================================

// Local copies for backward compatibility
const writingCategories = [
  { value: 'article', label_en: 'Article', label_cn: '文章' },
  { value: 'essay', label_en: 'Essay', label_cn: '随笔' },
  { value: 'blog', label_en: 'Blog', label_cn: '博客' },
  { value: 'review', label_en: 'Review', label_cn: '评论' },
  { value: 'tutorial', label_en: 'Tutorial', label_cn: '教程' },
  { value: 'news', label_en: 'News', label_cn: '新闻' },
  { value: 'other', label_en: 'Other', label_cn: '其他' }
];

const publishStatusOptions = [
  { value: 'DRAFT', label_en: 'Draft', label_cn: '草稿' },
  { value: 'PUBLISHED', label_en: 'Published', label_cn: '已发布' },
  { value: 'ARCHIVED', label_en: 'Archived', label_cn: '已归档' },
  { value: 'SCHEDULED', label_en: 'Scheduled', label_cn: '定时发布' }
];

export const languageOptions = [
  { value: 'EN', label_en: 'English (EN)', label_cn: '英文 (EN)' },
  { value: 'CN', label_en: 'Chinese (CN)', label_cn: '中文 (CN)' }
];

const webTypes = [
  { value: 'portfolio', label_en: 'Portfolio', label_cn: '作品集' },
  { value: 'blog', label_en: 'Blog', label_cn: '博客' },
  { value: 'ecommerce', label_en: 'E-commerce', label_cn: '电商' },
  { value: 'corporate', label_en: 'Corporate', label_cn: '企业' },
  { value: 'personal', label_en: 'Personal', label_cn: '个人' },
  { value: 'other', label_en: 'Other', label_cn: '其他' }
];

// Re-export for external usage
export { writingCategories, publishStatusOptions, webTypes };

// ============================================================
// DIRECT DATA ACCESS FUNCTIONS
// ============================================================

/**
 * Get form types for a specific entity
 * @param {string} entityType - Entity type (e.g., 'artwork', 'writing', 'web')
 * @returns {Array} Array of type objects
 */
export const getFormTypes = (entityType) => {
  return formTypesData[entityType] || [];
};

/**
 * Get form field options for a specific entity and field
 * @param {string} entityType - Entity type
 * @param {string} field - Field name
 * @param {string} language - Language code ('en' or 'cn')
 * @returns {Array} Array of option objects
 */
export const getFormFieldOptions = (entityType, field, language = 'en') => {
  // Try formOptions first
  const formOptions = formOptionsData[entityType]?.formOptions?.[field] || [];
  if (formOptions.length > 0) {
    return formOptions.map(option => ({
      id: option.id,
      value: option.value,
      label: language === 'cn' ? option.label_cn : option.label_en
    }));
  }

  // Try filterOptions
  const filterOptions = formOptionsData[entityType]?.filterOptions?.[field] || [];
  if (filterOptions.length > 0) {
    return filterOptions.map(option => ({
      id: option.id,
      value: option.value,
      label: language === 'cn' ? option.label_cn : option.label_en
    }));
  }

  // Try common options
  const commonOptions = formOptionsData.common?.[field] || [];
  if (commonOptions.length > 0) {
    return commonOptions.map(option => ({
      id: option.id,
      value: option.value,
      label: language === 'cn' ? option.label_cn : option.label_en
    }));
  }

  return [];
};

/**
 * Get type options with proper structure and unique IDs
 * @param {string} entityType - Entity type
 * @param {string} language - Language code ('en' or 'cn')
 * @returns {Array} Array of type option objects
 */
export const getTypeOptions = (entityType, language = 'en') => {
  const types = getFormTypes(entityType);

  return types.map(type => {
    // Handle image type which only has 'value' field
    if (entityType === 'image') {
      return {
        id: type.id,
        value: type.value,
        label: type.value
      };
    }

    // Fallback for backward compatibility
    if (type.label_en && type.label_cn) {
      return {
        id: type.id,
        value: language === 'cn' ? type.label_cn : type.label_en,
        label: language === 'cn' ? type.label_cn : type.label_en,
        priority: type.priority
      };
    }

    if (type.label) {
      return {
        id: type.id,
        value: type.value || type.label,
        label: type.label
      };
    }

    return {
      id: type.id,
      ...type
    };
  });
};

/**
 * Get boolean options
 * @param {string} language - Language code ('en' or 'cn')
 * @returns {Array} Array of boolean option objects
 */
export const getBooleanOptions = (language = 'en') => {
  const options = formOptionsData.common?.boolean || [];

  return options.map(option => ({
    id: option.id,
    value: option.value,
    label: language === 'cn' ? option.label_cn : option.label_en
  }));
};

/**
 * Get language options
 * @param {string} language - Language code ('en' or 'cn')
 * @returns {Array} Array of language option objects
 */
export const getLanguageOptions = (language = 'en') => {
  // Try to get from formOptionsData first
  const options = formOptionsData.common?.language || [];
  
  if (options.length > 0) {
    return options.map(option => ({
      id: option.id,
      value: option.value,
      label: language === 'cn' ? option.label_cn : option.label_en
    }));
  }

  // Fallback to languageOptions
  return languageOptions.map((option, index) => ({
    id: index + 1,
    value: option.value,
    label: language === 'cn' ? option.label_cn : option.label_en
  }));
};

// ============================================================
// CATEGORY OPTIONS
// ============================================================

/**
 * Get category options for a specific entity type
 * @param {string} entityType - Entity type
 * @param {string} language - Language code ('EN' or 'CN')
 * @returns {Array} Array of category option objects
 */
export const getCategoryOptions = (entityType, language = 'EN') => {
  const categories = {
    writing: writingCategories,
    // Add other entity types as needed
  };

  const entityCategories = categories[entityType] || [];
  const lang = language.toUpperCase();

  return entityCategories.map(cat => ({
    value: cat.value,
    label: lang === 'CN' ? cat.label_cn : cat.label_en
  }));
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get form type by value
 * @param {string} entityType - Entity type
 * @param {string} value - Type value to find
 * @param {string} language - Language code ('en' or 'cn')
 * @returns {string} Localized label or original value
 */
export const getFormTypeByValue = (entityType, value, language = 'en') => {
  // Check custom entity types first
  const typeMap = {
    writing: writingCategories,
    web: webTypes,
    // Add other entity types as needed
  };

  const types = typeMap[entityType];
  if (types) {
    const option = types.find(opt => opt.value === value);
    if (option) {
      return language === 'cn' ? option.label_cn : option.label_en;
    }
  }

  // Fallback to form types data
  const formTypes = getFormTypes(entityType);
  const formType = formTypes.find(type => type.value === value);
  
  if (formType) {
    if (formType.label_en && formType.label_cn) {
      return language === 'cn' ? formType.label_cn : formType.label_en;
    }
    if (formType.label) {
      return formType.label;
    }
  }

  // Return original value if not found
  return value;
};

/**
 * Get publish status label by value
 * @param {string} value - Status value
 * @param {string} language - Language code ('en' or 'cn')
 * @returns {string} Localized label or original value
 */
export const getPublishStatusLabel = (value, language = 'en') => {
  const option = publishStatusOptions.find(opt => opt.value === value);
  if (!option) return value;
  
  return language === 'cn' ? option.label_cn : option.label_en;
};

/**
 * Get category label by value
 * @param {string} entityType - Entity type
 * @param {string} value - Category value
 * @param {string} language - Language code ('en' or 'cn')
 * @returns {string} Localized label or original value
 */
export const getCategoryLabel = (entityType, value, language = 'en') => {
  const categories = getCategoryOptions(entityType, language.toUpperCase());
  const category = categories.find(cat => cat.value === value);
  
  return category ? category.label : value;
};

/**
 * Get language label by value
 * @param {string} value - Language value
 * @param {string} language - Language code ('en' or 'cn')
 * @returns {string} Localized label or original value
 */
export const getLanguageLabel = (value, language = 'en') => {
  const option = languageOptions.find(opt => opt.value === value);
  if (!option) return value;
  
  return language === 'cn' ? option.label_cn : option.label_en;
};

/**
 * Get web type label by value
 * @param {string} value - Web type value
 * @param {string} language - Language code ('en' or 'cn')
 * @returns {string} Localized label or original value
 */
export const getWebTypeLabel = (value, language = 'en') => {
  const option = webTypes.find(opt => opt.value === value);
  if (!option) return value;
  
  return language === 'cn' ? option.label_cn : option.label_en;
};

// ============================================================
// EXPORT RAW DATA
// ============================================================

export { formTypesData, formOptionsData };

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  // Data access functions
  getFormTypes,
  getFormFieldOptions,
  getTypeOptions,
  getBooleanOptions,
  getLanguageOptions,
  getCategoryOptions,
  
  // Helper functions
  getFormTypeByValue,
  getPublishStatusLabel,
  getCategoryLabel,
  getLanguageLabel,
  getWebTypeLabel,
  
  // Options data
  writingCategories,
  publishStatusOptions,
  languageOptions,
  webTypes,
  
  // Raw data
  formTypesData,
  formOptionsData
};
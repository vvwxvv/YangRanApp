// Import label functions for each schema type
import { getUserLabel } from '@/components/labels/user_labels';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get field label from labels based on schema type and language
 * @param {string} schemaType - The schema type (artwork, image, video, event, about, subscribe, users)
 * @param {string} fieldKey - The field key
 * @param {boolean} isCn - Whether to return Chinese label
 * @returns {string} The field label
 */
export const getFieldLabel = (schemaType, fieldKey, isCn = false) => {
  const language = isCn ? 'CN':'EN';
  
  // Map schema types to their respective label functions
  const labelFunctions = {
    users: getUserLabel
  };
  
  const labelFunction = labelFunctions[schemaType];
  if (labelFunction) {
    return labelFunction(fieldKey, language) || fieldKey;
  }
  
  return fieldKey;
};

/**
 * Smart label function that automatically handles language-specific fields
 * @param {string} schemaName - The schema name
 * @param {string} fieldName - The field name
 * @param {boolean} isCn - Whether current language is Chinese
 * @returns {string} The field label
 */
export const getSmartLabel = (schemaName, fieldName, isCn) => {
  // For language-specific fields, always use the field's intended language
  if (fieldName.endsWith('_en')) {
    return getFieldLabel(schemaName, fieldName, 'en');
  }
  if (fieldName.endsWith('_cn')) {
    return getFieldLabel(schemaName, fieldName, 'cn');
  }
  // For regular fields, use current language
  return getFieldLabel(schemaName, fieldName, isCn ? 'CN':'EN');
};

/**
 * Get all field labels for a schema type
 * @param {string} schemaType - The schema type
 * @param {boolean} isCn - Whether to return Chinese labels
 * @returns {object} Object with field keys and their labels
 */
export const getSchemaFieldLabels = (schemaType, isCn = false) => {
  const language = isCn ? 'CN':'EN';
  
  // Import the fieldLabels from the appropriate labels file
  let fieldLabels = {};
  
  try {
    switch (schemaType) {
      case 'users':
        fieldLabels = require('@/components/labels/user_labels').fieldLabels;
        break;
      default:
        return {};
    }
  } catch (error) {
    console.warn(`Could not load labels for schema type: ${schemaType}`, error);
    return {};
  }
  
  const labels = {};
  Object.keys(fieldLabels).forEach(fieldKey => {
    // Extract the base field name (remove language suffix)
    const baseFieldName = fieldKey.replace(/_(en|cn)$/, '');
    if (!labels[baseFieldName]) {
      labels[baseFieldName] = fieldLabels[fieldKey] || baseFieldName;
    }
  });
  
  return labels;
};

/**
 * Get field groups configuration using data from form_fields.json
 * @param {string} schemaType - The schema type
 * @param {object} fieldGroups - Field groups configuration
 * @param {boolean} isCn - Whether to return Chinese labels
 * @returns {object} Field groups with labels from JSON
 */
export const getFieldGroupsWithLabels = (schemaType, fieldGroups, isCn = false) => {
  const result = {};
  
  Object.keys(fieldGroups).forEach(groupKey => {
    const group = fieldGroups[groupKey];
    result[groupKey] = {
      title: group.title,
      fields: group.fields.map(field => ({
        ...field,
        label: getFieldLabel(schemaType, field.key, isCn)
      }))
    };
  });
  
  return result;
};

/**
 * Get all available schema names
 * @returns {string[]} Array of schema names
 */
export const getSchemaNames = async () => {
  // Dynamically fetch schema names from the Prisma models
  return ['Users', 'Writing', 'Web'];
};

/**
 * Get all field names for a specific schema
 * @param {string} schemaName - The schema name
 * @returns {string[]} Array of field names
 */
export const getSchemaFieldNames = async (schemaName) => {
  try {
    const modelFields = {
      Users: ['id', 'username', 'email', 'password', 'createdAt', 'updatedAt', 'lastLoginAt'],
      Writing: [
        'id', 'cover_img_url', 'author', 'title', 'subtitle', 'summary', 'keywords', 'category',
        'type', 'year', 'paragraphs', 'caption', 'status', 'mark', 'tag', 'language', 'createdAt', 'updatedAt'
      ],
      Web: [
        'id', 'web_url', 'cover_img_url', 'type', 'tag_en', 'tag_cn', 'caption_en', 'caption_cn',
        'mark', 'order', 'updatedAt'
      ],
      About: [
        'id', 'artist', 'portrait_image_url', 'caption', 'introduction', 'language', 'mark', 'updatedAt'
      ]
    };

    return modelFields[schemaName] || [];
  } catch (error) {
    console.warn(`Could not load field names for schema: ${schemaName}`, error);
    return [];
  }
};

/**
 * Check if a field exists in a schema
 * @param {string} schemaName - The schema name
 * @param {string} fieldName - The field name
 * @returns {boolean} True if field exists
 */
export const hasField = async (schemaName, fieldName) => {
  try {
    const fieldNames = await getSchemaFieldNames(schemaName);
    return fieldNames.includes(fieldName);
  } catch (error) {
    console.warn(`Could not check field existence for schema: ${schemaName}`, error);
    return false;
  }
};

/**
 * Get all available fields data
 * @returns {object} The complete form fields data from Prisma models
 */
export const getAllFormFields = async () => {
  const allFields = {};
  const schemaNames = await getSchemaNames();

  for (const schemaName of schemaNames) {
    allFields[schemaName] = await getSchemaFieldNames(schemaName);
  }

  return allFields;
};

export default {
  getFieldLabel,
  getSmartLabel,
  getSchemaFieldLabels,
  getSchemaNames,
  getSchemaFieldNames,
  hasField,
  getAllFormFields
};
import { useMemo } from 'react';

/**
 * Hook for schema configuration that can be reused across different schemas
 * @param {Object} config - Schema configuration
 * @param {string} config.schemaName - Name of the schema
 * @param {Array} config.validFields - Array of valid field names
 * @param {Array} config.searchableFields - Array of searchable fields
 * @param {Array} config.arrayFields - Array of array fields
 * @param {Array} config.requiredFields - Array of required fields
 * @param {Object} config.defaults - Default configuration values
 * @returns {Object} Schema configuration utilities
 */
export function useSchemaConfig(config) {
  const {
    schemaName,
    validFields = [],
    searchableFields = [],
    arrayFields = [],
    requiredFields = [],
    defaults = {}
  } = config;

  // Memoized schema configuration
  const schemaConfig = useMemo(() => {
    // Default configuration
    const defaultConfig = {
      enablePagination: false,
      enableSearch: true,
      enableSorting: true,
      enableSoftDelete: false,
      defaultPageSize: 10000,
      maxPageSize: 10000,
      defaultSortOrder: -1,
      ...defaults
    };

    /**
     * Get field configuration for a specific field
     * @param {string} fieldName - Name of the field
     * @returns {Object} Field configuration
     */
    const getFieldConfig = (fieldName) => {
      return {
        name: fieldName,
        isValid: validFields.includes(fieldName),
        isSearchable: searchableFields.includes(fieldName),
        isArray: arrayFields.includes(fieldName),
        isRequired: requiredFields.includes(fieldName),
        type: arrayFields.includes(fieldName) ? 'array' : 'string'
      };
    };

    /**
     * Get all field configurations
     * @returns {Array} Array of field configurations
     */
    const getAllFieldConfigs = () => {
      return validFields.map(fieldName => getFieldConfig(fieldName));
    };

    /**
     * Get searchable field configurations
     * @returns {Array} Array of searchable field configurations
     */
    const getSearchableFieldConfigs = () => {
      return searchableFields.map(fieldName => getFieldConfig(fieldName));
    };

    /**
     * Get required field configurations
     * @returns {Array} Array of required field configurations
     */
    const getRequiredFieldConfigs = () => {
      return requiredFields.map(fieldName => getFieldConfig(fieldName));
    };

    /**
     * Get array field configurations
     * @returns {Array} Array of array field configurations
     */
    const getArrayFieldConfigs = () => {
      return arrayFields.map(fieldName => getFieldConfig(fieldName));
    };

    /**
     * Validate field name
     * @param {string} fieldName - Name of the field to validate
     * @returns {boolean} Whether the field is valid
     */
    const isValidField = (fieldName) => {
      return validFields.includes(fieldName);
    };

    /**
     * Validate multiple field names
     * @param {Array} fieldNames - Array of field names to validate
     * @returns {Object} Validation result with valid and invalid fields
     */
    const validateFields = (fieldNames) => {
      const valid = [];
      const invalid = [];

      fieldNames.forEach(fieldName => {
        if (isValidField(fieldName)) {
          valid.push(fieldName);
        } else {
          invalid.push(fieldName);
        }
      });

      return { valid, invalid };
    };

    /**
     * Get configuration summary
     * @returns {Object} Configuration summary
     */
    const getConfigSummary = () => {
      return {
        schemaName,
        totalFields: validFields.length,
        searchableFields: searchableFields.length,
        arrayFields: arrayFields.length,
        requiredFields: requiredFields.length,
        config: defaultConfig
      };
    };

    /**
     * Get field type for a specific field
     * @param {string} fieldName - Name of the field
     * @returns {string} Field type
     */
    const getFieldType = (fieldName) => {
      if (arrayFields.includes(fieldName)) {
        return 'array';
      }
      if (fieldName === 'introductions' || fieldName.endsWith('_introductions')) {
        return 'text'; // Special handling for introductions
      }
      return 'string';
    };

    /**
     * Get field validation rules
     * @param {string} fieldName - Name of the field
     * @returns {Object} Validation rules
     */
    const getFieldValidationRules = (fieldName) => {
      const fieldConfig = getFieldConfig(fieldName);
      
      return {
        required: fieldConfig.isRequired,
        type: fieldConfig.type,
        searchable: fieldConfig.isSearchable,
        array: fieldConfig.isArray
      };
    };

    return {
      // Configuration
      config: defaultConfig,
      
      // Field utilities
      getFieldConfig,
      getAllFieldConfigs,
      getSearchableFieldConfigs,
      getRequiredFieldConfigs,
      getArrayFieldConfigs,
      getFieldType,
      getFieldValidationRules,
      
      // Validation utilities
      isValidField,
      validateFields,
      
      // Summary
      getConfigSummary,
      
      // Raw data
      validFields,
      searchableFields,
      arrayFields,
      requiredFields,
      schemaName
    };
  }, [schemaName, validFields, searchableFields, arrayFields, requiredFields, defaults]);

  return schemaConfig;
} 
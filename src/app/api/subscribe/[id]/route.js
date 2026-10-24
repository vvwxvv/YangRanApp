import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { subscribeApiConfig } from '@/app/api/_config/subscribe_api_config';

// Create subscribe-specific configuration for API ID shell
// Extends centralized config with custom hooks
const subscribeIdApiConfig = {
  // Use centralized config as base
  collectionName: subscribeApiConfig.collectionName,
  validFields: ['id', ...subscribeApiConfig.validFields], // Add 'id' for API responses
  arrayFields: subscribeApiConfig.arrayFields,
  enableSoftDelete: subscribeApiConfig.enableSoftDelete,
  enableAutoFillArtist: subscribeApiConfig.enableAutoFillArtist,
  customValidation: subscribeApiConfig.customValidation,
  
  // Custom hooks for subscribe-specific processing
  beforeUpdate: subscribeApiConfig.beforeUpdate,
  
  // Custom response transformation
  transformResponse: async (data) => {
    // Only return valid fields
    const filtered = {};
    subscribeIdApiConfig.validFields.forEach(field => {
      if (data[field] !== undefined) {
        filtered[field] = data[field];
      }
    });
    return filtered;
  }
};

// Create API handlers using the API ID shell
const handlers = createApiIdHandler(subscribeIdApiConfig);

// Export handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

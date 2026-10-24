import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { userApiConfig } from '@/app/api/_config/user_api_config';

// Create user-specific configuration for API ID shell
// Extends centralized config with custom hooks
const userIdApiConfig = {
  // Use centralized config as base
  collectionName: userApiConfig.collectionName,
  validFields: ['id', ...userApiConfig.validFields], // Add 'id' for API responses
  arrayFields: userApiConfig.arrayFields,
  enableSoftDelete: userApiConfig.enableSoftDelete,
  enableAutoFillArtist: userApiConfig.enableAutoFillArtist,
  customValidation: userApiConfig.customValidation,
  
  // Custom hooks for user-specific processing
  beforeUpdate: userApiConfig.beforeUpdate,
  
  // Custom response transformation to exclude password
  transformResponse: userApiConfig.transformResponse
};

// Create API handlers using the API ID shell
const handlers = createApiIdHandler(userIdApiConfig);

// Export handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

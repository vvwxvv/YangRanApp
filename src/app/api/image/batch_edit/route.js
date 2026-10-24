import { createBatchApiHandler } from '@/app/api/_lib/batch_api_shell';
import { imageApiConfig } from '@/app/api/_config/image_api_config';

// Image batch configuration - uses centralized config
const imageBatchConfig = {
  // Use centralized config
  ...imageApiConfig,
  
  // Add 'id' to validFields for batch operations
  validFields: ['id', ...imageApiConfig.validFields],
  
  // Use the beforeBatchUpdate hook from centralized config
  beforeBatchUpdate: imageApiConfig.beforeBatchUpdate,
  
  // Custom response transformation to remove timestamps
  transformResponse: async (data) => {
    // Remove timestamp fields from response
    return data.map(item => {
      const { createdAt, updatedAt, ...rest } = item;
      Object.keys(rest).forEach(key => {
        if (key.toLowerCase().includes('timestamp')) {
          delete rest[key];
        }
      });
      return rest;
    });
  }
};

// Create batch API handlers using the batch API shell
const handlers = createBatchApiHandler(imageBatchConfig);

// Export handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;

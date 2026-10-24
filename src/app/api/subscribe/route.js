// app/api/subscribe/route.js - Subscribe API using the API Shell

import { createApiHandler } from '@/app/api/_lib/api_shell';
import { subscribeApiConfig } from '@/app/api/_config/subscribe_api_config';

// Use centralized config with additional lifecycle hooks
const subscribeConfig = {
  ...subscribeApiConfig,
  
  // Additional lifecycle hooks
  afterCreate: async (data, result) => {
    console.log('Subscribe - Created with ID:', result.insertedId);
    // Could trigger notifications, welcome emails, etc.
  },
  
  afterUpdate: async (id, data, result) => {
    console.log('Subscribe - Updated:', id);
  },
  
  beforeDelete: async (id) => {
    console.log('Subscribe - Before delete:', id);
  },
  
  afterDelete: async (id, result) => {
    console.log('Subscribe - Deleted:', id);
  }
};

// Create API handlers
const handlers = createApiHandler(subscribeConfig);

// Export handlers
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

// app/api/users/route.js - User API using the API Shell with bcrypt functionality

import { createApiHandler } from '@/app/api/_lib/api_shell';
import { userApiConfig } from '@/app/api/_config/user_api_config';

// Use centralized config with additional lifecycle hooks
const userConfig = {
  ...userApiConfig,
  
  // Additional lifecycle hooks
  afterCreate: async (data, result) => {
    console.log('User - Created with ID:', result.insertedId);
    // Could trigger notifications, webhooks, etc.
  },
  
  afterUpdate: async (id, data, result) => {
    console.log('User - Updated:', id);
  },
  
  beforeDelete: async (id) => {
    console.log('User - Before delete:', id);
  },
  
  afterDelete: async (id, result) => {
    console.log('User - Deleted:', id);
  }
};

// Create API handlers
const handlers = createApiHandler(userConfig);

// Export handlers
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
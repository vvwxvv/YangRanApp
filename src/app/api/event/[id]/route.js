// app/api/event/[id]/route.js - Event API handler for single item operations

import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { eventApiConfig } from '@/app/api/_config/event_api_config';

// Create handlers using the factory with event configuration
const handlers = createApiIdHandler(eventApiConfig);

// Export the generated handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
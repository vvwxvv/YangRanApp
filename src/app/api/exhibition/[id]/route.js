// app/api/exhibition/[id]/route.js - exhibition API handler for single item operations

import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { exhibitionApiConfig } from '@/app/api/_config/exhibition_api_config';

// Create handlers using the factory with exhibition configuration
const handlers = createApiIdHandler(exhibitionApiConfig);

// Export the generated handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
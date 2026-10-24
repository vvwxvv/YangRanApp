import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { imageApiConfig } from '@/app/api/_config/image_api_config';

// Create handlers using the factory with image configuration
const handlers = createApiIdHandler(imageApiConfig);

// Export the generated handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { webApiConfig } from '@/app/api/_config/web_api_config';

// Create handlers using the factory with web configuration
const handlers = createApiIdHandler(webApiConfig);

// Export the generated handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

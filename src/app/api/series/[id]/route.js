import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { seriesApiConfig } from '@/app/api/_config/series_api_config';

// Create handlers using the factory with series configuration
const handlers = createApiIdHandler(seriesApiConfig);

// Export the generated handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

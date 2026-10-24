import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { writingApiConfig } from '@/app/api/_config/writing_api_config';

// Create handlers using the factory with writing configuration
const handlers = createApiIdHandler(writingApiConfig);

// Export the generated handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

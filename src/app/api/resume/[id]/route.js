import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { resumeApiConfig } from '@/app/api/_config/resume_api_config';

// Create handlers using the factory with resume configuration
const handlers = createApiIdHandler(resumeApiConfig);

// Export the generated handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

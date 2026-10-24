import { createApiIdHandler } from '@/app/api/_lib/api_id_shell';
import { videoApiConfig } from '@/app/api/_config/video_api_config';

// Create handlers using the factory with video configuration
const handlers = createApiIdHandler(videoApiConfig);

// Export the generated handlers
export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

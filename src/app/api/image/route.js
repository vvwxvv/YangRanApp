import { createApiHandler } from '@/app/api/_lib/api_shell';
import { imageApiConfig } from '@/app/api/_config/image_api_config';

const handlers = createApiHandler(imageApiConfig);

// Export handlers directly like image route does
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
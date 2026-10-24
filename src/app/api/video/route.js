import { createApiHandler } from '@/app/api/_lib/api_shell';
import { videoApiConfig } from '@/app/api/_config/video_api_config';

const handlers = createApiHandler(videoApiConfig);

// Export handlers directly like web route does
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
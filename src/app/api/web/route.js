import { createApiHandler } from '@/app/api/_lib/api_shell';
import { webApiConfig } from '@/app/api/_config/web_api_config';

const handlers = createApiHandler(webApiConfig);

// Export handlers directly like web route does
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
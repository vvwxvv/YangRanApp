import { createApiHandler } from '@/app/api/_lib/api_shell';
import { eventApiConfig } from '@/app/api/_config/event_api_config';

// Create API handlers using the centralized configuration
const handlers = createApiHandler(eventApiConfig);

// Override handlers to remove cache
const noCacheResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
};

export const GET = async (request) => {
  const response = await handlers.GET(request);
  const data = await response.json();
  return noCacheResponse(data, response.status);
};

export const POST = async (request) => {
  const response = await handlers.POST(request);
  const data = await response.json();
  return noCacheResponse(data, response.status);
};

export const PUT = async (request) => {
  const response = await handlers.PUT(request);
  const data = await response.json();
  return noCacheResponse(data, response.status);
};

export const DELETE = async (request) => {
  const response = await handlers.DELETE(request);
  const data = await response.json();
  return noCacheResponse(data, response.status);
};
// app/api/bibliography/route.js
import { createApiHandler } from '@/app/api/_lib/api_shell';
import { bibliographyApiConfig } from '@/app/api/_config/bibliography_api_config';

// 使用集中配置创建 API 处理器
const handlers = createApiHandler(bibliographyApiConfig);

// 覆盖所有处理方法，强制禁用缓存
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
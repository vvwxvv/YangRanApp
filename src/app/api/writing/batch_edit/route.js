import { PrismaClient } from '@prisma/client';
import { writingApiConfig } from '@/app/api/_config/writing_api_config';
import { createBatchApiHandler } from '@/app/api/_lib/batch_api_shell';

const prisma = new PrismaClient();

// No-cache response helper
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

// Configuration (extend if needed)
const CONF = {
  collectionName: writingApiConfig.collectionName || '',
  requiredFields: writingApiConfig.requiredFields || [],
  uniqueFields: writingApiConfig.uniqueFields || [],
  validFields: writingApiConfig.validFields || [],
  arrayFields: writingApiConfig.arrayFields || [],
  enableSoftDelete: false,
  beforeBatchUpdate: null,
  afterBatchUpdate: null,
  customValidation: null,
  transformResponse: null,
  ...writingApiConfig
};

const { GET: shellGET, PUT: shellPUT, POST: shellPOST, DELETE: shellDELETE } = createBatchApiHandler(writingApiConfig);

export async function PUT(request) {
  const response = await shellPUT(request);
  const data = await response.json();
  return noCacheResponse(data, response.status);
}

export async function POST(request) {
  const response = await shellPOST(request);
  const data = await response.json();
  return noCacheResponse(data, response.status);
}

export async function DELETE(request) {
  const response = await shellDELETE(request);
  const data = await response.json();
  return noCacheResponse(data, response.status);
}

export async function GET() {
  const response = await shellGET();
  const data = await response.json();
  return noCacheResponse(data, response.status);
}
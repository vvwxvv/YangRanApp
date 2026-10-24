import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getCurrentFormattedDate } from '@/utils/dateFormatter';
import { resumeApiConfig } from '@/app/api/_config/resume_api_config';

// MongoDB connection setup
const uri = process.env.MONGODB_URL || '';
const dbName = process.env.MONGODB_DB || '';
const collectionName = resumeApiConfig.collectionName;

if (!uri || !dbName) {
  throw new Error('Please define MONGODB_URL and MONGODB_DB environment variables');
}

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }
    cachedDb = cachedClient.db(dbName);
    return cachedDb;
  } catch (error) {
    console.log('MongoDB connection error:', error);
    throw error;
  }
}

// Helper functions
function sanitizeData(data) {
  const sanitized = {};
  Object.entries(data).forEach(([key, value]) => {
    // Only allow schema fields from config
    if (!resumeApiConfig.validFields.includes(key)) return;

    // Handle array fields (introduction)
    if (resumeApiConfig.arrayFields.includes(key)) {
      if (Array.isArray(value)) {
        sanitized[key] = value.map(item => String(item).trim()).filter(item => item.length > 0);
      } else if (typeof value === 'string' && value.trim() !== '') {
        // 支持逗号分隔字符串
        sanitized[key] = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
      } else {
        sanitized[key] = [];
      }
    } else {
      // 对字符串字段 trim（可选，但保留原值）
      if (typeof value === 'string') {
        sanitized[key] = value.trim() || null;
      } else {
        sanitized[key] = value;
      }
    }
  });
  return sanitized;
}

function validateRequiredFields(data) {
  const missingFields = resumeApiConfig.requiredFields.filter(
    field => !data[field] || data[field] === ''
  );
  return { valid: missingFields.length === 0, missingFields };
}

// PUT - Batch update multiple items
export async function PUT(request) {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);
    const body = await request.json();

    // 适配不同的请求体格式：原代码中使用 { about: [...] }，现在更通用地使用 { items: [...] } 或直接数组
    let items = body;
    if (body.items && Array.isArray(body.items)) {
      items = body.items;
    } else if (body.resume && Array.isArray(body.resume)) {
      items = body.resume;
    } else if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array or object with "items" or "resume" array.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array.' },
        { status: 400 }
      );
    }

    const updatePromises = [];
    const errors = [];

    for (const item of items) {
      if (!item.id) {
        errors.push({ item, error: 'Missing id field' });
        continue;
      }

      try {
        const { id, ...updateData } = item;

        // 移除 autoFillArtist（不再需要）
        const sanitized = sanitizeData(updateData);

        // Validate required fields
        const validation = validateRequiredFields(sanitized);
        if (!validation.valid) {
          errors.push({
            id,
            error: 'Missing required fields',
            fields: validation.missingFields
          });
          continue;
        }

        // Update the entry
        sanitized.updatedAt = getCurrentFormattedDate();
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: sanitized }
        );
        updatePromises.push(result);
      } catch (error) {
        errors.push({ id: item.id, error: error.message });
      }
    }

    const results = await Promise.all(updatePromises);
    const successCount = results.filter(r => r.modifiedCount > 0).length;

    return NextResponse.json({
      message: 'Batch update completed',
      success: successCount,
      errors: errors.length > 0 ? errors : undefined,
      total: updatePromises.length
    });

  } catch (error) {
    console.log('Batch update error:', error);
    return NextResponse.json(
      { error: 'Failed to perform batch update', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Health check
export async function GET() {
  return NextResponse.json({
    message: 'Batch update endpoint for Resume',
    method: 'PUT',
    expectedBody: '{ "items": [{ id: "...", artist: "...", year: "...", ... }] } or [{ ... }]'
  });
}

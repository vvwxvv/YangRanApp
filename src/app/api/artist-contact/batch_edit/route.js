import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getCurrentFormattedDate } from '@/utils/dateFormatter';
import { ArtistContactApiConfig } from '@/app/api/_config/artist_contact_api_config';

// MongoDB connection setup
const uri = process.env.MONGODB_URL || '';
const dbName = process.env.MONGODB_DB || '';
const collectionName = ArtistContactApiConfig.collectionName;

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
    if (!ArtistContactApiConfig.validFields.includes(key)) return;

    // Handle array fields
    if (ArtistContactApiConfig.arrayFields.includes(key)) {
      if (Array.isArray(value)) {
        sanitized[key] = value.map(String);
      } else if (typeof value === 'string' && value.trim() !== '') {
        sanitized[key] = value.split('\n').filter(item => item.trim().length > 0);
      } else {
        sanitized[key] = [];
      }
    } else {
      sanitized[key] = value;
    }
  });
  return sanitized;
}

function validateRequiredFields(data) {
  const missingFields = ArtistContactApiConfig.requiredFields.filter(
    field => !data[field] || data[field] === ''
  );
  return { valid: missingFields.length === 0, missingFields };
}

// PUT - Batch update multiple items
export async function PUT(request) {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);
    const { ArtistContacts } = await request.json();

    if (!Array.isArray(ArtistContacts)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array under "ArtistContacts" key.' },
        { status: 400 }
      );
    }

    const updatePromises = [];
    const errors = [];

    for (const item of ArtistContacts) {
      if (!item.id) {
        errors.push({ item, error: 'Missing id field' });
        continue;
      }

      try {
        const { id, ...updateData } = item;

        // 如果配置了自动填充，可在此调用（本例未使用 autoFillArtist）
        // 但根据需要可保留或移除
        // const dataWithArtist = autoFillArtist(updateData, updateData.language || 'EN');

        // 对数据进行预处理（例如补充 URL 协议等）
        // 注意：beforeCreate/beforeUpdate 逻辑应在业务层完成，此处仅做基础清洗
        // 但建议在调用此 API 前已完成，或者直接在此处调用配置的 beforeUpdate？
        // 为简化，仅执行 sanitizeData，复杂的预处理可在前端或服务层完成。
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

        // Update the Artist Contact entry
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
    message: 'Batch update endpoint for Artist Contacts',
    method: 'PUT',
    expectedBody: '{ "ArtistContacts": [{ id: "...",artist_name: "...", email: "...", ... }, ...] }'
  });
}
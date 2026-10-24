import {NextResponse} from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentFormattedDate } from '@/utils/dateFormatter';
import { webApiConfig } from '@/app/api/_config/web_api_config';

// Utility functions
const getCollection = async () => {
  const { MongoClient } = await import('mongodb');
  const uri = process.env.MONGODB_URL || '';
  const dbName = process.env.MONGODB_DB || '';
  
  if (!uri || !dbName) {
    throw new Error('Please define MONGODB_URL and MONGODB_DB environment variables');
  }
  
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return db.collection(webApiConfig.collectionName);
};

const sanitizeData = (data) => {
  const sanitized = {};
  Object.entries(data).forEach(([key, value]) => {
    // Only allow schema fields from config
    if (!webApiConfig.validFields.includes(key)) return;
    sanitized[key] = value;
  });
  return sanitized;
};

// PUT - Batch update multiple items
export async function PUT(request) {
  try {
    const collection = await getCollection();
    const { web } = await request.json();

    if (!Array.isArray(web)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array.' },
        { status: 400 }
      );
    }

    const updatePromises = [];
    const errors = [];

    for (const item of web) {
      if (!item.id) {
        errors.push({ item, error: 'Missing id field' });
        continue;
      }

      try {
        const { id, ...updateData } = item;
        const sanitized = sanitizeData(updateData);

        // Validate required fields
        if (webApiConfig.requiredFields && webApiConfig.requiredFields.length > 0) {
          const missingFields = webApiConfig.requiredFields.filter(field => !sanitized[field]);
          if (missingFields.length > 0) {
            errors.push({
              id,
              error: 'Missing required fields',
              fields: missingFields
            });
            continue;
          }
        }

        // Update the web item
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
    message: 'Batch update endpoint for web',
    method: 'PUT',
    expectedBody: '{ "web": [{ id: "...", web_url: "...", tag_en: "...", tag_cn: "...", type: "...", order: "..." }, ...] }'
  });
}
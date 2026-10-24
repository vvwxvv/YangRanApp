import {NextResponse} from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentFormattedDate } from '@/utils/dateFormatter';
import { videoApiConfig } from '@/app/api/_config/video_api_config';

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
  return db.collection(videoApiConfig.collectionName);
};

const sanitizeData = (data) => {
  const sanitized = {};
  Object.entries(data).forEach(([key, value]) => {
    // Only allow schema fields from config
    if (!videoApiConfig.validFields.includes(key)) return;
    sanitized[key] = value;
  });
  return sanitized;
};

// PUT - Batch update multiple items
export async function PUT(request) {
  try {
    const collection = await getCollection();
    const { video } = await request.json();

    if (!Array.isArray(video)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array.' },
        { status: 400 }
      );
    }

    const updatePromises = [];
    const errors = [];

    for (const item of video) {
      if (!item.id) {
        errors.push({ item, error: 'Missing id field' });
        continue;
      }

      try {
        const { id, ...updateData } = item;
        const sanitized = sanitizeData(updateData);

        // Validate required fields
        if (videoApiConfig.requiredFields && videoApiConfig.requiredFields.length > 0) {
          const missingFields = videoApiConfig.requiredFields.filter(field => !sanitized[field]);
          if (missingFields.length > 0) {
            errors.push({
              id,
              error: 'Missing required fields',
              fields: missingFields
            });
            continue;
          }
        }

        // Update the video
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
    message: 'Batch update endpoint for video',
    method: 'PUT',
    expectedBody: '{ "video": [{ id: "...", field1: "...", field2: "..." }, ...] }'
  });
}
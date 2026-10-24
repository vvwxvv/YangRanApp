import {NextResponse} from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getCurrentFormattedDate } from '@/utils/dateFormatter';
import bcrypt from 'bcryptjs';
import { userApiConfig } from '@/app/api/_config/user_api_config';

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
  return db.collection(userApiConfig.collectionName);
};

const sanitizeData = (data) => {
  const sanitized = {};
  Object.entries(data).forEach(([key, value]) => {
    // Only allow schema fields from config
    if (!userApiConfig.validFields.includes(key)) return;
    sanitized[key] = value;
  });
  return sanitized;
};

// PUT - Batch update multiple items
export async function PUT(request) {
  try {
    const collection = await getCollection();
    const { users } = await request.json();

    if (!Array.isArray(users)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array.' },
        { status: 400 }
      );
    }

    const updatePromises = [];
    const errors = [];

    for (const item of users) {
      if (!item.id) {
        errors.push({ item, error: 'Missing id field' });
        continue;
      }

      try {
        const { id, ...updateData } = item;
        
        // Process username and email fields (trim and normalize)
        if (updateData.username) {
          updateData.username = updateData.username.trim();
        }
        if (updateData.email) {
          updateData.email = updateData.email.trim().toLowerCase();
        }
        
        // Hash password if provided
        if (updateData.password) {
          updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        
        const sanitized = sanitizeData(updateData);

        // Validate required fields
        if (userApiConfig.requiredFields && userApiConfig.requiredFields.length > 0) {
          const missingFields = userApiConfig.requiredFields.filter(field => !sanitized[field]);
          if (missingFields.length > 0) {
            errors.push({
              id,
              error: 'Missing required fields',
              fields: missingFields
            });
            continue;
          }
        }

        // Update the user
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
    message: 'Batch update endpoint for users',
    method: 'PUT',
    expectedBody: '{ "users": [{ id: "...", field1: "...", field2: "..." }, ...] }'
  });
}

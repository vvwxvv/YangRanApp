import {NextResponse} from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getCurrentFormattedDate } from '@/utils/dateFormatter';
import { autoFillArtist } from '@/utils/artistUtils';
import { aboutApiConfig } from '@/app/api/_config/about_api_config';

// MongoDB connection setup
const uri = process.env.MONGODB_URL || '';
const dbName = process.env.MONGODB_DB || '';
const collectionName = aboutApiConfig.collectionName;

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
    if (!aboutApiConfig.validFields.includes(key)) return;
    
    // Handle array fields
    if (aboutApiConfig.arrayFields.includes(key)) {
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
  const missingFields = aboutApiConfig.requiredFields.filter(
    field => !data[field] || data[field] === ''
  );
  return { valid: missingFields.length === 0, missingFields };
}

// PUT - Batch update multiple items
export async function PUT(request) {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);
    const { about } = await request.json();

    if (!Array.isArray(about)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array.' },
        { status: 400 }
      );
    }

    const updatePromises = [];
    const errors = [];

    for (const item of about) {
      if (!item.id) {
        errors.push({ item, error: 'Missing id field' });
        continue;
      }

      try {
        const { id, ...updateData } = item;
        
        // Ensure language is set before auto-fill
        const dataWithLanguage = {
          ...updateData,
          language: updateData.language || 'EN'
        };
        
        // Auto-fill artist field if this is an Artist web
        const dataWithArtist = autoFillArtist(dataWithLanguage, dataWithLanguage.language);
        
        const sanitized = sanitizeData(dataWithArtist);

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

        // Update the about entry
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
    message: 'Batch update endpoint for about',
    method: 'PUT',
    expectedBody: '{ "about": [{ id: "...", field1: "...", field2: "..." }, ...] }'
  });
}

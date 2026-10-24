import {NextResponse} from 'next/server';
import { invalidateListCache } from '@/app/api/_lib/list_cache';
import { MongoClient, ObjectId } from 'mongodb';
import { exhibitionApiConfig } from '@/app/api/_config/exhibition_api_config';

const uri = process.env.MONGODB_URL || '';
const dbName = process.env.MONGODB_DB || '';
const collectionName = exhibitionApiConfig.collectionName;

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  // Shared client + single connect for the whole server (see _lib/mongo.js).
  const { getDb } = await import('@/app/api/_lib/mongo');
  return getDb();
}

export async function POST(request) {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);

    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: 'orderedIds must be a non-empty array' }, { status: 400 });
    }

    // Update each exhibition's order field as string (Note: order field not in Prisma exhibition model)
    // This might need to be removed or handled differently based on your requirements
    await Promise.all(
      orderedIds.map((id, idx) =>
        collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { order: String(idx + 1) } }
        )
      )
    );

    invalidateListCache(collectionName);
    return NextResponse.json({ success: true, updated: orderedIds.length }, { status: 200 });
  } catch (error) {
    console.log('Error updating exhibition order:', error, error?.message || '');
    return NextResponse.json({ error: 'Failed to update exhibition order.', details: error?.message || error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);

    // Fetch all exhibitions sorted by 'order' (ascending, as string)
    // Note: order field not in Prisma exhibition model - might need to sort by year or date instead
    const exhibitions = await collection.find().sort({ order: 1 }).toArray();
    return NextResponse.json(exhibitions, { status: 200 });
  } catch (error) {
    console.log('Failed to fetch exhibitions for reorder:', error);
    return NextResponse.json({ message: 'Failed to fetch exhibitions', error: error.message }, { status: 500 });
  }
}

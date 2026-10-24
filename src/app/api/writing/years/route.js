// app/api/writing/years/route.ts
import {NextResponse} from 'next/server';
import { MongoClient } from 'mongodb';

/**
 * Ultra-fast years endpoint - bypasses apiShell to use aggregation pipeline
 * This endpoint ONLY loads year values, not full documents
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const debug = searchParams.get('debug') === 'true';
    
    const uri = process.env.MONGODB_URL || '';
    const dbName = process.env.MONGODB_DB || '';
    
    if (!uri || !dbName) {
      throw new Error('MongoDB environment variables not configured');
    }
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    
    // Debug mode: show sample documents
    if (debug) {
      const sample = await db.collection('Writing')
        .find({ category: { $in: ['梦志', 'Dream Journal'] } })
        .limit(3)
        .project({ title: 1, category: 1, year: 1, _id: 0 })
        .toArray();
      
      await client.close();
      return NextResponse.json({ 
        debug: true,
        sampleDocs: sample,
        message: 'Remove ?debug=true to get normal response'
      });
    }
    
    // Use aggregation pipeline - processes everything in MongoDB
    const years = await db.collection('Writing')
      .aggregate([
        // 1. Filter by category (uses index if available)
        {
          $match: {
            category: { $in: ['梦志', 'Dream Journal'] },
            year: { $exists: true, $ne: null }
          }
        },
        // 2. Project ONLY year field (critical: no full docs loaded)
        {
          $project: { year: 1, _id: 0 }
        },
        // 3. Group to get unique years (deduplication in MongoDB)
        {
          $group: {
            _id: '$year'
          }
        },
        // 4. Sort ascending
        {
          $sort: { _id: 1 }
        }
      ])
      .toArray();

    // Convert to simple number array
    const uniqueYears = years
      .map(item => Number(item._id))
      .filter(y => y > 0);

    // Close connection
    await client.close();

    return NextResponse.json(uniqueYears);
    
  } catch (error) {
    console.log('Error fetching years:', error);
    return NextResponse.json(
      { error: 'Failed to fetch years' },
      { status: 500 }
    );
  }
}

// Note: This endpoint intentionally does NOT use createApiHandler
// because we need aggregation pipeline for performance.
// The apiShell would load all full documents first, then filter in Node.js.
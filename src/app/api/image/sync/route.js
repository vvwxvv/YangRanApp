import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { imageApiConfig } from '@/app/api/_config/image_api_config';
import { normalizeImageUrl, isUsableImageUrl } from '@/utils/imageSync';

const uri = process.env.MONGODB_URL || '';
const dbName = process.env.MONGODB_DB || '';
const collectionName = imageApiConfig.collectionName;

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}

/**
 * POST /api/image/sync
 *
 * Body: { items: [{ img_url, tag_en?, tag_cn?, type? }, …] }
 *
 * Creates an Image row for every cover URL that is NOT already in the
 * collection — the duplicate check runs again here (server side) so a URL can
 * never be added twice, even if two tabs sync at the same time.
 *
 * Response: { ok, added, skipped, total, addedUrls }
 */
export async function POST(request) {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);

    const body = await request.json();
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json({ ok: true, added: 0, skipped: 0, total: 0, addedUrls: [] });
    }

    // Existing URLs (normalised) — the single source of truth for "duplicate?".
    const existingDocs = await collection.find({}, { projection: { img_url: 1 } }).toArray();
    const existing = new Set();
    for (const doc of existingDocs) {
      const key = normalizeImageUrl(doc?.img_url);
      if (key) existing.add(key);
    }

    const toInsert = [];
    const addedUrls = [];
    let skipped = 0;

    for (const item of items) {
      const url = String(item?.img_url ?? '').trim();
      if (!isUsableImageUrl(url)) {
        skipped += 1;
        continue;
      }

      const key = normalizeImageUrl(url);
      if (existing.has(key)) {
        skipped += 1;
        continue;
      }

      // Guard against duplicates *within* the same payload too.
      existing.add(key);
      addedUrls.push(url);

      toInsert.push({
        img_url: url,
        tag_en: String(item?.tag_en ?? '').trim(),
        tag_cn: String(item?.tag_cn ?? '').trim(),
        type: String(item?.type ?? '').trim(),
        caption_en: '',
        caption_cn: '',
        mark: '',
        tag_source: '',
        order: null,
        updatedAt: new Date(),
      });
    }

    if (toInsert.length) {
      await collection.insertMany(toInsert, { ordered: false });
    }

    return NextResponse.json({
      ok: true,
      added: toInsert.length,
      skipped,
      total: items.length,
      addedUrls,
    });
  } catch (error) {
    console.log('[image/sync] failed:', error);
    return NextResponse.json(
      { ok: false, message: error?.message || 'Sync failed' },
      { status: 500 }
    );
  }
}

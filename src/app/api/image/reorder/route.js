import { NextResponse } from 'next/server';
import { invalidateListCache } from '@/app/api/_lib/list_cache';
import { MongoClient, ObjectId } from 'mongodb';
import { imageApiConfig } from '@/app/api/_config/image_api_config';
import { normalizeImageOrder } from '@/utils/mediaOrder';

const uri = process.env.MONGODB_URL || '';
const dbName = process.env.MONGODB_DB || '';
const collectionName = imageApiConfig.collectionName;

// Which sub-key of the JSON `order` the reorder route writes by default.
const DEFAULT_ORDER_KEY = 'artist_page_order';

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  // Shared client + single connect for the whole server (see _lib/mongo.js).
  const { getDb } = await import('@/app/api/_lib/mongo');
  return getDb();
}

// POST /api/image/reorder
// Body: { groups? | reorderedImages? | orderedIds?, orderKey?, clearIds? }
//   groups:          [[id,…], …]        — each inner array becomes 1..N for that group
//   orderedIds:      [id, …]            — index+1 becomes the value
//   reorderedImages: [{ _id|id, order }] — `order` is the value for orderKey
//   orderKey:        which sub-order to write (default artist_page_order)
//   clearIds:        [id, …]            — remove that sub-order (no position) for
//                                        these rows (used by "hidden" images)
export async function POST(request) {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);

    const body = await request.json();
    const { reorderedImages, orderedIds, groups, orderKey, clearIds } = body;
    const key = orderKey || DEFAULT_ORDER_KEY;

    const clearList = (Array.isArray(clearIds) ? clearIds : []).filter((id) =>
      ObjectId.isValid(id)
    );

    let pairs = [];
    if (Array.isArray(groups) && groups.length > 0) {
      // Per-group numbering: each inner array becomes 1..N for that group.
      for (const gIds of groups) {
        (Array.isArray(gIds) ? gIds : []).forEach((id, idx) =>
          pairs.push([id, String(idx + 1)])
        );
      }
    } else if (Array.isArray(reorderedImages) && reorderedImages.length > 0) {
      // `order` here may arrive as a JSON object (a caller echoing the record
      // back) — never String() it into "[object Object]"; fall back to index.
      pairs = reorderedImages.map((img, idx) => [
        img._id || img.id,
        typeof img.order === 'string' || typeof img.order === 'number'
          ? String(img.order)
          : String(idx + 1),
      ]);
    } else if (Array.isArray(orderedIds) && orderedIds.length > 0) {
      pairs = orderedIds.map((id, idx) => [id, String(idx + 1)]);
    } else if (clearList.length === 0) {
      return NextResponse.json(
        { message: 'groups, reorderedImages or orderedIds must be a non-empty array' },
        { status: 400 }
      );
    }

    // Merge into the existing JSON `order` object — read once, write once.
    const ids = [...pairs.map(([id]) => id), ...clearList]
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    const existingDocs = ids.length
      ? await collection
          .find({ _id: { $in: ids } }, { projection: { order: 1 } })
          .toArray()
      : [];
    const orderById = new Map(existingDocs.map((d) => [d._id.toString(), d.order]));

    const mergeOrder = (id, raw, mutate) => {
      const merged = normalizeImageOrder(raw);
      // Legacy numeric `order` (pre-JSON rows) — keep the value, don't drop it.
      if (typeof raw === 'number' && raw !== null) {
        if (!merged.artist_page_order) merged.artist_page_order = String(raw);
      }
      mutate(merged);
      // Never store an object / "[object Object]" as a position.
      for (const k of Object.keys(merged)) {
        const v = merged[k];
        merged[k] = v === null || v === undefined || typeof v === 'object' || String(v).trim() === '[object Object]'
          ? null
          : String(v).trim();
      }
      // No position left anywhere → store null instead of an empty object.
      const hasValue = Object.values(merged).some(
        (v) => v !== null && v !== undefined && String(v).trim() !== ''
      );
      return hasValue ? merged : null;
    };

    const ops = pairs
      .filter(([id]) => ObjectId.isValid(id))
      .map(([id, value]) => {
        const _id = new ObjectId(id);
        const raw = orderById.get(_id.toString());
        const next = mergeOrder(id, raw, (merged) => {
          merged[key] = value;
        });
        return { updateOne: { filter: { _id }, update: { $set: { order: next } } } };
      });

    // "Hidden" rows carry no position for this key.
    for (const id of clearList) {
      const _id = new ObjectId(id);
      const raw = orderById.get(_id.toString());
      const next = mergeOrder(id, raw, (merged) => {
        merged[key] = null;
      });
      ops.push({ updateOne: { filter: { _id }, update: { $set: { order: next } } } });
    }

    if (ops.length) await collection.bulkWrite(ops, { ordered: false });

    invalidateListCache(collectionName);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log('Reorder Error:', error);
    return NextResponse.json(
      { message: 'Failed to reorder images', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/image/reorder?orderKey=artist_page_order
export async function GET(request) {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('orderKey') || DEFAULT_ORDER_KEY;

    // Fetch all images sorted by the chosen order key (ascending)
    const images = await collection.find().sort({ [`order.${key}`]: 1 }).toArray();

    // Remove all timestamp fields from each image in the response
    const cleanedImages = images.map((item) => {
      const { createdAt, updatedAt, ...rest } = item;
      Object.keys(rest).forEach((k) => {
        if (k.toLowerCase().includes('timestamp')) {
          delete rest[k];
        }
      });
      return rest;
    });

    return NextResponse.json(cleanedImages, { status: 200 });
  } catch (error) {
    console.log('Failed to fetch images for reorder:', error);
    return NextResponse.json(
      { message: 'Failed to fetch images', error: error.message },
      { status: 500 }
    );
  }
}

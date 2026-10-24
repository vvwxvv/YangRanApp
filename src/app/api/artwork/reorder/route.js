import { NextResponse } from 'next/server';
import { invalidateListCache } from '@/app/api/_lib/list_cache';
import { MongoClient, ObjectId } from 'mongodb';
import { artworkApiConfig } from '@/app/api/_config/artwork_api_config';
import { normalizeArtworkOrder } from '@/utils/artworkOrder';

const uri = process.env.MONGODB_URL || '';
const dbName = process.env.MONGODB_DB || '';
const collectionName = artworkApiConfig.collectionName;

// Which sub-key of the JSON `order` the reorder route writes by default.
const DEFAULT_ORDER_KEY = 'artist_page_order';

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  // Shared client + single connect for the whole server (see _lib/mongo.js).
  const { getDb } = await import('@/app/api/_lib/mongo');
  return getDb();
}

// POST /api/artwork/reorder
// Body: { reorderedImages? | reorderedWorks? | orderedIds | groups, orderKey?, clearIds? }
//   groups:         [[id,…], …]           — each inner array becomes 1..N for that group
//   orderedIds:     [id, …]               — index+1 becomes the value for orderKey
//   reorderedWorks: [{ _id|id, order }]   — `order` is the value for orderKey
//   orderKey:       which per-page order to write (default artist_page_order)
//   clearIds:       [id, …]               — remove that page order (no position)
//                                           for these rows (used by "hidden" ones)
export async function POST(request) {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);

    const body = await request.json();
    const { orderedIds, groups, reorderedWorks, reorderedImages, orderKey, clearIds } = body;
    const key = orderKey || DEFAULT_ORDER_KEY;

    const clearList = (Array.isArray(clearIds) ? clearIds : []).filter((id) =>
      ObjectId.isValid(id)
    );

    let pairs = [];
    const explicit = reorderedWorks || reorderedImages;
    if (Array.isArray(groups) && groups.length > 0) {
      // Per-group numbering: each inner array becomes 1..N for that group.
      for (const gIds of groups) {
        (Array.isArray(gIds) ? gIds : []).forEach((id, idx) =>
          pairs.push([id, String(idx + 1)])
        );
      }
    } else if (Array.isArray(orderedIds) && orderedIds.length > 0) {
      pairs = orderedIds.map((id, idx) => [id, String(idx + 1)]);
    } else if (Array.isArray(explicit) && explicit.length > 0) {
      // `order` here may arrive as a JSON object (a caller echoing the record
      // back) — never String() it into "[object Object]"; fall back to the
      // list index instead.
      pairs = explicit.map((item, idx) => [
        item._id || item.id,
        typeof item.order === 'string' || typeof item.order === 'number'
          ? String(item.order)
          : String(idx + 1),
      ]);
    } else if (clearList.length === 0) {
      return NextResponse.json(
        { message: 'orderedIds or groups must be a non-empty array' },
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

    const mergeOrder = (raw, mutate) => {
      const merged = normalizeArtworkOrder(raw);
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
        const next = mergeOrder(raw, (merged) => {
          merged[key] = value;
        });
        return { updateOne: { filter: { _id }, update: { $set: { order: next } } } };
      });

    // "Hidden" rows carry no position for this key.
    for (const id of clearList) {
      const _id = new ObjectId(id);
      const raw = orderById.get(_id.toString());
      const next = mergeOrder(raw, (merged) => {
        merged[key] = null;
      });
      ops.push({ updateOne: { filter: { _id }, update: { $set: { order: next } } } });
    }

    if (ops.length) await collection.bulkWrite(ops, { ordered: false });

    invalidateListCache(collectionName);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log('Artwork reorder error:', error);
    return NextResponse.json(
      { message: 'Failed to reorder artworks', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/artwork/reorder?orderKey=artist_page_order
export async function GET(request) {
  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('orderKey') || DEFAULT_ORDER_KEY;

    const artworks = await collection.find().sort({ [`order.${key}`]: 1 }).toArray();

    // Normalise _id → id (the reorder page reads item.id || item._id)
    const data = artworks.map((item) => {
      const { _id, ...rest } = item;
      return { ...rest, id: _id ? _id.toString() : item.id, _id: _id ? _id.toString() : item.id };
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log('Failed to fetch artworks for reorder:', error);
    return NextResponse.json(
      { message: 'Failed to fetch artworks', error: error.message },
      { status: 500 }
    );
  }
}

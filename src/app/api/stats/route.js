// app/api/stats/route.js
//
// One request that returns the record count of every manager collection.
//
// Why a dedicated route: the manager footer shows "what is in the archive"
// (the menu already covers where to go). Doing that from the client meant N
// requests — one per /api/<entity> — each returning full documents just to
// call `.length`. Here the counts happen server-side and only numbers cross the
// wire.
//
// Cost control matters on this cluster:
//   • counts run SEQUENTIALLY, not as 14 parallel queries;
//   • the result is cached for 60s (the footer is on every manager page);
//   • a stale value is served if the cluster errors, so the footer never
//     blocks a page;
//   • `estimatedDocumentCount()` is used: it reads collection metadata instead
//     of scanning. These collections are small and append-mostly, so the number
//     is accurate in practice and an order of magnitude cheaper.

import { NextResponse } from 'next/server';
import { getDb } from '@/app/api/_lib/mongo';

export const dynamic = 'force-dynamic';

const NO_STORE = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

/** manager key → Mongo collection (matches src/app/api/_config/*). */
const STATS_COLLECTIONS = {
  about: 'About',
  'artist-contact': 'ArtistContact',
  artwork: 'Artwork',
  bibliography: 'Bibliography',
  enquire: 'Enquire',
  event: 'Event',
  exhibition: 'Exhibition',
  image: 'Image',
  resume: 'Resume',
  series: 'Series',
  subscribe: 'Subscribe',
  video: 'Video',
  web: 'Web',
  writing: 'Writing',
};

const CACHE_TTL_MS = 60_000;

let cache = { at: 0, payload: null };

async function collect() {
  const db = await getDb();
  const entries = Object.entries(STATS_COLLECTIONS);

  const data = {};
  for (const [key, collection] of entries) {
    try {
      // Metadata-based: no collection scan.
      data[key] = await db.collection(collection).estimatedDocumentCount();
    } catch {
      data[key] = null;
    }
  }

  const total = Object.values(data).reduce((sum, n) => sum + (n || 0), 0);
  return { data, total, collections: entries.length };
}

export async function GET() {
  const fresh = cache.payload && Date.now() - cache.at < CACHE_TTL_MS;
  if (fresh) {
    return new NextResponse(JSON.stringify(cache.payload), { status: 200, headers: NO_STORE });
  }

  try {
    const payload = await collect();
    cache = { at: Date.now(), payload };
    return new NextResponse(JSON.stringify(payload), { status: 200, headers: NO_STORE });
  } catch (error) {
    console.error('[api/stats] failed:', error);
    // Serve the previous numbers rather than an empty footer.
    const payload = cache.payload || { data: {}, total: 0, collections: 0 };
    return new NextResponse(JSON.stringify(payload), { status: 200, headers: NO_STORE });
  }
}

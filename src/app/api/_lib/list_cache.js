// src/app/api/_lib/list_cache.js
/**
 * list_cache.js — a tiny in-process cache for list (GET) responses.
 *
 * The gallery's Mongo cluster answers a 500-row find in 1–8 s (latency bound,
 * not CPU bound), while every page fans out several list requests at once:
 * `/artworks` alone reads images + artworks + abouts, the manager order page up
 * to seven collections. Repeat navigations must not re-pay that.
 *
 * Rules that keep it safe:
 *   • short TTL (default 15 s) — a stale window nobody notices, and
 *   • EVERY write path invalidates its collection (api_shell POST/PUT/DELETE,
 *     the batch shell, the reorder routes, the [id] shell), so anything the
 *     manager saves is never served from cache.
 *
 * Keys are `collection|query|projection|sort|skip|limit`, so a filtered / paged
 * request is cached separately from the plain list.
 */

const DEFAULT_TTL_MS = 15000;

/** key → { expires, body } */
const store = new Map();

/** Hard cap so a long-lived process can't grow the map without bound. */
const MAX_ENTRIES = 300;

export const cacheKeyFor = (collection, query, projection, sort, skip, limit) =>
  `${collection}|${JSON.stringify([query, projection, sort, skip, limit])}`;

/** Cached body for this request, or null. */
export function readListCache(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) {
    store.delete(key);
    return null;
  }
  return hit.body;
}

/** Remember a response body (ttlMs <= 0 disables caching). */
export function writeListCache(key, body, ttlMs = DEFAULT_TTL_MS) {
  if (!ttlMs || ttlMs <= 0 || body === undefined) return;
  if (store.size >= MAX_ENTRIES) store.clear();
  store.set(key, { expires: Date.now() + ttlMs, body });
}

/** Drop every cached list for one collection (call after any write). */
export function invalidateListCache(collection) {
  if (!collection) {
    store.clear();
    return;
  }
  const prefix = `${collection}|`;
  for (const key of [...store.keys()]) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/** How many (collection-scoped) list responses are cached — for diagnostics. */
export const listCacheSize = () => store.size;

export default { readListCache, writeListCache, invalidateListCache };

import { createApiResource } from '@/lib/api/createApiResource';

/**
 * Generic per-schema API config builder.
 *
 * Replaces the need for a separate artworkConfig.js / seriesConfig.js /
 * artworkConfig.js / ... file for every Prisma model. Just call this
 * with the lowercase schema/route name.
 *
 * @param {string} schemaName  e.g. 'artwork', 'series', 'project', 'event',
 *                              'writing', 'about', 'resume'
 * @param {object} [options]   passed through to createApiResource
 *                              (e.g. { idParam: 'slug' })
 * @returns {{ itemUrl: string, api: ReturnType<typeof createApiResource> }}
 */
export function createSchemaApiConfig(schemaName, options = {}) {
  const resource = createApiResource(schemaName, options);
  return {
    itemUrl: schemaName,
    api: resource,
  };
}

// Cache so repeated calls for the same schema return the same object
// reference (useful for useEffect deps, memoization, etc.) instead of
// constructing a new resource every render.
const _cache = new Map();

/**
 * Cached/memoized version of createSchemaApiConfig. Prefer this in
 * components so the returned `api` object is referentially stable
 * across renders.
 */
export function getSchemaApiConfig(schemaName, options = {}) {
  if (!schemaName) {
    throw new Error('getSchemaApiConfig: schemaName is required');
  }

  const cacheKey = `${schemaName}:${JSON.stringify(options)}`;

  if (!_cache.has(cacheKey)) {
    _cache.set(cacheKey, createSchemaApiConfig(schemaName, options));
  }

  return _cache.get(cacheKey);
}
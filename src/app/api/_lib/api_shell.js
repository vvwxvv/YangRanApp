// apiShell.js - Reusable API factory for MongoDB CRUD operations

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentFormattedDate } from '@/utils/dateFormatter';
import { autoFillArtist } from '@/utils/artistUtils';
import { cleanMarkForStore } from '@/utils/mediaMarks';
import { getDb as getSharedDb } from '@/app/api/_lib/mongo';
import { cacheKeyFor, invalidateListCache, readListCache, writeListCache } from '@/app/api/_lib/list_cache';

/**
 * `mark` is a JSON object now ({ value, hide }). Normalise whatever was
 * submitted (scalar form string or full JSON) before it is sanitised, keeping
 * the record's existing page hides when a plain string was sent.
 * Only applies when the collection declares `mark` in `jsonFields`.
 */
function normalizeMarkField(config, data, existingMark) {
  if (!data || typeof data !== 'object') return data;
  if (!config?.jsonFields?.includes('mark')) return data;
  if (!('mark' in data)) return data;
  return { ...data, mark: cleanMarkForStore(data.mark, existingMark) };
}

// MongoDB connection: ONE shared client for the whole server (see _lib/mongo.js).
// It used to be a per-module client that every process re-created — and the
// TLS handshake alone costs ~1.4 s against this cluster, so the shared client
// is the difference between "slow page" and "instant page".
async function getDb() {
  return getSharedDb();
}

/**
 * Creates a complete API handler with GET, POST, PUT, DELETE methods
 * @param {Object} config - Configuration object for the API
 * @returns {Object} Object containing GET, POST, PUT, DELETE handler functions
 */
export function createApiHandler(config) {
  const CONFIG = {
    enablePagination: false,
    defaultPageSize: 10000,
    maxPageSize: 10000,
    enableSearch: true,
    enableSorting: true,
    enableSoftDelete: false,
    enableBulkOperations: false,
    enableAutoFillArtist: false,
    collectionName: '',
    // List (GET) responses are cached in-process for this long. 0 disables it.
    listCacheMs: 15000,
    requiredFields: [],
    uniqueFields: [],
    searchableFields: [],
    arrayFields: [],
    jsonFields: [],
    objectIdArrayFields: [],
    dateFields: [],
    validFields: [],
    defaultSortField: 'order',
    defaultSortOrder: 1,
    beforeCreate: null,
    afterCreate: null,
    beforeUpdate: null,
    afterUpdate: null,
    beforeDelete: null,
    afterDelete: null,
    customValidation: null,
    transformResponse: null,
    ...config
  };

  if (!CONFIG.collectionName) {
    throw new Error('collectionName is required in config');
  }

  const getCollection = async () => {
    const db = await getDb();
    return db.collection(CONFIG.collectionName);
  };

  /** Drop this collection's cached list responses (called after every write). */
  const dropListCache = () => invalidateListCache(CONFIG.collectionName);

  // ─── Helper functions ───

  function buildSearchQuery(search) {
    if (!search || !CONFIG.enableSearch || CONFIG.searchableFields.length === 0) {
      return {};
    }
    const searchRegex = { $regex: search, $options: 'i' };
    return { $or: CONFIG.searchableFields.map(field => ({ [field]: searchRegex })) };
  }

  function buildFilterQuery(filters) {
    const query = {};
    if (CONFIG.enableSoftDelete) {
      query.deletedAt = { $exists: false };
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = value;
      }
    });
    return query;
  }

  function validateRequiredFields(data) {
    if (!CONFIG.requiredFields.length) return { valid: true };
    const missingFields = CONFIG.requiredFields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || value === '';
    });
    return { valid: missingFields.length === 0, missingFields };
  }

  function sanitizeData(data) {
    const sanitized = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key === '_id' || key === 'id') return;
      if (!CONFIG.validFields.includes(key)) return;

      // Handle JSON object fields (e.g. Artwork.order) — pass plain objects
      // / arrays through untouched instead of stringifying them.
      if (CONFIG.jsonFields.includes(key)) {
        if (value === undefined || value === null || value === '') {
          sanitized[key] = null;
        } else if (typeof value === 'object') {
          sanitized[key] = value;
        } else {
          sanitized[key] = String(value);
        }
      }
      // Handle array fields
      else if (CONFIG.arrayFields.includes(key)) {
        if (Array.isArray(value)) {
          sanitized[key] = value
            .filter(item => item !== null && item !== undefined)
            .map(item => (item !== null && typeof item === 'object' ? item : String(item).trim()))
            .filter(item => (item !== null && typeof item === 'object') || item.length > 0);
        } else if (typeof value === 'string' && value.trim() !== '') {
          sanitized[key] = value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        } else {
          sanitized[key] = [];
        }
      }
      // Handle order/year — keep as string, allow empty → skip
      else if (key === 'order' || key === 'year') {
        if (value !== undefined && value !== null && value !== '') {
          sanitized[key] = String(value);
        }
        // If empty string, don't include (will use DB default or existing value)
      }
      // Default: pass through as string, empty string → null
      else {
        if (value === undefined || value === null || value === '') {
          sanitized[key] = null;
        } else {
          sanitized[key] = String(value);
        }
      }
    });

    // Add timestamps if in validFields
    if (!sanitized.updatedAt && CONFIG.validFields.includes('updatedAt')) {
      sanitized.updatedAt = getCurrentFormattedDate();
    }
    if (!sanitized.createdAt && CONFIG.validFields.includes('createdAt')) {
      sanitized.createdAt = getCurrentFormattedDate();
    }

    return sanitized;
  }

  function mapIdForResponse(doc) {
    if (!doc) return doc;
    const mapped = { ...doc };
    if (mapped._id) {
      mapped.id = mapped._id.toString();
      delete mapped._id;
    }
    return mapped;
  }

  function buildPaginationResponse(data, page, limit, total) {
    const response = { data };
    if (CONFIG.enablePagination) {
      response.pagination = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      };
    }
    return response;
  }

  function applyAutoFillArtist(data) {
    if (!CONFIG.enableAutoFillArtist) return data;
    const dataWithLanguage = { ...data, language: data.language || 'EN' };
    return autoFillArtist(dataWithLanguage, dataWithLanguage.language);
  }

  // ─── GET ───

  async function GET(request) {
    try {
      const collection = await getCollection();
      const { searchParams } = new URL(request.url);

      const search = searchParams.get('search') || '';
      const page = CONFIG.enablePagination ? parseInt(searchParams.get('page') || '1') : 1;
      const limit = CONFIG.enablePagination
        ? Math.min(parseInt(searchParams.get('limit') || CONFIG.defaultPageSize), CONFIG.maxPageSize)
        : CONFIG.maxPageSize;
      const sortField = searchParams.get('sortBy') || CONFIG.defaultSortField;
      const sortOrder = parseInt(searchParams.get('sortOrder') || CONFIG.defaultSortOrder);
      const fields = searchParams.get('fields')?.split(',') || null;

      const filters = {};
      for (const [key, value] of searchParams.entries()) {
        if (!['search', 'page', 'limit', 'sortBy', 'sortOrder', 'fields'].includes(key)) {
          filters[key] = value;
        }
      }

      const query = { ...buildSearchQuery(search), ...buildFilterQuery(filters) };
      const projection = fields ? fields.reduce((acc, f) => ({ ...acc, [f]: 1 }), {}) : {};
      const sort = CONFIG.enableSorting ? { [sortField]: sortOrder } : {};
      const skip = CONFIG.enablePagination ? (page - 1) * limit : 0;

      // ── Cache ── list responses are re-used for CONFIG.listCacheMs and
      // dropped by every write below, so navigating back to a page (or two
      // pages asking for the same collection) is instant instead of paying
      // another multi-second round trip to the cluster.
      const cacheKey = cacheKeyFor(CONFIG.collectionName, query, projection, sort, skip, limit);
      const cached = readListCache(cacheKey);
      if (cached) {
        return NextResponse.json(cached, {
          status: 200,
          headers: { 'X-List-Cache': 'HIT' },
        });
      }

      const [data, total] = await Promise.all([
        collection.find(query, { projection }).sort(sort).skip(skip).limit(limit).toArray(),
        CONFIG.enablePagination ? collection.countDocuments(query) : collection.estimatedDocumentCount()
      ]);

      let mappedData = data.map(mapIdForResponse);
      if (CONFIG.transformResponse) {
        mappedData = await CONFIG.transformResponse(mappedData);
      }

      const body = buildPaginationResponse(mappedData, page, limit, total);
      writeListCache(cacheKey, body, CONFIG.listCacheMs);

      return NextResponse.json(body, {
        status: 200,
        headers: { 'X-List-Cache': 'MISS' },
      });
    } catch (error) {
      console.log(`[${CONFIG.collectionName} GET] Error:`, error.message);
      return NextResponse.json(
        { message: 'Failed to fetch data', error: error.message },
        { status: 500 }
      );
    }
  }

  // ─── POST ───

  async function POST(request) {
    try {
      const collection = await getCollection();

      let rawData;
      try {
        rawData = await request.json();
      } catch (parseError) {
        return NextResponse.json(
          { message: 'Invalid JSON in request body', error: parseError.message },
          { status: 400 }
        );
      }

      // Auto-fill artist
      rawData = applyAutoFillArtist(rawData);

      // Apply beforeCreate hook
      if (CONFIG.beforeCreate) {
        rawData = await CONFIG.beforeCreate(rawData);
      }

      // `mark` is JSON now — normalise it (scalar string → { value, hide }).
      rawData = normalizeMarkField(CONFIG, rawData, null);

      const sanitized = sanitizeData(rawData);

      // Validate required fields
      const validation = validateRequiredFields(sanitized);
      if (!validation.valid) {
        return NextResponse.json(
          { message: 'Missing required fields', missingFields: validation.missingFields },
          { status: 400 }
        );
      }

      // Custom validation
      if (CONFIG.customValidation) {
        const result = await CONFIG.customValidation(sanitized, 'create');
        if (!result.valid) {
          return NextResponse.json(
            { message: result.error || 'Validation failed' },
            { status: 400 }
          );
        }
      }

      // Check unique fields
      if (CONFIG.uniqueFields.length > 0) {
        const uniqueChecks = CONFIG.uniqueFields
          .filter(field => sanitized[field] !== undefined && sanitized[field] !== null)
          .map(field => ({ [field]: sanitized[field] }));

        if (uniqueChecks.length > 0) {
          const conflict = await collection.findOne({ $or: uniqueChecks });
          if (conflict) {
            const conflictField = CONFIG.uniqueFields.find(f => conflict[f] === sanitized[f]);
            return NextResponse.json(
              { message: `${conflictField} already exists`, field: conflictField },
              { status: 409 }
            );
          }
        }
      }

      const insertResult = await collection.insertOne(sanitized);

      // Apply afterCreate hook
      if (CONFIG.afterCreate) {
        try {
          await CONFIG.afterCreate(sanitized, insertResult);
        } catch (hookError) {
          console.log(`[${CONFIG.collectionName} POST] afterCreate hook error:`, hookError.message);
        }
      }

      let responseData = mapIdForResponse({ ...sanitized, _id: insertResult.insertedId });
      if (CONFIG.transformResponse) {
        responseData = await CONFIG.transformResponse(responseData);
      }

      // A new row changes every cached list of this collection.
      dropListCache();

      return NextResponse.json(
        { message: 'Created successfully', id: insertResult.insertedId, data: responseData },
        { status: 201 }
      );
    } catch (error) {
      console.log(`[${CONFIG.collectionName} POST] Error:`, error.message);

      if (error.code === 11000) {
        return NextResponse.json(
          { message: 'Duplicate entry detected', error: error.message },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { message: 'Failed to create item', error: error.message },
        { status: 500 }
      );
    }
  }

  // ─── PUT ───

  async function PUT(request) {
    try {
      const collection = await getCollection();
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');

      if (!id || !ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: 'Valid ID is required', receivedId: id },
          { status: 400 }
        );
      }

      let rawData;
      try {
        rawData = await request.json();
      } catch (parseError) {
        return NextResponse.json(
          { message: 'Invalid JSON in request body', error: parseError.message },
          { status: 400 }
        );
      }

      // Auto-fill artist
      rawData = applyAutoFillArtist(rawData);

      // Check if document exists
      const existing = await collection.findOne({ _id: new ObjectId(id) });
      if (!existing) {
        return NextResponse.json(
          { message: 'Item not found', id },
          { status: 404 }
        );
      }

      // Apply beforeUpdate hook
      if (CONFIG.beforeUpdate) {
        rawData = await CONFIG.beforeUpdate(id, rawData, existing);
      }

      // `mark` is JSON now — normalise it, preserving existing page hides when
      // a plain scalar (form) value was submitted.
      rawData = normalizeMarkField(CONFIG, rawData, existing?.mark ?? null);

      // Sanitize and prepare update data
      const sanitizeResult = sanitizeData(rawData);
      const { _id, id: idField, ...updateData } = sanitizeResult;
      updateData.updatedAt = getCurrentFormattedDate();

      // Custom validation
      if (CONFIG.customValidation) {
        const validationResult = await CONFIG.customValidation(updateData, 'update');
        if (!validationResult.valid) {
          return NextResponse.json(
            { message: validationResult.error || 'Validation failed' },
            { status: 400 }
          );
        }
      }

      // Check unique fields (excluding current document)
      if (CONFIG.uniqueFields.length > 0) {
        const uniqueChecks = CONFIG.uniqueFields
          .filter(field => updateData[field] !== undefined && updateData[field] !== null)
          .map(field => ({
            [field]: updateData[field],
            _id: { $ne: new ObjectId(id) }
          }));

        if (uniqueChecks.length > 0) {
          const conflict = await collection.findOne({ $or: uniqueChecks });
          if (conflict) {
            const conflictField = CONFIG.uniqueFields.find(f =>
              conflict[f] === updateData[f] && updateData[f] !== undefined
            );
            return NextResponse.json(
              { message: `${conflictField} already exists`, field: conflictField },
              { status: 409 }
            );
          }
        }
      }

      // Update document
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Item not found during update' }, { status: 404 });
      }

      // Apply afterUpdate hook
      if (CONFIG.afterUpdate) {
        try {
          await CONFIG.afterUpdate(id, updateData, result);
        } catch (hookError) {
          console.log(`[${CONFIG.collectionName} PUT] afterUpdate hook error:`, hookError.message);
        }
      }

      // Fetch and return updated document
      const updated = await collection.findOne({ _id: new ObjectId(id) });
      let responseData = mapIdForResponse(updated);
      if (CONFIG.transformResponse) {
        responseData = await CONFIG.transformResponse(responseData);
      }

      dropListCache();

      return NextResponse.json(
        { message: 'Updated successfully', modified: result.modifiedCount > 0, data: responseData },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    } catch (error) {
      console.log(`[${CONFIG.collectionName} PUT] Error:`, error.message);
      return NextResponse.json(
        { message: 'Failed to update', error: error.message },
        { status: 500 }
      );
    }
  }

  // ─── DELETE ───

  async function DELETE(request) {
    try {
      const collection = await getCollection();
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];

      // Single delete
      if (id) {
        if (!ObjectId.isValid(id)) {
          return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
        }

        if (CONFIG.beforeDelete) {
          await CONFIG.beforeDelete(id);
        }

        const filter = { _id: new ObjectId(id) };

        if (CONFIG.enableSoftDelete) {
          const result = await collection.updateOne(filter, { $set: { deletedAt: getCurrentFormattedDate() } });
          if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
          }
          if (CONFIG.afterDelete) await CONFIG.afterDelete(id, result);
          dropListCache();
          return NextResponse.json({ message: 'Soft deleted successfully' }, { status: 200 });
        } else {
          const result = await collection.deleteOne(filter);
          if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
          }
          if (CONFIG.afterDelete) await CONFIG.afterDelete(id, result);
          dropListCache();
          return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
        }
      }

      // Bulk delete
      if (ids.length > 0 && CONFIG.enableBulkOperations) {
        const validIds = ids.filter(i => ObjectId.isValid(i));
        if (validIds.length === 0) {
          return NextResponse.json({ message: 'No valid IDs provided' }, { status: 400 });
        }

        const filter = { _id: { $in: validIds.map(i => new ObjectId(i)) } };

        if (CONFIG.enableSoftDelete) {
          const result = await collection.updateMany(filter, { $set: { deletedAt: getCurrentFormattedDate() } });
          dropListCache();
          return NextResponse.json({ message: 'Soft deleted successfully', count: result.modifiedCount }, { status: 200 });
        } else {
          const result = await collection.deleteMany(filter);
          dropListCache();
          return NextResponse.json({ message: 'Deleted successfully', count: result.deletedCount }, { status: 200 });
        }
      }

      return NextResponse.json({ message: 'ID or IDs parameter required' }, { status: 400 });
    } catch (error) {
      console.log(`[${CONFIG.collectionName} DELETE] Error:`, error.message);
      return NextResponse.json(
        { message: 'Failed to delete', error: error.message },
        { status: 500 }
      );
    }
  }

  return { GET, POST, PUT, DELETE };
}
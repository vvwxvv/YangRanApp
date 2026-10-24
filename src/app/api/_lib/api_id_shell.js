// apiIdShell.js - Simplified API factory WITHOUT caching for immediate data updates

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getCurrentFormattedDate } from '@/utils/dateFormatter';
import { autoFillArtist } from '@/utils/artistUtils';
import { cleanMarkForStore } from '@/utils/mediaMarks';
import { invalidateListCache } from '@/app/api/_lib/list_cache';

/**
 * `mark` is a JSON object now ({ value, hide }). Normalise it before sanitising,
 * preserving the record's existing page hides when a scalar was submitted.
 */
function normalizeMarkField(config, data, existingMark) {
  if (!data || typeof data !== 'object') return data;
  if (!config?.jsonFields?.includes('mark')) return data;
  if (!('mark' in data)) return data;
  return { ...data, mark: cleanMarkForStore(data.mark, existingMark) };
}

/**
 * Creates a complete API handler with GET, PUT, DELETE methods for single items by ID
 * Simple, robust, no caching - always fetch fresh data
 */
export function createApiIdHandler(config) {
  // Merge with default config
  const CONFIG = {
    // Basic configuration
    collectionName: '',
    
    // Feature flags
    enableSoftDelete: false,
    enableAutoFillArtist: false,
    
    // Schema configuration
    validFields: [],
    arrayFields: [],
    jsonFields: [],
    
    // Hooks (optional callbacks)
    beforeUpdate: null,  // async (id, data, existing) => modifiedData
    afterUpdate: null,   // async (id, data, result) => void
    beforeDelete: null,  // async (id) => void
    afterDelete: null,   // async (id, result) => void
    
    // Custom validation
    customValidation: null, // async (data, operation) => { valid: boolean, error?: string }
    
    // Response transformation
    transformResponse: null, // async (data) => transformedData
    
    ...config
  };

  // Validate required config
  if (!CONFIG.collectionName) {
    throw new Error('collectionName is required in config');
  }

  // MongoDB connection — the ONE shared client for the whole server
  // (see _lib/mongo.js). A per-module client meant every shell opened its own
  // pool, and the connect cost (~1.4 s to this cluster) was paid per process.
  const getCollection = async () => {
    const { getCollection: shared } = await import('@/app/api/_lib/mongo');
    return shared(CONFIG.collectionName);
  };

  // Helper: Sanitize data based on validFields
  function sanitizeData(data) {
    const sanitized = {};
    
    Object.entries(data).forEach(([key, value]) => {
      // Skip fields not in validFields
      if (!CONFIG.validFields.includes(key)) return;
      
      // Handle array fields
      if (CONFIG.arrayFields.includes(key)) {
        sanitized[key] = Array.isArray(value)
          ? value.map(item => (item !== null && typeof item === 'object' ? item : String(item)))
          : [];
      } else {
        sanitized[key] = value;
      }
    });
    
    return sanitized;
  }

  // Helper: Map MongoDB _id to id for frontend
  function mapIdForResponse(doc) {
    if (!doc) return doc;
    const mapped = { ...doc };
    if (mapped._id) {
      mapped.id = mapped._id.toString();
      delete mapped._id;
    }
    return mapped;
  }

  // Helper: Create no-cache headers
  function createNoCacheHeaders() {
    return {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
  }

  // GET - Fetch single item by ID (always fresh from database)
  async function GET(request, context) {
    try {
      // Handle both old and new Next.js parameter passing
      const params = context?.params || {};
      const { id } = await Promise.resolve(params);
      
      if (!id || !ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
      }
      
      const collection = await getCollection();
      
      // Always fetch fresh data from database
      const document = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!document) {
        return NextResponse.json({ message: 'Document not found' }, { status: 404 });
      }
      
      // Transform response if needed
      let responseData = mapIdForResponse(document);
      if (CONFIG.transformResponse) {
        responseData = await CONFIG.transformResponse(responseData);
      }
      
      // Return with no-cache headers
      return NextResponse.json(responseData, { 
        status: 200,
        headers: createNoCacheHeaders()
      });
      
    } catch (error) {
      console.log('GET Error:', error);
      return NextResponse.json(
        { message: 'Failed to fetch document', error: error.message },
        { status: 500 }
      );
    }
  }

  // PUT - Update single item by ID
  async function PUT(request, context) {
    try {
      // Handle both old and new Next.js parameter passing
      const params = context?.params || {};
      const { id } = await Promise.resolve(params);
      
      if (!id || !ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
      }
      
      let rawData = await request.json();
      
      // Auto-fill artist if enabled
      if (CONFIG.enableAutoFillArtist) {
        const dataWithLanguage = {
          ...rawData,
          language: rawData.language || 'EN'
        };
        rawData = autoFillArtist(dataWithLanguage, dataWithLanguage.language);
      }
      
      const collection = await getCollection();
      
      // Check if document exists
      const existing = await collection.findOne(
        { _id: new ObjectId(id) },
        { projection: { _id: 1, mark: 1 } }
      );
      
      if (!existing) {
        return NextResponse.json({ message: 'Document not found' }, { status: 404 });
      }
      
      // Apply beforeUpdate hook
      if (CONFIG.beforeUpdate) {
        rawData = await CONFIG.beforeUpdate(id, rawData, existing);
      }

      // `mark` is JSON now — normalise (preserve existing page hides).
      rawData = normalizeMarkField(CONFIG, rawData, existing?.mark ?? null);

      // Sanitize data
      const { _id, ...updateData } = sanitizeData(rawData);
      
      if (!updateData || Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: 'No data provided for update' }, { status: 400 });
      }
      
      // Add updatedAt timestamp
      updateData.updatedAt = getCurrentFormattedDate();
      
      // Custom validation
      if (CONFIG.customValidation) {
        const customValidation = await CONFIG.customValidation(updateData, 'update');
        if (!customValidation.valid) {
          return NextResponse.json(
            { message: customValidation.error || 'Validation failed' },
            { status: 400 }
          );
        }
      }
      
      // Update document
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Document not found' }, { status: 404 });
      }
      
      // Apply afterUpdate hook
      if (CONFIG.afterUpdate) {
        await CONFIG.afterUpdate(id, updateData, result);
      }
      
      // Invalidate caches for both detail and list pages
      invalidateListCache(CONFIG.collectionName);
      try {
        revalidatePath(`/api/${CONFIG.collectionName}`);
        revalidatePath(`/api/${CONFIG.collectionName}/${id}`);
      } catch (e) {
        console.warn('Cache revalidation failed:', e);
      }
      
      return NextResponse.json({ 
        message: 'Document updated successfully',
        modified: result.modifiedCount > 0
      }, { 
        status: 200,
        headers: createNoCacheHeaders()
      });
      
    } catch (error) {
      console.log('PUT Error:', error);
      return NextResponse.json(
        { message: 'Failed to update document', error: error.message },
        { status: 500 }
      );
    }
  }

  // DELETE - Delete single item by ID
  async function DELETE(request, context) {
    try {
      // Handle both old and new Next.js parameter passing
      const params = context?.params || {};
      const { id } = await Promise.resolve(params);
      
      if (!id || !ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
      }
      
      // Apply beforeDelete hook
      if (CONFIG.beforeDelete) {
        await CONFIG.beforeDelete(id);
      }
      
      const collection = await getCollection();
      const filter = { _id: new ObjectId(id) };
      
      if (CONFIG.enableSoftDelete) {
        // Soft delete - mark as deleted
        const result = await collection.updateOne(
          filter,
          { $set: { deletedAt: getCurrentFormattedDate() } }
        );
        
        if (result.matchedCount === 0) {
          return NextResponse.json({ message: 'Document not found' }, { status: 404 });
        }
        
        // Apply afterDelete hook
        if (CONFIG.afterDelete) {
          await CONFIG.afterDelete(id, result);
        }
        
        // CRITICAL: Invalidate ALL caches after delete
        invalidateListCache(CONFIG.collectionName);
        try {
          revalidatePath(`/api/${CONFIG.collectionName}`);
          revalidatePath(`/api/${CONFIG.collectionName}/[id]`, 'page');
          revalidatePath('/', 'layout'); // Invalidate entire app if needed
        } catch (e) {
          console.warn('Cache revalidation failed:', e);
        }
        
        return NextResponse.json(
          { message: 'Document soft deleted successfully' }, 
          { 
            status: 200,
            headers: createNoCacheHeaders()
          }
        );
        
      } else {
        // Hard delete - remove from database
        const result = await collection.deleteOne(filter);
        
        if (result.deletedCount === 0) {
          return NextResponse.json({ message: 'Document not found' }, { status: 404 });
        }
        
        // Apply afterDelete hook
        if (CONFIG.afterDelete) {
          await CONFIG.afterDelete(id, result);
        }
        
        // CRITICAL: Invalidate ALL caches after delete
        invalidateListCache(CONFIG.collectionName);
        try {
          revalidatePath(`/api/${CONFIG.collectionName}`);
          revalidatePath(`/api/${CONFIG.collectionName}/[id]`, 'page');
          revalidatePath('/', 'layout'); // Invalidate entire app if needed
        } catch (e) {
          console.warn('Cache revalidation failed:', e);
        }
        
        return NextResponse.json(
          { message: 'Document deleted successfully' }, 
          { 
            status: 200,
            headers: createNoCacheHeaders()
          }
        );
      }
      
    } catch (error) {
      console.log('DELETE Error:', error);
      return NextResponse.json(
        { message: 'Failed to delete document', error: error.message },
        { status: 500 }
      );
    }
  }

  return { GET, PUT, DELETE };
}
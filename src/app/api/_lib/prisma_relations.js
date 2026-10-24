// src/lib/mediaRelations.js - MongoDB/Prisma only

/**
 * Collections that support relatedWebs field
 * Only Artwork and Event have this field in the schema
 */
const SUPPORTED_COLLECTIONS = ['artwork', 'event'];

/**
 * Check if a collection supports relatedWebs
 */
function supportsRelatedWebs(collection) {
  return SUPPORTED_COLLECTIONS.includes(collection.toLowerCase());
}

/**
 * Update relatedWebs references for a document
 * Only works with Artwork and Event collections
 * 
 * @param {string} collection - Collection name ('artwork' or 'event')
 * @param {string} id - Document ID
 * @param {string[]} relatedWebs - Array of Web document IDs
 */
export async function updateMediaReferences(collection, id, relatedWebs = []) {
  // Validate input parameters
  if (!collection || !id) {
    console.log('Missing required parameters: collection and id are required');
    return;
  }

  // Check if this collection supports relatedWebs
  if (!supportsRelatedWebs(collection)) {
    console.log(`Collection '${collection}' does not support relatedWebs field. Skipping.`);
    return;
  }

  // Validate relatedWebs is an array
  if (!Array.isArray(relatedWebs)) {
    console.log('relatedWebs must be an array');
    return;
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const collectionName = collection.toLowerCase();
    const repo = prisma[collectionName]; // prisma.artwork or prisma.event
    
    if (!repo) {
      console.log(`Repository not found for collection: ${collection}`);
      await prisma.$disconnect();
      return;
    }

    await repo.update({ 
      where: { id }, 
      data: { relatedWebs } 
    });
    
    await prisma.$disconnect();
    console.log(`Successfully updated relatedWebs for ${collection} ${id}`);
  } catch (error) {
    console.log(`Error updating media references for ${collection}:`, error);
    throw error;
  }
}

/**
 * Populate relatedWebs with full Web documents
 * Only works with Artwork and Event collections
 * 
 * @param {string} collection - Collection name
 * @param {Object|Object[]} docs - Document or array of documents
 * @returns {Promise<Object|Object[]>} Documents with populated relatedWebs
 */
export async function populateRelations(collection, docs) {
  const isArray = Array.isArray(docs);
  const arr = isArray ? docs : [docs];
  
  if (!arr.length) return isArray ? [] : null;
  
  // Check if this collection supports relatedWebs
  if (!supportsRelatedWebs(collection)) {
    return docs;
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Collect all unique Web IDs
    const webIds = new Set();
    arr.forEach(doc => {
      if (doc.relatedWebs && Array.isArray(doc.relatedWebs)) {
        doc.relatedWebs.forEach(id => webIds.add(id));
      }
    });

    // Fetch all related Web documents
    const webs = webIds.size > 0 
      ? await prisma.web.findMany({ 
          where: { id: { in: [...webIds] } } 
        }) 
      : [];
    
    const webMap = new Map(webs.map(w => [w.id, w]));

    // Replace IDs with full documents
    const populated = arr.map(doc => ({
      ...doc,
      relatedWebs: doc.relatedWebs
        ?.map(id => webMap.get(id))
        .filter(Boolean) || [],
    }));
    
    await prisma.$disconnect();
    return isArray ? populated : populated[0];
  } catch (error) {
    console.log(`Error populating relations for ${collection}:`, error);
    return docs; // Return original docs on error
  }
}

/**
 * Clear all relatedWebs references for a document
 * Only works with Artwork and Event collections
 * 
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 */
export async function cleanupReferences(collection, id) {
  // Check if this collection supports relatedWebs
  if (!supportsRelatedWebs(collection)) {
    console.log(`Collection '${collection}' does not support relatedWebs field. Skipping cleanup.`);
    return;
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const collectionName = collection.toLowerCase();
    const repo = prisma[collectionName];
    
    if (!repo) {
      console.log(`Repository not found for collection: ${collection}`);
      await prisma.$disconnect();
      return;
    }

    await repo.update({ 
      where: { id }, 
      data: { relatedWebs: [] } 
    });
    
    await prisma.$disconnect();
    console.log(`Successfully cleaned up references for ${collection} ${id}`);
  } catch (error) {
    console.log(`Error cleaning up references for ${collection}:`, error);
    throw error;
  }
}

/**
 * Validate ObjectId array - convert and filter valid IDs
 */
export function validateObjectIdArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(id => id && typeof id === 'string' && id.length === 24);
}

/**
 * Validate that relation IDs exist in their respective collections
 */
export async function validateRelationIds(data) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const errors = [];
    
    // Check relatedWebs if present
    if (data.relatedWebs && Array.isArray(data.relatedWebs)) {
      const webCount = await prisma.web.count({
        where: { id: { in: data.relatedWebs } }
      });
      
      if (webCount !== data.relatedWebs.length) {
        errors.push('Some Web IDs do not exist');
      }
    }
    
    await prisma.$disconnect();
    return { valid: errors.length === 0, errors };
  } catch (error) {
    console.log('Error validating relation IDs:', error);
    return { valid: false, errors: ['Validation error'] };
  }
}
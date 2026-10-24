import { useState, useCallback } from 'react';
import { triggerDataRefresh } from '@/utils/dataRefresh';

export default function useDeleteItem(setData, setError, deleteEndpoint, options = {}) {
  const [loadingId, setLoadingId] = useState(null);
  
  const {
    idField = '_id',
    onDeleteSuccess,
    onDeleteError,
    customFilter,
    itemUrl
  } = options;

  const deleteItem = useCallback(async (id) => {
    try {
      // Validate ID
      if (!id && id !== 0) {
        const error = new Error('Invalid item ID provided for deletion');
        setError(error.message);
        if (onDeleteError) {
          onDeleteError(error, id);
        }
        throw error;
      }

      setLoadingId(id);
      setError(null);
      
      // Construct endpoint with proper query parameter
      let endpoint;
      if (typeof deleteEndpoint === 'function') {
        endpoint = deleteEndpoint(id);
      } else if (typeof deleteEndpoint === 'string') {
        // Check if endpoint has {id} placeholder
        if (deleteEndpoint.includes('{id}')) {
          endpoint = deleteEndpoint.replace('{id}', encodeURIComponent(id));
        } else {
          // Add id as query parameter
          const separator = deleteEndpoint.includes('?') ? '&' : '?';
          endpoint = `${deleteEndpoint}${separator}id=${encodeURIComponent(id)}`;
        }
      } else {
        const error = new Error('Invalid deleteEndpoint configuration');
        setError(error.message);
        if (onDeleteError) {
          onDeleteError(error, id);
        }
        throw error;
      }
      
      // Perform delete request
      const response = await fetch(endpoint, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Handle successful deletion
      if (response.ok || response.status === 404) {
        // Update local state
        if (customFilter) {
          setData(customFilter(id));
        } else {
          setData((prev) => {
            if (!Array.isArray(prev)) {
              return prev;
            }
            
            return prev.filter((item) => {
              const itemId = item[idField];
              return itemId !== id && String(itemId) !== String(id);
            });
          });
        }
        
        // Trigger data refresh
        if (itemUrl) {
          triggerDataRefresh(itemUrl);
        }
        
        // Call success callback
        if (onDeleteSuccess) {
          onDeleteSuccess(id);
        }
        
        return { success: true, id };
      } 
      
      // Handle failed deletion
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { 
          message: response.statusText || `Delete failed with status ${response.status}` 
        };
      }
      
      const errorMessage = errorData?.message || 
                          errorData?.error || 
                          response.statusText || 
                          `Failed to delete item (Status: ${response.status})`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      
      setError(errorMessage);
      
      if (onDeleteError) {
        onDeleteError(error, id);
      }
      
      throw error;
      
    } catch (err) {
      // Handle all errors uniformly
      const errorMessage = err?.message || 
                          'An unexpected error occurred during deletion';
      
      setError(errorMessage);
      
      // Only call error callback if not already called
      if (onDeleteError && !err.status) {
        onDeleteError(err, id);
      }
      
      throw err;
    } finally {
      setLoadingId(null);
    }
  }, [setData, setError, deleteEndpoint, idField, onDeleteSuccess, onDeleteError, customFilter, itemUrl]);

  return { deleteItem, loadingId };
}
import { useCallback, useContext } from 'react';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import useData from './useData';
import useDeleteDialog from './useDeleteDialog';
import useDeleteItem from './useDeleteItem';

export default function useSchemaData(config) {
  const { isCn } = useContext(LanguageContext);

  // Safely extract nested config values upfront to avoid runtime errors
  // if config or config.api is undefined/not yet available
  const listEndpoint = config?.api?.endpoints?.list ?? null;
  const deleteEndpoint = config?.api?.endpoints?.delete ?? null;
  const itemUrl = config?.itemUrl ?? null;

  // Use your existing useData hook
  const {
    data,
    isLoading,
    error,
    setData,
    setError,
    refetch
  } = useData(listEndpoint, itemUrl);

  // Get label function that responds to language changes
  const getLabel = useCallback((key) => {
    if (!config?.getLabel) return key;
    const language = isCn ? 'cn' : 'en';
    return config.getLabel(key, language);
  }, [config, isCn]);

  // Enhanced delete success callback that ensures UI update
  const handleDeleteSuccess = useCallback((deletedId) => {
    console.log(`Successfully deleted item with id: ${deletedId}`);

    setData(prevData => {
      if (Array.isArray(prevData)) {
        return prevData.filter(item => item._id !== deletedId && item.id !== deletedId);
      }
      return prevData;
    });
  }, [setData]);

  // Enhanced delete error callback
  const handleDeleteError = useCallback((err, id) => {
    console.log(`Failed to delete item with id: ${id}`, err);
    setError(err?.message || 'Failed to delete item');
    refetch();
  }, [setError, refetch]);

  // Use delete item hook with enhanced configuration
  const { deleteItem, loadingId } = useDeleteItem(
    setData,
    setError,
    deleteEndpoint,
    {
      idField: '_id',
      itemUrl,
      onDeleteSuccess: handleDeleteSuccess,
      onDeleteError: handleDeleteError
    }
  );

  // Enhanced delete confirmation that ensures proper state management
  const enhancedDeleteItem = useCallback(async (item) => {
    try {
      await deleteItem(item);
    } catch (err) {
      throw err;
    }
  }, [deleteItem]);

  // Use delete dialog hook with enhanced delete function
  const {
    openDialogItem,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm
  } = useDeleteDialog(enhancedDeleteItem, setError);

  // Enhanced refetch function that clears errors
  const enhancedRefetch = useCallback(() => {
    setError(null);
    return refetch();
  }, [refetch, setError]);

  return {
    data,
    isLoading,
    error,
    loadingId,
    openDialogItem,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    getLabel,
    refetch: enhancedRefetch
  };
}
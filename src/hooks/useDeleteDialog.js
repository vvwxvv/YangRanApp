import { useState, useCallback } from 'react';
import { triggerDataRefresh } from '@/utils/dataRefresh';

export default function useDeleteDialog(deleteItem, setError, itemUrl) {
  const [openDialogItem, setOpenDialogItem] = useState(null);

  const handleDeleteClick = useCallback((item) => {
    
    if (!item) {
      console.log("Delete clicked with undefined/null item:", item);
      setError('Invalid item provided');
      return;
    }
    
    const itemId = item._id || item.id;
    if (!itemId) {
      console.log("Delete clicked with item missing _id and id:", item);
      setError('Invalid ID provided');
      return;
    }
    
    setOpenDialogItem({ ...item, _id: itemId });
  }, [setError]);

  const handleDeleteCancel = useCallback(() => {
    setOpenDialogItem(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!openDialogItem || !openDialogItem._id) {
      console.log("Delete confirm called with invalid item:", openDialogItem);
      setError('Invalid ID provided');
      return;
    }
    
    try {
      await deleteItem(openDialogItem._id);
      setOpenDialogItem(null);
      
      // Trigger data refresh after successful delete
      if (itemUrl) {
        triggerDataRefresh(itemUrl);
      }
    } catch (error) {
      console.log("Delete operation failed:", error);
      // Don't close dialog on error, let user try again
    }
  }, [openDialogItem, deleteItem, setError, itemUrl]);

  return {
    openDialogItem,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm
  };
}
import { useState, useEffect, useCallback, useRef } from 'react';

export default function useItemReorder({ fetchItems, saveItemOrder, idKey = 'id' }) {
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadItems = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchItems(abortControllerRef.current.signal);
      
      if (data && isMountedRef.current) {
        console.log('Loaded items:', data.length);
        setItems(data);
        setOriginalItems(JSON.parse(JSON.stringify(data)));
        setHasChanges(false);
      }
    } catch (err) {
      if (isMountedRef.current && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Fixed handleDragEnd function
  const handleDragEnd = useCallback((result) => {
    console.log('handleDragEnd called with:', result);
    // Support customOrder for text list view
    if (result.customOrder && Array.isArray(result.customOrder)) {
      const newItemsWithOrder = result.customOrder.map((item, idx) => ({ ...item, order: idx + 1 }));
      setItems(newItemsWithOrder);
      // Check if order has changed compared to original
      const hasOrderChanged = newItemsWithOrder.some((item, index) => {
        return item[idKey] !== originalItems[index]?.[idKey];
      });
      setHasChanges(hasOrderChanged);
      return;
    }
    if (!result.destination || !isMountedRef.current) {
      console.log('No destination or not mounted');
      return;
    }
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) {
      console.log('Same position, no change');
      return;
    }
    console.log(`Moving item from ${sourceIndex} to ${destinationIndex}`);
    // Create a new array from current items
    const newItems = Array.from(items);
    // Remove the item from source index
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    // Insert the item at destination index
    newItems.splice(destinationIndex, 0, reorderedItem);
    console.log('New items order:', newItems.map(item => item[idKey]));
    // Update the 'order' field for each item to match its new position
    const newItemsWithOrder = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    setItems(newItemsWithOrder);
    // Check if order has changed compared to original
    const hasOrderChanged = newItemsWithOrder.some((item, index) => {
      return item[idKey] !== originalItems[index]?.[idKey];
    });
    console.log('Has order changed:', hasOrderChanged);
    setHasChanges(hasOrderChanged);
  }, [items, originalItems, idKey]);

  // Accepts optional argument for items to save
  const saveOrder = useCallback(async (itemsToSave) => {
    const itemsForSave = itemsToSave || items;
    if (!isMountedRef.current || !hasChanges && !itemsToSave) {
      console.log('Cannot save: not mounted or no changes');
      return false;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setIsSaving(true);
      setError(null);
      // Send the full reordered image objects with updated order fields
      console.log('Saving order with reordered images:', itemsForSave);
      const result = await saveItemOrder(itemsForSave, abortControllerRef.current.signal);
      if (result && isMountedRef.current) {
        setOriginalItems(JSON.parse(JSON.stringify(itemsForSave)));
        setHasChanges(false);
        setItems(itemsForSave); // update local state to match saved
        console.log('Order saved successfully');
        return true;
      }
      return false;
    } catch (err) {
      if (isMountedRef.current && err.name !== 'AbortError') {
        setError(err.message);
        console.log('Save order error:', err);
      }
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [items, hasChanges, saveItemOrder, idKey]);

  const resetOrder = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('Resetting order to original');
    setItems(JSON.parse(JSON.stringify(originalItems)));
    setHasChanges(false);
  }, [originalItems]);

  return {
    items,
    isLoading,
    isSaving,
    error,
    setError,
    hasChanges,
    loadItems,
    handleDragEnd,
    saveOrder,
    resetOrder
  };
}
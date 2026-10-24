"use client";

import { useCallback } from 'react';

/**
 * Generic navigation handler hook
 * @param {Object} config - Navigation configuration
 * @returns {Object} Navigation handlers
 */
export const useNavigationHandlers = (config) => {
  const {
    router,
    isManageMode = false,
    isMobile = false,
    baseRoute = '',
    editRoute = '/manager',
    getItemId = (item) => item.id || item._id,
    getItemSlug = (item) => item.slug || getItemId(item)
  } = config;

  const handleItemClick = useCallback((item) => {
    if (isManageMode) {
      const itemId = getItemId(item);
      router.push(`${editRoute}/${baseRoute}/${itemId}/edit`);
    } else if (!isMobile) {
      const slug = getItemSlug(item);
      router.push(`/${baseRoute}/${slug}`);
    }
  }, [isManageMode, isMobile, router, baseRoute, editRoute, getItemId, getItemSlug]);

  const handleEditClick = useCallback((item, e) => {
    e?.stopPropagation();
    const itemId = getItemId(item);
    router.push(`${editRoute}/${baseRoute}/${itemId}/edit`);
  }, [router, editRoute, baseRoute, getItemId]);

  const handleDeleteClick = useCallback((item, e) => {
    e?.stopPropagation();
    console.log(`Delete ${baseRoute}:`, getItemId(item));
    // Implement delete confirmation dialog here
  }, [baseRoute, getItemId]);

  return {
    handleItemClick,
    handleEditClick,
    handleDeleteClick
  };
}; 
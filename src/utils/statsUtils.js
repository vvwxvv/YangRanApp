/**
 * Fetch statistics for all menu sections
 * @param {Array} menuItems - Array of menu items from menuData.managerMenu
 * @returns {Promise<Object>} Object with stats keyed by section name
 */
export const fetchStats = async (menuItems) => {
  try {
    // Build endpoints from menu items
    // Only routable list sections count — settings pages (e.g. /manager/meta)
    // and href-less items are skipped.
    const routable = menuItems.filter(
      (item) => item?.href && !["/manager/meta", "/manager/artist-contact"].includes(item.href)
    );
    const endpoints = routable.map((item) => `/api/${item.href.split("/").pop()}`);

    // Fetch all endpoints in parallel
    const results = await Promise.allSettled(
      endpoints.map((endpoint) => fetch(endpoint).then((res) => res.json()))
    );

    // Process results and build stats object
    const stats = {};

    results.forEach((result, index) => {
      const key = routable[index].href.split("/").pop();
      
      if (result.status === "fulfilled" && result.value.data) {
        stats[key] = Array.isArray(result.value.data)
          ? result.value.data.length
          : result.value.pagination?.total || 0;
      } else {
        stats[key] = 0;
      }
    });

    return stats;
  } catch (err) {
    console.log("Failed to fetch stats:", err);
    throw new Error("获取数据时出错 | Error fetching data");
  }
};

/**
 * Extract key from menu item href
 * @param {string} href - Menu item href (e.g., "/manager/users")
 * @returns {string} The last segment of the path (e.g., "users")
 */
export const extractKeyFromHref = (href) => {
  return href.split("/").pop();
};

/**
 * Count items from API response
 * @param {Object} response - API response object
 * @returns {number} Count of items
 */
export const countItems = (response) => {
  if (!response || !response.data) return 0;
  
  if (Array.isArray(response.data)) {
    return response.data.length;
  }
  
  return response.pagination?.total || 0;
};
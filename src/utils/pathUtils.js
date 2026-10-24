/**
 * Utility functions for working with URL paths
 */

/**
 * Extract title from pathname
 * @param {string} pathname - The current pathname
 * @param {string} baseSegment - The base segment to look for (default: 'manager')
 * @returns {string} The extracted title in uppercase
 * @example
 * getTitleFromPath('/manager/artwork') // 'ARTWORK'
 * getTitleFromPath('/manager/exhibition') // 'EXHIBITION'
 * getTitleFromPath('/manager/news/create') // 'NEWS'
 */
export const getTitleFromPath = (pathname, baseSegment = 'manager') => {
  if (!pathname) return '';
  
  const segments = pathname.split('/').filter(Boolean);
  const baseIndex = segments.indexOf(baseSegment);
  
  if (baseIndex !== -1 && segments[baseIndex + 1]) {
    return segments[baseIndex + 1].toUpperCase();
  }
  
  return '';
};

/**
 * Get the last segment of a path
 * @param {string} pathname - The pathname
 * @returns {string} The last segment
 * @example
 * getLastPathSegment('/manager/artwork') // 'artwork'
 * getLastPathSegment('/api/news') // 'news'
 */
export const getLastPathSegment = (pathname) => {
  if (!pathname) return '';
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1] || '';
};

/**
 * Check if pathname starts with a specific path
 * @param {string} pathname - The current pathname
 * @param {string} basePath - The base path to check
 * @returns {boolean} Whether pathname starts with basePath
 */
export const isPathUnder = (pathname, basePath) => {
  if (!pathname || !basePath) return false;
  return pathname.startsWith(basePath) || pathname === basePath;
};

/**
 * Check if current path is a manager route
 * @param {string} pathname - The current pathname
 * @returns {boolean} Whether it's a manager route
 */
export const isManagerRoute = (pathname) => {
  return isPathUnder(pathname, '/manager');
};

/**
 * Build API endpoint from menu item href
 * @param {string} href - The menu item href (e.g., '/manager/artwork')
 * @returns {string} The API endpoint (e.g., '/api/artwork')
 */
export const buildApiEndpoint = (href) => {
  const key = getLastPathSegment(href);
  return `/api/${key}`;
};

/**
 * Get path segments as array
 * @param {string} pathname - The pathname
 * @returns {string[]} Array of path segments
 */
export const getPathSegments = (pathname) => {
  if (!pathname) return [];
  return pathname.split('/').filter(Boolean);
};

/**
 * Build breadcrumb items from pathname
 * @param {string} pathname - The current pathname
 * @param {Object} labelMap - Optional map of segment to display label
 * @returns {Array<{label: string, href: string}>} Breadcrumb items
 */
export const buildBreadcrumbs = (pathname, labelMap = {}) => {
  const segments = getPathSegments(pathname);
  const breadcrumbs = [];
  let currentPath = '';

  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: labelMap[segment] || segment.toUpperCase(),
      href: currentPath,
    });
  });

  return breadcrumbs;
};

export default {
  getTitleFromPath,
  getLastPathSegment,
  isPathUnder,
  isManagerRoute,
  buildApiEndpoint,
  getPathSegments,
  buildBreadcrumbs,
};
import { useMemo } from 'react';
import { getSchemaApiConfig } from '@/lib/api/schemaApiConfig';

/**
 * @param {string} schemaName  e.g. 'series', 'artwork', 'project', 'event', 'writing'
 * @param {object} [options]   forwarded to createApiResource (e.g. { idParam })
 *
 * @returns {{
 *   apiConfig: { itemUrl: string, api: object },
 *   api: object,        // has .list(), .endpoints, .methods
 *   itemUrl: string,
 * }}
 */
export default function useSchemaApiConfig(schemaName, options) {
  // Stringify options for a stable dependency — options objects are
  // typically small/static (e.g. { idParam: 'slug' }).
  const optionsKey = options ? JSON.stringify(options) : '';

  return useMemo(() => {
    const apiConfig = getSchemaApiConfig(schemaName, options);
    return { apiConfig, api: apiConfig.api, itemUrl: apiConfig.itemUrl };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaName, optionsKey]);
}
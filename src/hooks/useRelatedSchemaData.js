import { useEffect, useRef, useState } from 'react';

/**
 * @param {Object<string, { list: () => Promise<any[]> }>} sources
 *   e.g. { artwork: artworkAPI, series: seriesAPI }
 */
export default function useRelatedSchemaData(sources = {}) {
  const sourcesRef = useRef(sources);
  sourcesRef.current = sources;

  const signature = Object.keys(sources).sort().join('|');

  const [state, setState] = useState({ data: {}, loading: signature.length > 0, errors: {} });

  const fetchAll = async () => {
    const current = sourcesRef.current;
    const keys = Object.keys(current);

    if (keys.length === 0) {
      setState({ data: {}, loading: false, errors: {} });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    const results = await Promise.allSettled(keys.map((key) => current[key]?.list?.()));

    const data = {};
    const errors = {};

    results.forEach((res, idx) => {
      const key = keys[idx];
      if (res.status === 'fulfilled') {
        const value = res.value;
        data[key] = Array.isArray(value) ? value : value?.data ?? [];
      } else {
        data[key] = [];
        errors[key] = res.reason;
        console.log(`[useRelatedSchemaData] "${key}" failed:`, res.reason);
      }
    });

    setState({ data, loading: false, errors });
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return { ...state, refetch: fetchAll };
}
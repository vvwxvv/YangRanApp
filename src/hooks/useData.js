import { useState, useEffect, useRef, useCallback } from 'react';
import { beginLoad, endLoad } from '@/utils/pageLoadState';

/** Abort a request that never settles. The Mongo-backed list endpoints measure
 *  ~1-16s per collection (cold), and manager pages fire several of them at
 *  once, so this has to be generous — a tight watchdog just turns a slow load
 *  into a bogus "Request timeout" error. */
const REQUEST_TIMEOUT_MS = 45000;
/** Extra attempts for transient failures — a single dropped/slow request
 *  should not turn into an error screen the user has to refresh away. */
const MAX_RETRIES = 2;

export default function useData(apiEndpoint, itemUrl = null, isCn = false) {

  const [data, setData] = useState([]);
  // A provided endpoint ALWAYS starts a fetch, so begin in the loading state.
  // Starting at `false` made the very first paint look like "finished, no data",
  // which flashed empty states / "not found" before the request resolved (and
  // mismatched the server render, where effects never run).
  const [isLoading, setIsLoading] = useState(() => Boolean(apiEndpoint));
  const [error, setError] = useState(null);

  // Use refs to track component mount state
  const isMountedRef = useRef(true);
  const retryTimeoutRef = useRef(null);
  // Retry attempt counter. Deliberately a REF, not state: a state counter would
  // change `fetchData`'s identity, re-run the fetch effect, and reset the count
  // on every attempt — which made a persistently failing request retry forever.
  const attemptRef = useRef(0);

  // Cleanup function to clear timeouts
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const fetchData = useCallback(async (isRetry = false) => {
    if (!apiEndpoint) {
      setError('No API endpoint provided');
      setIsLoading(false);
      return;
    }

    // Clear any existing timeout
    cleanup();

    let watchdog = null;
    let didRetry = false;
    let timedOut = false;

    try {
      if (!isMountedRef.current) return;

      setError(null);

      if (!isRetry) {
        attemptRef.current = 0;
        setIsLoading(true);
      }

      // Watchdog: abort a request that never settles. It MUST be cancelled in
      // `finally` below — leaving it armed made it fire ~30s after a
      // SUCCESSFUL load and push a bogus "Request timeout" error into a page
      // that had rendered fine (the "Loading Failed / System Empty" flash).
      const controller = new AbortController();
      watchdog = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, REQUEST_TIMEOUT_MS);

      const response = await fetch(apiEndpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      // Check if component is still mounted before proceeding
      if (!isMountedRef.current) return;

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
        const httpError = new Error(errorMessage);
        // 5xx is worth another try; 4xx is a real answer.
        httpError.retryable = response.status >= 500;
        throw httpError;
      }

      const result = await response.json();

      // Handle different response structures
      let items = [];
      if (result && typeof result === 'object') {
        if (Array.isArray(result.data)) {
          items = result.data;
        } else if (Array.isArray(result.items)) {
          items = result.items;
        } else if (Array.isArray(result)) {
          items = result;
        } else {
          console.warn('Unexpected response structure:', result);
        }
      }

      if (!isMountedRef.current) return;

      setData(items);
      attemptRef.current = 0;

    } catch (err) {
      if (!isMountedRef.current) return;

      // Retry transient failures (network / timeout / 5xx). While a retry is
      // pending we STAY in the loading state, so no page can flash its
      // empty/error screen just because one request was slow or dropped.
      const isNetworkError =
        err?.name === 'TypeError' ||
        err?.name === 'AbortError' ||
        String(err?.message || '').toLowerCase().includes('fetch') ||
        String(err?.message || '').toLowerCase().includes('network') ||
        String(err?.message || '').toLowerCase().includes('failed to fetch');

      const shouldRetry =
        attemptRef.current < MAX_RETRIES &&
        (err?.retryable || isNetworkError || timedOut);

      if (shouldRetry) {
        attemptRef.current += 1;
        didRetry = true;

        // Simple delay: 1s, 2s
        const delay = attemptRef.current * 1000;
        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            fetchData(true);
          }
        }, delay);
        return;
      }

      let errorMessage = 'Failed to fetch data';
      if (timedOut) {
        errorMessage = 'Request timeout - please try again';
      } else if (isNetworkError) {
        errorMessage = 'Network error - please check your connection';
      } else if (err?.message) {
        errorMessage = err.message;
      }

      // Keep whatever we already had — a failed refresh should not blank a
      // page that was rendering fine a moment ago.
      setData((prev) => (Array.isArray(prev) && prev.length ? prev : []));
      setError(errorMessage);

    } finally {
      // The request has settled: the watchdog must not outlive it.
      if (watchdog) clearTimeout(watchdog);

      if (isMountedRef.current && !didRetry) {
        retryTimeoutRef.current = null;
        setIsLoading(false);
      }
    }
  }, [apiEndpoint, cleanup, isCn]); // Add isCn dependency

  // Page-loader participation: one token while this hook reports `isLoading`.
  // Tying it to the state (instead of an individual request) means remounts,
  // aborted requests and retries can never leave a stale token behind — the
  // shell stays hidden until the data has actually arrived.
  useEffect(() => {
    if (!isLoading) return undefined;
    const token = beginLoad();
    return () => endLoad(token);
  }, [isLoading]);

  // Initial data fetch
  useEffect(() => {
    if (apiEndpoint) {
      fetchData();
    }
  }, [apiEndpoint, fetchData, isCn]); // Add isCn dependency

  // Event listeners for data refresh
  useEffect(() => {
    if (!itemUrl) return;

    const handleStorageChange = (e) => {
      if (e.key === `${itemUrl}_updated`) {
        fetchData();
        // Clear the storage event
        try {
          localStorage.removeItem(e.key);
        } catch (err) {
          console.warn('Failed to remove localStorage item:', err);
        }
      }
    };

    const handleCustomRefresh = () => {
      fetchData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(`refresh_${itemUrl}`, handleCustomRefresh);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(`refresh_${itemUrl}`, handleCustomRefresh);
    };
  }, [itemUrl, fetchData, isCn]); // Add isCn dependency

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Manual refresh function
  const refetch = useCallback(() => {
    attemptRef.current = 0; // Reset retry count on manual refetch
    fetchData();
  }, [fetchData]);

  // Helper function to trigger refresh for other components
  const triggerRefresh = useCallback(() => {
    if (itemUrl) {
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent(`refresh_${itemUrl}`));
      // Also set localStorage for cross-tab communication
      try {
        localStorage.setItem(`${itemUrl}_updated`, Date.now().toString());
      } catch (err) {
        console.warn('Failed to set localStorage item:', err);
      }
    }
  }, [itemUrl]);

  return { 
    data, 
    isLoading, 
    error, 
    refetch,
    triggerRefresh,
    // Allow manual data manipulation if needed
    updateData: useCallback((newData) => {
      if (isMountedRef.current) {
        setData(newData);
      }
    }, []),
    updateError: useCallback((newError) => {
      if (isMountedRef.current) {
        setError(newError);
      }
    }, [])
  };
}

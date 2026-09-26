import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

/**
 * Generic GET hook for public pages. Deliberately returns the raw response
 * shape from the API rather than forcing a fixed {items, pagination}
 * contract — different endpoints return different shapes (paginated lists,
 * plain arrays for /journey, stats objects for /dsa/stats) and callers
 * know best how to use their own data.
 *
 * @param {string|null} path - full query string included, e.g. '/projects?limit=100'.
 *   Pass null to skip fetching (e.g. waiting on another value first).
 */
export function useApiGet(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get(path)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Something went wrong loading this.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path, version]);

  return { data, loading, error, reload };
}

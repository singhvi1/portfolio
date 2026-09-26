import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export function useEntityList(endpoint, { limit = 20 } = {}) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      const data = await api.get(`${endpoint}?${params.toString()}`);
      setItems(data.items || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: data.items?.length || 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, search, limit]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return { items, pagination, page, setPage, search, setSearch, loading, error, reload: load };
}

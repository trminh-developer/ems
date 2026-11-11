import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { AdminPage } from '../services/adminService';

export const adminErrorMessage = (error: unknown) => {
  const failure = error as { response?: { data?: { error?: string } }; message?: string };
  return failure.response?.data?.error || 'Không thể kết nối máy chủ. Vui lòng thử lại.';
};
export function useAdminData<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    if (!url) { setData(null); setLoading(false); return; }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    void apiClient.get<T>(url, { signal: controller.signal }).then(response => {
      if (!controller.signal.aborted) setData(response.data);
    }).catch(failure => {
      if (!controller.signal.aborted) setError(adminErrorMessage(failure));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [url, revision]);
  return { data, loading, error, refresh };
}

export function useAdminList<T>(path: string, defaults: Record<string, string> = {}) {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  const setFilter = useCallback((key: string, value: string) => {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value); else next.delete(key);
      if (key !== 'page') next.set('page', '1');
      return next;
    }, { replace: true });
  }, [setParams]);
  useEffect(() => { setQuery(q); }, [q]);
  useEffect(() => {
    if (query === q) return;
    const timer = setTimeout(() => setFilter('q', query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query, q, setFilter]);
  const request = new URLSearchParams(defaults);
  params.forEach((value, key) => request.set(key, value));
  const state = useAdminData<AdminPage<T>>(path + '?' + request.toString());
  useEffect(() => {
    if (state.data && !state.loading && state.data.page > state.data.totalPages) setFilter('page', String(state.data.totalPages));
  }, [state.data, state.loading, setFilter]);
  return { ...state, query, setQuery, setFilter,
    filter: (key: string) => params.get(key) || defaults[key] || 'ALL',
    clear: () => { setQuery(''); setParams({}, { replace: true }); },
  };
}

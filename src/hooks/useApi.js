import { useState, useEffect, useCallback } from 'react';

export function useApi(apiCall, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall();
      // Support both wrapped { data: ... } and direct responses
      setData(res.data?.data !== undefined ? res.data.data : res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useApiMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (apiCall, { onSuccess, onError } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall();
      onSuccess?.(res.data.data);
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed.';
      setError(msg);
      onError?.(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

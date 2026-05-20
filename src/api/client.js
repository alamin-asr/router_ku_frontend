import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach JWT ──────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('router_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: handle 401 + auto-refresh ──────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('router_refresh_token');
      if (!refreshToken) {
        window.location.href = '/login';
        return Promise.reject(err);
      }
      try {
        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
        const newToken = data.data.accessToken;
        localStorage.setItem('router_access_token', newToken);
        localStorage.setItem('router_refresh_token', data.data.refreshToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export const publicApi = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;

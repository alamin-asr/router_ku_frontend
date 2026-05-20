import api, { publicApi } from './client';

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (token) => api.post('/auth/refresh', { refreshToken: token }),
  registerInitiate: (data) => api.post('/auth/register-request', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  setPassword: (data) => api.post('/auth/set-password', data),
};

// ── User ─────────────────────────────────────────────────────────────────────
export const userApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (id, data) => api.put(`/users/update/${id}`, data),
  completeProfile: (data) => api.post('/users/complete-profile', data),
};

// ── Events ───────────────────────────────────────────────────────────────────
export const eventsApi = {
  getUpcoming: () => publicApi.get('/v1/events/upcoming'),
  getPast: () => publicApi.get('/v1/events/past-event'),
  create: (data) => api.post('v1/events/create', data),
  // update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`v1/events/delete/${id}`),
};

// ── Workshops ─────────────────────────────────────────────────────────────────
export const workshopsApi = {
  getAll: () => api.get('/workshop/getAll-workshop'),
  getOne: (id) => api.get(`/workshops/${id}`),
  create: (data) => api.post('/workshop/create-workshop', data),
  update: (id, data) => api.put(`/workshops/${id}`, data),
  delete: (id) => api.delete(`/workshops/${id}`),
  register: (data) => api.post('/workshops/getAll-workshopRegistered', data),
  getMyRegistrations: () => api.get('/workshops/my-registrations'),
};

// ── Competitions ──────────────────────────────────────────────────────────────
export const competitionsApi = {
  getAll: () => api.get('/competitions'),
  create: (data) => api.post('/competitions', data),
  update: (id, data) => api.put(`/competitions/${id}`, data),
  delete: (id) => api.delete(`/competitions/${id}`),
  register: (data) => api.post('/competitions/register', data),
  getMyRegistrations: () => api.get('/competitions/my-registrations'),
  getAllRegistrations: () => api.get('/competitions/registrations'),
};

// ── Projects ──────────────────────────────────────────────────────────────────
export const projectsApi = {
  getAll: (category) => api.get('/projects', { params: category ? { category } : {} }),
  getFeatured: () => api.get('/projects/featured'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// ── Announcements ─────────────────────────────────────────────────────────────
export const announcementsApi = {
  getAll: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

// ── Gallery ───────────────────────────────────────────────────────────────────
export const galleryApi = {
  getAll: (category) => api.get('/gallery', { params: category ? { category } : {} }),
  create: (data) => api.post('/gallery', data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getMembers: (params) => api.get('/users/getAllUser', { params }),
};
import axios from 'axios';

// Create configured axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const portfolioAPI = {
  get: () => api.get('/portfolio').then(res => res.data),
  update: (data) => api.put('/portfolio', data).then(res => res.data)
};

export const skillsAPI = {
  getAll: () => api.get('/skills').then(res => res.data),
  create: (data) => api.post('/skills', data).then(res => res.data),
  update: (id, data) => api.put(`/skills/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/skills/${id}`).then(res => res.data),
  reorder: (skillIds) => api.put('/skills/reorder', { skillIds }).then(res => res.data)
};

export const projectsAPI = {
  getAll: () => api.get('/projects').then(res => res.data),
  create: (data) => api.post('/projects', data).then(res => res.data),
  update: (id, data) => api.put(`/projects/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/projects/${id}`).then(res => res.data),
  reorder: (projectIds) => api.put('/projects/reorder', { projectIds }).then(res => res.data)
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data).then(res => res.data),
  getAll: (search = '') => api.get(`/contact?search=${encodeURIComponent(search)}`).then(res => res.data),
  toggleRead: (id) => api.put(`/contact/${id}/read`).then(res => res.data),
  delete: (id) => api.delete(`/contact/${id}`).then(res => res.data)
};

export const analyticsAPI = {
  get: () => api.get('/analytics').then(res => res.data),
  track: (eventType) => api.post('/analytics/track', { eventType }).then(res => res.data)
};

export const mediaAPI = {
  getAll: () => api.get('/media').then(res => res.data),
  upload: (formData) => api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data),
  delete: (filename) => api.delete(`/media/${filename}`).then(res => res.data)
};

export default api;

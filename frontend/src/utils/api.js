import axios from 'axios';

// Detect whether running in dev with direct port or proxy
const BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for graceful error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, token might be invalid or expired
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-changed'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth API Calls
export const authAPI = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  seedDemo: async () => {
    const res = await api.post('/auth/seed-demo');
    return res.data;
  }
};

// Visitor Management API Calls
export const visitorAPI = {
  getVisitors: async (params = {}) => {
    const res = await api.get('/visitors', { params });
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/visitors/stats');
    return res.data;
  },
  getVisitorById: async (id) => {
    const res = await api.get(`/visitors/${id}`);
    return res.data;
  },
  createVisitor: async (data) => {
    const res = await api.post('/visitors', data);
    return res.data;
  },
  updateVisitor: async (id, data) => {
    const res = await api.put(`/visitors/${id}`, data);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/visitors/${id}/status`, { status });
    return res.data;
  },
  deleteVisitor: async (id) => {
    const res = await api.delete(`/visitors/${id}`);
    return res.data;
  }
};

export default api;

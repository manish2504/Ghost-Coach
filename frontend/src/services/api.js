import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ghost_coach_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ghost_coach_token');
      localStorage.removeItem('ghost_coach_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const sessionsAPI = {
  upload: (formData, onProgress) =>
    api.post('/sessions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  getAll: () => api.get('/sessions'),
  getById: (id) => api.get(`/sessions/${id}`),
};

export const chatAPI = {
  getMessages: (sessionId) => api.get(`/chat/${sessionId}`),
  sendMessage: (sessionId, message) => api.post(`/chat/${sessionId}`, { message }),
};

export default api;

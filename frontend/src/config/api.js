// API konfiguracija za RecFinder
const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '/api'  // Vercel serverless funkcije 
  : 'http://localhost:3001/api';

// API helper funkcija
export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('rf_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    register: (userData) => api.request('/auth/register', {
      method: 'POST',
      body: userData,
    }),
    login: (credentials) => api.request('/auth/login', {
      method: 'POST', 
      body: credentials,
    }),
    me: () => api.request('/auth/me'),
  },

  // Events endpoints
  events: {
    getAll: () => api.request('/events'),
    getById: (id) => api.request(`/events/${id}`),
    create: (eventData) => api.request('/events', {
      method: 'POST',
      body: eventData,
    }),
    update: (id, eventData) => api.request(`/events/${id}`, {
      method: 'PUT',
      body: eventData,
    }),
    delete: (id) => api.request(`/events/${id}`, {
      method: 'DELETE',
    }),
    join: (id) => api.request(`/events/${id}/join`, {
      method: 'POST',
    }),
    leave: (id) => api.request(`/events/${id}/leave`, {
      method: 'DELETE',
    }),
  },

  // Users endpoints
  users: {
    getProfile: (id) => api.request(`/users/${id}`),
    updateProfile: (id, userData) => api.request(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    }),
  },
};
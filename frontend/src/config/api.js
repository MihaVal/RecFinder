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
    async getAll() {
      try {
        // Poskusi dobiti iz API
        const apiEvents = await api.request('/events');
        
        // Dobi lokalne dogodke iz localStorage
        const localEvents = JSON.parse(localStorage.getItem('rf_local_events') || '[]');
        
        // Združi API in lokalne dogodke
        const allEvents = [...apiEvents, ...localEvents];
        
        return allEvents;
      } catch (error) {
        // Če API ne deluje, vrni samo lokalne dogodke
        console.warn('API not available, using local events only');
        return JSON.parse(localStorage.getItem('rf_local_events') || '[]');
      }
    },
    
    getById: (id) => api.request(`/events/${id}`),
    
    async create(eventData) {
      try {
        // Poskusi ustvariti preko API
        const newEvent = await api.request('/events', {
          method: 'POST',
          body: eventData,
        });
        return newEvent;
      } catch (error) {
        // Če API ne deluje, shrani lokalno
        console.warn('API not available, saving locally');
        
        const newEvent = {
          id: Date.now().toString(),
          ...eventData,
          currentParticipants: 1,
          createdAt: new Date().toISOString()
        };
        
        const localEvents = JSON.parse(localStorage.getItem('rf_local_events') || '[]');
        localEvents.push(newEvent);
        localStorage.setItem('rf_local_events', JSON.stringify(localEvents));
        
        return newEvent;
      }
    },
    
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
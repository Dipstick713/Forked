const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('forked_auth_token');
};

const api = {
  async get(endpoint) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      const token = getToken();
      if (token) {
        console.log(`[API GET ${endpoint}] Adding auth token to request`);
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log(`[API GET ${endpoint}] No token available`);
      }
      
      console.log(`[API GET ${endpoint}] Fetching from: ${API_BASE}${endpoint}`);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers,
      });
      
      console.log(`[API GET ${endpoint}] Response status:`, response.status);
      
      if (!response.ok) {
        console.error(`[API GET ${endpoint}] Failed with status:`, response.status);
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      console.log(`[API GET ${endpoint}] Success`);
      return response.json();
    } catch (error) {
      console.error(`[API GET ${endpoint}] Error:`, error);
      console.error(`[API GET ${endpoint}] Error name:`, error.name);
      console.error(`[API GET ${endpoint}] Error message:`, error.message);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
};

export default api;

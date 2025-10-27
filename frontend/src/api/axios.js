const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

console.log('API configured with base URL:', API_BASE);

const api = {
  async get(endpoint) {
    console.log('GET', `${API_BASE}${endpoint}`);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        console.error('Request failed:', error);
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    console.log('POST', `${API_BASE}${endpoint}`, data);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        console.error('Request failed:', error);
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    console.log('PUT', `${API_BASE}${endpoint}`, data);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        console.error('Request failed:', error);
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    console.log('DELETE', `${API_BASE}${endpoint}`);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        console.error('Request failed:', error);
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
};

export default api;

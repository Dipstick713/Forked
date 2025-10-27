import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const authService = {
  // Redirect to GitHub login
  loginWithGitHub() {
    window.location.href = `${API_BASE}/auth/github`;
  },

  // Check if user is logged in
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return { user: null };
    }
  },

  // Logout
  async logout() {
    try {
      await api.get('/auth/logout');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }
};
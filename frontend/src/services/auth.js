import api from '../api/axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const authService = {
  // Redirect to GitHub login
  loginWithGitHub() {
    window.location.href = `${API_BASE}/auth/github`;
  },

  // Check if user is logged in
  async getCurrentUser() {
    try {
      const data = await api.get('/auth/user');
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      // Remove invalid token
      localStorage.removeItem('forked_auth_token');
      return { user: null };
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
      // Remove token from localStorage
      localStorage.removeItem('forked_auth_token');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      // Still remove token even if server call fails
      localStorage.removeItem('forked_auth_token');
      return false;
    }
  }
};
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
      console.error('[AuthService] Error fetching user:', error);
      
      // If it's a network error, the backend might be waking up
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        // Wait 2 seconds and retry once
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const data = await api.get('/auth/user');
          return data;
        } catch (retryError) {
          console.error('[AuthService] Retry failed:', retryError);
          // Remove invalid token
          localStorage.removeItem('forked_auth_token');
          return { user: null };
        }
      }
      
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
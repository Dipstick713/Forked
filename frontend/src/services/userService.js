import api from '../api/axios';

export const userService = {
  // Search users by query
  async searchUsers(query) {
    try {
      const data = await api.get(`/api/users/search/${encodeURIComponent(query)}`);
      return data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const data = await api.get(`/api/users/${userId}`);
      return data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Get user by username
  async getUserByUsername(username) {
    try {
      const data = await api.get(`/api/users/username/${username}`);
      return data;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  },

  // Get user's posts
  async getUserPosts(userId, page = 1, limit = 20) {
    try {
      const queryString = new URLSearchParams({ page, limit }).toString();
      const data = await api.get(`/api/users/${userId}/posts?${queryString}`);
      return data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  // Get current user profile
  async getCurrentUserProfile() {
    try {
      const data = await api.get('/api/users/profile/me');
      return data;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      // If profileData contains files, convert to base64
      if (profileData.avatar instanceof File || profileData.banner instanceof File) {
        const payload = {};
        
        if (profileData.displayName) payload.displayName = profileData.displayName;
        if (profileData.bio) payload.bio = profileData.bio;
        if (profileData.location) payload.location = profileData.location;
        if (profileData.website) payload.website = profileData.website;
        
        if (profileData.avatar instanceof File) {
          payload.avatarUrl = await this.fileToBase64(profileData.avatar);
        }
        if (profileData.banner instanceof File) {
          payload.bannerUrl = await this.fileToBase64(profileData.banner);
        }
        
        const data = await api.put('/api/users/profile', payload);
        return data;
      } else {
        // Send as regular JSON if no files
        const data = await api.put('/api/users/profile', profileData);
        return data;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Helper function to convert File to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
};

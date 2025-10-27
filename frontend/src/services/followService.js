import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const followService = {
  // Follow a user
  async followUser(userId) {
    try {
      const response = await api.post(`/api/follows/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },

  // Unfollow a user
  async unfollowUser(userId) {
    try {
      const response = await api.delete(`/api/follows/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },

  // Get followers of a user
  async getFollowers(userId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/api/follows/${userId}/followers`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching followers:', error);
      throw error;
    }
  },

  // Get following of a user
  async getFollowing(userId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/api/follows/${userId}/following`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching following:', error);
      throw error;
    }
  },

  // Check if following a user
  async checkFollowStatus(userId) {
    try {
      const response = await api.get(`/api/follows/check/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking follow status:', error);
      throw error;
    }
  }
};

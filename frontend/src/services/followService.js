import api from '../api/axios';

export const followService = {
  // Follow a user
  async followUser(userId) {
    try {
      const data = await api.post(`/api/follows/${userId}`);
      return data;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },

  // Unfollow a user
  async unfollowUser(userId) {
    try {
      const data = await api.delete(`/api/follows/${userId}`);
      return data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },

  // Get followers of a user
  async getFollowers(userId, page = 1, limit = 20) {
    try {
      const queryString = new URLSearchParams({ page, limit }).toString();
      const data = await api.get(`/api/follows/${userId}/followers?${queryString}`);
      return data;
    } catch (error) {
      console.error('Error fetching followers:', error);
      throw error;
    }
  },

  // Get following of a user
  async getFollowing(userId, page = 1, limit = 20) {
    try {
      const queryString = new URLSearchParams({ page, limit }).toString();
      const data = await api.get(`/api/follows/${userId}/following?${queryString}`);
      return data;
    } catch (error) {
      console.error('Error fetching following:', error);
      throw error;
    }
  },

  // Check if following a user
  async checkFollowStatus(userId) {
    try {
      const data = await api.get(`/api/follows/check/${userId}`);
      return data;
    } catch (error) {
      console.error('Error checking follow status:', error);
      throw error;
    }
  }
};

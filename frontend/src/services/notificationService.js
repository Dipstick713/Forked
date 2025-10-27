import api from '../api/axios';

export const notificationService = {
  // Get user's notifications
  async getNotifications(page = 1, limit = 20) {
    try {
      const queryString = new URLSearchParams({ page, limit }).toString();
      const data = await api.get(`/api/notifications?${queryString}`);
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const data = await api.put(`/api/notifications/${notificationId}/read`);
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const data = await api.put('/api/notifications/read-all');
      return data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      const data = await api.delete(`/api/notifications/${notificationId}`);
      return data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get unread count
  async getUnreadCount() {
    try {
      const data = await api.get('/api/notifications/unread-count');
      return data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
};

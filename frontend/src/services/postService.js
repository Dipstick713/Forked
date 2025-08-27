import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const postService = {
  // Get all posts
  async getPosts() {
    try {
      const response = await api.get('/api/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Create new post
  async createPost(postData) {
    try {
      const response = await api.post('/api/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Like/unlike post
  async likePost(postId, action) {
    try {
      const response = await api.put(`/api/posts/${postId}/like`, { action });
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  // Delete post
  async deletePost(postId) {
    try {
      const response = await api.delete(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};
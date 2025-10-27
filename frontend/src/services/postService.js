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

  // Get a specific post
  async getPost(postId) {
    try {
      const response = await api.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Get replies for a post
  async getPostReplies(postId) {
    try {
      const response = await api.get(`/api/posts/${postId}/replies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  },

  // Get forks for a post
  async getPostForks(postId) {
    try {
      const response = await api.get(`/api/posts/${postId}/forks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching forks:', error);
      throw error;
    }
  },

  // Create new post
  async createPost(postData) {
    try {
      // If postData contains a file, convert to base64
      if (postData.image instanceof File) {
        const base64Image = await this.fileToBase64(postData.image);
        const payload = {
          content: postData.content,
          image: base64Image
        };
        if (postData.forkedFrom) {
          payload.forkedFrom = postData.forkedFrom;
        }
        if (postData.parentId) {
          payload.parentId = postData.parentId;
        }
        
        const response = await api.post('/api/posts', payload);
        return response.data;
      } else {
        // Send as regular JSON if no file
        const response = await api.post('/api/posts', postData);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating post:', error);
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
import api from '../api/axios';

export const postService = {
  // Get all posts
  async getPosts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/api/posts?${queryString}` : '/api/posts';
      const data = await api.get(endpoint);
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get a specific post
  async getPost(postId) {
    try {
      const data = await api.get(`/api/posts/${postId}`);
      return data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Get replies for a post
  async getPostReplies(postId) {
    try {
      const data = await api.get(`/api/posts/${postId}/replies`);
      return data;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  },

  // Get forks for a post
  async getPostForks(postId) {
    try {
      const data = await api.get(`/api/posts/${postId}/forks`);
      return data;
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
        
        const data = await api.post('/api/posts', payload);
        return data;
      } else {
        // Send as regular JSON if no file
        const data = await api.post('/api/posts', postData);
        return data;
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
      const data = await api.put(`/api/posts/${postId}/like`, { action });
      return data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  // Delete post
  async deletePost(postId) {
    try {
      const data = await api.delete(`/api/posts/${postId}`);
      return data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};
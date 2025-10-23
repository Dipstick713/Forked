import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

axios.defaults.withCredentials = true;

export const likePost = async (postId) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${postId}/like`, {
      action: 'like'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${postId}/like`, {
      action: 'unlike'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserLikedPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/likes/my-likes`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

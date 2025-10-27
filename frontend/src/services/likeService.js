import api from '../api/axios';

export const likePost = async (postId) => {
  try {
    const data = await api.put(`/api/posts/${postId}/like`, {
      action: 'like'
    });
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const unlikePost = async (postId) => {
  try {
    const data = await api.put(`/api/posts/${postId}/like`, {
      action: 'unlike'
    });
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserLikedPosts = async () => {
  try {
    const data = await api.get('/api/likes/my-likes');
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserLikedPostsWithDetails = async (userId) => {
  try {
    const data = await api.get(`/api/likes/user/${userId}`);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

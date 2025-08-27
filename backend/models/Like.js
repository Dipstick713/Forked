const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  // Compound index to ensure one like per user per post
  indexes: [
    { 
      unique: true, 
      fields: ['user', 'post'] 
    }
  ]
});

// Auto-increment post's like count when a like is created
likeSchema.post('save', async function(doc) {
  try {
    const Like = mongoose.model('Like');
    const likeCount = await Like.countDocuments({ post: doc.post });
    
    await mongoose.model('Post').findByIdAndUpdate(doc.post, {
      'stats.likes': likeCount
    });
  } catch (error) {
    console.error('Error updating like count:', error);
  }
});

// Auto-decrement post's like count when a like is removed
likeSchema.post('remove', async function(doc) {
  try {
    const Like = mongoose.model('Like');
    const likeCount = await Like.countDocuments({ post: doc.post });
    
    await mongoose.model('Post').findByIdAndUpdate(doc.post, {
      'stats.likes': likeCount
    });
  } catch (error) {
    console.error('Error updating like count:', error);
  }
});

// Static method to check if a user has liked a post
likeSchema.statics.hasLiked = async function(userId, postId) {
  return await this.exists({ user: userId, post: postId });
};

// Static method to get like count for a post
likeSchema.statics.getLikeCount = async function(postId) {
  return await this.countDocuments({ post: postId });
};

// Static method to get users who liked a post
likeSchema.statics.getLikers = async function(postId, limit = 10) {
  return await this.find({ post: postId })
    .populate('user', 'username displayName avatarUrl')
    .limit(limit)
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Like', likeSchema);
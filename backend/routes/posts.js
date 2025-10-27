const express = require('express');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Notification = require('../models/Notification');
const router = express.Router();

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// Get all posts (with optional pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'username displayName avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific post with its thread
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username displayName avatarUrl')
      .populate('parent')
      .populate('branches');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get replies/comments for a specific post
router.get('/:id/replies', async (req, res) => {
  try {
    const replies = await Post.find({ parent: req.params.id })
      .populate('author', 'username displayName avatarUrl')
      .sort({ createdAt: -1 });

    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get forks for a specific post
router.get('/:id/forks', async (req, res) => {
  try {
    const forks = await Post.find({ parent: req.params.id })
      .populate('author', 'username displayName avatarUrl')
      .sort({ createdAt: -1 });

    res.json(forks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new post
router.post('/', requireAuth, async (req, res) => {
  try {
    const { content, parentId, forkedFrom, image } = req.body;

    // Validate content
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ message: 'Post content must be 280 characters or less' });
    }

    const postData = {
      content,
      author: req.user._id
    };

    // Add image if provided (should be base64 string)
    if (image) {
      postData.image = image;
    }

    // Handle forkedFrom or parentId (they're the same thing)
    const parentPostId = forkedFrom || parentId;
    
    if (parentPostId) {
      const parentPost = await Post.findById(parentPostId);
      if (!parentPost) {
        return res.status(404).json({ message: 'Parent post not found' });
      }
      postData.parent = parentPostId;
      postData.seed = parentPost.seed;
      
      // Increment fork count on parent post
      await Post.findByIdAndUpdate(parentPostId, { $inc: { 'stats.forks': 1 } });
    }

    const post = new Post(postData);
    const savedPost = await post.save();
    
    // For parent posts, set seed to its own _id
    if (!parentPostId) {
      savedPost.seed = savedPost._id;
      await savedPost.save();
    }
    
    // Populate author info for immediate response
    await savedPost.populate('author', 'username displayName avatarUrl');

    // Create notification if it's a reply/fork
    if (parentPostId) {
      const parentPost = await Post.findById(parentPostId);
      if (parentPost && parentPost.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: parentPost.author,
          sender: req.user._id,
          type: 'fork',
          post: savedPost._id
        });
      }
    }

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like/unlike a post
router.put('/:id/like', requireAuth, async (req, res) => {
  try {
    const { action } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (action === 'like') {
      // Check if already liked
      const existingLike = await Like.findOne({ user: userId, post: postId });
      if (existingLike) {
        return res.status(400).json({ message: 'Post already liked' });
      }

      const like = new Like({ user: userId, post: postId });
      await like.save();

      // Create notification for the post author
      const post = await Post.findById(postId);
      if (post && post.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: userId,
          type: 'like',
          post: postId
        });
      }
    } else if (action === 'unlike') {
      await Like.findOneAndDelete({ user: userId, post: postId });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Get updated like count
    const likeCount = await Like.countDocuments({ post: postId });
    await Post.findByIdAndUpdate(postId, { 'stats.likes': likeCount });

    res.json({ likes: likeCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a post
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Soft delete: mark as deleted instead of removing from database
    post.deleted = true;
    post.content = '[deleted]';
    post.image = null;
    await post.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
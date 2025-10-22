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

// Create a new post
router.post('/', requireAuth, async (req, res) => {
  try {
    const { content, parentId, image } = req.body;

    // Validate content
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ message: 'Post content must be 280 characters or less' });
    }

    const postData = {
      content,
      author: req.user._id,
      image
    };

    if (parentId) {
      const parentPost = await Post.findById(parentId);
      if (!parentPost) {
        return res.status(404).json({ message: 'Parent post not found' });
      }
      postData.parent = parentId;
      postData.seed = parentPost.seed;
    }

    const post = new Post(postData);
    const savedPost = await post.save();
    
    // For parent posts, set seed to its own _id
    if (!parentId) {
      savedPost.seed = savedPost._id;
      await savedPost.save();
    }
    
    // Populate author info for immediate response
    await savedPost.populate('author', 'username displayName avatarUrl');

    // Create notification if it's a reply/fork
    if (parentId) {
      const parentPost = await Post.findById(parentId);
      if (parentPost && parentPost.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: parentPost.author,
          sender: req.user._id,
          type: parentId ? 'fork' : 'reply',
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

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
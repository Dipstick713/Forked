const express = require('express');
const Like = require('../models/Like');
const { authenticateJWT } = require('../middleware/jwt');
const router = express.Router();

// Get all posts liked by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const likes = await Like.find({ user: req.params.userId })
      .populate({
        path: 'post',
        populate: {
          path: 'author',
          select: 'username displayName avatarUrl'
        }
      })
      .sort({ createdAt: -1 });

    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all post IDs liked by the current user (lightweight for checking liked status)
router.get('/my-likes', requireAuth, async (req, res) => {
  try {
    const likes = await Like.find({ user: req.userId }).select('post');
    const postIds = likes.map(like => like.post.toString());
    res.json(postIds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users who liked a post
router.get('/post/:postId', async (req, res) => {
  try {
    const likes = await Like.find({ post: req.params.postId })
      .populate('user', 'username displayName avatarUrl')
      .sort({ createdAt: -1 });

    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

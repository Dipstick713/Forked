const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const router = express.Router();

// Search users by username or display name
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    // Search for users matching the query (case-insensitive)
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username displayName avatarUrl bio')
    .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (for testing)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile by GitHub username
router.get('/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's posts
router.get('/:id/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'username displayName avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user's profile (requires authentication)
router.get('/profile/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json(req.user);
});

// Update user profile (requires authentication)
router.put('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { displayName, bio, location, website, avatarUrl, bannerUrl } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Follow a user
router.post('/:userId', isAuthenticated, async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.userId;

    // Can't follow yourself
    if (followerId.toString() === followingId) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    // Check if user exists
    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Create follow relationship
    const follow = new Follow({
      follower: followerId,
      following: followingId
    });

    await follow.save();

    // Update follower and following counts
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });

    // Create notification
    await Notification.create({
      recipient: followingId,
      sender: followerId,
      type: 'follow'
    });

    res.json({ message: 'Successfully followed user', follow });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow a user
router.delete('/:userId', isAuthenticated, async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.userId;

    // Find and delete the follow relationship
    const follow = await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId
    });

    if (!follow) {
      return res.status(404).json({ error: 'Follow relationship not found' });
    }

    // Update follower and following counts
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

// Get followers of a user
router.get('/:userId/followers', async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const followers = await Follow.find({ following: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('follower', 'username displayName avatarUrl bio followersCount followingCount');

    const total = await Follow.countDocuments({ following: userId });

    // If authenticated, check which followers the current user is following
    let followingIds = [];
    if (req.isAuthenticated()) {
      const userFollowing = await Follow.find({ 
        follower: req.user._id,
        following: { $in: followers.map(f => f.follower._id) }
      }).select('following');
      followingIds = userFollowing.map(f => f.following.toString());
    }

    const followersWithStatus = followers.map(follow => ({
      ...follow.follower.toObject(),
      isFollowing: followingIds.includes(follow.follower._id.toString()),
      followedAt: follow.createdAt
    }));

    res.json({
      followers: followersWithStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// Get following of a user
router.get('/:userId/following', async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const following = await Follow.find({ follower: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('following', 'username displayName avatarUrl bio followersCount followingCount');

    const total = await Follow.countDocuments({ follower: userId });

    // If authenticated, check which users the current user is following
    let followingIds = [];
    if (req.isAuthenticated()) {
      const userFollowing = await Follow.find({ 
        follower: req.user._id,
        following: { $in: following.map(f => f.following._id) }
      }).select('following');
      followingIds = userFollowing.map(f => f.following.toString());
    }

    const followingWithStatus = following.map(follow => ({
      ...follow.following.toObject(),
      isFollowing: followingIds.includes(follow.following._id.toString()),
      followedAt: follow.createdAt
    }));

    res.json({
      following: followingWithStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

// Check if user is following another user
router.get('/check/:userId', isAuthenticated, async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.userId;

    const follow = await Follow.findOne({
      follower: followerId,
      following: followingId
    });

    res.json({ isFollowing: !!follow });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ error: 'Failed to check follow status' });
  }
});

module.exports = router;

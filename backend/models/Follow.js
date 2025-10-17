const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  // The user who is following
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // The user being followed
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't follow the same person twice
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Compound indexes for efficient queries
followSchema.index({ follower: 1, createdAt: -1 });
followSchema.index({ following: 1, createdAt: -1 });

module.exports = mongoose.model('Follow', followSchema);

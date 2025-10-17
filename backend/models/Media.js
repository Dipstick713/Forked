const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    index: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'gif'],
    default: 'image'
  },
  url: {
    type: String,
    required: true
  },
  filename: String,
  mimetype: String,
  size: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mediaSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);

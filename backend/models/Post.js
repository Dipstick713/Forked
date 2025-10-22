const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post' 
  },
  seed: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post'
  },
  image: { 
    type: String 
  },
  tags: [{ 
    type: String 
  }],
  stats: {
    replies: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for branches (child posts)
postSchema.virtual('branches', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'parent'
});

// Note: For parent posts (posts without a parent), 
// seed should be set to the post's own _id after creation
// This is handled in the POST route, not in the pre-save hook
// because _id is not available until after the first save

module.exports = mongoose.model('Post', postSchema);
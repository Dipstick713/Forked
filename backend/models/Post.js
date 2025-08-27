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
    ref: 'Post', 
    required: true 
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

// Auto-set seed if not provided
postSchema.pre('save', function(next) {
  if (this.isNew && !this.seed) {
    this.seed = this.parent ? this.parent.seed : this._id;
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: String,
  displayName: String,
  avatarUrl: String,
  profileUrl: String,
  email: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 
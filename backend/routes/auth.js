const express = require('express');
const passport = require('passport');
const { generateToken, authenticateJWT } = require('../middleware/jwt');
const User = require('../models/User');
const router = express.Router();

// Start GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed` 
  }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user._id.toString());
    
    // Redirect to frontend with JWT token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`);
  }
);

// Get current user (JWT protected)
router.get('/user', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        githubId: user.githubId,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout (client-side token removal, no server action needed)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router; 
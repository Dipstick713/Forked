const express = require('express');
const passport = require('passport');
const { generateToken, authenticateJWT } = require('../middleware/jwt');
const User = require('../models/User');
const router = express.Router();

// Debug endpoint to check environment
router.get('/debug/env', (req, res) => {
  res.json({
    FRONTEND_URL: process.env.FRONTEND_URL,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    NODE_ENV: process.env.NODE_ENV,
    HAS_JWT_SECRET: !!process.env.JWT_SECRET,
    HAS_GITHUB_CLIENT_ID: !!process.env.GITHUB_CLIENT_ID,
    HAS_GITHUB_CLIENT_SECRET: !!process.env.GITHUB_CLIENT_SECRET,
  });
});

// Start GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`,
    session: true
  }),
  (req, res) => {
    try {
      console.log('OAuth callback hit, user:', req.user);
      
      if (!req.user) {
        console.error('No user in OAuth callback');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_user`);
      }
      
      // Generate JWT token
      const token = generateToken(req.user._id.toString());
      console.log('Generated token for user:', req.user._id);
      
      // Redirect to frontend with JWT token
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`;
      console.log('Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
    }
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
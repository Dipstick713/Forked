const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed` 
  }),
  (req, res) => {
    // Successful authentication, redirect to frontend with success
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  }
);

// Logout


// Get current user
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        githubId: req.user.githubId,
        username: req.user.username,
        displayName: req.user.displayName,
        avatarUrl: req.user.avatarUrl,
        email: req.user.email
      }
    });
  } else {
    res.status(401).json({ user: null });
  }
});


// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});



module.exports = router; 
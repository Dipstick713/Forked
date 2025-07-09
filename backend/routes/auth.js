const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect or send user info
    res.redirect('/'); // You can change this to your frontend URL
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

// Get current user
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ user: null });
  }
});

module.exports = router; 
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
    console.log('=== GitHub callback successful ===');
    console.log('User authenticated:', req.user.username);
    console.log('Session ID:', req.sessionID);
    console.log('Session:', JSON.stringify(req.session, null, 2));
    
    // Save session before redirect to ensure it's persisted
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=session_failed`);
      }
      console.log('Session saved successfully, redirecting to:', process.env.FRONTEND_URL || 'http://localhost:5173');
      // Successful authentication, redirect to frontend with success
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
    });
  }
);

// Logout


// Get current user
router.get('/user', (req, res) => {
  console.log('=== /auth/user request ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Session ID:', req.sessionID);
  console.log('Session:', JSON.stringify(req.session, null, 2));
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('Cookies:', req.headers.cookie);
  
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
    console.log('User not authenticated - sending 401');
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
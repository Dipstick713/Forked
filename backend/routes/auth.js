const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const router = express.Router();

// Temporary token storage (in production, use Redis)
const tempTokens = new Map();

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
    
    // Generate temporary token
    const token = crypto.randomBytes(32).toString('hex');
    tempTokens.set(token, {
      userId: req.user._id,
      sessionId: req.sessionID,
      createdAt: Date.now()
    });
    
    // Clean up expired tokens (older than 5 minutes)
    for (const [key, value] of tempTokens.entries()) {
      if (Date.now() - value.createdAt > 5 * 60 * 1000) {
        tempTokens.delete(key);
      }
    }
    
    // Save session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=session_failed`);
      }
      console.log('Session saved, redirecting with token');
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth_token=${token}`);
    });
  }
);

// Exchange token for session
router.post('/exchange-token', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }
  
  const tokenData = tempTokens.get(token);
  
  if (!tokenData) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  // Check token age (5 minutes max)
  if (Date.now() - tokenData.createdAt > 5 * 60 * 1000) {
    tempTokens.delete(token);
    return res.status(401).json({ error: 'Token expired' });
  }
  
  // Set user in session
  req.session.passport = { user: tokenData.userId.toString() };
  
  // Delete token (one-time use)
  tempTokens.delete(token);
  
  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).json({ error: 'Session save failed' });
    }
    
    console.log('Token exchanged, session established for user:', tokenData.userId);
    res.json({ success: true });
  });
});

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
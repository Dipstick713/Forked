const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    
    if (!user) {
      user = await User.create({
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        avatarUrl: profile.photos?.[0]?.value,
        profileUrl: profile.profileUrl,
        email: profile.emails?.[0]?.value
      });
    } else {
      // Update user info if they already exist
      user.avatarUrl = profile.photos?.[0]?.value;
      user.displayName = profile.displayName || profile.username;
      await user.save();
    }
    
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
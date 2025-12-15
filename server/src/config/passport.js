/**
 * Passport.js Configuration - Google OAuth 2.0
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { sqlite } = require('../db/connection');

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userId = profile.id;
      const email = profile.emails?.[0]?.value || '';
      const name = profile.displayName || '';
      const profileImage = profile.photos?.[0]?.value || '';

      // Check if user exists
      const existingUser = sqlite.prepare('SELECT * FROM users WHERE id = ?').get(userId);

      if (existingUser) {
        // Update existing user
        sqlite.prepare(`
          UPDATE users SET name = ?, profile_image = ? WHERE id = ?
        `).run(name, profileImage, userId);
        
        return done(null, { ...existingUser, name, profileImage });
      } else {
        // Create new user
        sqlite.prepare(`
          INSERT INTO users (id, email, name, profile_image, created_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(userId, email, name, profileImage, Date.now());

        const newUser = sqlite.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        return done(null, newUser);
      }
    } catch (error) {
      console.error('Error in Google OAuth strategy:', error);
      return done(error, null);
    }
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  try {
    const user = sqlite.prepare('SELECT * FROM users WHERE id = ?').get(id);
    done(null, user || null);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

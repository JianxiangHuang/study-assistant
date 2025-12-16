/**
 * Authentication Routes - Google OAuth
 */

const express = require('express');
const passport = require('passport');
const router = express.Router();
const { sqlite } = require('../db/connection');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Get current user
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      profileImage: req.user.profile_image
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Initiate Google OAuth login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_URL + '/login?error=auth_failed'
  }),
  (req, res) => {
    // Successful authentication, redirect to client
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  }
);

// Logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      profileImage: req.user.profile_image
    } : null
  });
});

// Mock login (skip Google OAuth) - for demo / fallback
router.get('/mock-login', (req, res, next) => {

  if (process.env.ENABLE_MOCK_AUTH !== 'true') {
    return res.status(403).json({ message: 'Mock auth disabled' });
  }

  if (process.env.MOCK_AUTH_TOKEN) {
    const token = req.query.token;
    if (token !== process.env.MOCK_AUTH_TOKEN) {
      return res.status(401).json({ message: 'Invalid mock token' });
    }
  }

  const mockUser = {
    id: 'mock-user-001',
    email: 'mock@example.com',
    name: 'Demo User',
    profile_image: null
  };
  try {
    const existing = sqlite
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(mockUser.id);
    if (!existing) {
      sqlite.prepare(`
        INSERT INTO users (id, email, name, profile_image, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        mockUser.id,
        mockUser.email,
        mockUser.name,
        mockUser.profile_image,
        Date.now()
      );
    }
    req.login(mockUser, (err) => {
      if (err) return next(err);
      const redirectTo =
        process.env.CLIENT_URL || 'http://localhost:5173';
      return res.redirect(redirectTo);
    });
  } catch (err) {
    console.error('Mock login error:', err);
    res.status(500).json({ message: 'Mock login failed' });
  }
});

module.exports = router;
module.exports.isAuthenticated = isAuthenticated;

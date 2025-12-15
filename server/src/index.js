/**
 * AI-Powered Study Assistant - Server Entry Point
 * Express.js backend with Google OAuth, OpenAI integration, and SQLite database
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const studyMaterialRoutes = require('./routes/studyMaterials');
const flashcardRoutes = require('./routes/flashcards');
const analyzeRoutes = require('./routes/analyze');

// Import database initialization
const { initializeDatabase } = require('./db/init');

// Import passport configuration
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.options('*', cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,

    // ✅ Cross-site cookies (Vercel frontend + Render backend) need SameSite=None + Secure
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',

    // ✅ Must be true in production for SameSite=None to work (HTTPS required)
    secure: process.env.NODE_ENV === 'production',

    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize database
initializeDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/analyze', analyzeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Study Assistant API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Study Assistant server running on port ${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
});

module.exports = app;

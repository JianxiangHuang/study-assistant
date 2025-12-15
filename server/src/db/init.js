/**
 * Database Initialization - Creates tables if they don't exist
 */

const { sqlite } = require('./connection');

function initializeDatabase() {
  console.log('📦 Initializing database...');

  // Create users table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      profile_image TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Create study_materials table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS study_materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT,
      content TEXT NOT NULL,
      keywords TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Create flashcards table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id),
      study_material_id INTEGER REFERENCES study_materials(id),
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      mastered INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Create indexes for better query performance
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS idx_study_materials_user_id ON study_materials(user_id);
    CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id);
    CREATE INDEX IF NOT EXISTS idx_flashcards_study_material_id ON flashcards(study_material_id);
  `);

  console.log('✅ Database initialized successfully');
}

module.exports = { initializeDatabase };

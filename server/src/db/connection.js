/**
 * Database Connection - SQLite with better-sqlite3
 */

const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const path = require('path');

// Create database file in server directory
const dbPath = path.join(__dirname, '../../data/study-assistant.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create SQLite connection
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL'); // Better performance

// Create Drizzle ORM instance
const db = drizzle(sqlite);

module.exports = { db, sqlite };

/**
 * Database Schema - Drizzle ORM with SQLite
 * Defines tables for users, study materials, and flashcards
 */

const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');

// Users table - stores Google OAuth user data
const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Google user ID
  email: text('email').notNull().unique(),
  name: text('name'),
  profileImage: text('profile_image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// Study Materials table - stores user-submitted content for analysis
const studyMaterials = sqliteTable('study_materials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title'),
  content: text('content').notNull(),
  keywords: text('keywords'), // JSON string of keyword-detail pairs
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// Flashcards table - stores generated flashcards
const flashcards = sqliteTable('flashcards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id),
  studyMaterialId: integer('study_material_id').references(() => studyMaterials.id),
  front: text('front').notNull(), // Question side
  back: text('back').notNull(),   // Answer side
  mastered: integer('mastered').default(0), // 0 = not mastered, 1 = mastered
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

module.exports = {
  users,
  studyMaterials,
  flashcards
};

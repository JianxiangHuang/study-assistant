/**
 * Flashcard Routes - CRUD operations for flashcards
 */

const express = require('express');
const { sqlite } = require('../db/connection');
const { isAuthenticated } = require('./auth');
const { generateFlashcards } = require('../services/openai');
const { z } = require('zod');

const router = express.Router();

// Validation schemas
const createFlashcardSchema = z.object({
  studyMaterialId: z.number().optional(),
  front: z.string().min(1, 'Front text is required'),
  back: z.string().min(1, 'Back text is required')
});

const generateFlashcardsSchema = z.object({
  keywords: z.array(z.object({
    keyword: z.string(),
    detail: z.string()
  })),
  studyMaterialId: z.number().optional()
});

// Generate flashcards from keywords using AI
router.post('/generate', isAuthenticated, async (req, res) => {
  try {
    const validation = generateFlashcardsSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validation.error.errors 
      });
    }

    const { keywords, studyMaterialId } = validation.data;
    const userId = req.user.id;

    // Generate flashcards using OpenAI
    const flashcardPairs = await generateFlashcards(keywords);

    // Insert flashcards into database
    const insertStmt = sqlite.prepare(`
      INSERT INTO flashcards (user_id, study_material_id, front, back, mastered, created_at)
      VALUES (?, ?, ?, ?, 0, ?)
    `);

    const insertedCards = [];
    for (const fc of flashcardPairs) {
      const result = insertStmt.run(
        userId, 
        studyMaterialId || null, 
        fc.front, 
        fc.back, 
        Date.now()
      );
      
      const card = sqlite.prepare('SELECT * FROM flashcards WHERE id = ?')
        .get(result.lastInsertRowid);
      
      insertedCards.push({
        id: card.id,
        userId: card.user_id,
        studyMaterialId: card.study_material_id,
        front: card.front,
        back: card.back,
        mastered: card.mastered === 1,
        createdAt: card.created_at
      });
    }

    res.status(201).json({ flashcards: insertedCards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ message: 'Failed to generate flashcards' });
  }
});

// CREATE - Add single flashcard manually
router.post('/', isAuthenticated, (req, res) => {
  try {
    const validation = createFlashcardSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validation.error.errors 
      });
    }

    const { studyMaterialId, front, back } = validation.data;
    const userId = req.user.id;

    const result = sqlite.prepare(`
      INSERT INTO flashcards (user_id, study_material_id, front, back, mastered, created_at)
      VALUES (?, ?, ?, ?, 0, ?)
    `).run(userId, studyMaterialId || null, front, back, Date.now());

    const card = sqlite.prepare('SELECT * FROM flashcards WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json({
      id: card.id,
      userId: card.user_id,
      studyMaterialId: card.study_material_id,
      front: card.front,
      back: card.back,
      mastered: card.mastered === 1,
      createdAt: card.created_at
    });
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({ message: 'Failed to create flashcard' });
  }
});

// READ - Get all flashcards for current user
router.get('/', isAuthenticated, (req, res) => {
  try {
    const userId = req.user.id;
    const { studyMaterialId } = req.query;

    let query = 'SELECT * FROM flashcards WHERE user_id = ?';
    const params = [userId];

    if (studyMaterialId) {
      query += ' AND study_material_id = ?';
      params.push(studyMaterialId);
    }

    query += ' ORDER BY created_at DESC';

    const flashcards = sqlite.prepare(query).all(...params);

    res.json(flashcards.map(fc => ({
      id: fc.id,
      userId: fc.user_id,
      studyMaterialId: fc.study_material_id,
      front: fc.front,
      back: fc.back,
      mastered: fc.mastered === 1,
      createdAt: fc.created_at
    })));
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ message: 'Failed to fetch flashcards' });
  }
});

// READ - Get single flashcard by ID
router.get('/:id', isAuthenticated, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const card = sqlite.prepare(`
      SELECT * FROM flashcards WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!card) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    res.json({
      id: card.id,
      userId: card.user_id,
      studyMaterialId: card.study_material_id,
      front: card.front,
      back: card.back,
      mastered: card.mastered === 1,
      createdAt: card.created_at
    });
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    res.status(500).json({ message: 'Failed to fetch flashcard' });
  }
});

// UPDATE - Toggle mastered status
router.patch('/:id/mastered', isAuthenticated, (req, res) => {
  try {
    const { id } = req.params;
    const { mastered } = req.body;
    const userId = req.user.id;

    // Check if flashcard exists and belongs to user
    const existing = sqlite.prepare(`
      SELECT * FROM flashcards WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!existing) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    sqlite.prepare(`
      UPDATE flashcards SET mastered = ? WHERE id = ?
    `).run(mastered ? 1 : 0, id);

    res.json({ success: true, mastered: mastered });
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ message: 'Failed to update flashcard' });
  }
});

// UPDATE - Update flashcard content
router.put('/:id', isAuthenticated, (req, res) => {
  try {
    const { id } = req.params;
    const { front, back } = req.body;
    const userId = req.user.id;

    // Check if flashcard exists and belongs to user
    const existing = sqlite.prepare(`
      SELECT * FROM flashcards WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!existing) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    sqlite.prepare(`
      UPDATE flashcards 
      SET front = COALESCE(?, front), back = COALESCE(?, back)
      WHERE id = ?
    `).run(front, back, id);

    const updated = sqlite.prepare('SELECT * FROM flashcards WHERE id = ?').get(id);

    res.json({
      id: updated.id,
      userId: updated.user_id,
      studyMaterialId: updated.study_material_id,
      front: updated.front,
      back: updated.back,
      mastered: updated.mastered === 1,
      createdAt: updated.created_at
    });
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ message: 'Failed to update flashcard' });
  }
});

// DELETE - Delete flashcard
router.delete('/:id', isAuthenticated, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if flashcard exists and belongs to user
    const existing = sqlite.prepare(`
      SELECT * FROM flashcards WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!existing) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    sqlite.prepare('DELETE FROM flashcards WHERE id = ?').run(id);

    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ message: 'Failed to delete flashcard' });
  }
});

module.exports = router;

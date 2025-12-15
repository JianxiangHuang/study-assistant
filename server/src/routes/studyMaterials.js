/**
 * Study Materials Routes - CRUD operations for study content
 */

const express = require('express');
const { sqlite } = require('../db/connection');
const { isAuthenticated } = require('./auth');
const { z } = require('zod');

const router = express.Router();

// Validation schemas
const createMaterialSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required')
});

const updateMaterialSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  keywords: z.string().optional() // JSON string
});

// CREATE - Add new study material
router.post('/', isAuthenticated, (req, res) => {
  try {
    const validation = createMaterialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validation.error.errors 
      });
    }

    const { title, content } = validation.data;
    const userId = req.user.id;

    const result = sqlite.prepare(`
      INSERT INTO study_materials (user_id, title, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, title || null, content, Date.now(), Date.now());

    const material = sqlite.prepare('SELECT * FROM study_materials WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json({
      id: material.id,
      userId: material.user_id,
      title: material.title,
      content: material.content,
      keywords: material.keywords ? JSON.parse(material.keywords) : null,
      createdAt: material.created_at,
      updatedAt: material.updated_at
    });
  } catch (error) {
    console.error('Error creating study material:', error);
    res.status(500).json({ message: 'Failed to create study material' });
  }
});

// READ - Get all study materials for current user
router.get('/', isAuthenticated, (req, res) => {
  try {
    const userId = req.user.id;
    const materials = sqlite.prepare(`
      SELECT * FROM study_materials 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(userId);

    res.json(materials.map(m => ({
      id: m.id,
      userId: m.user_id,
      title: m.title,
      content: m.content,
      keywords: m.keywords ? JSON.parse(m.keywords) : null,
      createdAt: m.created_at,
      updatedAt: m.updated_at
    })));
  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ message: 'Failed to fetch study materials' });
  }
});

// READ - Get single study material by ID
router.get('/:id', isAuthenticated, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const material = sqlite.prepare(`
      SELECT * FROM study_materials 
      WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    res.json({
      id: material.id,
      userId: material.user_id,
      title: material.title,
      content: material.content,
      keywords: material.keywords ? JSON.parse(material.keywords) : null,
      createdAt: material.created_at,
      updatedAt: material.updated_at
    });
  } catch (error) {
    console.error('Error fetching study material:', error);
    res.status(500).json({ message: 'Failed to fetch study material' });
  }
});

// UPDATE - Update study material
router.put('/:id', isAuthenticated, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const validation = updateMaterialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validation.error.errors 
      });
    }

    // Check if material exists and belongs to user
    const existing = sqlite.prepare(`
      SELECT * FROM study_materials WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!existing) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    const { title, content, keywords } = validation.data;

    sqlite.prepare(`
      UPDATE study_materials 
      SET title = COALESCE(?, title),
          content = COALESCE(?, content),
          keywords = COALESCE(?, keywords),
          updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(title, content, keywords, Date.now(), id, userId);

    const updated = sqlite.prepare('SELECT * FROM study_materials WHERE id = ?').get(id);

    res.json({
      id: updated.id,
      userId: updated.user_id,
      title: updated.title,
      content: updated.content,
      keywords: updated.keywords ? JSON.parse(updated.keywords) : null,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    });
  } catch (error) {
    console.error('Error updating study material:', error);
    res.status(500).json({ message: 'Failed to update study material' });
  }
});

// DELETE - Delete study material
router.delete('/:id', isAuthenticated, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if material exists and belongs to user
    const existing = sqlite.prepare(`
      SELECT * FROM study_materials WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!existing) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    // Delete associated flashcards first
    sqlite.prepare('DELETE FROM flashcards WHERE study_material_id = ?').run(id);

    // Delete the study material
    sqlite.prepare('DELETE FROM study_materials WHERE id = ?').run(id);

    res.json({ message: 'Study material deleted successfully' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    res.status(500).json({ message: 'Failed to delete study material' });
  }
});

module.exports = router;

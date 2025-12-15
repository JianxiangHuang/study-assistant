/**
 * Analyze Routes - AI-powered content analysis
 */

const express = require('express');
const { sqlite } = require('../db/connection');
const { isAuthenticated } = require('./auth');
const { analyzeStudyMaterial } = require('../services/openai');
const { z } = require('zod');

const router = express.Router();

// Validation schema
const analyzeSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  studyMaterialId: z.number().optional()
});

// Analyze study material content
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const validation = analyzeSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validation.error.errors 
      });
    }

    const { content, studyMaterialId } = validation.data;

    // Analyze content using OpenAI
    const keywords = await analyzeStudyMaterial(content);

    // If studyMaterialId provided, update the study material with keywords
    if (studyMaterialId) {
      const userId = req.user.id;
      
      // Verify the study material belongs to the user
      const material = sqlite.prepare(`
        SELECT * FROM study_materials WHERE id = ? AND user_id = ?
      `).get(studyMaterialId, userId);

      if (material) {
        sqlite.prepare(`
          UPDATE study_materials 
          SET keywords = ?, updated_at = ?
          WHERE id = ?
        `).run(JSON.stringify(keywords), Date.now(), studyMaterialId);
      }
    }

    res.json({ keywords });
  } catch (error) {
    console.error('Error analyzing content:', error);
    res.status(500).json({ message: 'Failed to analyze content' });
  }
});

module.exports = router;

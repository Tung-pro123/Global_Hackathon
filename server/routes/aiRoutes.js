import { Router } from 'express';
import { generateSafeContextualSentence } from '../services/aiSentenceService.js';
import { getDb } from '../db/database.js';

const router = Router();

// POST /api/ai/sentence
router.post('/sentence', async (req, res) => {
  try {
    const { term, culture = 'SG', category = 'campus', level = 'intermediate', userId } = req.body;

    if (!term || typeof term !== 'string') {
      return res.status(400).json({ success: false, error: 'Thiếu từ lóng (term) cần tạo câu!' });
    }

    let resolvedCategory = category;
    let resolvedLevel = level;
    let resolvedCulture = culture;

    // If userId provided, adapt to user profile
    if (userId) {
      const db = getDb();
      const user = db.get('users', u => u.id === userId || u.player_id === userId);
      if (user) {
        if (user.interests?.[0]) resolvedCategory = user.interests[0];
        if (user.english_level) resolvedLevel = user.english_level;
        if (user.target_culture && user.target_culture !== 'ALL') resolvedCulture = user.target_culture;
      }
    }

    const result = await generateSafeContextualSentence({
      term: term.trim(),
      culture: resolvedCulture,
      category: resolvedCategory,
      level: resolvedLevel
    });

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('AI sentence generation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

import { Router } from 'express';
import { getDb } from '../db/database.js';

const router = Router();

// GET /api/game/quiz?type=visual_rebus&stage=1&userId=...
router.get('/quiz', (req, res) => {
  const db = getDb();
  const { type = 'visual_rebus', stage = 1, userId } = req.query;

  let userPreferences = null;
  if (userId) {
    const user = db.get('users', u => u.id === userId || u.player_id === userId);
    if (user) {
      userPreferences = {
        english_level: user.english_level || 'intermediate',
        interests: user.interests || ['campus'],
        target_culture: user.target_culture || 'ALL'
      };
    }
  }

  // Gather all challenges
  let allChallenges = db.all('challenges');

  let filtered = allChallenges;

  // 1. Filter by culture if user has preference
  if (userPreferences?.target_culture && userPreferences.target_culture !== 'ALL') {
    const cultureMatches = filtered.filter(c => {
      const slang = db.get('slangs', s => s.id === c.slang_id);
      return slang?.culture === userPreferences.target_culture;
    });
    if (cultureMatches.length > 0) filtered = cultureMatches;
  }

  // 2. Filter by category/interests if user has preferences
  let matchedCategory = null;
  if (userPreferences?.interests?.length) {
    const interestMatches = filtered.filter(c => {
      const slang = db.get('slangs', s => s.id === c.slang_id);
      return userPreferences.interests.some(i => (slang?.category || '').toLowerCase().includes(i.toLowerCase()));
    });
    if (interestMatches.length > 0) {
      filtered = interestMatches;
      matchedCategory = userPreferences.interests[0];
    }
  }

  // Pick random challenge
  let challenge = filtered.length ? filtered[Math.floor(Math.random() * filtered.length)] : db.random('challenges');

  if (!challenge) {
    return res.status(404).json({ error: 'No challenges available.' });
  }

  // Attach slang info
  const slang = db.get('slangs', s => s.id === challenge.slang_id);

  // Parse options
  const options = Array.isArray(challenge.options)
    ? challenge.options
    : (challenge.options_json ? JSON.parse(challenge.options_json) : []);

  res.json({
    success: true,
    data: {
      ...challenge,
      options,
      visual_rebus_url: slang?.visual_rebus_url || '',
      visual_caption: slang?.visual_caption || '',
      term: slang?.term || '',
      culture: slang?.culture || '',
      category: slang?.category || 'general',
      personalized: !!userPreferences,
      personalized_info: userPreferences ? {
        culture: userPreferences.target_culture,
        level: userPreferences.english_level,
        interests: userPreferences.interests
      } : null
    }
  });
});

// POST /api/game/answer
router.post('/answer', (req, res) => {
  const { challenge_id, selected_index, quiz_type = 'diamond', userId } = req.body;

  if (selected_index === undefined || !challenge_id) {
    return res.status(400).json({ error: 'Missing challenge_id or selected_index' });
  }

  const db = getDb();
  const challenge = db.get('challenges', c => c.id === challenge_id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  const slang = db.get('slangs', s => s.id === challenge.slang_id);
  const is_correct = parseInt(selected_index) === challenge.correct_index;

  const rewards = is_correct
    ? quiz_type === 'diamond'
      ? { coins: 100, diamonds: 1, xp: 50, shield: false }
      : { coins: 80, diamonds: 0, xp: 25, shield: true }
    : { coins: 0, diamonds: 0, xp: 0, shield: false };

  // If userId provided and correct, update user rewards
  if (userId && is_correct) {
    const user = db.get('users', u => u.id === userId || u.player_id === userId);
    if (user) {
      db.update('users', u => u.id === user.id, {
        coins: (user.coins || 0) + rewards.coins,
        diamonds: (user.diamonds || 0) + rewards.diamonds,
        xp: (user.xp || 0) + rewards.xp
      });
    }
  }

  res.json({
    is_correct,
    correct_index: challenge.correct_index,
    explanation: challenge.cultural_explanation || slang?.cultural_meaning || '',
    rewards
  });
});

export default router;

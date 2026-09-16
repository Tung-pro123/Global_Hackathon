import { Router } from 'express';
import { getDb } from '../db/database.js';

const router = Router();
const DEFAULT_PLAYER_ID = 'default_player';

function findUserOrPlayer(db, id) {
  if (id && id !== DEFAULT_PLAYER_ID) {
    const user = db.get('users', u => u.id === id || u.player_id === id);
    if (user) return { target: user, collection: 'users' };
  }
  let player = db.get('players', p => p.player_id === DEFAULT_PLAYER_ID);
  if (!player) {
    player = {
      id: DEFAULT_PLAYER_ID,
      player_id: DEFAULT_PLAYER_ID,
      coins: 200,
      diamonds: 2,
      xp: 140,
      streak_days: 3,
      active_skin: 'classic',
      owned_skins: ['classic']
    };
    db.insertOrIgnore('players', player);
  }
  return { target: player, collection: 'players' };
}

// GET /api/player/profile?userId=...
router.get('/profile', (req, res) => {
  const db = getDb();
  const userId = req.query.userId || req.headers['x-user-id'];
  const { target } = findUserOrPlayer(db, userId);
  const { password: _, ...safeData } = target;
  res.json({ success: true, data: safeData });
});

// POST /api/player/profile — update fields
router.post('/profile', (req, res) => {
  const db = getDb();
  const { userId, coins, diamonds, xp, streak_days, active_skin, owned_skins, english_level, interests, target_culture } = req.body;
  const { target, collection } = findUserOrPlayer(db, userId);

  const patch = {};
  if (coins !== undefined) patch.coins = coins;
  if (diamonds !== undefined) patch.diamonds = diamonds;
  if (xp !== undefined) patch.xp = xp;
  if (streak_days !== undefined) patch.streak_days = streak_days;
  if (active_skin) patch.active_skin = active_skin;
  if (owned_skins) patch.owned_skins = owned_skins;
  if (english_level) patch.english_level = english_level;
  if (interests) patch.interests = interests;
  if (target_culture) patch.target_culture = target_culture;

  db.update(collection, p => p.id === target.id || p.player_id === target.player_id, patch);

  const updated = db.get(collection, p => p.id === target.id || p.player_id === target.player_id);
  const { password: _, ...safeData } = updated;
  res.json({ success: true, data: safeData });
});

// POST /api/player/reward — add coins/diamonds/xp
router.post('/reward', (req, res) => {
  const db = getDb();
  const { userId, coins = 0, diamonds = 0, xp = 0 } = req.body;
  const { target, collection } = findUserOrPlayer(db, userId);

  db.update(collection, p => p.id === target.id || p.player_id === target.player_id, {
    coins: (target.coins || 0) + coins,
    diamonds: (target.diamonds || 0) + diamonds,
    xp: (target.xp || 0) + xp
  });

  const updated = db.get(collection, p => p.id === target.id || p.player_id === target.player_id);
  const { password: _, ...safeData } = updated;
  res.json({ success: true, data: safeData });
});

// POST /api/player/buy-skin
router.post('/buy-skin', (req, res) => {
  const db = getDb();
  const { userId, skin_id, cost_coins = 0, cost_diamonds = 0 } = req.body;
  const { target, collection } = findUserOrPlayer(db, userId);

  const ownedSkins = target.owned_skins || ['classic'];
  if (ownedSkins.includes(skin_id)) {
    return res.status(400).json({ error: 'Skin already owned' });
  }

  if (target.coins < cost_coins || target.diamonds < cost_diamonds) {
    return res.status(400).json({ error: 'Insufficient funds', coins: target.coins, diamonds: target.diamonds });
  }

  db.update(collection, p => p.id === target.id || p.player_id === target.player_id, {
    coins: target.coins - cost_coins,
    diamonds: target.diamonds - cost_diamonds,
    owned_skins: [...ownedSkins, skin_id]
  });

  const updated = db.get(collection, p => p.id === target.id || p.player_id === target.player_id);
  const { password: _, ...safeData } = updated;
  res.json({ success: true, message: `🎉 Skin "${skin_id}" purchased!`, data: safeData });
});

export default router;

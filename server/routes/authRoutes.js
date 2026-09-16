import { Router } from 'express';
import { getDb } from '../db/database.js';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password, english_level, interests, target_culture } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập tên người dùng (Username)!' });
  }

  const cleanUsername = username.trim();
  if (cleanUsername.length < 3) {
    return res.status(400).json({ success: false, error: 'Tên người dùng phải có ít nhất 3 ký tự!' });
  }

  if (!password || password.trim().length < 4) {
    return res.status(400).json({ success: false, error: 'Mật khẩu phải có ít nhất 4 ký tự!' });
  }

  const db = getDb();
  const existing = db.get('users', u => u.username.toLowerCase() === cleanUsername.toLowerCase());

  if (existing) {
    return res.status(400).json({ success: false, error: `Tên người dùng "${cleanUsername}" đã được sử dụng! Vui lòng chọn tên khác.` });
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const newUser = {
    id: userId,
    player_id: userId,
    username: cleanUsername,
    password: password.trim(),
    english_level: english_level || 'intermediate', // beginner | intermediate | advanced
    interests: Array.isArray(interests) && interests.length ? interests : ['campus', 'social'],
    target_culture: target_culture || 'ALL', // SG | VN | ALL
    coins: 200,      // Quà tân thủ
    diamonds: 5,     // Quà tân thủ
    xp: 100,
    streak_days: 1,
    active_skin: 'classic',
    owned_skins: ['classic'],
    created_at: new Date().toISOString()
  };

  db.insertOrIgnore('users', newUser);

  // Return user without password
  const { password: _, ...safeUser } = newUser;
  res.json({
    success: true,
    message: `🎉 Chào mừng ${cleanUsername} gia nhập CultureSync!`,
    user: safeUser
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!' });
  }

  const cleanUsername = username.trim();
  const db = getDb();
  const user = db.get('users', u => u.username.toLowerCase() === cleanUsername.toLowerCase());

  if (!user || user.password !== password.trim()) {
    return res.status(401).json({ success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
  }

  const { password: _, ...safeUser } = user;
  res.json({
    success: true,
    message: `👋 Chào mừng trở lại, ${user.username}!`,
    user: safeUser
  });
});

// POST /api/auth/profile — Update learning preferences
router.post('/profile', (req, res) => {
  const { userId, english_level, interests, target_culture } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'Missing userId' });
  }

  const db = getDb();
  const user = db.get('users', u => u.id === userId || u.player_id === userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const patch = {};
  if (english_level) patch.english_level = english_level;
  if (Array.isArray(interests)) patch.interests = interests;
  if (target_culture) patch.target_culture = target_culture;

  db.update('users', u => u.id === userId || u.player_id === userId, patch);

  const updated = db.get('users', u => u.id === userId || u.player_id === userId);
  const { password: _, ...safeUser } = updated;

  res.json({ success: true, message: '✅ Đã cập nhật hồ sơ cá nhân hóa!', user: safeUser });
});

export default router;

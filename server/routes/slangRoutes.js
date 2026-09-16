import { Router } from 'express';
import { getDb } from '../db/database.js';
import { crawlSlangsWithGroq } from '../services/aiCrawlerService.js';

const router = Router();

// GET /api/slangs
router.get('/', (req, res) => {
  const db = getDb();
  const { culture } = req.query;
  const slangs = db.all(
    'slangs',
    culture && ['SG', 'VN'].includes(culture.toUpperCase())
      ? s => s.culture === culture.toUpperCase()
      : null,
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  res.json({ success: true, count: slangs.length, data: slangs });
});

// GET /api/slangs/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const slang = db.get('slangs', s => s.id === req.params.id);
  if (!slang) return res.status(404).json({ error: 'Slang not found' });
  const challenges = db.all('challenges', c => c.slang_id === slang.id);
  res.json({ success: true, data: { ...slang, challenges } });
});

// POST /api/slangs/sync or /api/slang/sync
router.post('/sync', async (req, res) => {
  try {
    const { seedDatabase } = await import('../db/seed.js');
    await seedDatabase();
    const db = getDb();
    res.json({ success: true, count: db.count('slangs'), message: `✅ Synced! Total slangs: ${db.count('slangs')}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/slang/crawl
router.post('/crawl', async (req, res) => {
  try {
    const newSlangs = await crawlSlangsWithGroq();
    res.json({ success: true, message: `✅ Harvested ${newSlangs.length} new slangs!`, data: newSlangs });
  } catch (err) {
    console.error('Crawl error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

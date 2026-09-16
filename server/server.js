import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { seedDatabase } from './db/seed.js';
import slangRoutes from './routes/slangRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Initialize DB and seed
try {
  await seedDatabase();
} catch (err) {
  console.error('❌ Database init error:', err.message);
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/slangs', slangRoutes);
app.use('/api/slang', slangRoutes); // alias for /crawl endpoint
app.use('/api/game', gameRoutes);
app.use('/api/player', playerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🦖 CultureSync SlangArena API is running!',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clientDistPath = join(__dirname, '../client/dist');

// Serve client static assets in production if built
if (existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(join(clientDistPath, 'index.html'));
  });
}

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log('');
  console.log('🦖 ============================================');
  console.log(`🚀  CultureSync SlangArena API`);
  console.log(`📡  Server: http://localhost:${PORT}`);
  console.log(`🔌  Health: http://localhost:${PORT}/api/health`);
  console.log(`📚  Slangs: http://localhost:${PORT}/api/slangs`);
  console.log(`🎮  Quiz:   http://localhost:${PORT}/api/game/quiz`);
  console.log('🦖 ============================================');
  console.log('');
});

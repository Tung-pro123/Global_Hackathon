-- CultureSync SlangArena Database Schema

-- 1. Campus Slang Dictionary
CREATE TABLE IF NOT EXISTS slangs (
    id TEXT PRIMARY KEY,
    term TEXT NOT NULL,
    culture TEXT NOT NULL CHECK (culture IN ('SG', 'VN')),
    phonetic TEXT,
    literal_translation TEXT,
    cultural_meaning TEXT NOT NULL,
    whatsapp_example TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    visual_rebus_url TEXT,
    visual_caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Interactive Quiz Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    slang_id TEXT NOT NULL,
    challenge_type TEXT NOT NULL,
    scenario_context TEXT NOT NULL,
    question TEXT NOT NULL,
    options_json TEXT NOT NULL,
    correct_index INTEGER NOT NULL,
    cultural_explanation TEXT NOT NULL,
    stage_level INTEGER DEFAULT 1,
    FOREIGN KEY(slang_id) REFERENCES slangs(id)
);

-- 3. Player Profiles & Inventory
CREATE TABLE IF NOT EXISTS players (
    player_id TEXT PRIMARY KEY,
    coins INTEGER DEFAULT 200,
    diamonds INTEGER DEFAULT 2,
    xp INTEGER DEFAULT 140,
    streak_days INTEGER DEFAULT 3,
    active_skin TEXT DEFAULT 'classic',
    owned_skins_json TEXT DEFAULT '["classic"]',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

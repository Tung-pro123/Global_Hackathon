# 🚀 MASTER BLUEPRINT: REBUILD CULTURSYNC 2D DINO RUNNER & SLANG ARENA
## Full-Stack Architecture: React (Vite) + Node.js (Express) + SQLite + Groq AI
> **Target:** Global Hackathon 2026 — Track 2: Intercultural Learning & Language  
> **Team:** Team 14 | **Project:** CultureSync SlangArena  
> **Purpose:** Detailed step-by-step implementation plan for AI agents to rebuild the entire system from scratch with modern, world-class aesthetics and pure JavaScript/TypeScript ecosystem.

---

## 1. Executive Summary & Core Value Proposition

CultureSync is an AI-powered gamified cross-cultural literacy platform designed for international student teams (Singapore 🇸🇬 & Vietnam 🇻🇳).
The core experience centers on **Dino Slang Quest** — a high-speed 2D arcade platformer where international students:
1. Run through iconic campus & city environments (Marina Bay, Library Crunch, Cyber Saigon).
2. Collect gold coins 🪙 and mystery diamonds 💎.
3. Solve **Visual Slang Rebus Quizzes ("Nhìn hình đoán chữ")** to earn currency and revive upon barrier collisions.
4. Spend earned currency in the **Dino Skin Shop** to unlock culturally distinctive skins (Nón Lá Saigon Racer, Merlion Singlish Champ, Golden King).
5. Ingest fresh real-time campus slang through an automated **AI Harvester** running on Node.js + Groq LLM.

---

## 2. Tech Stack Specification

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + Vite** (JavaScript/JSX) | Instant HMR, component-driven architecture, ultra-fast development. |
| **Styling & UI** | **Tailwind CSS + Glassmorphism** | Modern cyber-arcade aesthetic, sleek gradients, glowing neon borders. |
| **Icons & Typography** | **Lucide-React + Google Fonts** | `Orbitron` (Arcade numbers), `Outfit` (Headings), `Plus Jakarta Sans`. |
| **Game Engine** | **HTML5 2D Canvas Engine** (or PixiJS) | 60 FPS silky smooth physics, custom sprite rendering, multi-layer parallax. |
| **Audio Engine** | **Web Audio API** (or Howler.js) | Pure synthesized 8-bit retro sounds (jump, coin, fanfare, crash) without external mp3 files. |
| **Backend Framework**| **Node.js (v18+) + Express.js** | Pure JavaScript backend, unified language across stack, lightweight REST API. |
| **Database** | **SQLite via `better-sqlite3`** | Zero-config, single-file relational database with high performance. |
| **AI LLM Ingestion** | **Groq SDK (`groq-sdk`)** | Sub-second inference with `llama-3.3-70b-versatile` to crawl and ingest trending campus slang. |

---

## 3. System Architecture & Directory Structure

```
culturesync-app/
├── package.json                   # Root scripts (concurrently dev frontend & backend)
├── server/                        # Node.js + Express Backend
│   ├── package.json
│   ├── server.js                  # Main Express entry point (Port 5000)
│   ├── db/
│   │   ├── database.js            # SQLite connection (better-sqlite3)
│   │   ├── schema.sql             # DB tables: slangs, challenges, player_stats
│   │   └── seed.js                # Initial high-quality Singlish & Vietnamese slangs
│   ├── services/
│   │   └── aiCrawlerService.js    # Groq API crawler (extracts slangs + creates quizzes)
│   └── routes/
│       ├── slangRoutes.js         # GET /api/slangs, POST /api/slang/crawl
│       ├── gameRoutes.js          # GET /api/game/challenge, POST /api/game/answer
│       └── playerRoutes.js        # GET/POST /api/player/profile, sync wallet
├── client/                        # React 18 + Vite Frontend
│   ├── index.html                 # HTML shell with Google Fonts
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx               # React DOM root
│       ├── App.jsx                # Layout, top navbar, wallet state & tab router
│       ├── components/
│       │   ├── Navbar.jsx         # Sticky header with live Coins, Diamonds, XP badges
│       │   ├── TabNavigation.jsx  # Glowing tab pills with micro-animations
│       │   ├── ConfettiEffect.jsx # Canvas celebration particles
│       │   └── AudioController.js # 8-bit sound synthesizer
│       ├── features/
│       │   ├── game/              # 🎮 2D Dino Slang Quest
│       │   │   ├── DinoGameArena.jsx # Arcade cabinet shell with RGB LEDs & CRT scanlines
│       │   │   ├── DinoCanvas.jsx    # 60 FPS HTML5 Canvas game loop
│       │   │   ├── engine/
│       │   │   │   ├── DinoSprite.js    # Multi-skin Dino renderer (sneakers, Nón Lá, Crown)
│       │   │   │   ├── ParallaxWorld.js # 4-layer parallax (stars, skyline, laser track)
│       │   │   │   ├── Obstacles.js     # 3D shaded cacti with blooming flowers
│       │   │   │   └── Collectibles.js  # 3D spinning gold coins & glowing diamonds
│       │   │   └── modals/
│       │   │       ├── SlangQuizModal.jsx # Holographic Rebus quiz card
│       │   │       ├── CollisionModal.jsx # Give Up vs Try More (Revive quiz)
│       │   │       └── GameOverModal.jsx  # Run summary & XP rewards
│       │   ├── shop/              # 🛍️ Dino Skin Wardrobe
│       │   │   ├── SkinShop.jsx       # Shop catalog & live 3D preview chamber
│       │   │   ├── LiveDinoStage.jsx  # Dedicated preview canvas with idle bob animation
│       │   │   └── skinsData.js       # Lore, perks, and pricing for 6 skins
│       │   ├── dictionary/        # 📚 Slang Pokedex
│       │   │   └── SlangPokedex.jsx   # Filterable slang cards with cultural intent
│       │   └── crawler/           # 🤖 AI Harvester
│       │       └── AiHarvester.jsx    # Real-time Groq scanning terminal
│       └── styles/
│           └── index.css          # Custom animations, scanlines, and glow utilities
```

---

## 4. Database Schema (`server/db/schema.sql`)

```sql
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

-- 2. Interactive Dilemma & Quiz Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    slang_id TEXT NOT NULL,
    challenge_type TEXT NOT NULL, -- 'visual_rebus', 'chat_dilemma', 'revive_check'
    scenario_context TEXT NOT NULL,
    question TEXT NOT NULL,
    options_json TEXT NOT NULL, -- JSON array of 4 options
    correct_index INTEGER NOT NULL,
    cultural_explanation TEXT NOT NULL,
    stage_level INTEGER DEFAULT 1,
    FOREIGN KEY(slang_id) REFERENCES slangs(id)
);

-- 3. Player Profiles & Inventory Persistence
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
```

---

## 5. In-Game Economy & Skin Catalog Specification

### Economy Flow
1. **Track Run**: Collect Gold Coins = `+10 Coins` each.
2. **Diamond Mystery Rebus Quiz**:
   - Trigger: Touch flying Diamond 💎.
   - Action: Displays visual image clue ("Gói khăn giấy đặt trên bàn").
   - Reward: `+100 Coins`, `+1 Diamond`, `+50 XP`.
3. **Cactus Collision Revive Quiz**:
   - Trigger: Colliding with obstacle.
   - Choice: **Give Up** (End game) vs **Try More** (Cultural revive quiz).
   - Correct Answer: `+80 Coins`, `+25 XP`, Revive with **3.0s Invulnerability Plasma Shield**.

### 6 Collectible Skins in Wardrobe

| Skin ID | Name | Rarity | Price | Visual Highlights | Gameplay Perk |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `classic` | **Classic Emerald Dino** | COMMON | Free | Emerald gradient body, red headband with fluttering ribbon, white tooth, sneakers. | Balanced baseline physics |
| `cyberpunk` | **Cyber Neon Visor** | RARE | 150 🪙 | Obsidian scales, electric cyan visor with animated laser scanline, neon violet back fins. | +5% Distance score multiplier |
| `singlish` | **Singlish Hawker Champ** | EPIC | 300 🪙 | Crimson-green body, Merlion (`🦁`) emblem on chest, golden dorsal spikes, "CHAMP" headband. | +10% Gold coins magnet |
| `saigon` | **Saigon Street Racer** | EPIC | 450 🪙 | Traditional **Vietnamese Nón Lá (Conical Hat)** tilted stylishly, fiery orange sneakers. | Lower air drag & softer jump |
| `cosmic` | **Cosmic Nebula Dino** | LEGENDARY | 800 🪙 | Deep violet galaxy body with twinkling stellar flecks embedded into skin, stardust particle trail. | Stardust trail on landing |
| `golden` | **Golden King Dino** | LEGENDARY | 1,200 🪙 / 5 💎 | 24K pure radiant gold metallic finish with an Imperial **Royal Crown & Ruby gemstone**! | +20% All quiz rewards |

---

## 6. Sequential Step-by-Step Prompt Roadmap for AI Agent

Copy and execute these prompts in order when instructing another AI coding model:

### 🔹 PROMPT 1: Project Setup & Node.js Backend Foundation
```text
Role: Senior Full-Stack JavaScript Architect.
Task: Initialize a monorepo with Node.js Express backend and React Vite frontend.
Requirements:
1. Create /server directory with Express, cors, dotenv, better-sqlite3, and groq-sdk.
2. Setup server/db/database.js with SQLite schema for slangs, challenges, and players.
3. Create server/db/seed.js with 10 high-quality Singlish (Chope, Kiasu, Arrow, Bao Ka Liao, Shiok) and Vietnamese (Gánh team, Chạy deadline, Out-trình, Xu cà na, Bán than) slangs with visual Unsplash image URLs and rebus questions.
4. Implement REST API routes:
   - GET /api/slangs (filterable by culture SG/VN/ALL)
   - GET /api/game/quiz?type=rebus&stage=1
   - POST /api/game/answer (validates answer, returns is_correct, explanation, rewards)
   - GET & POST /api/player/profile (persists wallet and active skin)
5. Ensure server runs on port 5000 with clean console logs and error handling.
```

### 🔹 PROMPT 2: AI Slang Harvester Pipeline (Groq LLM)
```text
Task: Implement the automated AI Slang Crawler service in server/services/aiCrawlerService.js.
Requirements:
1. Integrate Groq API SDK (model: llama-3.3-70b-versatile or llama3-70b-8192).
2. Prompt Groq to analyze authentic 2026 university student slang in Singapore & Vietnam.
3. Extract structured JSON containing: term, culture, phonetic, cultural_meaning, real_whatsapp_example, visual_rebus_prompt, 4 multiple choice options, correct_index, and detailed intercultural explanation.
4. Insert newly ingested slangs directly into SQLite database.
5. Create POST /api/slang/crawl route that triggers this crawler on demand and returns the newly generated slangs.
```

### 🔹 PROMPT 3: React 18 + Vite Frontend & Cyber-Arcade Theme
```text
Task: Initialize client/ directory with Vite + React 18 + Tailwind CSS.
Requirements:
1. Install lucide-react, canvas-confetti, and configure Tailwind with cyber-arcade palette (dark navy #070a12, neon cyan #38bdf8, emerald #10b981, gold #fbbf24, rose #f43f5e).
2. Import Google Fonts: Orbitron, Outfit, and Plus Jakarta Sans.
3. Build App.jsx and Navbar.jsx:
   - Sticky glassmorphic navbar with logo, player streak 🔥, XP ⭐, and real-time wallet pills: Gold Coins 🪙 and Diamonds 💎.
   - 4-tab glowing navigation switcher:
     1. 🦖 Dino Slang Quest (2D Game)
     2. 🛍️ Dino Skin Shop (Wardrobe)
     3. 📚 Slang Pokedex (Dictionary)
     4. 🤖 AI Slang Harvester
4. Implement persistent client-side state synchronized with server/localStorage.
```

### 🔹 PROMPT 4: 2D Canvas Dino Runner Game Engine
```text
Task: Build the high-performance 2D Canvas game engine in client/src/features/game/.
Requirements:
1. DinoCanvas.jsx with 60 FPS requestAnimationFrame loop on 800x320 crisp resolution.
2. DinoSprite.js renderer supporting dynamic skins (Classic, Cyberpunk with cyan visor, Singlish with Merlion badge, Saigon Racer with Nón Lá, Cosmic with galaxy stars, Golden King with royal crown).
3. 4-layer Parallax background:
   - Twinkling star field.
   - Celestial body (Morning Sunrise corona, Crescent Moon, or Synthwave Sun).
   - Iconic city skyline (Marina Bay Sands & Bitexco / Landmark 81 with illuminated windows and blinking beacons).
   - Textured magnetic track with scrolling neon laser guide rails and speed lines.
4. Obstacles: 3D-shaded cylindrical desert cacti with thorns and blooming flowers.
5. Collectibles: 3D spinning gold coins 🪙 and radiant multifaceted diamonds 💎 with glowing auras.
6. Controls: Spacebar, Up Arrow, and tactile on-screen Jump button with 3D mechanical press animation.
7. Pure Web Audio API 8-bit synthesizer for jump, coin pickup, diamond arpeggio, collision crunch, and victory fanfare.
```

### 🔹 PROMPT 5: Holographic Rebus Quiz Modals & Revive Mechanics
```text
Task: Build the holographic modal cards for quiz interactions.
Requirements:
1. SlangQuizModal.jsx:
   - Triggered when Dino touches Diamond.
   - Glassmorphism overlay (backdrop-blur-md, border-cyan-400/50).
   - High-contrast visual rebus image with caption.
   - 4 sleek multiple-choice buttons ([A], [B], [C], [D]) with hover glow and tactile bounce.
   - Real-time reward banner: "+100 Coins 🪙 • +1 Diamond 💎 • +50 XP ⭐".
   - Detailed cultural wisdom explanation upon answer.
2. CollisionModal.jsx:
   - Triggered upon cactus collision.
   - Choice: "🏳️ Give Up" vs "🔥 Thử Thách Slang Để Hồi Sinh (Try More)".
   - Choosing Try More opens Revive Quiz. Correct answer grants +80 Coins and 3.0s Invulnerability Plasma Shield with particle sparks!
3. GameOverModal.jsx: Run stats, distance odometer, and restart button.
```

### 🔹 PROMPT 6: Dino Skin Shop (Wardrobe) & Slang Pokedex
```text
Task: Implement the interactive Dino Skin Shop and Slang Pokedex.
Requirements:
1. SkinShop.jsx with split layout:
   - Left: Live 3D/Canvas Preview Stage (LiveDinoStage.jsx) with a cyber-pedestal, idle breathing animation, and active accessories of the currently selected skin.
   - Right: Catalog grid of 6 collectible skins with rarity borders (COMMON, RARE, EPIC, LEGENDARY), pricing (Coins/Diamonds), and perks.
   - Action buttons: "✅ Đang Trang Bị", "⚡ Trang Bị Ngay", or "🛒 Mua với X Coins".
   - "Earn More Coins" prompt encouraging players to answer more quizzes.
2. SlangPokedex.jsx:
   - Real-time search bar + filter buttons (All, 🇸🇬 Singlish, 🇻🇳 Vietnam).
   - Cards displaying term, phonetic, cultural intent, and authentic WhatsApp dialogue snippets.
3. AiHarvester.jsx:
   - Interactive button triggering POST /api/slang/crawl with live Groq execution spinner and instant display of newly generated slangs.
```

---

## 7. Verification & Quality Checklist

Before presenting to hackathon judges, verify:
- [ ] `npm run dev` launches both Node.js Express server (`:5000`) and React Vite app (`:5173`) seamlessly.
- [ ] Top navbar displays real-time Coins 🪙 and Diamonds 💎 and animates upon reward.
- [ ] Dino accurately wears equipped skin (e.g. Nón Lá or Glowing Visor) both in Shop Preview and in Canvas Game.
- [ ] Touching Diamond triggers Visual Slang Quiz and awards +100 Coins on correct answer.
- [ ] Touching Cactus offers second-chance Revive Quiz and activates 3s Plasma Shield on correct answer.
- [ ] Buying skins deducts coins and saves inventory to database/localStorage.
- [ ] AI Harvester successfully queries Groq and injects new playable slangs.
- [ ] 0 console errors, 60 FPS smooth canvas loop, mobile responsive layout.

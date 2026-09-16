# PRD: CultureSync — The AI Campus Slang & Cultural Literacy Engine

> **Product Requirements Document (PRD)**  
> **Prepared by:** Team 14 | **Track:** Track 2 — Intercultural Learning & Language  
> **Mentors Assigned:** Lecturer Ho Quoc Dat (Business) & Lecturer Le Hoang Tuan Kiet (Technical)  
> **Core Direction:** Sharp focus on **Campus Slang & Regional Colloquialisms** via **AI-Powered Scenario Game (Priority 1)** and **Smart Slang Dictionary (Priority 2)**. Generic chatbot removed.

---

## 1. Problem Statement

When Vietnamese and international students (specifically Singaporean peers) collaborate in hackathons, capstone projects, or study-abroad cohorts, the greatest barrier causing friction and withdrawal is **not formal academic grammar, but INFORMAL CAMPUS SLANG AND REGIONAL COLLOQUIALISMS**.

* **Real-World Student Collaboration (WhatsApp, Telegram, Discord):** Students do not communicate in textbook English; they rely heavily on colloquial shorthand:
  * Singaporean students naturally use Singlish: *"Don't be so kiasu", "finish chop-chop can lah?", "I chope the room", "so sian"*...
  * Vietnamese students use local academic idioms: *"Gánh team", "bào việc", "thao túng tâm lý", "xụi lơ"*...
* **Direct Consequences:**
  1. **Alienation & Out-Group Exclusion:** Non-native peers feel excluded, unable to decode whether a teammate is joking, being rude, or demanding a task.
  2. **Accidental Conflict:** When Marcus texts *"Don't be so kiasu, just finish by 3 PM chop-chop"*, a Vietnamese student misinterprets *"kiasu"* as an insult, leading to resentment, defensiveness, and toxic silence.
  3. **Failure of Existing Tools:** Google Translate and DeepL completely misinterpret campus slang. Grammarly only flags grammar errors. General ChatGPT requires cumbersome prompting that hurried students will not do under deadline pressure.

---

## 2. Target Audience

* **Primary End Users:** University students engaged in cross-border group projects, global hackathons, and exchange cohorts (piloted directly with the **FPT University $\times$ Republic Polytechnic Singapore** cohort).
* **Institutional Buyers (B2B2C):** University Offices of International Affairs, Global Mobility Divisions, and Student Affairs (licensing CultureSync for orientation programs to boost international student integration and reduce project dropout rates).

---

## 3. User Stories & Scenarios

* **The Real-World Dilemma:** An (Vietnamese student) sees a WhatsApp message from Marcus (Singaporean teammate):  
  > *"Hey guys, I chope-d the discussion booth at 2 PM. Bring your slides chop-chop, don't be so kiasu can lah?"*
* **Without CultureSync:** An feels confused and offended, thinking Marcus is calling him greedy or selfish.
* **With CultureSync:**
  1. An opens **CultureSync** and plays a **60-Second Slang Challenge**: The app presents this exact team scenario.
  2. An selects the correct decode: *"Marcus reserved a study booth and wants us to work quickly together because he wants our team to win."* $\to$ Correct! +20 XP awarded and Daily Streak increments (🔥 Day 3).
  3. An looks up *"chope"* in the **Slang Dictionary** $\to$ Learns about Singapore's tissue-packet reserving culture.
  4. An confidently replies: *"Steady lah Marcus! Bringing the slides now."* $\to$ Instant team bonding!

---

## 4. Proposed Solution

The centerpiece solution is **CultureSync — The AI Campus Slang & Cultural Literacy Engine**:
The team has **ELIMINATED THE GENERIC CHATBOT** to concentrate 100% of resources on solving the slang barrier:

1. **PRIORITY 1 (Core Focus): Interactive Campus Slang Scenario Game ("SlangArena"):**
   * 60-second micro-challenges featuring real-world WhatsApp dilemmas loaded directly from SQLite (0ms latency, zero API downtime risk during pitch demonstrations).
   * Cultural Tact feedback, XP accumulation (+25 XP), and daily Streak maintenance (Streaks 🔥).
2. **PRIORITY 2 (Essential Tool): Smart Campus Slang Dictionary & Pokedex:**
   * Instant search for Singlish and Vietnamese campus slang, explaining pragmatic psychological intent, real-life chat examples, and recommended diplomatic responses.

---

## 5. The Exact Role of AI

AI is not a casual conversational bot; it serves as the **AUTONOMOUS SLANG HARVESTER & CONTINUOUS INGESTION PIPELINE (`agent/slang_crawler.py`)**:
1. **Autonomous Slang Discovery:**
   * Campus slang and youth colloquialisms mutate every semester on student chat channels (Telegram, WhatsApp, Reddit, TikTok). Traditional static dictionaries die within months.
   * AI (Groq 120B / Gemini) crawls and discovers authentic, newly emerging campus slangs from student discourse.
2. **Novelty Verification & Deduplication:**
   * AI checks against existing database records in `cultursync.db` to ensure **100% novelty**—it only ingests terms that have **never existed in the database before**.
3. **Cultural Psychology Structuring & Challenge Synthesis:**
   * For each newly discovered slang, AI decodes the subtle pragmatic intent vs. literal meaning, contextual WhatsApp sentences, and diplomatic replies.
   * AI automatically synthesizes a ready-to-play dilemma challenge (1 culturally accurate answer + 3 realistic misunderstanding distractors).
4. **Autonomous SQLite Ingestion:**
   * AI commits the new slang and dilemma challenge directly into SQLite. The game and dictionary stay permanently fresh without manual developer maintenance!
5. **Why This Architecture Outperforms Real-Time Generation:**
   * **0ms Latency & 100% Stability during Competitions:** Students load challenges instantly from SQLite. No API loading delays, no rate limits, and zero risk of LLM hallucinations while judges are testing live.

---

## 6. Feature Prioritization & Scope (P0 / P1 / P2)

* **P0 (Must-Have for 48h Prototype):**
  * **SlangArena Scenario Game:** 60s round, WhatsApp dilemma context loaded from SQLite, scoring, and streak tracking.
  * **Smart Slang Pokedex:** Bilateral search (SG $\leftrightarrow$ VN) with cultural intent explanations.
  * **AI Slang Harvester:** Automated crawler module discovering new unrecorded slangs and ingesting them into SQLite (`agent/slang_crawler.py`).
* **P1 (Should-Have for Final Demo):**
  * Cultural Badges system.
  * International Student Leaderboard.
* **P2 (Strictly Out-of-Scope):**
  * Open-ended conversational chatbots (removed due to lack of focus).
  * Translation hardware devices.

---

## 7. Success Metrics

* **Quantitative:**
  * 100% of tested students accurately decode targeted Singlish campus slang after playing the game.
  * AI Scenario Generation speed: **< 1.0 second** via Groq 120B.
* **Qualitative:**
  * Students find interactive gaming significantly more engaging than conventional language learning apps.
  * Eliminates interpersonal hesitation in cross-cultural student team chats.

# PROJECT CULTURSYNC - BUSINESS & TECHNICAL BLUEPRINT
> **Prepared for:** Team 14 & Checkpoint Presentations (Mentoring Lab)  
> **Business Mentor:** Lecturer Ho Quoc Dat | **Technical Mentor:** Lecturer Le Hoang Tuan Kiet  
> **Challenge Track:** Track 2 — Intercultural Learning & Language  
> **Core Pivot:** Sharp Focus on **Campus Slang & Colloquialisms** via **AI-Powered Gamification (Priority 1)** and **Smart Slang Dictionary (Priority 2)**. (Generic Chatbot removed).

---

## 📌 PART 1: EXECUTIVE SUMMARY

* **Project Name:** **CultureSync** (Campus Edition)
* **Product Tagline:** *The AI Gamified Slang & Cultural Literacy Engine for International Student Teams*
* **Track 2 Challenge Question:**  
  > *"How can AI help students overcome language and cultural barriers to learn, communicate, and adapt more effectively in international environments?"*
* **The Strategic Pivot:**  
  Instead of an open-ended, generic chatbot, CultureSync tackles the **#1 real-world trigger of cross-cultural confusion and team alienation**: **unfamiliar campus slang, Singlish idioms, and cultural colloquialisms**.
* **Team 14 Division of Responsibilities:**
  * 🇸🇬 **Wong Shin Yee (Business Lead & Co-Pitcher):** Singapore campus slang curation, business model validation, English pitch delivery.
  * 🇻🇳 **Le Thanh Tung (Technical Lead):** AI Logic Flow architecture, AI Game Scenario generation pipeline (Groq 120B & Gemini), database schema.
  * 🇻🇳 **Nguyen Thi Thanh Nha (UI/UX & Design):** Game interface design, streak & badge visuals, slide deck design.
  * 🇻🇳 **Nguyen Thuc Nghi (Content & Slang Research):** Bilingual slang dictionary compilation (VN $\leftrightarrow$ SG), game question bank validation.
  * 🇻🇳 **Nguyen Huynh Khanh Trang (Pitcher & User Testing):** Conducting 3–5 student gameplay tests, feedback logging, co-pitching.

---

## 📌 PART 2: THE 3 CORE EVALUATION PILLARS (FOR MENTORS & JUDGES)

### 🏆 PILLAR 1: PROBLEM STATEMENT & ROOT CAUSE ANALYSIS

#### 1. Target Persona & Context:
* University students engaged in cross-border group projects, hackathons, and exchange programs (piloted directly with the **FPT University $\times$ Republic Polytechnic Singapore** cohort).

#### 2. The Direct Problem: The Campus Slang Barrier (Alienation & Miscommunication):
* In real student collaboration (WhatsApp, Telegram, Discord), international peers **rarely speak formal textbook English**. They communicate heavily using **campus slang, regional colloquialisms, and cultural shorthand**:
  * Singaporean students naturally drop Singlish expressions: *"Don't be so kiasu", "finish chop-chop can lah?", "I chope the room", "so sian"*.
  * Vietnamese students use local academic idioms: *"Gánh team", "bào việc", "thao túng tâm lý", "xụi lơ"*.
* **The Resulting Friction:**
  1. **Alienation & Out-Group Exclusion:** Non-native peers feel excluded, unable to decode whether a teammate is joking, being rude, or issuing a serious deadline demand.
  2. **Accidental Conflict:** When Marcus texts *"Don't be so kiasu, just finish by 3 PM chop-chop"*, a Vietnamese student mistakenly interprets *"kiasu"* as a personal insult, leading to defensiveness and toxic silence.
  3. **Failure of Existing Tools:** Google Translate and DeepL completely fail on campus slang (translating *"kiasu"* literally or returning errors). Grammarly flags slang as grammatical errors. Unprompted ChatGPT requires complex prompting that hurried students will never do.

#### 3. Formal Problem Statement:
> *"University students in international teams face severe **misunderstandings, exclusion, and collaborative friction caused by unfamiliar campus slang and cultural colloquialisms**. Existing language tools only translate formal vocabulary while **completely failing to decode informal campus idioms, emotional nuance, and pragmatic team intent**."*

---

### 🏆 PILLAR 2: UNIQUE VALUE PROPOSITION (UVP)

#### 1. High-Concept Pitch:
> **"CultureSync is the *Duolingo for Campus Slang & Cross-Cultural Team Dynamics* — turning confusing colloquialisms into instant team bonding through AI-generated micro-games."**

#### 2. Dual Value Proposition Matrix:
* **For Students (End Users):**
  * **Instant Cultural Belonging:** Decodes the "secret language" of international teammates in under 60 seconds.
  * **Zero Friction Learning:** Addictive, gamified scenario challenges instead of boring grammar drills.
  * **Conflict Prevention:** Explains the positive/neutral intent behind seemingly blunt slang terms (e.g., *"Kiasu means they care about project success, not that they are attacking you"*).
* **For Universities (Buyers — B2B2C Institutional SaaS):**
  * **Boosts Exchange Cohort Integration:** International Student Offices license CultureSync during orientation to accelerate socialization between local and exchange students.
  * **Protects Retention & Student Satisfaction:** Eliminates early-stage teamwork dropout rates in bilateral programs (like FPT $\times$ Republic Poly).

#### 3. Differentiation Table:
| Dimension | Google Translate / DeepL | Duolingo | Generic ChatGPT | **CultureSync** |
| :--- | :--- | :--- | :--- | :--- |
| **Focus** | Formal literal text | Isolated grammar/vocab | Open-ended text | **Campus Slang & Team Colloquialisms** |
| **Format** | 1-way lookup | Repetitive drills | Open prompt chatbot | **AI-Generated Scenario Dilemma Game** |
| **Local Context** | None (mechanical) | Generic American/UK | Unverified internet data | **Curated Bilateral Slang (FPT $\times$ RP)** |
| **AI Role** | None | Static tree | Unbounded conversationalist | **Dynamic Scenario & Dilemma Generator** |

---

### 🏆 PILLAR 3: CUSTOMIZATION & PERSONALIZATION (AI-POWERED)

*How does CultureSync adapt to individual learners?*

1. **Bilateral Cultural Pairing (Dual-Sided Personalization):**
   * Students choose their pairing: **Vietnam $\longleftrightarrow$ Singapore** (piloted today), expandable to Vietnam $\longleftrightarrow$ Japan / Korea / USA.
   * The AI tailors game scenarios and dictionary explanations specifically to contrast those two specific cultures.
2. **Adaptive Difficulty Scaling:**
   * **Level 1 (Freshman / Social Slang):** Common greetings and informal chat (*"can lah", "chope", "makan"*).
   * **Level 2 (Project Crunch / Velocity Slang):** Task allocation and deadlines (*"kiasu", "chop-chop", "gánh team", "bào việc"*).
   * **Level 3 (High-Stakes Conflict / Pragmatics):** Handling project delays, pushbacks, and disagreement nuances.
3. **Cohort-Specific University Slang Packs:**
   * Universities can upload institution-specific acronyms and campus jargon (e.g., FPT campus terms, Republic Poly modules) to generate custom challenge packs.

---

## 📌 PART 3: THE 2 CORE FEATURES BREAKDOWN

```
┌────────────────────────────────────────────────────────────────────────┐
│ PRIORITY 1: 2D Dino Slang Runner Game ("CultureSync Dino Quest")        │
│ • Mario 2D / T-Rex Runner style with animated Dino character           │
│ • Collectibles: Gold Coins 🪙 and Diamonds 💎 | Obstacles: Cacti 🌵     │
│ • Multi-Stage progression (Campus Morning, Library Crunch, Hackathon)  │
│ • 2 Visual Slang Quiz Triggers ("Nhìn hình đoán chữ"):                 │
│   1. Diamond Touch 💎 -> Mystery Slang Bonus Quiz                      │
│   2. Cactus Hit 🌵 -> Pop-up choice: "Give Up" vs "Try More / Revive" │
├────────────────────────────────────────────────────────────────────────┤
│ PRIORITY 2: Smart Campus Slang Dictionary & Pokedex                    │
│ • Curated bilingual database of Singaporean & Vietnamese campus slang  │
│ • Pragmatic intent explanations, phonetics, examples & recommended replies │
│ • Instant search and 1-click contextual decoding                       │
├────────────────────────────────────────────────────────────────────────┤
│ THE CORE AI ENGINE: Autonomous Slang Harvester & Ingestion Pipeline     │
│ • Groq 120B discovers brand-new campus slangs not yet in the database  │
│ • Filters duplicates, analyzes cultural psychology & builds challenges │
│ • Automatically ingests new entries into SQLite to keep game evergreen │
└────────────────────────────────────────────────────────────────────────┘
```

### 🎮 FEATURE 1 (PRIORITY 1): 2D Dino Slang Runner Game ("CultureSync Dino Quest")
* **Style & Mechanics:**
  * Thể loại: **2D Side-Scrolling Platformer / Runner** (kết hợp lối chơi nhảy ăn item kiểu Mario 2D và né vật cản nhịp độ cao kiểu Chrome T-Rex Runner).
  * Nhân vật chính: Chú **Khủng long (Dino)** di chuyển tiến lên liên tục, người chơi điều khiển **Nhảy (Phím Space / Phím Mũi Tên Lên / Chạm màn hình)**.
  * Vật phẩm dọc đường:
    * 🪙 **Gold Coins (Tiền vàng):** Tăng điểm số cơ bản của màn chơi.
    * 💎 **Diamonds (Kim cương quý):** Kích hoạt câu hỏi bí mật văn hóa.
  * Vật cản:
    * 🌵 **Cacti (Cây xương rồng):** Các bụi xương rồng ngẫu nhiên cần nhảy né qua.
  * Hệ thống nhiều vòng chơi (Multi-level Stages - Dữ liệu giả định trước):
    * **Stage 1 (Campus Morning):** Tốc độ vừa phải, vật cản đơn, từ lóng sinh viên cơ bản (*chope, kiasu*).
    * **Stage 2 (Library Crunch):** Tốc độ tăng 20%, chùm xương rồng đôi, từ lóng làm việc nhóm (*chop-chop, sian*).
    * **Stage 3 (Hackathon Rush):** Tốc độ cao, xuất hiện vật cản dày đặc, từ lóng cạnh tranh học đường (*arrow, lobang, out-trình*).

* **2 Cơ chế kích hoạt Câu hỏi Quizz ("Nhìn hình đoán chữ" - Visual Slang Quiz):**
  * 💎 **Trường hợp 1 (Nhảy đụng Kim Cương):**
    * Khi Dino nhảy chạm vào viên Kim cương đang lơ lửng, game loop lập tức tạm dừng (Pause).
    * Pop-up Modal hiển thị: *"💎 Mystery Slang Discovered!"*.
    * Người chơi xem hình ảnh gợi ý trực quan (Visual Rebus/Meme image) và giải câu đố 4 lựa chọn để đoán từ lóng tiếng Anh/Singlish.
    * Trả lời **ĐÚNG**: Nhận điểm thưởng lớn (+50 XP), tăng hệ số kim cương, game tự động tiếp tục chạy mượt mà.
  * 🌵 **Trường hợp 2 (Va chạm Vật cản Xương rồng):**
    * Khi Dino đụng trúng cây xương rồng, game lập tức dừng lại và hiện Pop-up Modal thử thách bản lĩnh:
      * **Nút 1: "Give Up" (Bỏ cuộc):** Kết thúc vòng chơi ngay lập tức, hiển thị màn hình Game Over, tổng kết số Gold, Diamond và điểm XP thu thập được.
      * **Nút 2: "Try More" (Hồi sinh bằng kiến thức văn hóa):** Mở ra câu hỏi Quizz tiếng lóng dạng *"Nhìn hình đoán chữ"*.
        * **Nếu trả lời ĐÚNG:** Dino được **Hồi sinh tức thì**, nhận hiệu ứng Khiên bảo vệ nhấp nháy 2 giây (invulnerability shield), dọn dẹp vật cản vừa đụng và TIẾP TỤC VÒNG CHƠI!
        * **Nếu trả lời SAI:** Nhân vật ngã gục, kết thúc vòng chơi.

### 📚 FEATURE 2 (PRIORITY 2): Contextual Smart Slang Dictionary ("Slang Pokedex")
* **How It Works:**
  * Quick-search search bar for instant slang lookup during group meetings.
  * Displays:
    * **Term & Origin:** (e.g., *Kiasu* - Hokkien / Singlish).
    * **Literal Meaning vs. Cultural Intent:** Explains the psychological nuance so students don't take offense.
    * **Real Student Example:** Realistic chat screenshots showing how it is used on WhatsApp.
    * **Recommended Reply:** Pre-approved diplomatic responses.

---

## 📌 PART 4: THE EXACT ROLE OF AI (THE AUTONOMOUS SLANG HARVESTER)

*Mentors and Judges will evaluate whether AI is truly necessary or just a gimmick. Here is the concrete, irreplaceable role of AI in CultureSync:*

### 🤖 The Problem with Traditional Slang Apps:
Campus slang and youth colloquialisms mutate constantly every single semester (e.g., emerging terms on Telegram student groups, Reddit r/singapore, TikTok, campus confessions). **A static database becomes outdated and dead within 3 months.** Manual curation by professors or developers is too slow and unscalable.

### 🚀 How CultureSync Solves It With AI:
CultureSync deploys an **AI Slang Harvester & Ingestion Pipeline (`agent/slang_crawler.py` powered by Groq 120B / Gemini)**:
1. **Autonomous Web & Discourse Crawling:**
   * AI crawls and discovers authentic, newly emerging campus slangs and idioms from student team discourse, hackathon chats, and regional social channels.
2. **Novelty Verification & Deduplication:**
   * AI cross-checks candidate slangs against all existing records in `cultursync.db` to ensure **zero duplicates**—it only processes terms that have **never existed in the database before**.
3. **Deep Cultural Structuring & Game Synthesis:**
   * For each newly discovered slang, AI decodes:
     * Category, phonetic pronunciation, and literal translation.
     * Deep pragmatic intent: The underlying cultural psychology (e.g., why a Singaporean student says *"chope"* or a Vietnamese student says *"gánh team"*).
     * WhatsApp chat example & diplomatic suggested reply.
     * Synthesizes a ready-to-play WhatsApp dilemma challenge with 1 culturally accurate answer and 3 realistic misunderstanding distractors.
4. **Autonomous Ingestion into SQLite:**
   * AI automatically commits the structured slang and game challenge directly into SQLite. The game and dictionary are continuously enriched with fresh content without writing a single line of manual code!

### 💡 Why This Beats "Live AI Generation on Every Question":
* **0ms Latency & 100% Stability during Competitions:** The game client reads pre-verified challenges directly from SQLite. No API loading spinner, no rate-limit errors, and zero risk of LLM hallucinations during a live pitch to judges.
* **Cost-Efficient & Scalable:** LLM tokens are only consumed when harvesting new batches of knowledge, not on every individual student tap.

---

## 📌 PART 5: TECHNICAL ARCHITECTURE & PIPELINE

$$\mathbf{Student\ Discourse\ /\ Web\ Slangs} \xrightarrow{\mathbf{Groq\ 120B\ AI\ Crawler}} \mathbf{Novelty\ Filter\ (De-dup)} \xrightarrow{\mathbf{Cultural\ Structuring}} \mathbf{SQLite\ DB} \xrightarrow{\mathbf{0ms\ API}} \mathbf{SlangArena\ Game\ \&\ Pokedex}$$

* **Tech Stack:**
  * **AI Ingestion Engine:** **Groq Cloud (`openai/gpt-oss-120b`)** for sub-second extraction + **Gemini 2.5 Flash** fallback.
  * **Backend:** Python Flask (`backend/routes.py`) + SQLite (`cultursync.db`) storing verified bilingual slangs, dilemma challenges, and user streak data.
  * **Frontend:** High-impact Web UI (`templates/index.html`) with WhatsApp chat simulator, canvas confetti, audio chimes, streak tracking, and live AI Harvester trigger.

---

## 📌 PART 6: 2-MINUTE ELEVATOR PITCH (UPDATED FOR SLANG FOCUS)
*(Ready for Wong Shin Yee, Le Thanh Tung, or Khanh Trang to deliver at Checkpoints)*

> *"Good afternoon, Mentors! Team 14 is excited to present our sharpened solution for Track 2 — **CultureSync: The AI Campus Slang & Cultural Literacy Engine**:
> 
> 1. **The Problem:** In cross-cultural student projects—like between Vietnamese and Singaporean peers—the biggest barrier isn't formal grammar; it's **informal campus slang and regional colloquialisms**. When international peers use Singlish terms like *'kiasu'*, *'chope'*, or *'chop-chop'*, non-native students feel alienated, misunderstand the tone, and take offense, causing toxic silence and project delays. Google Translate and Grammarly fail completely on campus slang.
> 2. **Our Solution:** CultureSync eliminates this friction through two core pillars:
>    * **Priority 1 (Dino Slang Quest 2D):** An addictive 2D platformer runner where students jump to collect Gold & Diamonds and dodge Cacti. Hitting Diamonds or stumbling on obstacles triggers visual *"Guess the Slang from Image"* quizzes—letting students earn bonus XP or earn a cultural "Second Chance" revive to stay alive!
>    * **Priority 2 (Smart Slang Pokedex):** A curated bilingual dictionary decoding the cultural psychology and recommended responses behind local slang.
> 3. **The Irreplaceable Role of AI:** Campus slang mutates every semester, making static databases obsolete. We use **Groq 120B AI as an Autonomous Slang Harvester** that actively crawls emerging student slang, verifies novelty, decodes cultural nuance, and auto-ingests them into our database as ready-to-play challenges. This keeps CultureSync evergreen without manual labor, while keeping the game 100% fast, stable, and zero-latency!
> 4. **Business Viability:** We license CultureSync to university Global Mobility and International Student Offices (B2B2C) as an orientation onboarding tool to boost international student integration and retention.
> 
> We are excited to show you our working prototype running live!"*

Viewed DE_TAI_CULTURSYNC_BUSINESS_TECH_TEAM14.md:85-140
Viewed DE_TAI_CULTURSYNC_BUSINESS_TECH_TEAM14.md:85-135
Edited DE_TAI_CULTURSYNC_BUSINESS_TECH_TEAM14.md
Viewed DE_TAI_CULTURSYNC_BUSINESS_TECH_TEAM14.md:155-195
Edited DE_TAI_CULTURSYNC_BUSINESS_TECH_TEAM14.md

Tôi đã cập nhật trực tiếp tài liệu đề tài **[DE_TAI_CULTURSYNC_BUSINESS_TECH_TEAM14.md](file:///d:/Cac_Cuoc_Thi/Global_Hackathon/DE_TAI_CULTURSYNC_BUSINESS_TECH_TEAM14.md)** theo đúng cơ chế game 2D Dino Runner mới mà bạn đưa ra (chỉ sửa file đề tài, không tạo file code theo đúng yêu cầu).

Dưới đây là **Bản kế hoạch chi tiết & Chuỗi Prompt tuần tự (Prompt Chaining)** để bạn có thể gửi lần lượt cho AI Agent code hoàn thiện game này mà **không bị lỗi Big-Bang** (nhồi nhét quá nhiều logic khiến AI viết code dở dang, lỗi game loop, xung đột Modal hay kẹt physics).

---

## 🗺️ TẠI SAO PHẢI CHIA NHỎ PROMPT (TRÁNH BIG-BANG PROMPT)?
* **Lỗi kinh điển khi gửi 1 prompt lớn:** AI sẽ cố viết 600–800 dòng code gộp cả Canvas render, vật lý nhảy, 2 luồng sự kiện Modal, âm thanh và chuyển màn. Hậu quả là:
  1. Token bị cắt cụt giữa chừng.
  2. Sự kiện bàn phím (Spacebar) vẫn ăn khi đang mở Modal câu đố.
  3. Game loop (`requestAnimationFrame`) bị lặp vô tận khiến game giật lag.
* **Giải pháp chuẩn:** Chia làm **6 Prompts độc lập - xây dựng theo từng tầng (Layered Architecture)**, mỗi prompt xong là test chạy được ngay.

---

## 📋 CHI TIẾT 6 PROMPTS TUẦN TỰ ĐỂ GỬI CHO AI AGENT

### 🔹 PROMPT 1: Khởi tạo 2D Canvas & Vật lý Khủng Long cơ bản (Core Physics)
> **Mục tiêu:** Dựng khung Canvas, chú khủng long T-Rex chạy và nhảy mượt mà, né chướng ngại vật xương rồng.

```text
[TASK 1/6 - CORE 2D DINO ENGINE]
Hãy xây dựng khung Canvas 2D cho một game Runner phong cách T-Rex Runner của Chrome bằng Vanilla HTML5 Canvas và Javascript (chưa cần nối database):
1. Canvas kích thước 800x300px (responsive theo màn hình), có vạch mặt đất cuộn ngang vô tận (ground parallax line).
2. Nhân vật chính: Chú khủng long (Dino) dạng pixel/vector 2D đơn giản đặt ở bên trái:
   - Trạng thái: x, y, vy (vận tốc rơi), gravity (trọng lực 0.6), jumpStrength (-12), isGrounded.
   - Điều khiển: Nhấn phím Space, Phím Mũi Tên Lên hoặc Chạm/Click chuột vào màn hình để Nhảy.
3. Chướng ngại vật: Cây xương rồng (Cactus) xuất hiện ngẫu nhiên từ cạnh phải màn hình và trôi dần sang trái theo gameSpeed.
4. Xử lý va chạm cơ bản: Dùng thuật toán AABB (Axis-Aligned Bounding Box) giữa Dino và Cactus. Nếu va chạm tạm thời `console.log("COLLISION DETECTED")`.
5. Tách biệt rõ ràng Game Loop bằng `requestAnimationFrame`. Có biến trạng thái `gameState: 'PLAYING' | 'PAUSED' | 'GAMEOVER'`.

YÊU CẦU: Viết code sạch, mượt mà ở 60 FPS, không dùng thư viện ngoài, có thể test chạy trực tiếp.
```
* **Tiêu chí nghiệm thu (Check):** Khủng long nhảy lên rơi xuống nhịp nhàng, xương rồng trôi đều, bấm nhảy không bị nhảy 2 lần giữa không trung, va chạm log ra console.

---

### 🔹 PROMPT 2: Hệ thống Vật phẩm (Gold 🪙 & Diamonds 💎) + HUD Điểm số
> **Mục tiêu:** Thêm Vàng và Kim cương xuất hiện trên đường chạy, tính điểm thu thập.

```text
[TASK 2/6 - COLLECTIBLES & HUD SYSTEM]
Tiếp tục phát triển từ Engine ở Task 1, hãy bổ sung hệ thống vật phẩm và bảng hiển thị chỉ số (HUD):
1. Tạo 2 loại vật phẩm ngẫu nhiên xuất hiện dọc đường:
   - 🪙 Gold Coins (Tiền vàng): Xuất hiện thường xuyên theo từng cụm 2-3 đồng ở cả dưới đất và trên không (buộc người chơi phải nhảy để ăn).
   - 💎 Diamonds (Kim cương quý): Xuất hiện hiếm hơn ở vị trí cao, yêu cầu căn lực nhảy chuẩn xác.
2. Vẽ Item trên Canvas:
   - Đồng vàng hình tròn màu vàng óng có hiệu ứng lấp lánh nhẹ.
   - Kim cương hình thoi/giác cạnh màu xanh lam/cyan nổi bật.
3. Kiểm tra va chạm ăn item: Khi Dino chạm vào Coin hoặc Diamond thì item biến mất kèm hiệu ứng nổ hạt nhẹ (floating text "+10" hoặc "+1 💎").
4. HUD Bar ở góc trên Canvas hiển thị:
   - Score (khoảng cách chạy được).
   - Gold: 🪙 0.
   - Diamond: 💎 0.
5. Tạo sẵn hàm sự kiện callback trống: `onCollectDiamond()` để chuẩn bị cho bước gắn câu hỏi Quizz ở Task sau.
```
* **Tiêu chí nghiệm thu (Check):** Dino chạy ăn được vàng, ăn được kim cương, các số trên HUD nhảy tăng đều.

---

### 🔹 PROMPT 3: Component Modal Quizz "Nhìn Hình Đoán Chữ" (Mock Data Slang)
> **Mục tiêu:** Tạo giao diện Modal câu hỏi Slang có hình ảnh minh họa, hỗ trợ tạm dừng Game loop và 4 lựa chọn.

```text
[TASK 3/6 - SLANG VISUAL QUIZ MODAL COMPONENT]
Hãy xây dựng một UI Modal Popup (HTML + CSS Glassmorphism + JS) phủ lên trên Canvas Game để phục vụ cho các câu hỏi đố vui từ lóng (Slang Quizz):
1. Thiết kế Modal nổi bật, hiện đại:
   - Phông nền mờ backdrop-blur tối màu che Canvas.
   - Tiêu đề Badge (ví dụ: "💎 Mystery Slang Discovered!").
   - Khung hình ảnh trực quan (Image Box 300x180px) hiển thị hình ảnh gợi ý từ lóng (dạng "nhìn hình đoán chữ", tạm thời dùng ảnh demo từ Unsplash).
   - Câu hỏi gợi ý bên dưới ảnh (VD: "What campus slang does this image represent?").
   - Lưới 4 nút bấm đáp án (A, B, C, D) với hiệu ứng hover mượt mà.
2. Dữ liệu mẫu (Mock Slang Data - Tạo 5 câu đố slang tiếng Anh/Singlish):
   - Cấu trúc: `{ id, slang, imageUrl, question, options, correctIndex, explanation }`.
   - Ví dụ: Slang "Chope" (ảnh gói khăn giấy đặt trên bàn), "Kiasu" (ảnh sinh viên tranh nhau giành chỗ), "Chop-chop" (ảnh đồng hồ chạy nhanh), "Gánh team" (ảnh người cõng đồng đội).
3. Xử lý Logic Modal:
   - Hàm `openQuizModal(quizData, onAnswerCallback)`.
   - Khi Modal mở: Phải TẠM DỪNG Game Loop Canvas ngay lập tức và VÔ HIỆU HÓA phím Space nhảy của game để không bị nhảy ngoài ý muốn.
   - Khi người chơi click chọn đáp án: Báo xanh/đỏ (Đúng/Sai), hiện giải thích văn hóa ngắn (Explanation), rồi kích hoạt callback trả kết quả.
```
* **Tiêu chí nghiệm thu (Check):** Gọi thử hàm `openQuizModal()`, màn hình game dừng lại, ảnh và 4 nút hiện ra sắc nét, bấm đáp án kiểm tra đúng/sai chính xác.

---

### 🔹 PROMPT 4: Tích hợp 2 Luồng Kích Hoạt Quizz (Trường hợp 1: Kim cương & Trường hợp 2: Đụng Xương rồng)
> **Mục tiêu:** Ghép nối hoàn chỉnh logic cốt lõi của đề tài theo 2 kịch bản đã định nghĩa.

```text
[TASK 4/6 - GAME EVENT TRIGGERS & REVIVAL MECHANISM]
Hãy tích hợp Quizz Modal từ Task 3 vào Canvas Game Engine theo đúng 2 trường hợp sự kiện sau:

💎 TRƯỜNG HỢP 1: KHI DINO NHẢY ĐỤNG KIM CƯƠNG
- Ngay khi Dino chạm viên Kim cương: Tạm dừng game, mở Modal Quizz: "💎 Mystery Diamond Slang!"
- Nếu người chơi trả lời ĐÚNG:
  + Thưởng ngay +50 Điểm thưởng, tăng số Diamond +1.
  + Đóng Modal, đếm ngược 3-2-1 hoặc tiếp tục Game loop chạy tiếp.
- Nếu người chơi trả lời SAI:
  + Không được cộng kim cương, đóng Modal và tiếp tục game bình thường (không bị chết).

🌵 TRƯỜNG HỢP 2: KHI DINO ĐỤNG CÂY XƯƠNG RỒNG (VẬT CẢN)
- Khi va chạm xương rồng: Game KHÔNG GAME OVER NGAY mà dừng lại và hiển thị Modal "💥 OUCH! BẠN ĐÃ VA CHẠM!"
- Modal có 2 nút lựa chọn:
  1. Nút "Give Up" (Bỏ cuộc):
     + Kết thúc vòng chơi -> Chuyển sang màn hình Game Over Summary (hiển thị tổng Score, Gold, Diamond thu được, nút Restart).
  2. Nút "Try More" (Hồi sinh bằng thử thách văn hóa):
     + Lập tức kích hoạt 1 câu hỏi Quizz "Nhìn hình đoán chữ".
     + NẾU TRẢ LỜI ĐÚNG: Dino được HỒI SINH! Cây xương rồng vừa va chạm lập tức biến mất, Dino nhận hiệu ứng "Khiên bảo vệ nhấp nháy" (Invulnerable Shield) trong 2 giây (không bị chết nếu quẹt trúng gì) và Game TIẾP TỤC CHẠY!
     + NẾU TRẢ LỜI SAI: Dino gục ngã -> Kết thúc vòng chơi (Game Over).

YÊU CẦU: Xử lý triệt để biến cờ `isInvulnerable` để khi vừa hồi sinh xong không bị đụng lại ngay vật cản cũ.
```
* **Tiêu chí nghiệm thu (Check):** Test cả 2 luồng: Nhảy ăn kim cương hiện quizz; Đâm vào xương rồng bấm "Try More" trả lời đúng thì hồi sinh chạy tiếp mượt mà.

---

### 🔹 PROMPT 5: Hệ thống Đa Vòng Chơi (Multi-Stage Progression - Mock Data)
> **Mục tiêu:** Tạo 3 màn chơi (Stages) tăng dần độ khó để người chơi có cảm giác chinh phục.

```text
[TASK 5/6 - MULTI-STAGE PROGRESSION SYSTEM]
Hãy phát triển hệ thống nhiều vòng chơi (Stages) nối tiếp nhau:
1. Tạo 3 Vòng chơi mẫu:
   - Stage 1: "Campus Morning" (Tốc độ gameSpeed = 5, xương rồng thưa, xuất hiện từ lóng cơ bản).
   - Stage 2: "Library Crunch" (Tốc độ gameSpeed = 6.5, xương rồng đôi, xuất hiện đồng vàng nhiều hơn, từ lóng làm việc nhóm).
   - Stage 3: "Hackathon Rush" (Tốc độ gameSpeed = 8, xương rồng dày đặc, tốc độ cao, từ lóng thi đua cạnh tranh).
2. Điều kiện hoàn thành màn (Level Clear):
   - Khi người chơi chạy đạt đủ mốc cự ly (ví dụ: Stage 1 = 500m, Stage 2 = 1000m) HOẶC thu thập đủ 2 viên kim cương.
3. Hiệu ứng chuyển màn:
   - Dừng game trong 2 giây, hiện Banner lớn giữa màn hình: "🎉 STAGE 1 CLEARED! READY FOR STAGE 2...".
   - Tự động thay đổi theme giao diện Canvas (Stage 1 nền trời xanh nhạt -> Stage 2 nền hoàng hôn cam -> Stage 3 nền đêm tím Cyberpunk).
   - Nạp bộ câu đố Slang tương ứng với chủ đề của màn đó.
```
* **Tiêu chí nghiệm thu (Check):** Chạy hết Stage 1 tự động chuyển sang Stage 2 với tốc độ nhanh hơn và màu nền đổi rõ rệt.

---

### 🔹 PROMPT 6: Hiệu ứng Âm thanh (Web Audio API), Confetti & Tinh chỉnh UI
> **Mục tiêu:** Thêm âm thanh arcade vui tai, pháo hoa ăn mừng và hoàn thiện giao diện tổng thể.

```text
[TASK 6/6 - SFX SYNTHESIZER & POLISH]
Hoàn thiện toàn bộ trải nghiệm nghe nhìn của game để sẵn sàng demo Hackathon:
1. Bộ âm thanh cổ điển 8-bit (Sử dụng Web Audio API thuần, KHÔNG cần tải file mp3 bên ngoài):
   - Âm thanh nhảy: Tiếng beep/boing nhẹ nhàng khi Dino nhảy.
   - Âm thanh ăn vàng: Tiếng "ping" vui tai khi nhặt Coin.
   - Âm thanh ăn kim cương: Hợp âm lấp lánh khi chạm Diamond.
   - Âm thanh trả lời đúng: Tiếng "Victory Fanfare" ngắn 2 nốt vui mừng.
   - Âm thanh va chạm: Tiếng "thud" trầm khi đụng xương rồng.
2. Hiệu ứng Pháo hoa Confetti:
   - Bắn pháo hoa rực rỡ khi trả lời đúng Quizz hoặc khi hoàn thành 1 Stage.
3. Nút Bật/Tắt âm thanh (Mute/Unmute toggle) ở góc màn hình.
4. Nút bấm điều khiển trên điện thoại (Mobile Touch Controls): Thêm 1 nút "TAP TO JUMP" to rõ dành cho người dùng test trên điện thoại.
```
* **Tiêu chí nghiệm thu (Check):** Game có âm thanh đầy đủ khi chơi, hiệu ứng pháo hoa bắt mắt, chơi được cả trên máy tính và mobile.

---

### 💡 Gợi ý thực hiện tiếp theo:
Bản thiết kế này đã được lưu đầy đủ vào [DE_TAI_CULTURSYNC_BUSINESS_TECH_TEAM14.md](file:///d:/Cac_Cuoc_Thi/Global_Hackathon/DE_TAI_CULTURSYNC_BUSINESS_TECH_TEAM14.md). Khi bạn sẵn sàng bắt tay vào làm tính năng game này, bạn chỉ cần gửi **Prompt 1** trước tiên để bắt đầu triển khai!
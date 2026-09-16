"""
backend/database.py - Upgraded Slang & Game Database Layer for CultureSync
Focuses on Campus Slang & Colloquialisms (VN <-> SG) and Gamified Scenario Dilemmas.
"""

import sqlite3
import json
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_FILE = os.path.join(PROJECT_ROOT, "cultursync.db")


def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(force: bool = False):
    conn = get_connection()
    cursor = conn.cursor()

    if force:
        cursor.execute("DROP TABLE IF EXISTS slang_dictionary;")
        cursor.execute("DROP TABLE IF EXISTS game_challenges;")
        cursor.execute("DROP TABLE IF EXISTS users;")
        cursor.execute("DROP TABLE IF EXISTS interaction_logs;")
        conn.commit()

    # 1. Bảng Người dùng & Tiến độ Game (Streaks, XP, Level, Badges)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        culture_origin TEXT DEFAULT 'Vietnam',
        target_culture TEXT DEFAULT 'Singapore',
        streak_count INTEGER DEFAULT 1,
        xp_points INTEGER DEFAULT 50,
        current_level TEXT DEFAULT 'Cultural Explorer',
        badges_json TEXT DEFAULT '["First Step"]',
        mastered_slangs_json TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Bảng Từ Điển Từ Lóng Học Đường (Bilingual Campus Slang Bank)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS slang_dictionary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        term TEXT UNIQUE NOT NULL,
        culture TEXT NOT NULL,                     -- 'SG' hoặc 'VN'
        category TEXT NOT NULL,                    -- 'deadline_crunch', 'social_chat', 'task_delegation', 'frustration_coping'
        phonetic TEXT,                             -- Cách phát âm
        literal_meaning TEXT NOT NULL,             -- Nghĩa đen
        cultural_meaning TEXT NOT NULL,            -- Ý nghĩa tâm lý & mục đích thực sự (Cultural Intent)
        equivalent_term TEXT,                      -- Từ tương đương bên văn hóa đối ứng
        whatsapp_example TEXT NOT NULL,            -- Đoạn chat mẫu thực tế trên WhatsApp
        suggested_reply TEXT NOT NULL,             -- Câu trả lời lịch sự & tinh tế nhất
        difficulty_level INTEGER DEFAULT 1,        -- 1: Cơ bản, 2: Làm việc nhóm, 3: Xung đột
        is_verified INTEGER DEFAULT 1
    );
    """)

    # 3. Bảng Thử Thách Game Tình Huống (Gamified Scenario Dilemmas)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS game_challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slang_id INTEGER,
        challenge_type TEXT NOT NULL,              -- 'decode_intent', 'tactful_reply', 'slang_match'
        scenario_context TEXT NOT NULL,            -- Tình huống thực tế (đoạn tin nhắn WhatsApp)
        question TEXT NOT NULL,                    -- Câu hỏi đặt ra cho người chơi
        options_json TEXT NOT NULL,                -- 4 lựa chọn (JSON array)
        correct_index INTEGER NOT NULL,            -- Vị trí đáp án chuẩn (0, 1, 2, 3)
        explanation TEXT NOT NULL,                 -- Giải thích tâm lý văn hóa & bài học
        xp_reward INTEGER DEFAULT 20,
        FOREIGN KEY (slang_id) REFERENCES slang_dictionary(id)
    );
    """)

    # 4. Bảng Nhật ký Game & Tương tác (Human-in-the-loop Analytics)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interaction_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 1,
        feature TEXT NOT NULL,                     -- 'game_challenge' hoặc 'slang_search'
        user_input TEXT NOT NULL,
        ai_output TEXT NOT NULL,
        rating TEXT DEFAULT 'pass',
        user_feedback TEXT,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """)

    conn.commit()
    seed_slang_and_game_data(conn)
    conn.close()
    print("✅ Database SQLite initialized with upgraded Slang & Game Bank!")


def seed_slang_and_game_data(conn):
    cursor = conn.cursor()

    # Seed User mặc định
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO users (username, role, culture_origin, target_culture, streak_count, xp_points, current_level)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, [
            ('tung_le', 'student', 'Vietnam', 'Singapore', 3, 140, 'Slang Apprentice'),
            ('shin_yee', 'student', 'Singapore', 'Vietnam', 2, 95, 'Cultural Diplomat'),
            ('mentor_dat', 'admin', 'Vietnam', 'International', 0, 0, 'Head Judge'),
            ('mentor_kiet', 'admin', 'Vietnam', 'International', 0, 0, 'Tech Master')
        ])

    # Seed Từ Điển Từ Lóng Phong Phú (12 từ cốt lõi cực chuẩn)
    cursor.execute("SELECT COUNT(*) FROM slang_dictionary")
    if cursor.fetchone()[0] == 0:
        slangs = [
            # SINGAPORE (SINGLISH)
            (
                "kiasu", "SG", "deadline_crunch", "/kʲaː.suː/",
                "Sợ bị thua thiệt, sợ bị tụt lại phía sau.",
                "Tâm lý muốn chuẩn bị kỹ càng, hoàn thành việc sớm nhất có thể để đảm bảo an toàn cho cả nhóm. Không phải là công kích hay mắng bạn ích kỷ!",
                "Sợ thua thiệt / Cầu toàn",
                "Hey guys, don't be so kiasu, the deadline is 3 PM, just submit what we have!",
                "I understand we want to stay ahead of the deadline! Testing takes 30 mins so we don't crash on stage. Let's submit at 3:30 PM, can?",
                2
            ),
            (
                "chop-chop", "SG", "deadline_crunch", "/tʃɒp tʃɒp/",
                "Làm thật nhanh lên, khẩn trương lên.",
                "Thúc giục tiến độ một cách thực dụng và thân mật giữa các bạn sinh viên thân thiết khi sắp đến giờ nộp bài.",
                "Làm lẹ lên / Gấp rút",
                "Meeting starts in 5 minutes, let's chop-chop finish the slides!",
                "On it! Wrapping up the final diagram now, sending in 2 minutes!",
                1
            ),
            (
                "chope", "SG", "social_chat", "/tʃoʊp/",
                "Đặt chỗ / Giữ chỗ trước.",
                "Nét văn hóa độc đáo tại Singapore: Đặt gói khăn giấy hoặc thẻ sinh viên lên bàn để giữ chỗ ngồi học nhóm hoặc ăn uống.",
                "Giành chỗ trước / Đặt gạch",
                "I will chope the discussion booth at the library for our team at 2 PM.",
                "Awesome, thanks for chope-ing the room! We will bring the prototype over.",
                1
            ),
            (
                "can lah", "SG", "social_chat", "/kæn lɑː/",
                "Được chứ! / Làm được mà! / Chắc chắn rồi!",
                "Từ cửa miệng thể hiện sự đồng ý nhiệt tình, giảm bớt căng thẳng và khích lệ đồng đội.",
                "Được tuốt / Ổn áp mà",
                "Can we test the AI voice API before the mentor arrives? - Can lah!",
                "Great! Let's run the voice test right away then.",
                1
            ),
            (
                "sian", "SG", "frustration_coping", "/siː.ɑːn/",
                "Mệt mỏi, chán nản, kiệt sức trước tình huống khó.",
                "Bày tỏ cảm xúc tiêu cực nhẹ khi gặp sự cố kỹ thuật hoặc deadline dồn dập. Đây là lúc đồng đội cần động viên nhau.",
                "Xụi lơ / Nản lòng",
                "So sian, the cloud server went to sleep right before our demo.",
                "No worries bro! We have the local backup ready, steady lah!",
                2
            ),
            (
                "steady lah", "SG", "social_chat", "/ˈstɛdi lɑː/",
                "Tuyệt vời! / Đỉnh đấy! / Rất đáng tin cậy!",
                "Khen ngợi nỗ lực hoặc giải pháp xuất sắc của đồng đội, thể hiện sự công nhận cao.",
                "Đỉnh của chóp / Chuẩn cơm mẹ nấu",
                "I just finished connecting the Groq 120B model! - Wah, steady lah!",
                "Thanks bro! Let's crush the pitch together.",
                1
            ),
            (
                "arrow", "SG", "task_delegation", "/ˈæroʊ/",
                "Bị chỉ định làm việc khó hoặc việc không ai muốn nhận.",
                "Khi nhóm trưởng phân công một việc gấp cho ai đó: 'He arrowed me to do the slide design'.",
                "Bị dí việc / Bị trúng tên",
                "Why did Marcus arrow me to present the Q&A section?",
                "He probably trusts your English speaking ability! I'll back you up with the slides.",
                2
            ),
            (
                "catch no ball", "SG", "social_chat", "/kætʃ noʊ bɔːl/",
                "Hoàn toàn không hiểu gì cả (Dịch nghĩa đen từ tiếng Phúc Kiến).",
                "Sinh viên nói khi bài giảng hoặc giải thích kỹ thuật quá phức tạp, cần đồng đội giải thích lại đơn giản hơn.",
                "Mù tịt / Ngơ ngác",
                "The mentor's feedback on the architecture was so fast, I catch no ball!",
                "Haha don't worry, I took notes! Basically he wants us to emphasize the MCP tools more.",
                2
            ),

            # VIETNAM (CAMPUS & TECH SLANG)
            (
                "gánh team", "VN", "task_delegation", "/ɣaʲŋ˧ˀ˥ tiːm/",
                "Một người nỗ lực làm phần lớn công việc để giúp cả nhóm vượt qua deadline.",
                "Sự ghi nhận chân thành của sinh viên Việt Nam dành cho thành viên nòng cốt kỹ thuật hoặc làm slide trong nhóm.",
                "Carry the team / MVP",
                "Tùng đang gánh team phần code backend và kết nối AI.",
                "Thanks everyone, but we all win together! Let's polish the presentation slides.",
                1
            ),
            (
                "bào việc", "VN", "deadline_crunch", "/baːw˨˩ viə̯k˨˩˨/",
                "Làm việc cật lực thâu đêm suốt sáng không nghỉ.",
                "Thể hiện tinh thần cống hiến hết mình cho mục tiêu chung của sinh viên Việt Nam trong các kỳ hackathon 48h.",
                "Grinding / Burning midnight oil",
                "Đêm qua cả nhóm bào việc đến 3 giờ sáng để kịp nộp canvas.",
                "Great dedication, but make sure to grab some coffee and rest before the pitch!",
                1
            ),
            (
                "thao túng tâm lý", "VN", "social_chat", "/tʰaːw˧˧ tuŋ˧ˀ˥ təm˧˧ li˧ˀ˥/",
                "Nói năng khéo léo để thuyết phục người khác làm theo ý mình.",
                "Cách nói đùa vui khi một bạn trong nhóm phân chia công việc khéo léo khiến ai cũng vui vẻ nhận việc khó.",
                "Master persuasion / Charm",
                "Shin Yee vừa thao túng tâm lý để Tùng thức đêm code prototype!",
                "Haha it worked because we all want that 1st prize!",
                2
            ),
            (
                "xụi lơ", "VN", "frustration_coping", "/suːj˧˨ ləː˧˧/",
                "Kiệt sức, hết năng lượng, không còn sức để làm tiếp.",
                "Trạng thái mệt mỏi thể xác và tinh thần sau những giờ debug căng thẳng, cần nghỉ ngơi và nạp năng lượng.",
                "Burned out / Sian",
                "Debug xong cái lỗi CORS này là xụi lơ luôn rồi.",
                "Take a 15-minute break and grab some snacks, we got this!",
                1
            )
        ]

        cursor.executemany("""
        INSERT INTO slang_dictionary (
            term, culture, category, phonetic, literal_meaning, cultural_meaning, 
            equivalent_term, whatsapp_example, suggested_reply, difficulty_level, is_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, slangs)

    # Seed Ngân hàng Thử Thách Game Tình Huống (Dilemma Challenges)
    cursor.execute("SELECT COUNT(*) FROM game_challenges")
    if cursor.fetchone()[0] == 0:
        challenges = [
            (
                1, "decode_intent",
                "Trong nhóm WhatsApp lúc 2:00 PM, Marcus (Singapore) nhắn: 'Hey guys, deadline is 3 PM chop-chop, don't be so kiasu!'. Bạn An (Việt Nam) nên hiểu ý Marcus như thế nào?",
                "Marcus thực sự muốn truyền đạt điều gì?",
                json.dumps([
                    "Marcus đang mắng bạn là kẻ ích kỷ và nhỏ nhen.",
                    "Marcus muốn cả nhóm làm nhanh lên và đừng lo xa thái quá, vì bạn ấy muốn nhóm nộp bài an toàn đúng giờ.",
                    "Marcus đang bực tức và muốn hủy bỏ buổi họp nhóm.",
                    "Marcus đang chê bai khả năng tiếng Anh của bạn."
                ], ensure_ascii=False),
                1,
                "Văn hóa 'Kiasu' của Singapore phản ánh nỗi sợ bị thua thiệt, xuất phát từ mong muốn cả nhóm đạt thành tích cao nhất. Marcus hoàn toàn không có ý xúc phạm cá nhân bạn!",
                25
            ),
            (
                3, "decode_intent",
                "Marcus nhắn tin: 'I already chope-d the discussion booth at Level 2, come up now!'. Từ 'chope' ở đây nghĩa là gì?",
                "Hành động 'chope' của Marcus có ý nghĩa gì trong văn hóa Singapore?",
                json.dumps([
                    "Marcus đã mua lại phòng thảo luận bằng tiền túi.",
                    "Marcus đã đặt chỗ/giữ chỗ trước (nét văn hóa giữ chỗ văn minh của người Sing) để cả nhóm có chỗ làm việc yên tĩnh.",
                    "Marcus đang phàn nàn vì phòng quá ồn ào.",
                    "Marcus muốn rủ bạn đi ăn trưa."
                ], ensure_ascii=False),
                1,
                "Ở Singapore, 'chope' là thói quen giữ chỗ trước (thường dùng khăn giấy đặt trên bàn). Marcus đã chu đáo giữ chỗ sẵn cho cả đội!",
                20
            ),
            (
                1, "tactful_reply",
                "Marcus hối: 'Submit slides by 3 PM chop-chop, can lah?'. Nhưng bạn cần thêm 30 phút để kiểm thử API AI. Cách đáp lại khéo léo nhất là gì?",
                "Lựa chọn câu trả lời giữ hòa khí và đạt hiệu quả công việc cao nhất:",
                json.dumps([
                    "No, 3 PM is too rushed. Why you keep pushing like that?",
                    "Understood the 3 PM goal! Testing the AI API takes about 30 more minutes so our demo doesn't crash on stage. Can we submit at 3:30 PM instead so both slides and code are rock-solid?",
                    "(Im lặng không trả lời và tắt mic)",
                    "You do it yourself if you want it so fast."
                ], ensure_ascii=False),
                1,
                "Khi làm việc với sinh viên Singapore (Low-context), họ tôn trọng lý do kỹ thuật khách quan và đề xuất giờ thay thế cụ thể hơn là sự phủ định cộc lốc hoặc im lặng!",
                30
            ),
            (
                9, "slang_match",
                "Khi bạn sinh viên Việt Nam nói: 'Tùng đang gánh team đồ án này!', từ tiếng lóng Singlish hoặc tiếng Anh tương đương nhất là:",
                "Tìm từ tương đương phản ánh hành động 'gánh team':",
                json.dumps([
                    "He is kiasu",
                    "He is hard-carrying the team / MVP",
                    "He is chope-ing the team",
                    "He is sian"
                ], ensure_ascii=False),
                1,
                "'Gánh team' trong văn hóa sinh viên Việt Nam tương đương với 'Hard carry' hoặc 'MVP' - người đảm nhận trọng trách lớn nhất đưa cả đội về đích.",
                20
            )
        ]

        cursor.executemany("""
        INSERT INTO game_challenges (
            slang_id, challenge_type, scenario_context, question, options_json, correct_index, explanation, xp_reward
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, challenges)

    conn.commit()


# =====================================================================
# CÁC HÀM CRUD PHỤC VỤ GAME & SLANG ENGINE
# =====================================================================

def db_get_all_slangs(culture: str = None, category: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM slang_dictionary WHERE 1=1"
    params = []
    if culture:
        query += " AND culture = ?"
        params.append(culture)
    if category:
        query += " AND category = ?"
        params.append(category)
    query += " ORDER BY id ASC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def db_lookup_slang(term: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM slang_dictionary WHERE LOWER(term) = LOWER(?)", (term.strip(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def db_get_random_game_challenge(challenge_type: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT c.*, s.term, s.culture, s.cultural_meaning FROM game_challenges c LEFT JOIN slang_dictionary s ON c.slang_id = s.id WHERE 1=1"
    params = []
    if challenge_type:
        query += " AND c.challenge_type = ?"
        params.append(challenge_type)
    query += " ORDER BY RANDOM() LIMIT 1"
    cursor.execute(query, params)
    row = cursor.fetchone()
    conn.close()
    if row:
        d = dict(row)
        d["options"] = json.loads(d["options_json"])
        return d
    return None


def db_record_user_game_win(user_id: int = 1, xp_gained: int = 20):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE users 
    SET xp_points = xp_points + ?, streak_count = streak_count + 1 
    WHERE id = ?
    """, (xp_gained, user_id))
    conn.commit()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = dict(cursor.fetchone())
    conn.close()
    return user


def db_save_unrecognized_slang(term: str, culture: str = "SG"):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
        INSERT OR IGNORE INTO slang_dictionary (
            term, culture, category, literal_meaning, cultural_meaning, 
            whatsapp_example, suggested_reply, is_verified
        ) VALUES (?, ?, 'general', 'Chưa có định nghĩa', 'Phát hiện từ người dùng - Chờ duyệt', '', '', 0)
        """, (term.strip().lower(), culture))
        conn.commit()
    except Exception:
        pass
    finally:
        conn.close()


def db_get_cultural_rules(category: str = None, keyword: str = None):
    """Giữ tương thích cho MCP tools"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM slang_dictionary WHERE category = ? OR term LIKE ? LIMIT 3", (category or "deadline_crunch", f"%{keyword or ''}%"))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def db_log_interaction(user_id: int, feature: str, user_input: str, ai_output: str, rating: str = "pass", user_feedback: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO interaction_logs (user_id, feature, user_input, ai_output, rating, user_feedback, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, feature, user_input, ai_output, rating, user_feedback, 'pending' if rating == 'flagged' else 'resolved'))
    interaction_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return interaction_id


def db_update_interaction_feedback(interaction_id: int, rating: str, user_feedback: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE interaction_logs 
    SET rating = ?, user_feedback = ?, status = ? 
    WHERE id = ?
    """, (rating, user_feedback, 'pending' if rating == 'flagged' else 'resolved', interaction_id))
    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db(force=True)
    print("Test Slangs count:", len(db_get_all_slangs()))
    print("Test Random Challenge:", db_get_random_game_challenge())

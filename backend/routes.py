"""
backend/routes.py - Flask API Routes for CultureSync
Serves Game Challenges, Answer Verification, AI Slang Crawler, and Slang Dictionary.
"""

from flask import Blueprint, request, jsonify
import backend.database as database
from agent.slang_crawler import ai_crawl_and_ingest_new_slangs
from agent.orchestrator import execute_agent_with_skill_and_mcp

api_bp = Blueprint("api", __name__)


# =====================================================================
# 1. GAME API ROUTES (MAIN FEATURE)
# =====================================================================

@api_bp.route("/api/game/next", methods=["GET"])
def get_next_game_challenge():
    """
    Lấy câu hỏi/tình huống tiếp theo từ SQLite Database
    """
    challenge = database.db_get_random_game_challenge()
    if not challenge:
        # Nếu chưa có câu đố nào, tự động gọi AI cào 2 câu mới
        ai_crawl_and_ingest_new_slangs("SG", 2)
        challenge = database.db_get_random_game_challenge()

    # Không gửi correct_index về client để chống cheat
    clean_challenge = {
        "id": challenge["id"],
        "challenge_type": challenge["challenge_type"],
        "scenario_context": challenge["scenario_context"],
        "question": challenge["question"],
        "options": challenge["options"],
        "xp_reward": challenge["xp_reward"],
        "term": challenge.get("term", ""),
        "culture": challenge.get("culture", "SG")
    }
    return jsonify(clean_challenge)


@api_bp.route("/api/game/answer", methods=["POST"])
def verify_game_answer():
    """
    Kiểm tra đáp án người chơi chọn, cập nhật điểm, XP và Streak
    """
    data = request.get_json() or {}
    challenge_id = data.get("challenge_id")
    selected_index = data.get("selected_index")
    user_id = data.get("user_id", 1)

    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM game_challenges WHERE id = ?", (challenge_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "Không tìm thấy thử thách!"}), 404

    challenge = dict(row)
    is_correct = (selected_index == challenge["correct_index"])

    xp_gained = challenge["xp_reward"] if is_correct else 5
    user = database.db_record_user_game_win(user_id=user_id, xp_gained=xp_gained if is_correct else 0)

    # Ghi log tương tác
    database.db_log_interaction(
        user_id=user_id,
        feature="game_challenge",
        user_input=f"Challenge #{challenge_id}, Selected: {selected_index}",
        ai_output=f"Correct: {is_correct}",
        rating="pass" if is_correct else "flagged"
    )

    return jsonify({
        "is_correct": is_correct,
        "correct_index": challenge["correct_index"],
        "explanation": challenge["explanation"],
        "xp_gained": xp_gained if is_correct else 0,
        "total_xp": user["xp_points"],
        "streak_count": user["streak_count"],
        "current_level": user["current_level"]
    })


# =====================================================================
# 2. AI SLANG CRAWLER API (AI AS INPUT/DATA HARVESTER)
# =====================================================================

@api_bp.route("/api/slang/crawl", methods=["POST"])
def crawl_new_slangs():
    """
    Kích hoạt AI cào từ lóng mới trên mạng và nạp tự động vào Database
    """
    data = request.get_json() or {}
    culture = data.get("culture", "SG")
    count = int(data.get("count", 2))

    try:
        newly_ingested = ai_crawl_and_ingest_new_slangs(culture=culture, count=count)
        return jsonify({
            "status": "success",
            "message": f"AI đã cào và nạp thành công {len(newly_ingested)} từ lóng mới vào Database!",
            "new_slangs": newly_ingested
        })
    except Exception as e:
        print(f"❌ Lỗi AI Crawler: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


# =====================================================================
# 3. SLANG DICTIONARY API
# =====================================================================

@api_bp.route("/api/slangs", methods=["GET"])
def get_slangs():
    """Lấy toàn bộ từ điển từ lóng từ Database"""
    culture = request.args.get("culture")
    category = request.args.get("category")
    return jsonify(database.db_get_all_slangs(culture=culture, category=category))


@api_bp.route("/api/user/stats", methods=["GET"])
def get_user_stats():
    """Lấy thống kê điểm và streak của sinh viên"""
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify(dict(row))
    return jsonify({"streak_count": 3, "xp_points": 140, "current_level": "Slang Explorer"})


# =====================================================================
# 4. TONE TUNER (HỖ TRỢ THÊM NẾU CẦN)
# =====================================================================

@api_bp.route("/api/tune", methods=["POST"])
def tune_message():
    data = request.get_json() or {}
    user_input = data.get("text", "").strip()
    origin_culture = data.get("origin_culture", "Vietnam")
    target_culture = data.get("target_culture", "Singapore")

    if not user_input:
        return jsonify({"error": "Vui lòng nhập một câu tin nhắn!"}), 400

    try:
        result = execute_agent_with_skill_and_mcp(
            skill_name="tone_tuner",
            user_text=user_input,
            origin_culture=origin_culture,
            target_culture=target_culture
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

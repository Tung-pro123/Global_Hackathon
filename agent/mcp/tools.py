"""
agent/mcp/tools.py - Custom Domain MCP Tools for CultureSync
These tools query the verified SQLite Database to ground LLM responses with real cultural data.
"""

import sys
import os

# Đảm bảo đường dẫn import
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
import database


def tool_lookup_slang(term: str, culture: str = "SG") -> dict:
    """
    [MCP Tool] Tra cứu từ lóng sinh viên Singapore (Singlish) hoặc Việt Nam từ SQLite.
    Nếu không tìm thấy, tự động gắn cờ ghi nhận cho Admin.
    """
    term_clean = term.lower().strip()
    result = database.db_lookup_slang(term_clean)
    
    if result:
        return {
            "found_in_database": True,
            "term": result["term"],
            "culture": result["culture"],
            "definition": result["definition"],
            "example": result["example"],
            "cultural_nuance": result["cultural_nuance"]
        }
    
    # Cơ chế tự học: Tự động ghi nhận từ mới vào hàng đợi Admin
    database.db_save_unrecognized_slang(term_clean, culture)
    return {
        "found_in_database": False,
        "term": term_clean,
        "message": f"Từ '{term}' chưa có trong DB chính thức. AI hãy phân tích theo ngữ cảnh câu nói và gắn nhãn '(AI suy luận)'."
    }


def tool_get_cultural_rules(keyword: str = None, category: str = None) -> list:
    """
    [MCP Tool] Lấy các quy tắc văn hóa chuẩn do Giảng viên/Admin đã phê duyệt từ SQLite.
    """
    rules = database.db_get_cultural_rules(category=category, keyword=keyword)
    if not rules:
        # Lấy ít nhất 2 quy tắc chung nhất
        rules = database.db_get_cultural_rules()[:2]
    return rules


def tool_log_user_feedback(interaction_id: int, rating: str, feedback_text: str = "") -> dict:
    """
    [MCP Tool] Ghi nhận phản hồi của sinh viên (Pass hoặc Flagged) vào SQLite.
    """
    database.db_update_interaction_feedback(interaction_id, rating, feedback_text)
    return {
        "status": "success",
        "interaction_id": interaction_id,
        "rating": rating,
        "message": "Phản hồi đã được ghi nhận vào hàng đợi kiểm duyệt của Giảng viên."
    }


def tool_get_micro_quiz() -> list:
    """
    [MCP Tool] Rút câu đố văn hóa từ ngân hàng đề SQLite.
    """
    return database.db_get_all_quizzes()

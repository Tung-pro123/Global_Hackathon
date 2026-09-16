"""
agent/mcp/mcp_server.py - Model Context Protocol (MCP) Server & Tool Registry
Defines official MCP Tool Schemas and routes execution to registered Python functions.
"""

import json
from agent.mcp.tools import (
    tool_lookup_slang,
    tool_get_cultural_rules,
    tool_log_user_feedback,
    tool_get_micro_quiz
)

# Danh sách định nghĩa JSON Schema của các MCP Tools (Chuẩn MCP / OpenAI Function Calling)
MCP_TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "lookup_slang",
            "description": "Tra cứu ý nghĩa, nguồn gốc và sắc thái văn hóa của từ lóng sinh viên Singapore hoặc Việt Nam.",
            "parameters": {
                "type": "object",
                "properties": {
                    "term": {"type": "string", "description": "Từ lóng cần tra (ví dụ: kiasu, chop-chop, can lah, gánh team)"},
                    "culture": {"type": "string", "enum": ["SG", "VN"], "description": "Văn hóa của từ lóng"}
                },
                "required": ["term"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_cultural_rules",
            "description": "Lấy các quy tắc ứng xử và mẫu câu chuẩn đã được Giảng viên (Admin) phê duyệt từ Database.",
            "parameters": {
                "type": "object",
                "properties": {
                    "keyword": {"type": "string", "description": "Từ khóa tình huống (ví dụ: slide, deadline, code)"},
                    "category": {"type": "string", "enum": ["feedback", "deadline", "disagreement", "general"]}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "log_user_feedback",
            "description": "Ghi nhận đánh giá của sinh viên (Hài lòng hoặc Báo cáo sượng) vào hàng đợi Admin Review.",
            "parameters": {
                "type": "object",
                "properties": {
                    "interaction_id": {"type": "integer", "description": "ID phiên tương tác"},
                    "rating": {"type": "string", "enum": ["pass", "flagged"]},
                    "feedback_text": {"type": "string", "description": "Ý kiến góp ý của sinh viên"}
                },
                "required": ["interaction_id", "rating"]
            }
        }
    }
]


class MCPServer:
    """MCP Server điều phối thực thi các Tools"""

    def __init__(self):
        self.tools = {
            "lookup_slang": tool_lookup_slang,
            "get_cultural_rules": tool_get_cultural_rules,
            "log_user_feedback": tool_log_user_feedback,
            "get_micro_quiz": tool_get_micro_quiz
        }

    def get_schemas(self):
        """Trả về danh sách Schema để cung cấp cho LLM"""
        return MCP_TOOL_SCHEMAS

    def execute_tool(self, tool_name: str, arguments: dict):
        """Thực thi một tool theo tên gọi và trả về kết quả"""
        if tool_name in self.tools:
            return self.tools[tool_name](**arguments)
        return {"error": f"Tool '{tool_name}' không tồn tại trên MCP Server."}


# Khởi tạo singleton server
mcp_server = MCPServer()

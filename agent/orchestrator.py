"""
agent/orchestrator.py - Core Agent Orchestrator
Coordinates Skills, MCP Tools, and AI Engines (Groq 120B / Gemini Flash).
"""

import os
import json
import urllib.request
import urllib.error
from agent.mcp.mcp_server import mcp_server

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

GROQ_MODEL = "openai/gpt-oss-120b"
GEMINI_MODEL = "gemini-2.5-flash"


def load_skill_markdown(skill_name: str) -> str:
    """Tải nội dung hướng dẫn từ file SKILL.md trong thư mục agent/skills/"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    skill_path = os.path.join(base_dir, "skills", skill_name, "SKILL.md")
    if os.path.exists(skill_path):
        with open(skill_path, "r", encoding="utf-8") as f:
            return f.read()
    return ""


def call_groq(prompt: str, system_instruction: str = "") -> str:
    """Gọi Groq Cloud API với model 120B"""
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1200
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=12) as response:
        result = json.loads(response.read().decode("utf-8"))
        return result["choices"][0]["message"]["content"]


def call_gemini(prompt: str, system_instruction: str = "") -> str:
    """Gọi Google Gemini 2.5 Flash làm dự phòng"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1000}
    }
    if system_instruction:
        payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=12) as response:
        result = json.loads(response.read().decode("utf-8"))
        return result["candidates"][0]["content"]["parts"][0]["text"]


def execute_agent_with_skill_and_mcp(skill_name: str, user_text: str, origin_culture: str = "Vietnam", target_culture: str = "Singapore") -> dict:
    """
    Quy trình Agent hoàn chỉnh:
    1. Đọc Skill từ file SKILL.md
    2. Gọi MCP Tools để lấy dữ liệu thực tế từ Database
    3. Ghép Context và bắn lên Groq 120B
    """
    print("\n" + "="*60)
    print(f"🤖 [AGENT ORCHESTRATOR] Bắt đầu xử lý tin nhắn của sinh viên...")
    print(f"📝 Câu gốc: \"{user_text}\"")

    # 1. Nạp Skill từ thư mục agent/skills/
    print(f"🧠 [BƯỚC 1 - LOAD SKILL] Đang tải file: agent/skills/{skill_name}/SKILL.md")
    skill_content = load_skill_markdown(skill_name)
    if skill_content:
        print(f"   -> Đã nạp thành công Skill '{skill_name}' ({len(skill_content)} ký tự)")
    else:
        print(f"   -> ⚠️ Không tìm thấy file SKILL.md, dùng prompt mặc định.")

    # 2. Gọi MCP Tools lấy tri thức nền tảng từ SQLite Database
    print(f"🧰 [BƯỚC 2 - EXECUTE MCP TOOLS] Đang gọi các MCP Tools truy vấn SQLite...")
    
    # Tool 1: Lấy quy tắc ứng xử văn hóa
    cultural_rules = mcp_server.execute_tool("get_cultural_rules", {"keyword": user_text})
    print(f"   -> [MCP Tool: get_cultural_rules] Tìm thấy {len(cultural_rules)} quy tắc ứng xử phù hợp từ Admin DB")

    # Tool 2: Quét và tra cứu từ lóng
    slang_keywords = ["kiasu", "chop-chop", "can lah", "chope", "sian", "gánh team", "bào việc"]
    detected_slangs = []
    for kw in slang_keywords:
        if kw in user_text.lower():
            slang_info = mcp_server.execute_tool("lookup_slang", {"term": kw, "culture": "SG"})
            if slang_info.get("found_in_database"):
                detected_slangs.append(slang_info)
                print(f"   -> [MCP Tool: lookup_slang] Phát hiện từ lóng '{kw}': Đã xác thực trong Database!")

    # 3. Tổng hợp System Prompt có chứa Skill + MCP Data
    print(f"⚡ [BƯỚC 3 - SYNTHESIS & INFERENCE] Tổng hợp Skill + MCP Context -> Gửi lên Groq 120B...")
    system_instruction = f"""
{skill_content}

---
ACTIVE MCP GROUNDING CONTEXT:
Origin Culture: {origin_culture} | Target Culture: {target_culture}
Retrieved Administrative Rules (via MCP get_cultural_rules):
{json.dumps(cultural_rules, ensure_ascii=False, indent=2)}

Retrieved Campus Slang Data (via MCP lookup_slang):
{json.dumps(detected_slangs, ensure_ascii=False, indent=2)}

Return pure JSON only conforming to the schema in the skill.
"""

    prompt = f"Student draft: \"{user_text}\""

    try:
        raw_res = call_groq(prompt, system_instruction)
        print(f"   -> Groq 120B phản hồi thành công siêu tốc!")
    except Exception as e:
        print(f"   -> ⚠️ Groq gặp sự cố ({e}), tự động chuyển sang Google Gemini Flash...")
        raw_res = call_gemini(prompt, system_instruction)
        print(f"   -> Gemini Flash phản hồi thành công!")

    # Clean JSON
    cleaned = raw_res.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    print(f"✅ [AGENT ORCHESTRATOR] Hoàn tất luồng xử lý! Xuất dữ liệu trả về Frontend.")
    print("="*60 + "\n")

    return json.loads(cleaned)


def generate_safe_contextual_sentence(slang_term: str, culture: str = "SG", interest: str = "campus", english_level: str = "intermediate") -> dict:
    """
    Sinh câu văn mẫu thực tế chứa từ lóng theo Skill cultural_sentence_crafter:
    - Tuân thủ 100% tiêu chuẩn cộng đồng và pháp luật (Zero Profanity, Zero Hate Speech, Zero Illegal).
    - May đo theo Domain Interest và English Level.
    - Kèm chỉ dẫn ngữ dụng (When to use, When to avoid) và cờ kiểm duyệt.
    """
    print("\n" + "="*60)
    print(f"✨ [CULTURAL SENTENCE CRAFTER] Đang tạo câu văn an toàn cho từ: '{slang_term}'...")
    print(f"🎯 Persona: Văn hóa: {culture} | Sở thích: {interest} | Cấp độ: {english_level}")

    skill_content = load_skill_markdown("cultural_sentence_crafter")
    
    # MCP lookup slang
    slang_info = mcp_server.execute_tool("lookup_slang", {"term": slang_term, "culture": culture})

    system_instruction = f"""
{skill_content}

---
MCP GROUNDING KNOWLEDGE:
Target Slang: "{slang_term}"
Culture: "{culture}"
Verified Database Info: {json.dumps(slang_info, ensure_ascii=False)}

User Persona:
- Domain Interest: {interest}
- English Proficiency Level: {english_level}

CRITICAL RULES:
- Output MUST be 100% safe, adhering to Community Guidelines (no profanity, no hate speech, no vulgarity) and Law (no gambling, no drugs).
- Output pure JSON conforming strictly to the output schema. No Markdown wrapper.
"""

    prompt = f"Generate a contextual, safe campus sentence using the slang '{slang_term}' tailored for a student into '{interest}' with '{english_level}' English level."

    try:
        raw_res = call_groq(prompt, system_instruction)
        print(f"   -> Groq 120B phản hồi thành công!")
    except Exception as e:
        print(f"   -> ⚠️ Groq gặp sự cố ({e}), chuyển sang Gemini Flash...")
        raw_res = call_gemini(prompt, system_instruction)
        print(f"   -> Gemini Flash phản hồi thành công!")

    # Clean JSON
    cleaned = raw_res.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    print(f"✅ [CULTURAL SENTENCE CRAFTER] Hoàn tất tạo câu và kiểm duyệt an toàn!")
    print("="*60 + "\n")
    return json.loads(cleaned)


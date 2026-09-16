"""
agent/slang_crawler.py - AI Slang Data Crawler & Ingestion Pipeline
Uses AI to discover, analyze, and ingest brand-new campus slangs from student discourse
into the SQLite database, automatically creating playable game challenges.
"""

import os
import json
import urllib.request
import urllib.error
import backend.database as database

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

GROQ_MODEL = "openai/gpt-oss-120b"
GEMINI_MODEL = "gemini-2.5-flash"


def call_groq_crawler(prompt: str, system_instruction: str) -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.8,
        "max_tokens": 1500
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=15) as response:
        result = json.loads(response.read().decode("utf-8"))
        return result["choices"][0]["message"]["content"]


def call_gemini_crawler(prompt: str, system_instruction: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "generationConfig": {"temperature": 0.8, "maxOutputTokens": 1500}
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=15) as response:
        result = json.loads(response.read().decode("utf-8"))
        return result["candidates"][0]["content"]["parts"][0]["text"]


def ai_crawl_and_ingest_new_slangs(culture: str = "SG", count: int = 2) -> list:
    """
    Kích hoạt AI cào các từ lóng mới nổi trên mạng/diễn đàn sinh viên,
    phân tích chuẩn xác và tự động nạp vào SQLite Database.
    """
    # 1. Lấy danh sách từ lóng đã có để tránh trùng lặp
    existing_slangs = [s["term"].lower() for s in database.db_get_all_slangs(culture=culture)]

    system_instruction = f"""
You are the CultureSync AI Slang Harvester and Linguistic Ingestion Pipeline.
Your goal is to discover and extract real-world, authentic campus slang and colloquialisms used by university students in {culture} (Singapore/Singlish or Vietnam).

DO NOT return any of these already existing slangs:
{json.dumps(existing_slangs, ensure_ascii=False)}

TASK:
Find {count} BRAND-NEW, trending, authentic campus slang words or idioms used in student team projects, social life, or hackathons.
For EACH slang, provide:
1. term: The slang word/phrase (e.g., 'lobang', 'arrow', 'paiseh', 'out-trình', 'gãy cánh')
2. category: One of ['deadline_crunch', 'social_chat', 'task_delegation', 'frustration_coping']
3. phonetic: Approximate pronunciation
4. literal_meaning: Literal translation
5. cultural_meaning: The true psychological intent and cultural nuance behind why students say it
6. equivalent_term: Equivalent concept in the other culture
7. whatsapp_example: Realistic WhatsApp chat sentence between university students
8. suggested_reply: A tactful, polite response
9. game_scenario: A 1-sentence WhatsApp dilemma scenario for the game
10. game_question: A question testing what the teammate actually meant
11. game_options: Array of 4 options where index 0 is the CORRECT cultural meaning, and 3 are realistic misunderstanding distractors.
12. game_explanation: Educational explanation of the slang for the player.

OUTPUT FORMAT:
Return PURE JSON ONLY as a list of objects conforming to this schema. No markdown formatting if possible.
"""

    prompt = f"Harvest {count} authentic, unrecorded campus slangs for {culture} student teams right now."

    try:
        raw_res = call_groq_crawler(prompt, system_instruction)
    except Exception as e:
        print(f"⚠️ Groq crawler error ({e}), switching to Gemini...")
        raw_res = call_gemini_crawler(prompt, system_instruction)

    # Làm sạch JSON
    cleaned = raw_res.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    items = json.loads(cleaned)
    if isinstance(items, dict) and "slangs" in items:
        items = items["slangs"]

    conn = database.get_connection()
    cursor = conn.cursor()
    ingested_slangs = []

    for item in items:
        term = item.get("term", "").strip()
        if not term or term.lower() in existing_slangs:
            continue

        # 1. Nạp vào bảng slang_dictionary
        cursor.execute("""
        INSERT OR IGNORE INTO slang_dictionary (
            term, culture, category, phonetic, literal_meaning, cultural_meaning, 
            equivalent_term, whatsapp_example, suggested_reply, difficulty_level, is_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 1)
        """, (
            term,
            culture,
            item.get("category", "social_chat"),
            item.get("phonetic", ""),
            item.get("literal_meaning", ""),
            item.get("cultural_meaning", ""),
            item.get("equivalent_term", ""),
            item.get("whatsapp_example", ""),
            item.get("suggested_reply", "")
        ))
        slang_id = cursor.lastrowid or 1

        # 2. Xáo trộn đáp án game để vị trí đáp án đúng ngẫu nhiên
        options = item.get("game_options", [item.get("cultural_meaning", "Correct"), "Option B", "Option C", "Option D"])
        correct_answer = options[0]
        import random
        shuffled_options = list(options)
        random.shuffle(shuffled_options)
        correct_index = shuffled_options.index(correct_answer)

        # 3. Nạp vào bảng game_challenges
        cursor.execute("""
        INSERT INTO game_challenges (
            slang_id, challenge_type, scenario_context, question, options_json, correct_index, explanation, xp_reward
        ) VALUES (?, 'decode_intent', ?, ?, ?, ?, ?, 25)
        """, (
            slang_id,
            item.get("game_scenario", item.get("whatsapp_example", "")),
            item.get("game_question", f"Từ lóng '{term}' trong câu này có ý nghĩa gì?"),
            json.dumps(shuffled_options, ensure_ascii=False),
            correct_index,
            item.get("game_explanation", item.get("cultural_meaning", ""))
        ))

        ingested_slangs.append({
            "term": term,
            "culture": culture,
            "cultural_meaning": item.get("cultural_meaning", ""),
            "example": item.get("whatsapp_example", "")
        })

    conn.commit()
    conn.close()

    print(f"✅ AI Crawler đã cào và nạp thành công {len(ingested_slangs)} từ lóng mới vào SQLite Database!")
    return ingested_slangs


if __name__ == "__main__":
    new_items = ai_crawl_and_ingest_new_slangs("SG", 1)
    print("Ingested items:", new_items)

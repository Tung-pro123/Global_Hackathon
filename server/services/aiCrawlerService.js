import Groq from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';

const CRAWL_PROMPT = `You are a cultural linguistics expert specializing in Southeast Asian university student slang. 
Generate 3 authentic, trending campus slangs used by university students in Singapore and Vietnam in 2024-2026.

Return a JSON array with exactly 3 objects. Each object must have these exact fields:
- term: the slang word/phrase
- culture: "SG" or "VN"
- phonetic: IPA pronunciation
- literal_translation: direct translation to English
- cultural_meaning: rich explanation of cultural context (2-3 sentences)
- whatsapp_example: a realistic WhatsApp message using the slang naturally
- category: one of: "social", "academic", "gaming", "expression", "work", "finance", "personality"
- visual_rebus_url: a relevant Unsplash image URL (use format: https://images.unsplash.com/photo-XXXXXXXXXXXXXXXXXX?w=400)
- visual_caption: short description of what the image shows as a rebus clue
- quiz_options: array of exactly 4 strings (first one MUST be the correct answer)
- cultural_explanation: 1-2 sentences on why this is culturally significant

ONLY return valid JSON array. No markdown, no explanation, no code blocks. Just the JSON array.`;

export async function crawlSlangsWithGroq() {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY not configured. Add it to server/.env file.');
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  console.log('🤖 Starting Groq AI slang crawl...');

  // Dynamically select available chat model
  let chosenModel = 'openai/gpt-oss-120b';
  try {
    const modelsRes = await groq.models.list();
    const availableIds = modelsRes.data?.map(m => m.id) || [];
    const chatModels = availableIds.filter(id => 
      !id.includes('guard') && 
      !id.includes('whisper') && 
      !id.includes('embed') && 
      !id.includes('moderation') &&
      !id.includes('tts')
    );
    const candidates = [
      'openai/gpt-oss-120b',
      'meta-llama/llama-3.3-70b-instruct',
      'meta-llama/llama-3.1-70b-instruct',
      'meta-llama/llama-3.1-8b-instruct',
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-70b-8192',
      'llama3-8b-8192',
      'gemma2-9b-it',
      'mixtral-8x7b-32768'
    ];
    chosenModel = candidates.find(c => chatModels.includes(c))
      || chatModels.find(m => m.includes('70b') || m.includes('120b'))
      || chatModels.find(m => m.includes('8b'))
      || chatModels[0] 
      || 'openai/gpt-oss-120b';
  } catch {}

  console.log(`🤖 Crawler using model: ${chosenModel}`);

  const completion = await groq.chat.completions.create({
    model: chosenModel,
    messages: [{ role: 'user', content: CRAWL_PROMPT }],
    temperature: 0.8,
    max_tokens: 3000,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('Groq returned empty response');

  let slangs;
  try {
    slangs = JSON.parse(raw);
  } catch {
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('Could not parse JSON from Groq response');
    slangs = JSON.parse(match[0]);
  }

  const db = getDb();
  const results = [];

  for (const s of slangs) {
    const slangId = uuidv4();
    const options = s.quiz_options || [s.term, 'Option B', 'Option C', 'Option D'];

    db.insertOrIgnore('slangs', {
      id: slangId,
      term: s.term,
      culture: s.culture,
      phonetic: s.phonetic || '',
      literal_translation: s.literal_translation || '',
      cultural_meaning: s.cultural_meaning,
      whatsapp_example: s.whatsapp_example,
      category: s.category || 'general',
      visual_rebus_url: s.visual_rebus_url || '',
      visual_caption: s.visual_caption || ''
    });

    db.insertOrIgnore('challenges', {
      id: uuidv4(),
      slang_id: slangId,
      challenge_type: 'visual_rebus',
      scenario_context: 'A mystery diamond appeared on your run! 💎 Solve this slang rebus!',
      question: `Look at this image clue: "${s.visual_caption}"\n\nWhat slang does this represent?`,
      options,
      options_json: JSON.stringify(options),
      correct_index: 0,
      cultural_explanation: s.cultural_explanation || s.cultural_meaning,
      stage_level: 2
    });

    results.push({ ...s, id: slangId });
  }

  console.log(`✅ Groq harvested and stored ${results.length} new slangs!`);
  return results;
}

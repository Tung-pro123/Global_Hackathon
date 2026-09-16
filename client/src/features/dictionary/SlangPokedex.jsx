import React, { useState, useEffect } from 'react';

const CULTURE_LABELS = { SG: '🇸🇬 Singlish', VN: '🇻🇳 Vietnamese', ALL: '🌏 All' };
const CATEGORY_COLORS = {
  social: '#f43f5e', academic: '#38bdf8', gaming: '#8b5cf6',
  expression: '#10b981', work: '#fbbf24', finance: '#f97316',
  personality: '#ec4899', general: '#64748b'
};

export default function SlangPokedex({ user }) {
  const [slangs, setSlangs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [aiSentences, setAiSentences] = useState({});
  const [generatingId, setGeneratingId] = useState(null);

  const handleGenerateSentence = async (slang, e) => {
    e.stopPropagation();
    if (generatingId || aiSentences[slang.id]) return;

    setGeneratingId(slang.id);
    try {
      const res = await fetch('/api/ai/sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: slang.term,
          culture: slang.culture,
          category: slang.category,
          userId: user?.id
        })
      });
      const d = await res.json();
      if (d.success && d.data) {
        setAiSentences(prev => ({ ...prev, [slang.id]: d.data }));
      }
    } catch (err) {
      console.error('Lỗi gọi AI:', err);
    } finally {
      setGeneratingId(null);
    }
  };

  useEffect(() => {
    const param = filter !== 'ALL' ? `?culture=${filter}` : '';
    setLoading(true);
    fetch(`/api/slangs${param}`)
      .then(r => r.json())
      .then(d => { setSlangs(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const filtered = slangs.filter(s =>
    !search || s.term.toLowerCase().includes(search.toLowerCase()) ||
    s.cultural_meaning?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-arcade)', fontSize: '1rem', color: 'var(--neon-cyan)', letterSpacing: '0.1em', marginBottom: '4px' }}>
          📚 SLANG POKÉDEX
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Your campus slang encyclopedia. {slangs.length} entries and growing!
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            className="input-arcade"
            placeholder="🔍 Search slang terms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'SG', 'VN'].map(c => (
            <button
              key={c}
              className={`btn-arcade ${filter === c ? 'btn-cyan' : 'btn-ghost'}`}
              onClick={() => setFilter(c)}
              style={{ padding: '8px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
            >
              {c === 'ALL' ? '🌏' : c === 'SG' ? '🇸🇬' : '🇻🇳'} {c}
            </button>
          ))}
        </div>
      </div>

      {/* Slang Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <div style={{ fontSize: '2rem', animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>⚙️</div>
          <p style={{ marginTop: '12px', fontFamily: 'var(--font-arcade)', fontSize: '0.8rem' }}>Loading slangs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <p style={{ fontSize: '2rem' }}>🔎</p>
          <p style={{ marginTop: '8px' }}>No slangs found. Try the AI Harvester to add more!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {filtered.map(slang => (
            <div
              key={slang.id}
              className="card"
              onClick={() => setExpanded(expanded === slang.id ? null : slang.id)}
              style={{ padding: '18px', cursor: 'pointer' }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '1.05rem', color: '#e2e8f0' }}>
                    {slang.term}
                  </h3>
                  {slang.phonetic && (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>{slang.phonetic}</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '1.2rem' }}>{slang.culture === 'SG' ? '🇸🇬' : '🇻🇳'}</span>
                  {slang.category && (
                    <span style={{
                      fontSize: '0.62rem', padding: '2px 8px', borderRadius: '4px',
                      background: `${CATEGORY_COLORS[slang.category]}22`,
                      color: CATEGORY_COLORS[slang.category] || '#64748b',
                      border: `1px solid ${CATEGORY_COLORS[slang.category]}44`,
                      fontFamily: 'var(--font-heading)', fontWeight: '600', letterSpacing: '0.05em'
                    }}>
                      {slang.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Meaning preview */}
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '10px' }}>
                {expanded === slang.id ? slang.cultural_meaning : (slang.cultural_meaning?.slice(0, 80) + (slang.cultural_meaning?.length > 80 ? '...' : ''))}
              </p>

              {/* Expanded content */}
              {expanded === slang.id && (
                <div style={{ animation: 'slide-up 0.3s ease-out' }}>
                  {slang.literal_translation && (
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#475569', display: 'block', marginBottom: '2px', fontFamily: 'var(--font-arcade)', letterSpacing: '0.08em' }}>
                        LITERAL
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{slang.literal_translation}</span>
                    </div>
                  )}

                  {slang.whatsapp_example && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.06)',
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                      borderRadius: '10px', padding: '10px 14px', marginBottom: '10px'
                    }}>
                      <span style={{ fontSize: '0.65rem', color: '#10b981', display: 'block', marginBottom: '4px', fontFamily: 'var(--font-arcade)', letterSpacing: '0.08em' }}>
                        💬 WHATSAPP EXAMPLE
                      </span>
                      <p style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.5 }}>
                        "{slang.whatsapp_example}"
                      </p>
                    </div>
                  )}

                  {slang.visual_rebus_url && (
                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.15)', marginBottom: '10px' }}>
                      <img
                        src={slang.visual_rebus_url}
                        alt="Rebus clue"
                        style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* 🤖 AI Sentence Crafter (Skill: cultural_sentence_crafter) */}
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(56,189,248,0.04)',
                    border: '1px solid rgba(56,189,248,0.2)',
                    marginTop: '8px'
                  }}>
                    {!aiSentences[slang.id] ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          🤖 <strong>AI Skill: Cultural Crafter</strong> • May đo câu hội thoại chuẩn bối cảnh & kiểm duyệt an toàn
                        </div>
                        <button
                          onClick={(e) => handleGenerateSentence(slang, e)}
                          disabled={generatingId === slang.id}
                          className="btn-arcade btn-cyan"
                          style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          {generatingId === slang.id ? '⚙️ Đang tạo...' : '✨ May Đo Câu AI'}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-arcade)', color: 'var(--neon-cyan)', letterSpacing: '0.08em' }}>
                            ✨ CÂU HỘI THOẠI AI MAY ĐO
                          </span>
                          <span style={{
                            fontSize: '0.62rem', padding: '2px 8px', borderRadius: '4px',
                            background: 'rgba(16,185,129,0.15)', color: 'var(--neon-emerald)', border: '1px solid rgba(16,185,129,0.3)',
                            fontWeight: '700'
                          }}>
                            🛡️ 100% TIÊU CHUẨN CỘNG ĐỒNG & PHÁP LUẬT
                          </span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: '600', fontStyle: 'italic', margin: '2px 0', lineHeight: 1.4 }}>
                          "{aiSentences[slang.id].authentic_sentence}"
                        </p>

                        <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                          🇻🇳 <strong>Dịch:</strong> {aiSentences[slang.id].translation_vi}
                        </div>

                        <div style={{ fontSize: '0.73rem', color: '#cbd5e1' }}>
                          🎯 <strong>Bối cảnh:</strong> {aiSentences[slang.id].context_scenario}
                        </div>

                        {/* Pragmatics matrix */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                          <div style={{
                            padding: '6px 8px', borderRadius: '8px',
                            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                            fontSize: '0.68rem', color: '#86efac'
                          }}>
                            ✅ <strong>NÊN DÙNG:</strong> {aiSentences[slang.id].pragmatics?.when_to_use}
                          </div>
                          <div style={{
                            padding: '6px 8px', borderRadius: '8px',
                            background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                            fontSize: '0.68rem', color: '#fca5a5'
                          }}>
                            ⚠️ <strong>TRÁNH DÙNG:</strong> {aiSentences[slang.id].pragmatics?.when_to_avoid}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.65rem', color: '#64748b', textAlign: 'right', marginTop: '2px' }}>
                          Audit: {aiSentences[slang.id].safety_verification?.safety_audit_notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Expand toggle */}
              <div style={{ marginTop: '8px', textAlign: 'right', fontSize: '0.72rem', color: '#475569' }}>
                {expanded === slang.id ? '▲ Less' : '▼ More'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

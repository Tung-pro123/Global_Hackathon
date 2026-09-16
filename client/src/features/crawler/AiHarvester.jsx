import React, { useState } from 'react';

const LOG_COLORS = { info: '#38bdf8', success: '#10b981', error: '#f43f5e', warn: '#fbbf24' };

export default function AiHarvester() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [logs, setLogs] = useState([
    { type: 'info', msg: '🤖 AI Slang Harvester ready. Powered by Groq llama-3.3-70b-versatile.' },
    { type: 'info', msg: '📡 Connected to campus cultural intelligence network.' },
    { type: 'warn', msg: '⚠️ Ensure GROQ_API_KEY is set in server/.env to enable live crawling.' }
  ]);

  const addLog = (type, msg) => setLogs(l => [...l, { type, msg, ts: new Date().toLocaleTimeString() }]);

  const handleCrawl = async () => {
    setLoading(true);
    setResults([]);
    addLog('info', '🚀 Initiating Groq AI slang harvest sequence...');
    addLog('info', '🔍 Analyzing Singapore & Vietnam university campus dialects...');

    try {
      const res = await fetch('/api/slang/crawl', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        addLog('success', `✅ ${data.message}`);
        setResults(data.data || []);
        data.data?.forEach((s, i) => {
          setTimeout(() => addLog('success', `📥 Ingested: "${s.term}" (${s.culture}) — ${s.category}`), i * 200);
        });
      } else {
        addLog('error', `❌ Harvest failed: ${data.error}`);
        if (data.error?.includes('GROQ_API_KEY')) {
          addLog('warn', '💡 Tip: Copy server/.env.example to server/.env and add your Groq key from console.groq.com');
        }
      }
    } catch (err) {
      addLog('error', `❌ Network error: ${err.message}. Is the server running on :5000?`);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-arcade)', fontSize: '1rem', color: 'var(--neon-emerald)', letterSpacing: '0.1em', marginBottom: '4px' }}>
          🤖 AI SLANG HARVESTER
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Powered by <strong style={{ color: '#94a3b8' }}>Groq + llama-3.3-70b-versatile</strong>.
          Automatically discovers and ingests trending campus slangs from Singapore & Vietnam.
        </p>
      </div>

      {/* Control Panel */}
      <div style={{
        background: 'rgba(13, 20, 36, 0.9)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '16px', padding: '20px',
        display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: '#e2e8f0', marginBottom: '4px' }}>
            Cultural Slang Intelligence Crawl
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Scans 2024-2026 Singlish & Vietnamese university student slang, generating visual rebus quizzes automatically.
          </p>
        </div>
        <button
          className={`btn-arcade btn-emerald ${loading ? '' : 'animate-pulse-glow'}`}
          onClick={handleCrawl}
          disabled={loading}
          style={{ padding: '14px 28px', fontSize: '0.9rem', borderRadius: '12px', whiteSpace: 'nowrap' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }}>⚙️</span>
              Harvesting...
            </span>
          ) : '🤖 Run AI Harvest'}
        </button>
      </div>

      {/* Terminal Log */}
      <div style={{
        background: '#020617',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        lineHeight: 1.7,
        maxHeight: '260px',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <div style={{
          position: 'sticky', top: 0, background: '#020617', paddingBottom: '8px', marginBottom: '4px',
          borderBottom: '1px solid rgba(16, 185, 129, 0.1)'
        }}>
          <span style={{ color: '#10b981', fontFamily: 'var(--font-arcade)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            GROQ TERMINAL — CULTURSYNC HARVESTER v2.0
          </span>
        </div>

        {logs.map((log, i) => (
          <div key={i} style={{ color: LOG_COLORS[log.type] || '#94a3b8', marginBottom: '2px' }}>
            {log.ts && <span style={{ color: '#334155', marginRight: '8px' }}>[{log.ts}]</span>}
            {log.msg}
          </div>
        ))}

        {loading && (
          <div style={{ color: '#10b981', animation: 'pulse-glow 1s ease-in-out infinite' }}>
            <span>▋</span> Processing cultural intelligence vectors...
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.85rem', color: 'var(--neon-emerald)', letterSpacing: '0.08em', marginBottom: '12px' }}>
            ✅ NEWLY HARVESTED SLANGS ({results.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
            {results.map((slang, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: '16px',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  animation: `slide-up 0.4s ease-out ${i * 0.1}s both`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: '#e2e8f0', fontSize: '1rem' }}>
                    {slang.term}
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>{slang.culture === 'SG' ? '🇸🇬' : '🇻🇳'}</span>
                </div>
                {slang.phonetic && (
                  <p style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', marginBottom: '6px' }}>
                    {slang.phonetic}
                  </p>
                )}
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '8px' }}>
                  {slang.cultural_meaning}
                </p>
                {slang.whatsapp_example && (
                  <p style={{ fontSize: '0.75rem', color: '#10b981', fontStyle: 'italic', borderTop: '1px solid rgba(16, 185, 129, 0.1)', paddingTop: '8px' }}>
                    💬 "{slang.whatsapp_example}"
                  </p>
                )}
                <span style={{
                  marginTop: '8px', display: 'inline-block',
                  fontSize: '0.62rem', padding: '2px 8px', borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  🆕 Just Harvested
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {[
          { icon: '🧠', title: 'llama-3.3-70b', desc: 'Powered by Groq\'s fastest open-source LLM for sub-second slang generation' },
          { icon: '🇸🇬🇻🇳', title: 'Dual Culture', desc: 'Specialized in Singlish hawker culture + Vietnamese Gen-Z campus dialect' },
          { icon: '🎮', title: 'Instant Quizzes', desc: 'Auto-generates visual rebus quiz cards for each harvested slang' },
          { icon: '💾', title: 'SQLite Sync', desc: 'All harvested slangs are instantly added to the playable game database' }
        ].map((card, i) => (
          <div key={i} style={{
            background: 'rgba(13, 20, 36, 0.6)',
            border: '1px solid rgba(56, 189, 248, 0.1)',
            borderRadius: '12px', padding: '14px'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{card.icon}</div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: '#e2e8f0', fontSize: '0.85rem', marginBottom: '4px' }}>
              {card.title}
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

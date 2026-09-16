import React, { useEffect, useState } from 'react';
import Leaderboard, { saveScore } from '../Leaderboard.jsx';

export default function GameOverModal({ score, coins, xp, activeSkin, user, onOpenAuth, onRestart, onClose }) {
  const [tab, setTab] = useState('stats'); // stats | leaderboard | flashcards
  const [flashcards, setFlashcards] = useState([]);
  const [rank, setRank] = useState(null);

  useEffect(() => {
    // Save score and get rank
    const r = saveScore(score || 0, coins || 0, activeSkin || 'classic');
    setRank(r);

    // Trigger confetti for good scores
    if (score > 100) {
      try {
        import('canvas-confetti').then(mod => {
          const confetti = mod.default;
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#38bdf8', '#fbbf24', '#10b981', '#f43f5e'] });
        }).catch(() => {});
      } catch {}
    }

    // Fetch random slangs for flashcard review
    fetch('/api/slangs')
      .then(r => r.json())
      .then(d => {
        if (d.data?.length) {
          const shuffled = [...d.data].sort(() => Math.random() - 0.5);
          setFlashcards(shuffled.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const getRating = (s) => {
    if (s >= 500) return { emoji: '🏆', label: 'LEGENDARY', color: '#fbbf24' };
    if (s >= 300) return { emoji: '🥇', label: 'EPIC', color: '#8b5cf6' };
    if (s >= 150) return { emoji: '🥈', label: 'GREAT', color: '#38bdf8' };
    if (s >= 50)  return { emoji: '🥉', label: 'GOOD', color: '#10b981' };
    return { emoji: '💪', label: 'KEEP GOING', color: '#64748b' };
  };

  const rating = getRating(score || 0);

  const TABS = [
    { id: 'stats', label: '📊 Stats' },
    { id: 'leaderboard', label: '🏆 Board' },
    { id: 'flashcards', label: '📚 Review' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content glass animate-bounce-in" style={{
        padding: '24px',
        borderRadius: '20px',
        border: '1.5px solid rgba(251,191,36,0.3)',
        boxShadow: '0 0 80px rgba(251,191,36,0.08)',
        width: '92%',
        maxWidth: '480px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '3.2rem' }}>{rating.emoji}</div>
          <span className="badge" style={{
            background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
            color: rating.color, fontSize: '0.65rem', letterSpacing: '0.15em', margin: '6px 0', display: 'inline-flex'
          }}>
            {rating.label}
          </span>
          <h2 style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.95rem', color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
            RUN COMPLETE
          </h2>
          {rank !== null && rank <= 2 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--neon-gold)', marginTop: '4px', fontFamily: 'var(--font-arcade)' }}>
              🎉 NEW TOP {rank + 1} SCORE!
            </p>
          )}
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'SCORE', value: String(score || 0).padStart(5, '0'), color: 'var(--neon-cyan)' },
            { label: 'COINS', value: `+${coins || 0}`, color: 'var(--neon-gold)' },
            { label: 'XP', value: `+${xp || 0}`, color: 'var(--neon-emerald)' }
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px', padding: '10px 8px', textAlign: 'center'
            }}>
              <div style={{ fontFamily: 'var(--font-arcade)', fontSize: '1rem', color: s.color, fontWeight: '700' }}>{s.value}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-arcade)', letterSpacing: '0.08em', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', background: 'var(--bg-card)', padding: '3px', borderRadius: '10px' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '7px', borderRadius: '7px', border: 'none',
                background: tab === t.id ? 'var(--neon-cyan)' : 'transparent',
                color: tab === t.id ? '#070a12' : 'var(--text-muted)',
                fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '0.75rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ minHeight: '140px' }}>
          {tab === 'stats' && (
            <div className="animate-slide-up">
              <div style={{
                background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
                borderRadius: '10px', padding: '12px 14px', marginBottom: '12px'
              }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  💡 <strong style={{ color: 'var(--text-secondary)' }}>Tip:</strong> Touch 💎 Diamonds for slang quizzes.
                  Answer correctly for +100 🪙. Use coins in the 🛍️ Skin Shop!
                </p>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                🆕 <strong style={{ color: 'var(--text-secondary)' }}>New:</strong> Double-tap Space to double jump! Watch out for 🐦 birds.
              </div>
            </div>
          )}

          {tab === 'leaderboard' && (
            <div className="animate-slide-up" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <Leaderboard highlightScore={score} />
            </div>
          )}

          {tab === 'flashcards' && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {flashcards.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px', fontSize: '0.8rem' }}>
                  Loading slangs...
                </p>
              ) : flashcards.map((s, i) => (
                <div key={i} className="flashcard" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {s.term}
                    </span>
                    <span style={{ fontSize: '1rem' }}>{s.culture === 'SG' ? '🇸🇬' : '🇻🇳'}</span>
                  </div>
                  {s.phonetic && <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '4px' }}>{s.phonetic}</p>}
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {s.cultural_meaning?.slice(0, 100)}{s.cultural_meaning?.length > 100 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guest Conversion CTA */}
        {!user && onOpenAuth && (
          <div style={{
            margin: '14px 0 6px', padding: '10px 14px', borderRadius: '12px',
            background: 'rgba(56,189,248,0.06)', border: '1px dashed rgba(56,189,248,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4, fontWeight: '500' }}>
              💡 <em>Đang ở Chế độ Khách.</em> Đăng ký để lưu điểm & mở khóa <strong>AI May Đo</strong>!
            </div>
            <button
              onClick={() => { onClose(); onOpenAuth(); }}
              className="btn-arcade btn-cyan"
              style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              ✨ Đăng Ký
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button
            className="btn-arcade btn-cyan"
            onClick={onRestart}
            style={{ flex: 1, fontSize: '0.9rem', padding: '13px', borderRadius: '10px' }}
          >
            🔄 Play Again
          </button>
          <button
            className="btn-arcade btn-ghost"
            onClick={onClose}
            style={{ padding: '13px 18px', borderRadius: '10px', fontSize: '0.82rem' }}
          >
            🛍️ Shop
          </button>
        </div>
      </div>
    </div>
  );
}

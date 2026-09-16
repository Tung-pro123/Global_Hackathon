import React, { useState, useEffect } from 'react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function SlangQuizModal({ quiz, onAnswer, onClose, quizType = 'diamond' }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleAnswer(-1); // time out — wrong
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [result]);

  const handleAnswer = async (index) => {
    if (selected !== null) return;
    setSelected(index);

    let is_correct = false;
    let correct_index = quiz.correct_index ?? 0;
    let explanation = quiz.explanation || '';
    let rewards = { coins: 0, diamonds: 0, xp: 0, shield: false };

    try {
      const res = await fetch('/api/game/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: quiz.id,
          selected_index: index,
          quiz_type: quizType
        })
      });

      if (res.ok) {
        const data = await res.json();
        is_correct = data.is_correct ?? (index === (data.correct_index ?? quiz.correct_index));
        correct_index = data.correct_index ?? quiz.correct_index ?? 0;
        explanation = data.explanation || quiz.explanation || '';
        rewards = data.rewards || (is_correct
          ? (quizType === 'diamond' ? { coins: 100, diamonds: 1, xp: 50, shield: false } : { coins: 80, diamonds: 0, xp: 25, shield: true })
          : { coins: 0, diamonds: 0, xp: 0, shield: false });
      } else {
        // Fallback local check
        is_correct = quiz.correct_index !== undefined ? index === quiz.correct_index : true;
        correct_index = quiz.correct_index ?? index;
        explanation = quiz.explanation || '';
        rewards = is_correct
          ? (quizType === 'diamond' ? { coins: 100, diamonds: 1, xp: 50, shield: false } : { coins: 80, diamonds: 0, xp: 25, shield: true })
          : { coins: 0, diamonds: 0, xp: 0, shield: false };
      }
    } catch {
      // Local evaluation fallback
      is_correct = quiz.correct_index !== undefined ? index === quiz.correct_index : true;
      correct_index = quiz.correct_index ?? index;
      explanation = quiz.explanation || '';
      rewards = is_correct
        ? (quizType === 'diamond' ? { coins: 100, diamonds: 1, xp: 50, shield: false } : { coins: 80, diamonds: 0, xp: 25, shield: true })
        : { coins: 0, diamonds: 0, xp: 0, shield: false };
    }

    const payload = { is_correct, correct_index, explanation, rewards };
    setResult(payload);

    if (is_correct) {
      try {
        await fetch('/api/player/reward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rewards)
        });
      } catch {}
    }

    setTimeout(() => onAnswer(payload), 1200);
  };

  const rewards = quizType === 'diamond'
    ? '+100 🪙  •  +1 💎  •  +50 ⭐'
    : '+80 🪙  •  +25 ⭐  •  🛡️ 3s Shield';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !result && onClose?.()}>
      <div className="modal-content glass animate-bounce-in" style={{
        padding: '28px',
        borderRadius: '20px',
        border: quizType === 'diamond' ? '1.5px solid rgba(56, 189, 248, 0.4)' : '1.5px solid rgba(251, 191, 36, 0.4)',
        boxShadow: quizType === 'diamond'
          ? '0 0 60px rgba(56, 189, 248, 0.15), 0 0 120px rgba(56, 189, 248, 0.05)'
          : '0 0 60px rgba(251, 191, 36, 0.15)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{quizType === 'diamond' ? '💎' : '🔥'}</span>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-arcade)',
                fontSize: '0.85rem',
                color: quizType === 'diamond' ? 'var(--neon-cyan)' : 'var(--neon-gold)',
                letterSpacing: '0.08em',
                marginBottom: '2px'
              }}>
                {quizType === 'diamond' ? 'MYSTERY DIAMOND QUIZ' : 'REVIVAL CHALLENGE'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {quizType === 'diamond' ? 'Identify the slang to earn rewards!' : 'Answer correctly to revive!'}
              </p>
            </div>
          </div>

          {/* Timer */}
          {!result && (
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: `3px solid ${timeLeft <= 5 ? 'var(--neon-rose)' : 'var(--neon-cyan)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-arcade)', fontSize: '0.9rem', fontWeight: '700',
              color: timeLeft <= 5 ? 'var(--neon-rose)' : 'var(--neon-cyan)',
              transition: 'all 0.3s',
              boxShadow: timeLeft <= 5 ? '0 0 15px rgba(244, 63, 94, 0.4)' : '0 0 15px rgba(56, 189, 248, 0.3)'
            }}>
              {timeLeft}
            </div>
          )}
        </div>

        {/* AI Personalized Badge vs Guest Mode Badge */}
        {quiz.personalized && quiz.personalized_info ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(139,92,246,0.12))',
            border: '1px solid rgba(56,189,248,0.3)',
            borderRadius: '999px', padding: '4px 14px', marginBottom: '12px',
            fontSize: '0.72rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-heading)',
            boxShadow: '0 0 15px rgba(56,189,248,0.08)'
          }}>
            <span>✨ AI May Đo Cho Bạn:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
              {quiz.personalized_info.interests?.[0]?.toUpperCase()} • {quiz.personalized_info.level?.toUpperCase()}
            </span>
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '999px', padding: '3px 12px', marginBottom: '12px',
            fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)'
          }}>
            <span>🌐 Thử Thách Tiếng Lóng Tổng Quát (Chế Độ Khách)</span>
          </div>
        )}

        {/* Reward preview */}
        {!result && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '10px',
            padding: '10px 16px',
            marginBottom: '16px',
            textAlign: 'center',
            fontFamily: 'var(--font-arcade)',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.05em'
          }}>
            ✅ Correct answer: {rewards}
          </div>
        )}

        {/* Rebus image */}
        {quiz.visual_rebus_url && (
          <div style={{ marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <img
              src={quiz.visual_rebus_url}
              alt={quiz.visual_caption || 'Slang rebus clue'}
              style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <p style={{ padding: '10px 14px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--bg-surface)' }}>
              🖼️ {quiz.visual_caption || 'What slang does this image represent?'}
            </p>
          </div>
        )}

        {/* Question */}
        <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.5, fontFamily: 'var(--font-heading)', fontWeight: '700' }}>
          {quiz.question || 'What campus slang does this image represent?'}
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {(Array.isArray(quiz.options) ? quiz.options : (typeof quiz.options === 'string' ? JSON.parse(quiz.options || '[]') : [])).map((option, i) => {
            let optClass = 'quiz-option';
            if (result) {
              if (i === result.correct_index) optClass += ' correct';
              else if (i === selected && !result.is_correct) optClass += ' wrong';
            }

            return (
              <button
                key={i}
                className={optClass}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
              >
                <span style={{
                  width: '26px', height: '26px', borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-arcade)', fontSize: '0.7rem', fontWeight: '700',
                  flexShrink: 0, color: 'var(--neon-cyan)'
                }}>
                  {OPTION_LABELS[i]}
                </span>
                {option}
                {result && i === result.correct_index && <span style={{ marginLeft: 'auto' }}>✅</span>}
                {result && i === selected && i !== result.correct_index && <span style={{ marginLeft: 'auto' }}>❌</span>}
              </button>
            );
          })}
        </div>

        {/* Result banner */}
        {result && (
          <div style={{
            borderRadius: '12px',
            padding: '14px 16px',
            background: result.is_correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: `1px solid ${result.is_correct ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            animation: 'slide-up 0.3s ease-out'
          }}>
            <p style={{
              fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '1rem',
              color: result.is_correct ? 'var(--neon-emerald)' : 'var(--neon-rose)',
              marginBottom: '6px'
            }}>
              {result.is_correct ? '🎉 Correct!' : '❌ Wrong!'}{' '}
              {result.is_correct && quizType === 'diamond' && <span style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.75rem' }}>+100 🪙 +1 💎 +50 ⭐</span>}
              {result.is_correct && quizType !== 'diamond' && <span style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.75rem' }}>+80 🪙 +25 ⭐ 🛡️</span>}
            </p>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: '500' }}>
              {result.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

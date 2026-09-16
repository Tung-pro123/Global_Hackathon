import React, { useState } from 'react';

export default function CollisionModal({ onGiveUp, onTryMore, score, collisionType = 'cactus' }) {
  const [choice, setChoice] = useState(null);
  const icon = collisionType === 'bird' ? '🐦' : '💥';
  const title = collisionType === 'bird' ? 'BIRD STRIKE!' : 'COLLISION DETECTED!';

  return (
    <div className="modal-overlay">
      <div className="modal-content glass animate-bounce-in" style={{
        padding: '32px',
        borderRadius: '20px',
        border: '1.5px solid rgba(244, 63, 94, 0.4)',
        boxShadow: '0 0 60px rgba(244, 63, 94, 0.12), 0 0 120px rgba(244, 63, 94, 0.05)',
        textAlign: 'center'
      }}>
        {/* Crash icon */}
        <div style={{ fontSize: '3.5rem', marginBottom: '12px', animation: 'float 2s ease-in-out infinite' }}>
          {icon}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '1.2rem',
          color: 'var(--neon-rose)',
          letterSpacing: '0.1em',
          marginBottom: '8px',
          textShadow: '0 0 20px rgba(244, 63, 94, 0.5)'
        }}>
          {title}
        </h2>

        <p style={{ color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
          The cactus got you! What will you do?
        </p>

        {/* Score display */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '8px', padding: '8px 20px', marginBottom: '28px'
        }}>
          <span style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.75rem', color: '#64748b' }}>SCORE</span>
          <span style={{ fontFamily: 'var(--font-arcade)', fontSize: '1.1rem', color: 'var(--neon-cyan)', fontWeight: '700' }}>
            {String(score || 0).padStart(5, '0')}
          </span>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Try More */}
          <button
            className="btn-arcade btn-emerald"
            onClick={() => { setChoice('try'); onTryMore(); }}
            disabled={choice !== null}
            style={{
              fontSize: '1rem',
              padding: '16px 24px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%'
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>🔥</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700' }}>Thử Thách Slang Để Hồi Sinh</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Answer correctly → Revive + 3s Shield 🛡️</div>
            </div>
          </button>

          {/* Give Up */}
          <button
            className="btn-arcade btn-ghost"
            onClick={() => { setChoice('give'); onGiveUp(); }}
            disabled={choice !== null}
            style={{
              fontSize: '0.9rem',
              padding: '12px 24px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%'
            }}
          >
            <span>🏳️</span>
            Give Up — End This Run
          </button>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: '16px' }}>
          🏅 Your score will be saved either way
        </p>
      </div>
    </div>
  );
}

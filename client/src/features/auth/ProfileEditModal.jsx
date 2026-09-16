import React, { useState } from 'react';

const INTEREST_OPTIONS = [
  { id: 'gaming', label: '🎮 Gaming & Esports' },
  { id: 'campus', label: '📚 Campus & Deadline' },
  { id: 'food', label: '☕ Food & Canteen' },
  { id: 'social', label: '💬 Social & Dating' },
  { id: 'career', label: '💼 Career & Internship' }
];

const LEVEL_OPTIONS = [
  { id: 'beginner', label: '🟢 Explorer', desc: 'Mới bắt đầu — từ vựng ngắn, trực quan' },
  { id: 'intermediate', label: '🔵 Connector', desc: 'Khá — tình huống hội thoại thực tế' },
  { id: 'advanced', label: '🟣 Insider', desc: 'Chuyên sâu — bẫy ngữ dụng & ngữ cảnh sâu' }
];

const CULTURE_OPTIONS = [
  { id: 'ALL', label: '🌏 Cả hai (Cross-Cultural)' },
  { id: 'SG', label: '🇸🇬 Singlish (Singapore)' },
  { id: 'VN', label: '🇻🇳 Tiếng Lóng Việt Nam' }
];

export default function ProfileEditModal({ user, onUpdate, onClose, onLogout }) {
  const [englishLevel, setEnglishLevel] = useState(user.english_level || 'intermediate');
  const [selectedInterests, setSelectedInterests] = useState(user.interests || ['campus']);
  const [targetCulture, setTargetCulture] = useState(user.target_culture || 'ALL');
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg('');

    const updatedUser = {
      ...user,
      english_level: englishLevel,
      interests: selectedInterests,
      target_culture: targetCulture
    };

    try {
      await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || user.player_id,
          english_level: englishLevel,
          interests: selectedInterests,
          target_culture: targetCulture
        })
      });
    } catch {}

    localStorage.setItem('cultursync_user', JSON.stringify(updatedUser));
    onUpdate(updatedUser);
    setSaving(false);
    setSavedMsg('✅ Đã lưu hồ sơ thành công!');
    setTimeout(() => {
      setSavedMsg('');
      onClose();
    }, 900);
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal-content glass animate-bounce-in" style={{
        padding: '26px',
        borderRadius: '24px',
        border: '1.5px solid rgba(56,189,248,0.3)',
        width: '92%',
        maxWidth: '480px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>⚙️</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.95rem', color: 'var(--neon-cyan)' }}>
                HỒ SƠ CÁ NHÂN HÓA
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Học viên: <strong style={{ color: 'var(--text-primary)' }}>{user.username}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: 'var(--text-muted)', width: '32px', height: '32px',
              borderRadius: '50%', cursor: 'pointer', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >×</button>
        </div>

        {savedMsg && (
          <div style={{
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: '8px', padding: '8px', color: 'var(--neon-emerald)',
            fontSize: '0.82rem', textAlign: 'center', marginBottom: '12px'
          }}>
            {savedMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Level */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-arcade)', color: 'var(--neon-cyan)', marginBottom: '6px' }}>
              🎯 TRÌNH ĐỘ TIẾNG ANH (AI MAY ĐO ĐỘ KHÓ)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              {LEVEL_OPTIONS.map(lvl => (
                <button
                  type="button"
                  key={lvl.id}
                  onClick={() => setEnglishLevel(lvl.id)}
                  style={{
                    padding: '8px 4px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: englishLevel === lvl.id ? 'rgba(56,189,248,0.2)' : 'var(--input-bg)',
                    border: `1.5px solid ${englishLevel === lvl.id ? 'var(--neon-cyan)' : 'var(--border-subtle)'}`,
                    color: englishLevel === lvl.id ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: '600'
                  }}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Culture */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-arcade)', color: 'var(--neon-gold)', marginBottom: '6px' }}>
              🌏 MỤC TIÊU VĂN HÓA
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {CULTURE_OPTIONS.map(c => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setTargetCulture(c.id)}
                  style={{
                    flex: 1, padding: '7px 4px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: targetCulture === c.id ? 'rgba(251,191,36,0.2)' : 'var(--input-bg)',
                    border: `1.5px solid ${targetCulture === c.id ? 'var(--neon-gold)' : 'var(--border-subtle)'}`,
                    color: targetCulture === c.id ? 'var(--neon-gold)' : 'var(--text-secondary)',
                    fontSize: '0.7rem', fontWeight: '600'
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-arcade)', color: 'var(--neon-emerald)', marginBottom: '6px' }}>
              🎮 CHỦ ĐỀ YÊU THÍCH (AI ƯU TIÊN RA CÂU ĐỐ)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {INTEREST_OPTIONS.map(opt => {
                const isSelected = selectedInterests.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    style={{
                      padding: '6px 12px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                      background: isSelected ? 'rgba(16,185,129,0.2)' : 'var(--input-bg)',
                      border: `1px solid ${isSelected ? 'var(--neon-emerald)' : 'var(--border-subtle)'}`,
                      color: isSelected ? 'var(--neon-emerald)' : 'var(--text-secondary)',
                      fontSize: '0.75rem', fontWeight: isSelected ? '700' : '500'
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-arcade btn-cyan"
              style={{ flex: 1, padding: '12px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700' }}
            >
              {saving ? 'Đang lưu...' : '💾 LƯU THAY ĐỔI'}
            </button>
            <button
              onClick={onLogout}
              className="btn-arcade btn-rose"
              style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '0.8rem' }}
            >
              🚪 Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

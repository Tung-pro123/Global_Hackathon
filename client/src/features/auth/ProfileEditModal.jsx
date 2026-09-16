import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

const INTEREST_IDS = ['gaming', 'campus', 'food', 'social', 'career'];
const LEVEL_IDS = ['beginner', 'intermediate', 'advanced'];
const CULTURE_IDS = ['ALL', 'SG', 'VN'];

export default function ProfileEditModal({ user, onUpdate, onClose, onLogout }) {
  const { t } = useLanguage();
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
    setSavedMsg(t('profile.savedSuccess'));
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
                {t('profile.title')}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {t('profile.studentLabel')} <strong style={{ color: 'var(--text-primary)' }}>{user.username}</strong>
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
              {t('profile.levelLabel')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              {LEVEL_IDS.map(lvlId => (
                <button
                  type="button"
                  key={lvlId}
                  onClick={() => setEnglishLevel(lvlId)}
                  style={{
                    padding: '8px 4px', borderRadius: '8px', cursor: 'pointer',
                    background: englishLevel === lvlId ? 'rgba(56,189,248,0.2)' : 'var(--input-bg)',
                    border: `1.5px solid ${englishLevel === lvlId ? 'var(--neon-cyan)' : 'var(--border-subtle)'}`,
                    color: englishLevel === lvlId ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: '600'
                  }}
                >
                  {t(`auth.levels.${lvlId}.label`)}
                </button>
              ))}
            </div>
          </div>

          {/* Culture */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-arcade)', color: 'var(--neon-gold)', marginBottom: '6px' }}>
              {t('profile.cultureLabel')}
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {CULTURE_IDS.map(cid => (
                <button
                  type="button"
                  key={cid}
                  onClick={() => setTargetCulture(cid)}
                  style={{
                    flex: 1, padding: '7px 4px', borderRadius: '8px', cursor: 'pointer',
                    background: targetCulture === cid ? 'rgba(251,191,36,0.2)' : 'var(--input-bg)',
                    border: `1.5px solid ${targetCulture === cid ? 'var(--neon-gold)' : 'var(--border-subtle)'}`,
                    color: targetCulture === cid ? 'var(--neon-gold)' : 'var(--text-secondary)',
                    fontSize: '0.7rem', fontWeight: '600'
                  }}
                >
                  {t(`auth.cultures.${cid}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-arcade)', color: 'var(--neon-emerald)', marginBottom: '6px' }}>
              {t('profile.interestsLabel')}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {INTEREST_IDS.map(optId => {
                const isSelected = selectedInterests.includes(optId);
                return (
                  <button
                    type="button"
                    key={optId}
                    onClick={() => toggleInterest(optId)}
                    style={{
                      padding: '6px 12px', borderRadius: '999px', cursor: 'pointer',
                      background: isSelected ? 'rgba(16,185,129,0.2)' : 'var(--input-bg)',
                      border: `1px solid ${isSelected ? 'var(--neon-emerald)' : 'var(--border-subtle)'}`,
                      color: isSelected ? 'var(--neon-emerald)' : 'var(--text-secondary)',
                      fontSize: '0.75rem', fontWeight: isSelected ? '700' : '500'
                    }}
                  >
                    {t(`auth.interests.${optId}`)}
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
              {saving ? t('profile.savingBtn') : t('profile.saveBtn')}
            </button>
            <button
              onClick={onLogout}
              className="btn-arcade btn-rose"
              style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '0.8rem' }}
            >
              {t('profile.logoutBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  { id: 'advanced', label: '🟣 Insider', desc: 'Chuyên sâu — ngữ cảnh văn hóa & bẫy ngữ dụng' }
];

const CULTURE_OPTIONS = [
  { id: 'ALL', label: '🌏 Cả hai (Cross-Cultural)' },
  { id: 'SG', label: '🇸🇬 Singlish (Singapore)' },
  { id: 'VN', label: '🇻🇳 Tiếng Lóng Việt Nam' }
];

export default function AuthModal({ onLoginSuccess, onClose, canClose = true }) {
  const [tab, setTab] = useState('register'); // 'register' | 'login'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [englishLevel, setEnglishLevel] = useState('intermediate');
  const [selectedInterests, setSelectedInterests] = useState(['campus', 'gaming']);
  const [targetCulture, setTargetCulture] = useState('ALL');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError('');

    if (!username.trim() || username.trim().length < 3) {
      return setError('Tên người dùng phải có ít nhất 3 ký tự!');
    }
    if (!password || password.length < 4) {
      return setError('Mật khẩu phải có ít nhất 4 ký tự!');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          english_level: englishLevel,
          interests: selectedInterests,
          target_culture: targetCulture
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Đăng ký không thành công!');
      } else {
        localStorage.setItem('cultursync_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err) {
      // Offline fallback: save locally
      const mockUser = {
        id: `user_${Date.now()}`,
        player_id: `user_${Date.now()}`,
        username: username.trim(),
        english_level: englishLevel,
        interests: selectedInterests,
        target_culture: targetCulture,
        coins: 200,
        diamonds: 5,
        xp: 100,
        streak_days: 1,
        active_skin: 'classic',
        owned_skins: ['classic']
      };
      localStorage.setItem('cultursync_user', JSON.stringify(mockUser));
      onLoginSuccess(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      return setError('Vui lòng nhập Tên đăng nhập và Mật khẩu!');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Sai tên đăng nhập hoặc mật khẩu!');
      } else {
        localStorage.setItem('cultursync_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ! Hãy thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAsGuest = () => {
    const guestUser = {
      id: `guest_${Date.now()}`,
      player_id: `guest_${Date.now()}`,
      username: `Guest_${Math.floor(100 + Math.random() * 900)}`,
      english_level: 'intermediate',
      interests: ['campus', 'gaming'],
      target_culture: 'ALL',
      coins: 200,
      diamonds: 2,
      xp: 100,
      streak_days: 1,
      active_skin: 'classic',
      owned_skins: ['classic']
    };
    localStorage.setItem('cultursync_user', JSON.stringify(guestUser));
    onLoginSuccess(guestUser);
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && canClose) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canClose, onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && canClose) {
          onClose?.();
        }
      }}
    >
      <div className="modal-content glass animate-bounce-in" style={{
        padding: '28px',
        borderRadius: '24px',
        border: '1.5px solid rgba(56,189,248,0.4)',
        boxShadow: '0 0 80px rgba(56,189,248,0.15)',
        width: '92%',
        maxWidth: '500px',
        position: 'relative'
      }}>
        {/* Close Button */}
        {canClose && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose?.();
            }}
            style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 9999,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#e2e8f0', width: '36px', height: '36px',
              borderRadius: '50%', cursor: 'pointer', fontSize: '1.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              transition: 'all 0.2s',
              lineHeight: 1
            }}
            title="Đóng (Esc)"
          >×</button>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2.8rem', animation: 'float 2s ease-in-out infinite' }}>🦖</div>
          <h2 style={{
            fontFamily: 'var(--font-arcade)', fontSize: '1.1rem',
            color: 'var(--neon-cyan)', letterSpacing: '0.1em', marginTop: '6px'
          }}>
            CULTURSYNC IDENTITY
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '500' }}>
            Đăng ký tài khoản để may đo câu đố AI theo đúng sở thích của bạn!
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex', gap: '6px', padding: '4px',
          background: 'var(--tab-bg)', borderRadius: '12px',
          border: '1px solid var(--border-subtle)', marginBottom: '18px'
        }}>
          <button
            className={`btn-arcade ${tab === 'register' ? 'btn-cyan' : 'btn-ghost'}`}
            onClick={() => { setTab('register'); setError(''); }}
            style={{ flex: 1, padding: '9px', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            ✨ Đăng Ký Mới
          </button>
          <button
            className={`btn-arcade ${tab === 'login' ? 'btn-cyan' : 'btn-ghost'}`}
            onClick={() => { setTab('login'); setError(''); }}
            style={{ flex: 1, padding: '9px', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            🔑 Đăng Nhập
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div style={{
            background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.4)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
            color: 'var(--neon-rose)', fontSize: '0.82rem', textAlign: 'center',
            fontWeight: '600', animation: 'screen-shake 0.3s'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form: Register */}
        {tab === 'register' ? (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-arcade)', color: 'var(--text-muted)', marginBottom: '5px' }}>
                TÊN NGƯỜI CHƠI (USERNAME) *
              </label>
              <input
                className="input-arcade"
                placeholder="ví dụ: tung_pro, alex_sg, linh_fpt..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                maxLength={20}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-arcade)', color: 'var(--text-muted)', marginBottom: '5px' }}>
                MẬT KHẨU *
              </label>
              <input
                className="input-arcade"
                type="password"
                placeholder="Tối thiểu 4 ký tự"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* English Level */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-arcade)', color: 'var(--neon-cyan)', marginBottom: '6px' }}>
                🎯 TRÌNH ĐỘ TIẾNG ANH (AI MAY ĐO ĐỘ KHÓ)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                {LEVEL_OPTIONS.map(lvl => (
                  <button
                    type="button"
                    key={lvl.id}
                    onClick={() => setEnglishLevel(lvl.id)}
                    style={{
                      padding: '8px 4px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: englishLevel === lvl.id ? 'rgba(56,189,248,0.18)' : 'var(--input-bg)',
                      border: `1.5px solid ${englishLevel === lvl.id ? 'var(--neon-cyan)' : 'var(--border-subtle)'}`,
                      color: englishLevel === lvl.id ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-heading)', fontSize: '0.76rem', fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Culture */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-arcade)', color: 'var(--neon-gold)', marginBottom: '6px' }}>
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
                      background: targetCulture === c.id ? 'rgba(251,191,36,0.18)' : 'var(--input-bg)',
                      border: `1.5px solid ${targetCulture === c.id ? 'var(--neon-gold)' : 'var(--border-subtle)'}`,
                      color: targetCulture === c.id ? 'var(--neon-gold)' : 'var(--text-secondary)',
                      fontSize: '0.72rem', fontWeight: '600'
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-arcade)', color: 'var(--neon-emerald)', marginBottom: '6px' }}>
                🎮 CHỦ ĐỀ YÊU THÍCH (CHỌN 1 HOẶC NHIỀU)
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
                        fontSize: '0.75rem', fontWeight: isSelected ? '700' : '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-arcade btn-cyan animate-pulse-glow"
              style={{
                padding: '14px', borderRadius: '12px', fontSize: '0.95rem',
                fontWeight: '700', letterSpacing: '0.05em', marginTop: '6px'
              }}
            >
              {loading ? 'Đang tạo tài khoản...' : '🚀 TẠO TÀI KHOẢN & VÀO GAME (+200 🪙)'}
            </button>
          </form>
        ) : (
          /* Form: Login */
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-arcade)', color: 'var(--text-muted)', marginBottom: '5px' }}>
                TÊN ĐĂNG NHẬP
              </label>
              <input
                className="input-arcade"
                placeholder="Nhập username của bạn..."
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-arcade)', color: 'var(--text-muted)', marginBottom: '5px' }}>
                MẬT KHẨU
              </label>
              <input
                className="input-arcade"
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-arcade btn-cyan"
              style={{
                padding: '14px', borderRadius: '12px', fontSize: '0.95rem',
                fontWeight: '700', letterSpacing: '0.05em', marginTop: '6px'
              }}
            >
              {loading ? 'Đang đăng nhập...' : '🔑 ĐĂNG NHẬP VÀO GAME'}
            </button>
          </form>
        )}

        {/* Guest quick entry */}
        <div style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
          <button
            type="button"
            onClick={handlePlayAsGuest}
            style={{
              background: 'transparent', border: 'none', color: '#64748b',
              fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline'
            }}
          >
            Hoặc chơi nhanh với tư cách Khách (Play as Guest)
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import DinoGameArena from './features/game/DinoGameArena.jsx';
import SkinShop from './features/shop/SkinShop.jsx';
import SlangPokedex from './features/dictionary/SlangPokedex.jsx';
import AiHarvester from './features/crawler/AiHarvester.jsx';
import AuthModal from './features/auth/AuthModal.jsx';
import ProfileEditModal from './features/auth/ProfileEditModal.jsx';

const TABS = [
  { id: 'game', label: 'Dino Quest', icon: '🦖', short: 'Game' },
  { id: 'shop', label: 'Skin Shop', icon: '🛍️', short: 'Shop' },
  { id: 'dict', label: 'Slang Pokédex', icon: '📚', short: 'Dict' },
  { id: 'ai', label: 'AI Harvester', icon: '🤖', short: 'AI' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('game');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cultursync_user')) || null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [playerData, setPlayerData] = useState(null);
  const [bumpKey, setBumpKey] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('cultursync_theme') || 'dark');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cultursync_theme', theme);
  }, [theme]);

  // Load player profile for current user
  useEffect(() => {
    const uid = currentUser?.id || currentUser?.player_id || '';
    const url = uid ? `/api/player/profile?userId=${uid}` : '/api/player/profile';

    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setPlayerData(d.data);
        } else if (currentUser) {
          setPlayerData(currentUser);
        }
      })
      .catch(() => {
        if (currentUser) {
          setPlayerData(currentUser);
        } else {
          setPlayerData({ coins: 200, diamonds: 2, xp: 140, streak_days: 3, active_skin: 'classic', owned_skins: ['classic'] });
        }
      });
  }, [currentUser]);

  const handlePlayerUpdate = useCallback((data) => {
    if (data && data.coins !== playerData?.coins) setBumpKey(`${Date.now()}`);
    setPlayerData(data);

    // Sync updated wallet into currentUser localStorage
    if (currentUser && data) {
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem('cultursync_user', JSON.stringify(updatedUser));
    }
  }, [playerData, currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setPlayerData(user);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('cultursync_user');
    setCurrentUser(null);
    setPlayerData(null);
    setShowProfileModal(false);
    setShowAuthModal(true);
  };

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    setPlayerData(p => ({ ...p, ...updatedUser }));
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const coins = playerData?.coins ?? currentUser?.coins ?? 0;
  const diamonds = playerData?.diamonds ?? currentUser?.diamonds ?? 0;
  const xp = playerData?.xp ?? currentUser?.xp ?? 0;
  const streak = playerData?.streak_days ?? currentUser?.streak_days ?? 1;
  const activeSkin = playerData?.active_skin ?? currentUser?.active_skin ?? 'classic';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ── */}
      <header className="glass" style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '10px 20px',
        background: 'var(--navbar-bg)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: 'auto' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', boxShadow: '0 0 12px rgba(16,185,129,0.3)'
          }}>🦖</div>
          <div>
            <div style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.75rem', color: 'var(--neon-cyan)', letterSpacing: '0.08em', textShadow: '0 0 8px rgba(56,189,248,0.4)' }}>
              CULTURSYNC
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
              SlangArena 2.0
            </div>
          </div>
        </div>

        {/* User Identity / Persona Pill */}
        {currentUser ? (
          <button
            onClick={() => setShowProfileModal(true)}
            className="btn-arcade"
            style={{
              padding: '5px 12px', borderRadius: '999px',
              background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)',
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
              color: 'var(--text-primary)', fontSize: '0.76rem', fontFamily: 'var(--font-heading)'
            }}
            title="Bấm để chỉnh sửa sở thích & trình độ"
          >
            <span style={{ fontSize: '0.85rem' }}>👤</span>
            <strong style={{ color: 'var(--neon-cyan)' }}>{currentUser.username}</strong>
            <span style={{
              background: 'rgba(16,185,129,0.15)', color: 'var(--neon-emerald)',
              padding: '1px 6px', borderRadius: '4px', fontSize: '0.62rem', fontWeight: '700'
            }}>
              {currentUser.interests?.[0]?.toUpperCase() || 'CAMPUS'}
            </span>
            <span style={{
              background: 'rgba(251,191,36,0.15)', color: 'var(--neon-gold)',
              padding: '1px 6px', borderRadius: '4px', fontSize: '0.62rem', fontWeight: '700'
            }}>
              {currentUser.english_level?.slice(0, 3)?.toUpperCase() || 'INT'}
            </span>
            <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>⚙️</span>
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="btn-arcade btn-cyan"
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}
          >
            🔑 Đăng Nhập / Đăng Ký
          </button>
        )}

        {/* Wallet pills */}
        <div style={{ display: 'flex', gap: '7px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Streak */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 10px', borderRadius: '999px',
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
            fontSize: '0.7rem', color: '#fb923c', fontFamily: 'var(--font-arcade)'
          }}>🔥 {streak}</div>

          <div className="wallet-pill xp">⭐ {xp.toLocaleString()}</div>
          <div className={`wallet-pill coins ${bumpKey ? 'bump' : ''}`} key={`coins-${bumpKey}`}>🪙 {coins.toLocaleString()}</div>
          <div className="wallet-pill diamonds">💎 {diamonds}</div>

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ── Tab nav ── */}
      <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="tab-nav" style={{ maxWidth: '540px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: '18px 20px', maxWidth: activeTab === 'game' ? '1400px' : '1200px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'game' && (
          <DinoGameArena
            activeSkin={activeSkin}
            playerData={playerData}
            onPlayerUpdate={handlePlayerUpdate}
            user={currentUser}
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        )}
        {activeTab === 'shop' && (
          <SkinShop
            playerData={playerData}
            onPlayerUpdate={handlePlayerUpdate}
          />
        )}
        {activeTab === 'dict' && <SlangPokedex user={currentUser} />}
        {activeTab === 'ai' && <AiHarvester />}
      </main>

      {/* ── Modals ── */}
      {showAuthModal && (
        <AuthModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAuthModal(false)}
          canClose={true}
        />
      )}

      {showProfileModal && currentUser && (
        <ProfileEditModal
          user={currentUser}
          onUpdate={handleProfileUpdate}
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout}
        />
      )}

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '14px 20px', textAlign: 'center',
        fontSize: '0.68rem', fontFamily: 'var(--font-arcade)',
        letterSpacing: '0.05em', color: 'var(--text-muted)'
      }}>
        🦖 CULTURSYNC SLANGARENA • TEAM 14 • GLOBAL HACKATHON 2026 • 🇸🇬 × 🇻🇳
      </footer>
    </div>
  );
}

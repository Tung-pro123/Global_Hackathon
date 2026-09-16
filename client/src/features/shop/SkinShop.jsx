import React, { useRef, useEffect, useState } from 'react';
import { drawDino } from '../game/engine/DinoSprite.js';
import { SKINS_DATA } from './skinsData.js';

export default function SkinShop({ playerData, onPlayerUpdate }) {
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [buyStatus, setBuyStatus] = useState({});
  const previewRef = useRef(null);
  const rafRef = useRef(null);

  const activeSkin = playerData?.active_skin || 'classic';
  const ownedSkins = playerData?.owned_skins || ['classic'];
  const coins = playerData?.coins || 0;
  const diamonds = playerData?.diamonds || 0;

  const previewSkin = selectedSkin?.id || activeSkin;

  // Live preview animation
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0, frameTimer = 0;

    const animate = () => {
      ctx.clearRect(0, 0, 200, 200);

      // Cyber pedestal
      const pedGrad = ctx.createLinearGradient(30, 170, 170, 200);
      pedGrad.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
      pedGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
      pedGrad.addColorStop(1, 'rgba(56, 189, 248, 0.05)');
      ctx.fillStyle = pedGrad;
      ctx.beginPath();
      ctx.ellipse(100, 180, 65, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pedestal glow pulse
      ctx.globalAlpha = 0.15 + Math.sin(Date.now() / 600) * 0.08;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(100, 180, 55, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Idle bob animation
      const bobY = Math.sin(Date.now() / 600) * 5;

      // Draw dino with current preview skin
      frameTimer++;
      if (frameTimer > 20) { frame = (frame + 1) % 2; frameTimer = 0; }
      drawDino(ctx, 40, 65 + bobY, 120, 100, previewSkin, frame, false);

      // Scan ring effect
      const scanProgress = (Date.now() / 2000) % 1;
      ctx.globalAlpha = (1 - scanProgress) * 0.3;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(100, 180, 65 * scanProgress, 14 * scanProgress, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, [previewSkin]);

  const handleEquip = async (skinId) => {
    try {
      const res = await fetch('/api/player/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active_skin: skinId,
          userId: playerData?.id || playerData?.player_id
        })
      });
      const data = await res.json();
      onPlayerUpdate?.(data.data);
    } catch {}
  };

  const handleBuy = async (skin) => {
    setBuyStatus(s => ({ ...s, [skin.id]: 'loading' }));
    try {
      const res = await fetch('/api/player/buy-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skin_id: skin.id,
          cost_coins: skin.price_coins,
          cost_diamonds: skin.price_diamonds,
          userId: playerData?.id || playerData?.player_id
        })
      });
      const data = await res.json();
      if (data.success) {
        setBuyStatus(s => ({ ...s, [skin.id]: 'success' }));
        onPlayerUpdate?.(data.data);
        setTimeout(() => setBuyStatus(s => ({ ...s, [skin.id]: null })), 2000);
      } else {
        setBuyStatus(s => ({ ...s, [skin.id]: 'error' }));
        setTimeout(() => setBuyStatus(s => ({ ...s, [skin.id]: null })), 2000);
      }
    } catch {
      setBuyStatus(s => ({ ...s, [skin.id]: 'error' }));
      setTimeout(() => setBuyStatus(s => ({ ...s, [skin.id]: null })), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-arcade)', fontSize: '1rem', color: 'var(--neon-gold)', letterSpacing: '0.1em', marginBottom: '4px' }}>
          🛍️ DINO SKIN WARDROBE
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', fontFamily: 'var(--font-heading)' }}>
          Unlock exclusive skins to customize your dino's appearance and unlock gameplay perks!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Live Preview Chamber */}
        <div style={{ position: 'sticky', top: '16px' }}>
          <div style={{
            background: 'rgba(13, 20, 36, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <p style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.6rem', color: '#475569', letterSpacing: '0.12em', marginBottom: '8px' }}>
              LIVE PREVIEW
            </p>
            <canvas ref={previewRef} width={200} height={200} style={{ width: '100%', height: 'auto' }} />
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '0.85rem', color: '#e2e8f0', marginTop: '8px' }}>
              {SKINS_DATA.find(s => s.id === previewSkin)?.name || 'Classic Emerald Dino'}
            </p>
            {(selectedSkin && selectedSkin.id !== activeSkin && ownedSkins.includes(selectedSkin.id)) && (
              <button
                className="btn-arcade btn-cyan"
                onClick={() => handleEquip(selectedSkin.id)}
                style={{ marginTop: '10px', width: '100%', borderRadius: '8px', fontSize: '0.8rem', padding: '8px' }}
              >
                ⚡ Equip This Skin
              </button>
            )}
          </div>

          {/* Wallet */}
          <div style={{
            marginTop: '12px',
            background: 'rgba(13, 20, 36, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.1)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <p style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.6rem', color: '#475569', letterSpacing: '0.12em' }}>YOUR WALLET</p>
            <div className="wallet-pill coins" style={{ justifyContent: 'center' }}>🪙 {coins.toLocaleString()} Coins</div>
            <div className="wallet-pill diamonds" style={{ justifyContent: 'center' }}>💎 {diamonds} Diamonds</div>
          </div>
        </div>

        {/* Skin Catalog Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
          {SKINS_DATA.map(skin => {
            const isOwned = ownedSkins.includes(skin.id);
            const isActive = activeSkin === skin.id;
            const isSelected = selectedSkin?.id === skin.id;
            const canAfford = coins >= skin.price_coins && diamonds >= skin.price_diamonds;
            const status = buyStatus[skin.id];

            return (
              <div
                key={skin.id}
                className={`card ${skin.rarityBorder}`}
                onClick={() => setSelectedSkin(skin)}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  borderWidth: '1.5px',
                  outline: isSelected ? `2px solid ${skin.color}` : 'none',
                  outlineOffset: '2px',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Rarity badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className={`badge ${skin.rarityClass}`}>{skin.rarity}</span>
                  {isActive && <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--neon-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>EQUIPPED</span>}
                </div>

                {/* Skin emoji icon */}
                <div style={{
                  width: '56px', height: '56px',
                  background: `radial-gradient(circle, ${skin.color}22, transparent)`,
                  border: `1.5px solid ${skin.color}44`,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', marginBottom: '10px'
                }}>
                  {skin.emoji}
                </div>

                {/* Name */}
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '4px' }}>
                  {skin.name}
                </h3>

                {/* Perk */}
                <p style={{ fontSize: '0.72rem', color: skin.color, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {skin.perkIcon} {skin.perk}
                </p>

                {/* Price / Action */}
                {skin.isFree ? (
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>✅ Free starter skin</div>
                ) : isOwned ? (
                  <button
                    className={`btn-arcade ${isActive ? 'btn-emerald' : 'btn-ghost'}`}
                    onClick={e => { e.stopPropagation(); if (!isActive) handleEquip(skin.id); }}
                    style={{ width: '100%', fontSize: '0.75rem', padding: '8px', borderRadius: '8px' }}
                  >
                    {isActive ? '✅ Equipped' : '⚡ Equip'}
                  </button>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      {skin.price_coins > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--neon-gold)', fontFamily: 'var(--font-arcade)' }}>
                          🪙 {skin.price_coins}
                        </span>
                      )}
                      {skin.price_diamonds > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-arcade)' }}>
                          💎 {skin.price_diamonds}
                        </span>
                      )}
                    </div>
                    <button
                      className={`btn-arcade ${canAfford ? 'btn-gold' : 'btn-ghost'}`}
                      onClick={e => { e.stopPropagation(); if (canAfford) handleBuy(skin); }}
                      disabled={!canAfford || status === 'loading'}
                      style={{ width: '100%', fontSize: '0.75rem', padding: '8px', borderRadius: '8px' }}
                    >
                      {status === 'loading' ? '⌛ Buying...' :
                       status === 'success' ? '✅ Purchased!' :
                       status === 'error' ? '❌ Failed' :
                       canAfford ? '🛒 Buy Now' : '🔒 Not Enough'}
                    </button>
                    {!canAfford && (
                      <p style={{ fontSize: '0.65rem', color: '#475569', marginTop: '6px', textAlign: 'center' }}>
                        Play & answer quizzes to earn coins!
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

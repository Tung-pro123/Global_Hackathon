import React, { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { drawDino } from './engine/DinoSprite.js';
import { drawParallax } from './engine/ParallaxWorld.js';
import { drawCactus } from './engine/Obstacles.js';
import { drawCoin, drawDiamond } from './engine/Collectibles.js';

const CANVAS_W = 1000;
const CANVAS_H = 400;
const GROUND_Y = 305;
const DINO_W = 64;
const DINO_H = 74;
const DINO_X = 90;
const GRAVITY = 0.55;
const JUMP_FORCE = -14;

const DIFFICULTY_PRESETS = {
  easy:   { baseSpeed: 2.8, ramp: 1600, birdFreq: 300, obstFreq: 110 },
  medium: { baseSpeed: 4.2, ramp: 750,  birdFreq: 180, obstFreq: 80  },
  hard:   { baseSpeed: 6.0, ramp: 420,  birdFreq: 120, obstFreq: 60  }
};

// ── Particle pool ──────────────────────────────────────────────
function createParticles(x, y, color, count = 8) {
  return Array.from({ length: count }, () => ({
    x, y,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 1.5) * 4,
    alpha: 1,
    radius: Math.random() * 4 + 2,
    color
  }));
}

// ── Audio synthesizer ──────────────────────────────────────────
function createAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  const ctx = new AudioCtx();
  const beep = (freq, dur, type = 'square', vol = 0.15) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  };
  return {
    jump: () => { beep(300, 0.08); beep(500, 0.06); },
    coin: () => { beep(880, 0.05); beep(1100, 0.08, 'sine'); },
    combo: (n) => {
      const freqs = [523, 659, 784, 1047];
      freqs.slice(0, Math.min(n, 4)).forEach((f, i) => setTimeout(() => beep(f, 0.08, 'sine', 0.12), i * 60));
    },
    diamond: () => { [440, 660, 880, 1100].forEach((f, i) => setTimeout(() => beep(f, 0.1, 'sine'), i * 50)); },
    crash: () => { beep(150, 0.3, 'sawtooth', 0.2); beep(80, 0.4, 'square', 0.1); },
    correct: () => { [523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.15, 'sine'), i * 80)); },
    levelup: () => { [392, 523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.1, 'sine', 0.2), i * 70)); }
  };
}

// ── Bird obstacle drawing ──────────────────────────────────────
function drawBird(ctx, x, y, w, h, frame) {
  const wingUp = frame % 2 === 0;
  const t = Date.now() / 1000;

  // Body
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.ellipse(x + w * 0.5, y + h * 0.55, w * 0.35, h * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wings
  ctx.fillStyle = '#f43f5e';
  const wingY = wingUp ? y + h * 0.15 : y + h * 0.5;
  // Left wing
  ctx.beginPath();
  ctx.moveTo(x + w * 0.3, y + h * 0.5);
  ctx.quadraticCurveTo(x + w * 0.1, wingY, x - w * 0.1, y + h * 0.55);
  ctx.quadraticCurveTo(x + w * 0.1, y + h * 0.7, x + w * 0.3, y + h * 0.6);
  ctx.fill();
  // Right wing
  ctx.beginPath();
  ctx.moveTo(x + w * 0.7, y + h * 0.5);
  ctx.quadraticCurveTo(x + w * 0.9, wingY, x + w * 1.1, y + h * 0.55);
  ctx.quadraticCurveTo(x + w * 0.9, y + h * 0.7, x + w * 0.7, y + h * 0.6);
  ctx.fill();

  // Head
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(x + w * 0.75, y + h * 0.38, h * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x + w * 0.82, y + h * 0.3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(x + w * 0.83, y + h * 0.3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.9, y + h * 0.42);
  ctx.lineTo(x + w * 1.1, y + h * 0.48);
  ctx.lineTo(x + w * 0.9, y + h * 0.54);
  ctx.closePath();
  ctx.fill();

  // Tail feathers
  ctx.fillStyle = '#be123c';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.2, y + h * 0.55);
  ctx.lineTo(x - w * 0.15, y + h * 0.4);
  ctx.lineTo(x + w * 0.15, y + h * 0.6);
  ctx.lineTo(x - w * 0.08, y + h * 0.75);
  ctx.lineTo(x + w * 0.12, y + h * 0.58);
  ctx.closePath();
  ctx.fill();

  // Glow
  ctx.shadowBlur = 8;
  ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
  ctx.strokeStyle = 'rgba(244,63,94,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x + w * 0.5, y + h * 0.55, w * 0.35, h * 0.28, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

const DinoCanvas = forwardRef(function DinoCanvas(
  { activeSkin, onCoinCollect, onDiamondCollect, onCollision, onCombo, gameState, gameActive, onScoreUpdate, difficulty = 'medium' },
  ref
) {
  const preset = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.medium;
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gameRef = useRef({
    running: false,
    preset,
    dino: { x: DINO_X, y: GROUND_Y - DINO_H, vy: 0, onGround: true, frame: 0, frameTimer: 0, doubleJumped: false },
    obstacles: [],
    birds: [],
    coins: [],
    diamonds: [],
    particles: [],
    offset: 0,
    speed: preset.baseSpeed,
    score: 0,
    distance: 0,
    spawnTimer: preset.obstFreq,
    coinTimer: 60,
    diamondTimer: 300,
    birdTimer: preset.birdFreq,
    isInvincible: false,
    invincibleTimer: 0,
    comboCount: 0,
    comboTimer: 0,
    comboFlash: null,   // { text, color, ttl }
    shake: 0,
    raf: null
  });
  const audioRef = useRef(null);
  const prevGameStateRef = useRef('idle');
  const [showJumpBtn, setShowJumpBtn] = useState(true);

  useEffect(() => {
    audioRef.current = createAudio();
  }, []);

  const pauseGame = useCallback(() => {
    const g = gameRef.current;
    g.running = false;
    if (g.raf) {
      cancelAnimationFrame(g.raf);
      g.raf = null;
    }
  }, []);

  const resumeGame = useCallback(({ shield = true, shieldDuration = 150, clearThreats = true } = {}) => {
    const g = gameRef.current;
    if (g.running) return;

    if (g.raf) {
      cancelAnimationFrame(g.raf);
      g.raf = null;
    }

    if (shield) {
      g.isInvincible = true;
      g.invincibleTimer = Math.max(g.invincibleTimer, shieldDuration);
    }

    if (clearThreats) {
      // Clear obstacles/birds in front of or hitting the dino
      g.obstacles = g.obstacles.filter(o => !(o.x < DINO_X + 220 && o.x + o.w > DINO_X - 25));
      g.birds = g.birds.filter(b => !(b.x < DINO_X + 240 && b.x + b.w > DINO_X - 25));
    }

    // Reset dino to stable ground if it crashed or paused mid-air
    if (g.dino.y >= GROUND_Y - DINO_H) {
      g.dino.y = GROUND_Y - DINO_H;
      g.dino.vy = 0;
      g.dino.onGround = true;
      g.dino.doubleJumped = false;
    }

    g.running = true;
    loop();
  }, []);

  const startNewGame = useCallback(() => {
    const g = gameRef.current;
    if (g.raf) {
      cancelAnimationFrame(g.raf);
      g.raf = null;
    }
    const p = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.medium;
    g.running = true;
    g.preset = p;
    g.dino = { x: DINO_X, y: GROUND_Y - DINO_H, vy: 0, onGround: true, frame: 0, frameTimer: 0, doubleJumped: false };
    g.obstacles = []; g.birds = []; g.coins = []; g.diamonds = []; g.particles = [];
    g.offset = 0; g.speed = p.baseSpeed; g.score = 0; g.distance = 0;
    g.spawnTimer = p.obstFreq; g.coinTimer = 60; g.diamondTimer = 300; g.birdTimer = p.birdFreq;
    g.isInvincible = false; g.comboCount = 0; g.comboTimer = 0; g.comboFlash = null; g.shake = 0;
    loop();
  }, [difficulty]);

  const stopGame = useCallback(() => {
    const g = gameRef.current;
    g.running = false;
    if (g.raf) {
      cancelAnimationFrame(g.raf);
      g.raf = null;
    }
  }, []);

  // Expose imperative controls to parent
  useImperativeHandle(ref, () => ({
    startNew() {
      startNewGame();
    },
    pause() {
      pauseGame();
    },
    resume(options) {
      resumeGame(options);
    },
    activateShield(duration = 180) {
      resumeGame({ shield: true, shieldDuration: duration, clearThreats: true });
    },
    revive() {
      resumeGame({ shield: true, shieldDuration: 180, clearThreats: true });
    }
  }), [startNewGame, pauseGame, resumeGame]);

  useEffect(() => {
    const handleKey = (e) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Handle gameState transitions
  useEffect(() => {
    const prev = prevGameStateRef.current;
    const curr = gameState || (gameActive ? 'playing' : 'idle');
    prevGameStateRef.current = curr;

    if (curr === 'playing') {
      if (prev === 'idle' || prev === 'gameover') {
        startNewGame();
      } else if (prev === 'quiz' || prev === 'collision') {
        // Resume directly from existing frame!
        resumeGame({ shield: true, shieldDuration: 150, clearThreats: true });
      } else if (!gameRef.current.running) {
        resumeGame({ shield: false, clearThreats: false });
      }
    } else if (curr === 'quiz' || curr === 'collision') {
      pauseGame();
    } else if (curr === 'idle' || curr === 'gameover') {
      stopGame();
    }
  }, [gameState, gameActive, startNewGame, resumeGame, pauseGame, stopGame]);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (!g.running) return;
    if (g.dino.onGround) {
      g.dino.vy = JUMP_FORCE;
      g.dino.onGround = false;
      g.dino.doubleJumped = false;
      audioRef.current?.jump();
    } else if (!g.dino.doubleJumped) {
      // Double jump!
      g.dino.vy = JUMP_FORCE * 0.85;
      g.dino.doubleJumped = true;
      audioRef.current?.jump();
      // Particle burst for double jump
      g.particles.push(...createParticles(g.dino.x + DINO_W / 2, g.dino.y + DINO_H, '#38bdf8', 10));
    }
  }, []);

  function loop() {
    const g = gameRef.current;
    if (!g.running) {
      if (g.raf) {
        cancelAnimationFrame(g.raf);
        g.raf = null;
      }
      return;
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    update(g);
    render(ctx, g);
    g.raf = requestAnimationFrame(loop);
  }

  function update(g) {
    // Dino physics
    if (!g.dino.onGround) {
      g.dino.vy += GRAVITY;
      g.dino.y += g.dino.vy;
      if (g.dino.y >= GROUND_Y - DINO_H) {
        g.dino.y = GROUND_Y - DINO_H;
        g.dino.vy = 0;
        g.dino.onGround = true;
        g.dino.doubleJumped = false;
      }
    }

    // Frame animation
    if (++g.dino.frameTimer > 8) { g.dino.frame = (g.dino.frame + 1) % 2; g.dino.frameTimer = 0; }

    // Progress
    g.distance++;
    g.score = Math.floor(g.distance / 10);
    const p = g.preset || DIFFICULTY_PRESETS.medium;
    g.speed = p.baseSpeed + g.distance / p.ramp;
    onScoreUpdate?.(g.score);
    g.offset += g.speed;

    // Invincibility
    if (g.isInvincible && --g.invincibleTimer <= 0) g.isInvincible = false;

    // Combo timer decay
    if (g.comboTimer > 0) {
      g.comboTimer--;
      if (g.comboTimer <= 0) g.comboCount = 0;
    }

    // Screen shake decay
    if (g.shake > 0) g.shake--;

    // Spawn cactus
    if (--g.spawnTimer <= 0) {
      const h = 42 + Math.random() * 32;
      g.obstacles.push({ x: CANVAS_W + 20, y: GROUND_Y - h, w: 40, h });
      const p = g.preset || DIFFICULTY_PRESETS.medium;
      g.spawnTimer = Math.max(45, (p.obstFreq * 0.7) + Math.random() * (p.obstFreq * 0.6));
    }

    // Spawn bird
    if (--g.birdTimer <= 0) {
      const birdType = Math.random() < 0.5 ? 'low' : 'high';
      const birdY = birdType === 'low' ? GROUND_Y - 145 : GROUND_Y - 230;
      g.birds.push({ x: CANVAS_W + 20, y: birdY, w: 56, h: 42, frame: 0, frameTimer: 0, type: birdType });
      const p = g.preset || DIFFICULTY_PRESETS.medium;
      g.birdTimer = Math.max(80, p.birdFreq * 0.7 + Math.random() * p.birdFreq * 0.6);
    }

    // Spawn coins
    if (--g.coinTimer <= 0) {
      const coinY = GROUND_Y - 18 - Math.random() * 55;
      for (let i = 0; i < 4; i++) {
        g.coins.push({ x: CANVAS_W + 20 + i * 38, y: coinY, r: 13, collected: false, offset: i * 0.5 });
      }
      g.coinTimer = 50 + Math.random() * 35;
    }

    // Spawn diamond
    if (--g.diamondTimer <= 0) {
      g.diamonds.push({ x: CANVAS_W + 20, y: GROUND_Y - 90 - Math.random() * 50, size: 22, collected: false });
      g.diamondTimer = 240 + Math.random() * 180;
    }

    // Move obstacles
    g.obstacles = g.obstacles.filter(o => { o.x -= g.speed; return o.x + o.w > -20; });

    // Move birds
    g.birds = g.birds.filter(b => {
      b.x -= g.speed * 1.2; // birds slightly faster
      if (++b.frameTimer > 12) { b.frame = (b.frame + 1) % 2; b.frameTimer = 0; }
      return b.x + b.w > -20 && !b.hit;
    });

    // Move coins/diamonds
    g.coins = g.coins.filter(c => { c.x -= g.speed; return c.x > -30 && !c.collected; });
    g.diamonds = g.diamonds.filter(d => { d.x -= g.speed * 0.85; return d.x > -30 && !d.collected; });

    // Update particles
    g.particles = g.particles.filter(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.15;
      p.alpha -= 0.04;
      return p.alpha > 0;
    });

    const dinoBox = { x: g.dino.x + 10, y: g.dino.y + 8, w: DINO_W - 16, h: DINO_H - 12 };

    // Coin collision
    g.coins.forEach(c => {
      if (c.collected) return;
      if (circleRectOverlap(c.x, c.y, c.r * 0.8, dinoBox)) {
        c.collected = true;
        audioRef.current?.coin();
        // Combo
        g.comboCount++;
        g.comboTimer = 90;
        const multiplier = Math.min(g.comboCount, 5);
        const earned = 10 * multiplier;
        onCoinCollect?.(earned, multiplier);
        if (g.comboCount >= 2) {
          audioRef.current?.combo(g.comboCount);
          const colors = ['#fbbf24','#f97316','#ef4444','#a855f7','#38bdf8'];
          g.comboFlash = { text: `COMBO x${g.comboCount}! +${earned}🪙`, color: colors[Math.min(g.comboCount - 2, 4)], ttl: 80 };
          onCombo?.(g.comboCount);
        }
        g.particles.push(...createParticles(c.x, c.y, '#fbbf24', 6));
      }
    });

    // Diamond collision
    g.diamonds.forEach(d => {
      if (d.collected) return;
      if (rectOverlap({ x: d.x - d.size * 0.6, y: d.y - d.size * 0.6, w: d.size * 1.2, h: d.size * 1.4 }, dinoBox)) {
        d.collected = true;
        audioRef.current?.diamond();
        g.particles.push(...createParticles(d.x, d.y, '#38bdf8', 12));
        g.running = false;
        if (g.raf) cancelAnimationFrame(g.raf);
        onDiamondCollect?.();
        return;
      }
    });

    // Cactus collision
    if (!g.isInvincible) {
      for (const o of g.obstacles) {
        if (rectOverlap(dinoBox, { x: o.x + 5, y: o.y, w: o.w - 10, h: o.h })) {
          audioRef.current?.crash();
          g.shake = 18;
          g.running = false;
          onCollision?.('cactus');
          return;
        }
      }
      // Bird collision
      for (const b of g.birds) {
        if (rectOverlap(dinoBox, { x: b.x + 6, y: b.y + 4, w: b.w - 12, h: b.h - 8 })) {
          audioRef.current?.crash();
          b.hit = true;
          g.shake = 18;
          g.particles.push(...createParticles(b.x + b.w / 2, b.y + b.h / 2, '#f43f5e', 10));
          g.running = false;
          onCollision?.('bird');
          return;
        }
      }
    }
  };

  function render(ctx, g) {
    ctx.save();

    // Screen shake
    if (g.shake > 0) {
      const s = g.shake * 0.5;
      ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
    }

    ctx.clearRect(-10, -10, CANVAS_W + 20, CANVAS_H + 20);
    drawParallax(ctx, CANVAS_W, CANVAS_H, g.offset, GROUND_Y);

    // Coins
    g.coins.forEach(c => drawCoin(ctx, c.x, c.y, c.r, c.offset));
    // Diamonds
    g.diamonds.forEach(d => drawDiamond(ctx, d.x, d.y, d.size));
    // Cacti
    g.obstacles.forEach(o => drawCactus(ctx, o.x, o.y, o.w, o.h));
    // Birds
    g.birds.forEach(b => drawBird(ctx, b.x, b.y, b.w, b.h, b.frame));
    // Dino
    drawDino(ctx, g.dino.x, g.dino.y, DINO_W, DINO_H, activeSkin, g.dino.frame, g.isInvincible);

    // Particles
    g.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // HUD: Score
    ctx.font = '700 14px Orbitron, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'right';
    ctx.shadowBlur = 8; ctx.shadowColor = '#38bdf8';
    ctx.fillText(`SCORE: ${String(g.score).padStart(5, '0')}`, CANVAS_W - 14, 24);
    ctx.shadowBlur = 0; ctx.textAlign = 'left';

    // HUD: Speed bar
    const baseS = (g.preset || DIFFICULTY_PRESETS.medium).baseSpeed;
    const lvl = Math.min(10, Math.floor((g.speed - baseS) / 0.3) + 1);
    ctx.fillStyle = 'rgba(56,189,248,0.12)';
    ctx.fillRect(14, 10, 80, 6);
    ctx.fillStyle = `hsl(${200 - lvl * 15}, 90%, 60%)`;
    ctx.fillRect(14, 10, lvl * 8, 6);
    ctx.font = '600 9px Orbitron, monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('SPD', 96, 18);

    // HUD: Combo counter
    if (g.comboCount >= 2) {
      const colors = ['','','#f97316','#ef4444','#a855f7','#38bdf8'];
      ctx.fillStyle = colors[Math.min(g.comboCount, 5)] || '#f97316';
      ctx.font = `700 ${12 + g.comboCount}px Orbitron, monospace`;
      ctx.shadowBlur = 12; ctx.shadowColor = ctx.fillStyle;
      ctx.fillText(`COMBO x${g.comboCount}`, 14, 42);
      ctx.shadowBlur = 0;
    }

    // HUD: Invincibility shield bar
    if (g.isInvincible) {
      const pct = g.invincibleTimer / 180;
      ctx.fillStyle = 'rgba(56,189,248,0.2)';
      ctx.fillRect(14, CANVAS_H - 18, 120, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 8; ctx.shadowColor = '#38bdf8';
      ctx.fillRect(14, CANVAS_H - 18, 120 * pct, 6);
      ctx.shadowBlur = 0;
      ctx.font = '600 9px Orbitron, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('🛡️ SHIELD', 14, CANVAS_H - 24);
    }

    // Hint: double jump (only at start)
    if (g.distance < 300) {
      ctx.globalAlpha = 0.4;
      ctx.font = '500 10px Orbitron, monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('DOUBLE TAP = DOUBLE JUMP ↑↑', CANVAS_W / 2, CANVAS_H - 8);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={jump}
        style={{ width: '100%', height: 'auto', cursor: 'pointer', display: 'block', imageRendering: 'crisp-edges' }}
      />
      {/* Mobile jump button */}
      {showJumpBtn && (
        <button
          onTouchStart={(e) => { e.preventDefault(); jump(); }}
          style={{
            position: 'absolute', bottom: '12px', right: '16px',
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.8), rgba(14,165,233,0.6))',
            border: '2px solid rgba(56,189,248,0.6)', color: '#fff',
            fontSize: '1.5rem', cursor: 'pointer', backdropFilter: 'blur(8px)',
            boxShadow: '0 0 20px rgba(56,189,248,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            touchAction: 'none', userSelect: 'none'
          }}
        >↑</button>
      )}
    </div>
  );
});

export default DinoCanvas;

function rectOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function circleRectOverlap(cx, cy, cr, rect) {
  const nx = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
  const ny = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
  const dx = cx - nx, dy = cy - ny;
  return dx * dx + dy * dy < cr * cr;
}

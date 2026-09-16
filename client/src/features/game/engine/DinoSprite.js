// DinoSprite.js — Multi-skin Dino Canvas Renderer

export function drawDino(ctx, x, y, width, height, skin = 'classic', frame = 0, isInvincible = false) {
  ctx.save();

  // Invincibility shimmer
  if (isInvincible) {
    ctx.globalAlpha = 0.7 + Math.sin(Date.now() / 100) * 0.3;
    // Plasma shield
    const shieldGrad = ctx.createRadialGradient(x + width/2, y + height/2, 10, x + width/2, y + height/2, width);
    shieldGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    shieldGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.1)');
    shieldGrad.addColorStop(1, 'rgba(56, 189, 248, 0.4)');
    ctx.beginPath();
    ctx.arc(x + width/2, y + height/2, width * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = shieldGrad;
    ctx.fill();
  }

  const config = SKIN_CONFIGS[skin] || SKIN_CONFIGS.classic;
  config.draw(ctx, x, y, width, height, frame);

  ctx.restore();
}

const SKIN_CONFIGS = {
  classic: {
    draw(ctx, x, y, w, h, frame) {
      const legOffset = frame % 2 === 0 ? 3 : -3;

      // Body gradient
      const bodyGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      bodyGrad.addColorStop(0, '#34d399');
      bodyGrad.addColorStop(1, '#059669');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(x + w * 0.1, y + h * 0.15, w * 0.7, h * 0.65, 8);
      ctx.fill();

      // Head
      const headGrad = ctx.createLinearGradient(x + w * 0.4, y, x + w, y + h * 0.4);
      headGrad.addColorStop(0, '#34d399');
      headGrad.addColorStop(1, '#10b981');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.roundRect(x + w * 0.45, y, w * 0.55, h * 0.42, 10);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + w * 0.82, y + h * 0.12, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(x + w * 0.83, y + h * 0.13, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Eye shine
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + w * 0.84, y + h * 0.12, 1, 0, Math.PI * 2);
      ctx.fill();

      // Red headband
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + w * 0.45, y + h * 0.01, w * 0.4, h * 0.09);
      // Headband ribbon
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.85, y + h * 0.04);
      ctx.lineTo(x + w * 0.95, y - h * 0.05);
      ctx.lineTo(x + w * 0.92, y + h * 0.08);
      ctx.fill();

      // Tooth
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.9, y + h * 0.3, 6, 8, 2);
      ctx.fill();

      // Arms
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.65, y + h * 0.45, w * 0.2, h * 0.18, 4);
      ctx.fill();

      // Legs with animation
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.2, y + h * 0.72 + legOffset, w * 0.18, h * 0.28 - legOffset, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.42, y + h * 0.72 - legOffset, w * 0.18, h * 0.28 + legOffset, 4);
      ctx.fill();

      // Sneakers
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.15, y + h * 0.88 + legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.37, y + h * 0.88 - legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();

      // Tail
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.1, y + h * 0.5);
      ctx.quadraticCurveTo(x - w * 0.15, y + h * 0.6, x - w * 0.05, y + h * 0.8);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#059669';
      ctx.stroke();

      // Dorsal spikes
      const spikePositions = [0.3, 0.45, 0.55];
      spikePositions.forEach((pos, i) => {
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.moveTo(x + w * (0.2 + pos * 0.5), y + h * (0.15 - i * 0.03));
        ctx.lineTo(x + w * (0.13 + pos * 0.5), y + h * 0.28);
        ctx.lineTo(x + w * (0.27 + pos * 0.5), y + h * 0.28);
        ctx.closePath();
        ctx.fill();
      });
    }
  },

  cyberpunk: {
    draw(ctx, x, y, w, h, frame) {
      const legOffset = frame % 2 === 0 ? 3 : -3;

      // Dark obsidian body
      const bodyGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      bodyGrad.addColorStop(0, '#1e293b');
      bodyGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(x + w * 0.1, y + h * 0.15, w * 0.7, h * 0.65, 8);
      ctx.fill();

      // Scale texture
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
          ctx.beginPath();
          ctx.arc(x + w * (0.2 + i * 0.2), y + h * (0.3 + j * 0.12), 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Head
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.45, y, w * 0.55, h * 0.42, 10);
      ctx.fill();

      // Cyber visor
      const visorGrad = ctx.createLinearGradient(x + w * 0.5, y + h * 0.08, x + w, y + h * 0.25);
      visorGrad.addColorStop(0, '#0891b2');
      visorGrad.addColorStop(0.5, '#38bdf8');
      visorGrad.addColorStop(1, '#0891b2');
      ctx.fillStyle = visorGrad;
      ctx.beginPath();
      ctx.roundRect(x + w * 0.52, y + h * 0.08, w * 0.44, h * 0.18, 6);
      ctx.fill();

      // Visor scanline animation
      const scanY = y + h * 0.08 + ((Date.now() / 20) % (h * 0.18));
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x + w * 0.52, scanY, w * 0.44, 2);

      // Visor glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#38bdf8';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x + w * 0.52, y + h * 0.08, w * 0.44, h * 0.18, 6);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Neon violet back fins
      ctx.fillStyle = '#7c3aed';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#7c3aed';
      [0, 0.1, 0.2].forEach((offset, i) => {
        ctx.beginPath();
        ctx.moveTo(x + w * (0.15 + offset), y + h * (0.18 - i * 0.04));
        ctx.lineTo(x + w * (0.08 + offset), y + h * 0.32);
        ctx.lineTo(x + w * (0.22 + offset), y + h * 0.32);
        ctx.closePath();
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Legs
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.2, y + h * 0.72 + legOffset, w * 0.18, h * 0.28 - legOffset, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.42, y + h * 0.72 - legOffset, w * 0.18, h * 0.28 + legOffset, 4);
      ctx.fill();

      // Neon boots
      ctx.fillStyle = '#0891b2';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.15, y + h * 0.88 + legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.37, y + h * 0.88 - legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Tail
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.1, y + h * 0.5);
      ctx.quadraticCurveTo(x - w * 0.15, y + h * 0.6, x - w * 0.05, y + h * 0.8);
      ctx.stroke();

      // Tooth - neon
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.9, y + h * 0.3, 6, 8, 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  },

  singlish: {
    draw(ctx, x, y, w, h, frame) {
      const legOffset = frame % 2 === 0 ? 3 : -3;

      // Crimson-green body
      const bodyGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      bodyGrad.addColorStop(0, '#dc2626');
      bodyGrad.addColorStop(1, '#059669');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(x + w * 0.1, y + h * 0.15, w * 0.7, h * 0.65, 8);
      ctx.fill();

      // Head
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.45, y, w * 0.55, h * 0.42, 10);
      ctx.fill();

      // Merlion emblem on chest
      ctx.fillStyle = '#fbbf24';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#fbbf24';
      ctx.font = `${w * 0.3}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🦁', x + w * 0.45, y + h * 0.6);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'left';

      // CHAMP headband
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + w * 0.45, y + h * 0.01, w * 0.5, h * 0.09);
      ctx.fillStyle = '#1e293b';
      ctx.font = `bold ${w * 0.1}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('CHAMP', x + w * 0.7, y + h * 0.09);
      ctx.textAlign = 'left';

      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + w * 0.82, y + h * 0.12, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(x + w * 0.83, y + h * 0.13, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Golden dorsal spikes
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#fbbf24';
      ctx.fillStyle = '#fbbf24';
      [0.3, 0.43, 0.53].forEach((pos, i) => {
        ctx.beginPath();
        ctx.moveTo(x + w * (0.2 + pos * 0.5), y + h * (0.15 - i * 0.03));
        ctx.lineTo(x + w * (0.13 + pos * 0.5), y + h * 0.28);
        ctx.lineTo(x + w * (0.27 + pos * 0.5), y + h * 0.28);
        ctx.closePath();
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Legs
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.2, y + h * 0.72 + legOffset, w * 0.18, h * 0.28 - legOffset, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.42, y + h * 0.72 - legOffset, w * 0.18, h * 0.28 + legOffset, 4);
      ctx.fill();

      // Shoes
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.15, y + h * 0.88 + legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.37, y + h * 0.88 - legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();

      // Tail
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.1, y + h * 0.5);
      ctx.quadraticCurveTo(x - w * 0.15, y + h * 0.6, x - w * 0.05, y + h * 0.8);
      ctx.stroke();

      // Tooth
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.9, y + h * 0.3, 6, 8, 2);
      ctx.fill();
    }
  },

  saigon: {
    draw(ctx, x, y, w, h, frame) {
      const legOffset = frame % 2 === 0 ? 3 : -3;

      // Warm orange body
      const bodyGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      bodyGrad.addColorStop(0, '#fb923c');
      bodyGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(x + w * 0.1, y + h * 0.15, w * 0.7, h * 0.65, 8);
      ctx.fill();

      // Head
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.45, y, w * 0.55, h * 0.42, 10);
      ctx.fill();

      // Nón Lá (Vietnamese conical hat)
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.72, y - h * 0.22);
      ctx.lineTo(x + w * 0.35, y + h * 0.05);
      ctx.lineTo(x + w * 1.05, y + h * 0.05);
      ctx.closePath();
      ctx.fill();
      // Hat edge
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Hat ribbon
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + w * 0.35, y + h * 0.04, w * 0.7, h * 0.03);

      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + w * 0.82, y + h * 0.12, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(x + w * 0.83, y + h * 0.13, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Dorsal fins
      ctx.fillStyle = '#c2410c';
      [0.3, 0.43, 0.53].forEach((pos, i) => {
        ctx.beginPath();
        ctx.moveTo(x + w * (0.2 + pos * 0.5), y + h * (0.15 - i * 0.03));
        ctx.lineTo(x + w * (0.13 + pos * 0.5), y + h * 0.28);
        ctx.lineTo(x + w * (0.27 + pos * 0.5), y + h * 0.28);
        ctx.closePath();
        ctx.fill();
      });

      // Speed flame trails
      if (frame % 2 === 0) {
        ctx.globalAlpha = 0.4;
        ['#fbbf24', '#f97316', '#ef4444'].forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.ellipse(x - w * (0.1 + i * 0.12), y + h * 0.55, w * 0.08, h * 0.04, 0, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // Orange sneakers
      ctx.fillStyle = '#f97316';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#f97316';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.15, y + h * 0.88 + legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.37, y + h * 0.88 - legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Legs
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.2, y + h * 0.72 + legOffset, w * 0.18, h * 0.28 - legOffset, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.42, y + h * 0.72 - legOffset, w * 0.18, h * 0.28 + legOffset, 4);
      ctx.fill();

      // Tail
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.1, y + h * 0.5);
      ctx.quadraticCurveTo(x - w * 0.15, y + h * 0.6, x - w * 0.05, y + h * 0.8);
      ctx.stroke();

      // Tooth
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.9, y + h * 0.3, 6, 8, 2);
      ctx.fill();
    }
  },

  cosmic: {
    draw(ctx, x, y, w, h, frame) {
      const legOffset = frame % 2 === 0 ? 3 : -3;
      const t = Date.now() / 1000;

      // Galaxy body
      const bodyGrad = ctx.createRadialGradient(x + w * 0.4, y + h * 0.5, 0, x + w * 0.4, y + h * 0.5, w);
      bodyGrad.addColorStop(0, '#4c1d95');
      bodyGrad.addColorStop(0.5, '#6d28d9');
      bodyGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(x + w * 0.1, y + h * 0.15, w * 0.7, h * 0.65, 8);
      ctx.fill();

      // Star flecks
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 8; i++) {
        const sx = x + w * (0.15 + Math.sin(i * 2.5 + t) * 0.3 + 0.3);
        const sy = y + h * (0.2 + Math.cos(i * 1.8 + t) * 0.2 + 0.3);
        const sr = Math.sin(t + i) * 0.5 + 1;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Head
      const headGrad = ctx.createLinearGradient(x + w * 0.45, y, x + w, y + h * 0.42);
      headGrad.addColorStop(0, '#6d28d9');
      headGrad.addColorStop(1, '#4c1d95');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.roundRect(x + w * 0.45, y, w * 0.55, h * 0.42, 10);
      ctx.fill();

      // Cosmic crown
      ctx.fillStyle = '#a855f7';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#a855f7';
      const crownPoints = [0.5, 0.6, 0.7, 0.8, 0.9];
      crownPoints.forEach((pos, i) => {
        const height = i % 2 === 0 ? h * 0.15 : h * 0.1;
        ctx.fillRect(x + w * pos, y - height, w * 0.08, height);
      });
      ctx.shadowBlur = 0;

      // Eye with galaxy iris
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + w * 0.82, y + h * 0.12, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(x + w * 0.83, y + h * 0.13, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + w * 0.84, y + h * 0.12, 1, 0, Math.PI * 2);
      ctx.fill();

      // Stardust trail
      for (let i = 0; i < 5; i++) {
        ctx.globalAlpha = (0.8 - i * 0.15) * Math.abs(Math.sin(t * 2 + i));
        ctx.fillStyle = ['#a855f7', '#7c3aed', '#6d28d9', '#4c1d95', '#c084fc'][i];
        ctx.beginPath();
        ctx.arc(x - w * (0.1 + i * 0.15), y + h * (0.5 + Math.sin(t + i) * 0.15), 4 - i * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Cosmic spikes
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#a855f7';
      ctx.fillStyle = '#a855f7';
      [0.3, 0.43, 0.53].forEach((pos, i) => {
        ctx.beginPath();
        ctx.moveTo(x + w * (0.2 + pos * 0.5), y + h * (0.15 - i * 0.03));
        ctx.lineTo(x + w * (0.13 + pos * 0.5), y + h * 0.28);
        ctx.lineTo(x + w * (0.27 + pos * 0.5), y + h * 0.28);
        ctx.closePath();
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Legs
      ctx.fillStyle = '#4c1d95';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.2, y + h * 0.72 + legOffset, w * 0.18, h * 0.28 - legOffset, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.42, y + h * 0.72 - legOffset, w * 0.18, h * 0.28 + legOffset, 4);
      ctx.fill();

      // Purple boots
      ctx.fillStyle = '#7c3aed';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#a855f7';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.15, y + h * 0.88 + legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.37, y + h * 0.88 - legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Tail
      ctx.strokeStyle = '#4c1d95';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.1, y + h * 0.5);
      ctx.quadraticCurveTo(x - w * 0.15, y + h * 0.6, x - w * 0.05, y + h * 0.8);
      ctx.stroke();

      // Tooth
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.9, y + h * 0.3, 6, 8, 2);
      ctx.fill();
    }
  },

  golden: {
    draw(ctx, x, y, w, h, frame) {
      const legOffset = frame % 2 === 0 ? 3 : -3;
      const t = Date.now() / 1000;

      // 24K gold body
      const bodyGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      bodyGrad.addColorStop(0, '#fef3c7');
      bodyGrad.addColorStop(0.3, '#fbbf24');
      bodyGrad.addColorStop(0.7, '#d97706');
      bodyGrad.addColorStop(1, '#92400e');
      ctx.fillStyle = bodyGrad;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.1, y + h * 0.15, w * 0.7, h * 0.65, 8);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Gold shimmer
      ctx.globalAlpha = 0.3 + Math.sin(t * 3) * 0.15;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.15, y + h * 0.2, w * 0.2, h * 0.4, 4);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Head
      const headGrad = ctx.createLinearGradient(x + w * 0.45, y, x + w, y + h * 0.42);
      headGrad.addColorStop(0, '#fef3c7');
      headGrad.addColorStop(1, '#fbbf24');
      ctx.fillStyle = headGrad;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.45, y, w * 0.55, h * 0.42, 10);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Imperial Crown
      const crownGrad = ctx.createLinearGradient(x + w * 0.45, y - h * 0.22, x + w, y);
      crownGrad.addColorStop(0, '#fef3c7');
      crownGrad.addColorStop(0.5, '#fbbf24');
      crownGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = crownGrad;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#fbbf24';
      // Crown base
      ctx.fillRect(x + w * 0.48, y - h * 0.05, w * 0.48, h * 0.07);
      // Crown points
      [0.5, 0.61, 0.72, 0.83, 0.92].forEach((pos, i) => {
        const ph = i % 2 === 0 ? h * 0.18 : h * 0.12;
        ctx.beginPath();
        ctx.moveTo(x + w * pos, y - h * 0.05);
        ctx.lineTo(x + w * (pos + 0.045), y - ph);
        ctx.lineTo(x + w * (pos + 0.09), y - h * 0.05);
        ctx.closePath();
        ctx.fill();
        // Ruby gems on tall points
        if (i % 2 === 0) {
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(x + w * (pos + 0.045), y - ph + 4, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = crownGrad;
        }
      });
      ctx.shadowBlur = 0;

      // Eye — golden
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(x + w * 0.82, y + h * 0.12, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(x + w * 0.83, y + h * 0.13, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Diamond armor studs
      ctx.fillStyle = '#bae6fd';
      [[0.25, 0.4], [0.45, 0.35], [0.35, 0.55], [0.55, 0.5]].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(x + w * px, y + h * py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Gold spikes
      const goldGrad2 = ctx.createLinearGradient(0, y, 0, y + h * 0.3);
      goldGrad2.addColorStop(0, '#fef3c7');
      goldGrad2.addColorStop(1, '#fbbf24');
      ctx.fillStyle = goldGrad2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fbbf24';
      [0.3, 0.43, 0.53].forEach((pos, i) => {
        ctx.beginPath();
        ctx.moveTo(x + w * (0.2 + pos * 0.5), y + h * (0.15 - i * 0.03));
        ctx.lineTo(x + w * (0.13 + pos * 0.5), y + h * 0.28);
        ctx.lineTo(x + w * (0.27 + pos * 0.5), y + h * 0.28);
        ctx.closePath();
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Gold legs
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.2, y + h * 0.72 + legOffset, w * 0.18, h * 0.28 - legOffset, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.42, y + h * 0.72 - legOffset, w * 0.18, h * 0.28 + legOffset, 4);
      ctx.fill();

      // Gold royal boots
      ctx.fillStyle = '#fbbf24';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.15, y + h * 0.88 + legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + w * 0.37, y + h * 0.88 - legOffset, w * 0.26, h * 0.12, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Tail
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.1, y + h * 0.5);
      ctx.quadraticCurveTo(x - w * 0.15, y + h * 0.6, x - w * 0.05, y + h * 0.8);
      ctx.stroke();

      // Tooth
      ctx.fillStyle = '#fef3c7';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(x + w * 0.9, y + h * 0.3, 6, 8, 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
};

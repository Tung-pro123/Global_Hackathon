// Collectibles.js — Spinning gold coins & glowing diamonds

export function drawCoin(ctx, x, y, radius, offset = 0) {
  const t = Date.now() / 1000 + offset;
  const scaleX = Math.abs(Math.cos(t * 3));

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleX, 1);

  // Outer glow
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#fbbf24';

  // Coin body
  const coinGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 1, 0, 0, radius);
  coinGrad.addColorStop(0, '#fef9c3');
  coinGrad.addColorStop(0.4, '#fbbf24');
  coinGrad.addColorStop(0.8, '#d97706');
  coinGrad.addColorStop(1, '#92400e');
  ctx.fillStyle = coinGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Coin face - $ or 🪙
  if (scaleX > 0.5) {
    ctx.fillStyle = '#d97706';
    ctx.font = `bold ${radius * 0.9}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 1);
  }

  // Edge shine
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 1, -Math.PI * 0.7, -Math.PI * 0.2);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.restore();

  // Float sparkles
  if (Math.random() > 0.92) {
    ctx.fillStyle = '#fbbf24';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(x + (Math.random() - 0.5) * radius * 2, y - radius - Math.random() * 8, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export function drawDiamond(ctx, x, y, size, offset = 0) {
  const t = Date.now() / 1000 + offset;
  const bobY = Math.sin(t * 2) * 4;

  ctx.save();
  ctx.translate(x, y + bobY);
  ctx.rotate(Math.sin(t * 0.8) * 0.15);

  // Outer glow pulse
  const glowIntensity = 15 + Math.sin(t * 3) * 8;
  ctx.shadowBlur = glowIntensity;
  ctx.shadowColor = '#38bdf8';

  // Diamond facets
  const half = size / 2;
  const top = -half * 0.8;
  const mid = 0;
  const bot = half;
  const left = -half;
  const right = half;
  const midL = -half * 0.4;
  const midR = half * 0.4;

  // Top facet (bright)
  const topGrad = ctx.createLinearGradient(0, top, 0, mid);
  topGrad.addColorStop(0, '#e0f2fe');
  topGrad.addColorStop(0.5, '#38bdf8');
  topGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  ctx.moveTo(0, top);
  ctx.lineTo(left, mid - half * 0.2);
  ctx.lineTo(midL, mid);
  ctx.lineTo(midR, mid);
  ctx.lineTo(right, mid - half * 0.2);
  ctx.closePath();
  ctx.fill();

  // Bottom facet (deep)
  const botGrad = ctx.createLinearGradient(0, mid, 0, bot);
  botGrad.addColorStop(0, '#0284c7');
  botGrad.addColorStop(1, '#0c4a6e');
  ctx.fillStyle = botGrad;
  ctx.beginPath();
  ctx.moveTo(midL, mid);
  ctx.lineTo(left, mid - half * 0.2);
  ctx.lineTo(0, bot);
  ctx.lineTo(right, mid - half * 0.2);
  ctx.lineTo(midR, mid);
  ctx.closePath();
  ctx.fill();

  // Center highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.moveTo(0, top + half * 0.3);
  ctx.lineTo(midL * 0.5, mid - half * 0.1);
  ctx.lineTo(midR * 0.5, mid - half * 0.1);
  ctx.closePath();
  ctx.fill();

  // Outline
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, top);
  ctx.lineTo(left, mid - half * 0.2);
  ctx.lineTo(0, bot);
  ctx.lineTo(right, mid - half * 0.2);
  ctx.closePath();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.restore();

  // Sparkle particles around diamond
  const sparkles = 4;
  for (let i = 0; i < sparkles; i++) {
    const angle = (i / sparkles) * Math.PI * 2 + t * 2;
    const dist = size * 0.8 + Math.sin(t * 3 + i) * 3;
    const sx = x + Math.cos(angle) * dist;
    const sy = y + bobY + Math.sin(angle) * dist;
    ctx.globalAlpha = 0.4 + Math.sin(t * 4 + i) * 0.4;
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

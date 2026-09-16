// ParallaxWorld.js — Multi-layer parallax background renderer

let stars = null;
let cityWindowsTimer = 0;

function generateStars(count = 140, maxWidth = 1200) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * maxWidth,
    y: Math.random() * 220,
    r: Math.random() * 1.5 + 0.3,
    twinkle: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.005
  }));
}

export function drawParallax(ctx, width, height, offset, groundY) {
  if (!stars) stars = generateStars(140, Math.max(width, 1000));

  const t = Date.now() / 1000;

  // ── Layer 1: Sky Gradient ──────────────────────────────────────
  const sky = ctx.createLinearGradient(0, 0, 0, groundY);
  sky.addColorStop(0, '#020817');
  sky.addColorStop(0.4, '#0a1628');
  sky.addColorStop(0.7, '#0f2440');
  sky.addColorStop(1, '#1a3a5c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, groundY);

  // ── Layer 2: Stars ─────────────────────────────────────────────
  stars.forEach(star => {
    star.twinkle += star.speed;
    const alpha = 0.4 + Math.sin(star.twinkle) * 0.5;
    ctx.globalAlpha = Math.max(0.1, alpha);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    // Subtle star cross for larger stars
    if (star.r > 1.2) {
      ctx.globalAlpha = alpha * 0.4;
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(star.x - 4, star.y);
      ctx.lineTo(star.x + 4, star.y);
      ctx.moveTo(star.x, star.y - 4);
      ctx.lineTo(star.x, star.y + 4);
      ctx.stroke();
    }
  });
  ctx.globalAlpha = 1;

  // ── Layer 3: Celestial Body (Moon) ─────────────────────────────
  const moonX = 650;
  const moonY = 55;
  // Moon glow
  const moonGlow = ctx.createRadialGradient(moonX, moonY, 5, moonX, moonY, 45);
  moonGlow.addColorStop(0, 'rgba(186, 230, 253, 0.15)');
  moonGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 45, 0, Math.PI * 2);
  ctx.fill();
  // Moon body
  const moonBody = ctx.createRadialGradient(moonX - 6, moonY - 6, 3, moonX, moonY, 22);
  moonBody.addColorStop(0, '#e0f2fe');
  moonBody.addColorStop(0.6, '#bae6fd');
  moonBody.addColorStop(1, '#7dd3fc');
  ctx.fillStyle = moonBody;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
  ctx.fill();
  // Crescent shadow
  ctx.fillStyle = '#0a1628';
  ctx.beginPath();
  ctx.arc(moonX + 10, moonY - 5, 18, 0, Math.PI * 2);
  ctx.fill();
  // Moon craters
  ctx.fillStyle = 'rgba(125, 211, 252, 0.3)';
  [[moonX - 8, moonY + 6, 3], [moonX - 2, moonY - 4, 2]].forEach(([cx, cy, cr]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  });

  // ── Layer 4: Far Skyline (slow scroll) ─────────────────────────
  const farOffset = (offset * 0.2) % width;
  drawSkyline(ctx, width, groundY, farOffset, 0.5, 'far');

  // ── Layer 5: Near Skyline (medium scroll) ──────────────────────
  const nearOffset = (offset * 0.45) % width;
  drawSkyline(ctx, width, groundY, nearOffset, 0.85, 'near');

  // ── Layer 6: Ground ────────────────────────────────────────────
  drawGround(ctx, width, height, groundY, offset);

  // ── Layer 7: Neon Laser Rails ──────────────────────────────────
  drawLaserRails(ctx, width, groundY, offset, t);
}

function drawSkyline(ctx, width, groundY, scrollOffset, heightFactor, type) {
  const buildings = type === 'far'
    ? generateBuildings(width, groundY, heightFactor, 20, 3)
    : generateBuildings(width, groundY, heightFactor, 12, 6);

  for (let pass = -1; pass <= 1; pass++) {
    buildings.forEach(b => {
      const bx = b.x - scrollOffset + pass * width;
      if (bx + b.w < -50 || bx > width + 50) return;

      // Building body
      const buildGrad = ctx.createLinearGradient(bx, b.y, bx + b.w, b.y + b.h);
      if (type === 'far') {
        buildGrad.addColorStop(0, 'rgba(15, 36, 64, 0.8)');
        buildGrad.addColorStop(1, 'rgba(10, 22, 40, 0.9)');
      } else {
        buildGrad.addColorStop(0, 'rgba(13, 25, 52, 0.95)');
        buildGrad.addColorStop(1, 'rgba(7, 10, 18, 0.98)');
      }
      ctx.fillStyle = buildGrad;
      ctx.fillRect(bx, b.y, b.w, b.h);

      // Building edge highlight
      ctx.fillStyle = type === 'far' ? 'rgba(56, 189, 248, 0.05)' : 'rgba(56, 189, 248, 0.1)';
      ctx.fillRect(bx, b.y, 2, b.h);

      // Windows
      if (type === 'near') {
        const windowRows = Math.floor(b.h / 14);
        const windowCols = Math.floor(b.w / 10);
        for (let r = 0; r < windowRows; r++) {
          for (let c = 0; c < windowCols; c++) {
            const wx = bx + 3 + c * 10;
            const wy = b.y + 6 + r * 14;
            const isLit = (b.seed + r * 7 + c * 3) % 5 !== 0;
            if (isLit) {
              const colors = ['rgba(251, 191, 36, 0.6)', 'rgba(56, 189, 248, 0.5)', 'rgba(255, 255, 255, 0.4)'];
              ctx.fillStyle = colors[(b.seed + r + c) % colors.length];
              ctx.fillRect(wx, wy, 5, 7);
            }
          }
        }

        // Rooftop beacon
        if (b.w > 20) {
          const beaconAlpha = 0.5 + Math.sin(Date.now() / 800 + b.seed) * 0.5;
          ctx.fillStyle = `rgba(244, 63, 94, ${beaconAlpha})`;
          ctx.beginPath();
          ctx.arc(bx + b.w / 2, b.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }
}

function generateBuildings(width, groundY, heightFactor, minWidth, seed) {
  const buildings = [];
  let x = 0;
  let i = seed;
  while (x < width * 2) {
    const w = 15 + (i * 37 % 60);
    const h = 40 + (i * 53 % (groundY * heightFactor - 40));
    buildings.push({ x, y: groundY - h, w, h, seed: i });
    x += w + 2 + (i * 13 % 8);
    i++;
  }
  return buildings;
}

function drawGround(ctx, width, height, groundY, offset) {
  // Ground platform
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
  groundGrad.addColorStop(0, '#1e293b');
  groundGrad.addColorStop(0.3, '#0f172a');
  groundGrad.addColorStop(1, '#020617');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, width, height - groundY);

  // Ground top edge (neon line)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.fillRect(0, groundY, width, 2);

  // Speed lines on ground
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const lineX = ((-offset * 2) % 100) + i * 100;
    ctx.beginPath();
    ctx.moveTo(lineX % width, groundY + 8);
    ctx.lineTo((lineX + 60) % width, groundY + 8);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Ground texture dashes
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.8)';
  ctx.lineWidth = 1;
  const dashOffset = offset % 60;
  for (let x = -dashOffset; x < width + 60; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, groundY + 1);
    ctx.lineTo(x + 30, groundY + 1);
    ctx.stroke();
  }
}

function drawLaserRails(ctx, width, groundY, offset, t) {
  // Bottom laser rail
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(0.2, 'rgba(56, 189, 248, 0.6)');
  gradient.addColorStop(0.8, 'rgba(56, 189, 248, 0.6)');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, groundY + 3, width, 1.5);

  // Pulsing glow
  ctx.globalAlpha = 0.3 + Math.sin(t * 3) * 0.2;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.fillRect(0, groundY + 1, width, 5);
  ctx.globalAlpha = 1;

  // Moving marker lines
  for (let i = 0; i < 4; i++) {
    const mx = (width + i * (width / 4) - offset * 3) % width;
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(mx, groundY, 1.5, 6);
    ctx.globalAlpha = 1;
  }
}

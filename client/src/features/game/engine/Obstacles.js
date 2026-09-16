// Obstacles.js — 3D-shaded cactus renderer

export function drawCactus(ctx, x, y, width, height) {
  const t = Date.now() / 1000;

  // Main trunk
  const trunkGrad = ctx.createLinearGradient(x, y, x + width, y + height);
  trunkGrad.addColorStop(0, '#4ade80');
  trunkGrad.addColorStop(0.4, '#16a34a');
  trunkGrad.addColorStop(1, '#14532d');
  ctx.fillStyle = trunkGrad;
  ctx.beginPath();
  ctx.roundRect(x + width * 0.3, y, width * 0.4, height, [4, 4, 2, 2]);
  ctx.fill();

  // Left arm
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.roundRect(x, y + height * 0.25, width * 0.35, height * 0.18, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x, y + height * 0.1, width * 0.2, height * 0.18, [4, 4, 0, 0]);
  ctx.fill();

  // Right arm
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.roundRect(x + width * 0.65, y + height * 0.35, width * 0.35, height * 0.18, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x + width * 0.8, y + height * 0.18, width * 0.2, height * 0.2, [4, 4, 0, 0]);
  ctx.fill();

  // 3D highlight on trunk
  const highlight = ctx.createLinearGradient(x + width * 0.3, y, x + width * 0.5, y);
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  highlight.addColorStop(1, 'transparent');
  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.roundRect(x + width * 0.3, y, width * 0.15, height, [4, 0, 0, 2]);
  ctx.fill();

  // Thorns on trunk
  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 1.5;
  const thornPositions = [0.2, 0.4, 0.6, 0.75];
  thornPositions.forEach(pos => {
    // Left thorns
    ctx.beginPath();
    ctx.moveTo(x + width * 0.3, y + height * pos);
    ctx.lineTo(x + width * 0.1, y + height * (pos - 0.05));
    ctx.stroke();
    // Right thorns
    ctx.beginPath();
    ctx.moveTo(x + width * 0.7, y + height * pos);
    ctx.lineTo(x + width * 0.9, y + height * (pos - 0.05));
    ctx.stroke();
  });

  // Blooming flower on top (animated sway)
  const swayX = Math.sin(t * 1.5) * 2;
  const flowerX = x + width * 0.5 + swayX;
  const flowerY = y - 12;

  // Flower petals
  const petalColors = ['#f472b6', '#fb923c', '#facc15', '#f472b6'];
  petalColors.forEach((color, i) => {
    const angle = (i / 4) * Math.PI * 2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(
      flowerX + Math.cos(angle) * 5,
      flowerY + Math.sin(angle) * 5,
      5, 3, angle, 0, Math.PI * 2
    );
    ctx.fill();
  });

  // Flower center
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(flowerX, flowerY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Shadow under cactus
  const shadowGrad = ctx.createRadialGradient(x + width / 2, y + height + 4, 1, x + width / 2, y + height + 4, width * 0.6);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
  shadowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(x + width / 2, y + height + 4, width * 0.6, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

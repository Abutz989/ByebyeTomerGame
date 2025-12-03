// game/zumaPath.js
export default class ZumaPath {
  constructor() {
    // Simple spiral-like path – easy to understand
    this.points = [];
    const cx = 0, cy = 0;
    const steps = 300;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * Math.PI * 6;
      const radius = t * 300;
      this.points.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      });
    }
  }

  getPoint(progress) { // progress 0..1
    const i = Math.floor(progress * (this.points.length - 1));
    return this.points[i];
  }

  getTotalLength() {
    return this.points.length;
  }

  draw(ctx) {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.beginPath();
    this.points.forEach((p,i) => i===0 ? ctx.moveTo(p.x + ctx.canvas.width/2, p.y + ctx.canvas.height/2)
                                   : ctx.lineTo(p.x + ctx.canvas.width/2, p.y + ctx.canvas.height/2));
    ctx.stroke();
  }

  getPointAlongRay(x, y, canvasWidth, canvasHeight) {
  const steps = 300;
  let closest = 0;
  let minDist = Infinity;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 6;
    const radius = t * 300;
    const px = radius * Math.cos(angle) + canvasWidth/2;
    const py = radius * Math.sin(angle) + canvasHeight/2;
    const d = Math.hypot(px - x, py - y);
    if (d < minDist) { minDist = d; closest = t; }
  }
  return closest;
}
}
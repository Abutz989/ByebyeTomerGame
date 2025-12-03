// game/shooter.js
import Sound from './sound.js';
import ASSETS from './assets.js';

const SHOOTER_SIZE = 80;
const PROJECTILE_SPEED = 800;

export default class Shooter {
  constructor(engine) {
    this.engine = engine;
    this.nextColor = this.randomColor();
    this.queue = [this.nextColor, this.randomColor()];
    this.angle = 0;
    this.bouncePhase = 0;
  }

  randomColor() {
    const c = ['red','green','blue'];
    return c[Math.floor(Math.random()*c.length)];
  }

  currentAimAngle() { return 0; } // overwritten by input.js

  fire(angle) {
    if (this.engine.gameOver) return;
    Sound.play('shoot');

    const color = this.queue.shift();
    this.queue.push(this.randomColor());

    const projectile = {
      x: this.engine.canvas.width / 2,
      y: this.engine.canvas.height / 2,
      color,
      vx: Math.cos(angle) * PROJECTILE_SPEED,
      vy: Math.sin(angle) * PROJECTILE_SPEED,
      life: 2
    };

    this.projectiles = this.projectiles || [];
    this.projectiles.push(projectile);

    // Squash-stretch animation
    const shooterImg = document.querySelector('#shooterImg');
    if (shooterImg) shooterImg.style.animation = 'squash 0.2s';
  }

  update(dt) {
    this.bouncePhase += dt * 3;

    if (this.projectiles) {
      for (let i = this.projectiles.length-1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;

        // Simple path collision
        const distFromCenter = Math.hypot(p.x - this.engine.canvas.width/2, p.y - this.engine.canvas.height/2);
        if (distFromCenter < 200 || p.life <= 0) {
          const progress = this.engine.path.getPointAlongRay(p.x, p.y);
          this.engine.chain.insert({color: p.color}, progress * this.engine.path.getTotalLength());
          this.projectiles.splice(i,1);
        }
      }
    }
  }

  draw(ctx) {
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    this.angle = this.engine.input?.angle || this.currentAimAngle();

    const img = new Image();
    img.src = ASSETS.shooter;
    img.id = 'shooterImg';
    const scale = 1 + Math.sin(this.bouncePhase) * 0.07;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.angle);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -SHOOTER_SIZE/2, -SHOOTER_SIZE/2, SHOOTER_SIZE, SHOOTER_SIZE);
    ctx.restore();

    // Next ball preview
    const nextImg = new Image();
    nextImg.src = ASSETS.heads[this.queue[0]];
    ctx.drawImage(nextImg, cx + 60, cy - 30, 40, 40);
  }
}

// Helper for path ray (very simple approximation)
Path2D.prototype.getPointAlongRay = function(x, y) {
  const steps = 300;
  let closest = 0;
  let minDist = Infinity;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 6;
    const radius = t * 300;
    const px = radius * Math.cos(angle) + canvas.width/2;
    const py = radius * Math.sin(angle) + canvas.height/2;
    const d = Math.hypot(px - x, py - y);
    if (d < minDist) { minDist = d; closest = t; }
  }
  return closest;
};
// game/chain.js
import { checkAndRemoveMatches } from './match.js';
import { insertProjectile } from './collision.js';
import Sound from './sound.js';
import ASSETS from './assets.js';

const COLORS = ['red', 'green', 'blue'];
const HEAD_SIZE = 40;

export default class Chain {
  constructor(path) {
    this.path = path;
    this.heads = [];
    this.progress = 0;
    this.speed = 0.07; // progress per second

    // Initial chain of ~30 heads
    for (let i = 0; i < 30; i++) {
      const color = COLORS[Math.floor(Math.random()*COLORS.length)];
      this.heads.push({ color, distance: i * 22 });
    }
  }

  update(dt) {
    if (this.heads.length === 0) return;
    this.progress += this.speed * dt;

    // Move every head
    this.heads.forEach(h => h.distance += this.speed * dt * 22);

    // Auto-remove matches repeatedly until none left
    while (checkAndRemoveMatches(this.heads)) {
      Sound.play('pop');
    }
  }

  insert(head, distance) {
    insertProjectile(this.heads, head, distance);
  }

  reachedEnd() {
    return this.heads.length > 0 && this.heads[0].distance > this.path.getTotalLength();
  }

  isEmpty() {
    return this.heads.length === 0;
  }

  draw(ctx) {
    const offsetX = ctx.canvas.width / 2;
    const offsetY = ctx.canvas.height / 2;

    this.heads.forEach(head => {
      const point = this.path.getPoint(head.distance / this.path.getTotalLength());
      if (!point) return;

      const img = ASSETS.getImage(ASSETS.heads[head.color]);
      if (img) ctx.drawImage(img,
        point.x + offsetX - HEAD_SIZE/2,
        point.y + offsetY - HEAD_SIZE/2,
        HEAD_SIZE, HEAD_SIZE
      );
    });
  }
}
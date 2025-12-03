// game/collision.js
export function insertProjectile(chain, newHead, targetDistance) {
  let insertIndex = 0;
  for (let i = chain.length - 1; i >= 0; i--) {
    if (chain[i].distance <= targetDistance) {
      insertIndex = i + 1;
      break;
    }
  }
  chain.splice(insertIndex, 0, { ...newHead, distance: targetDistance });
}
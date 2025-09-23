import { gameState, setMyPlayer } from './state';
import { sendMoveUpdate } from './game.network';

const keys: Record<string, boolean> = {};

function canMove(x: number, y: number): boolean {
  const mapX = Math.floor(x);
  const mapY = Math.floor(y);
  return gameState.mapData[mapY]?.[mapX] !== 1;
}

export function handleKeyboardInput() {
  let moved = false;
  const { me } = gameState;
  const step = 0.05;
  const turn = 0.05;

  let newX = me.x;
  let newY = me.y;
  let newDir = me.dir;

  if (keys['arrowleft']) {
    newDir -= turn;
    moved = true;
  }
  if (keys['arrowright']) {
    newDir += turn;
    moved = true;
  }
  if (keys['arrowup']) {
    const nx = me.x + Math.cos(me.dir) * step;
    const ny = me.y + Math.sin(me.dir) * step;
    if (canMove(nx, ny)) {
      newX = nx;
      newY = ny;
      moved = true;
    }
  }
  if (keys['arrowdown']) {
    const nx = me.x - Math.cos(me.dir) * step;
    const ny = me.y - Math.sin(me.dir) * step;
    if (canMove(nx, ny)) {
      newX = nx;
      newY = ny;
      moved = true;
    }
  }

  if (moved) {
    setMyPlayer({ x: newX, y: newY, dir: newDir });
    sendMoveUpdate(gameState.me);
  }
}

export function initInputHandlers() {
  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });
}
